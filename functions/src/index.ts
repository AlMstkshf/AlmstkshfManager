import * as admin from "firebase-admin";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {onDocumentWritten} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {GoogleGenAI, GenerateContentResponse} from "@google/genai";

admin.initializeApp();
const db = admin.firestore();

// --- Enums (mirroring your frontend types.ts for consistency) ---
enum UserRole {
  Admin = "Admin",
  ProjectManager = "ProjectManager",
  TeamMember = "TeamMember",
}

enum UserStatus {
  Active = "Active",
  Invited = "Invited",
  Deactivated = "Deactivated",
}

// --- Interfaces (mirroring your frontend types.ts) ---
interface UserProfile {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  status: UserStatus;
}

interface Organization {
  id: string;
  name: string;
  inviteCode: string;
  logoUrl?: string;
}

interface Invitation {
  id?: string; // Document ID
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string; // For email branding
  token: string; // Secure, unique token for the invitation link
  createdAt: admin.firestore.Timestamp;
  expiresAt: admin.firestore.Timestamp; // e.g., 7 days
}

const generateSecureToken = (length = 48): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


// --- Callable Function: User Self Sign-up ---
export const signUpUser = onCall(async (request) => {
  const {
    email,
    password,
    fullName,
    mode, // "create" or "join"
    organizationName, // if mode === "create"
    inviteCode, // if mode === "join"
  } = request.data;

  if (
    !email ||
    !password ||
    !fullName ||
    !mode ||
    (mode === "create" && !organizationName) ||
    (mode === "join" && !inviteCode)
  ) {
    throw new HttpsError(
      "invalid-argument",
      "Missing required fields for sign-up."
    );
  }

  if (password.length < 8) { // Basic validation, match client-side
    throw new HttpsError(
      "invalid-argument",
      "Password must be at least 8 characters long."
    );
  }

  let userOrganizationId: string;
  let userRole: UserRole;

  // Check if email already exists
  try {
    await admin.auth().getUserByEmail(email);
    throw new HttpsError(
      "already-exists",
      "A user with this email address already exists."
    );
  } catch (error: any) {
    if (error.code !== "auth/user-not-found") {
      // Rethrow if it's not the "user-not-found" error we expect
      throw error;
    }
    // User does not exist, proceed
  }


  if (mode === "create") {
    userOrganizationId = db.collection("organizations").doc().id;
    userRole = UserRole.Admin;

    const newOrg: Organization = {
      id: userOrganizationId,
      name: organizationName,
      // Simple invite code generation, make more robust if needed
      inviteCode: `${organizationName.substring(0, 4).toUpperCase()}${generateSecureToken(4)}`,
      logoUrl: `https://via.placeholder.com/150/0000FF/FFFFFF?Text=${organizationName.charAt(0).toUpperCase()}`, // Placeholder
    };
    await db.collection("organizations").doc(userOrganizationId).set(newOrg);
  } else { // mode === "join"
    const orgQuery = await db
      .collection("organizations")
      .where("inviteCode", "==", inviteCode)
      .limit(1)
      .get();

    if (orgQuery.empty) {
      throw new HttpsError(
        "not-found",
        "Invalid organization invite code."
      );
    }
    const orgDoc = orgQuery.docs[0].data() as Organization;
    userOrganizationId = orgDoc.id;
    userRole = UserRole.TeamMember; // Default role for joining
  }

  let newUserRecord;
  try {
    newUserRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
    });
  } catch (error: any) {
    logger.error("Error creating Firebase Auth user:", error);
    throw new HttpsError(
      "internal",
      "Failed to create user account.",
      error.message
    );
  }

  const userProfile: UserProfile = {
    id: newUserRecord.uid,
    name: fullName,
    email,
    role: userRole,
    organizationId: userOrganizationId,
    status: UserStatus.Active,
  };

  await db.collection("users").doc(newUserRecord.uid).set(userProfile);

  return {
    uid: newUserRecord.uid,
    email: userProfile.email,
    role: userProfile.role,
    organizationId: userProfile.organizationId,
    message: "User signed up successfully.",
  };
});


// --- Callable Function: Admin Invites User ---
export const adminInviteUser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated to invite users."
    );
  }

  const adminClaims = request.auth.token;

  if (adminClaims.role !== UserRole.Admin) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can invite users."
    );
  }

  const organizationId = adminClaims.organizationId as string;
  if (!organizationId) {
    throw new HttpsError(
      "permission-denied",
      "Admin user does not belong to an organization."
    );
  }


  const {email: invitedUserEmail, fullName: invitedUserFullName, role: invitedUserRole} = request.data;
  if (!invitedUserEmail || !invitedUserFullName || !invitedUserRole) {
    throw new HttpsError(
      "invalid-argument",
      "Missing email, full name, or role for invited user."
    );
  }
  if (!Object.values(UserRole).includes(invitedUserRole as UserRole)) {
     throw new HttpsError("invalid-argument", "Invalid role specified.");
  }

  const existingUserQuery = await db.collection("users")
    .where("email", "==", invitedUserEmail)
    .where("organizationId", "==", organizationId)
    .limit(1)
    .get();

  if (!existingUserQuery.empty) {
    throw new HttpsError(
      "already-exists",
      `User with email ${invitedUserEmail} already exists in this organization.`
    );
  }
  const existingInviteQuery = await db.collection("invitations")
    .where("email", "==", invitedUserEmail)
    .where("organizationId", "==", organizationId)
    .limit(1)
    .get();
  if (!existingInviteQuery.empty) {
     throw new HttpsError(
      "already-exists",
      `An active invitation for ${invitedUserEmail} already exists for this organization.`
    );
  }


  const organizationDoc = await db.collection("organizations").doc(organizationId).get();
  if (!organizationDoc.exists) {
    throw new HttpsError("not-found", "Admin's organization not found.");
  }
  const organizationData = organizationDoc.data() as Organization;


  const invitationToken = generateSecureToken();
  const invitation: Invitation = {
    email: invitedUserEmail,
    role: invitedUserRole as UserRole,
    organizationId: organizationId,
    organizationName: organizationData.name,
    token: invitationToken,
    createdAt: admin.firestore.Timestamp.now(),
    expiresAt: admin.firestore.Timestamp.fromMillis(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
  };

  await db.collection("invitations").add(invitation);

  logger.info(
    `Invitation created for ${invitedUserEmail} to organization ${organizationId}. ` +
    `Token: ${invitationToken}. ` +
    `Invite Link: https://[YOUR_APP_DOMAIN]/set-password?token=${invitationToken}`
  );


  return {
    message: `Invitation sent to ${invitedUserEmail}.`,
    invitationToken: invitationToken,
  };
});

// --- Callable Function: Invited User Completes Setup ---
export const completeInvitedUserSetup = onCall(async (request) => {
  const {invitationToken, password, fullName} = request.data;

  if (!invitationToken || !password || !fullName) {
    throw new HttpsError(
      "invalid-argument",
      "Missing token, password, or full name."
    );
  }
   if (password.length < 8) {
    throw new HttpsError(
      "invalid-argument",
      "Password must be at least 8 characters long."
    );
  }

  const inviteQuery = await db
    .collection("invitations")
    .where("token", "==", invitationToken)
    .limit(1)
    .get();

  if (inviteQuery.empty) {
    throw new HttpsError("not-found", "Invalid invitation token.");
  }

  const inviteDoc = inviteQuery.docs[0];
  const invitation = inviteDoc.data() as Invitation;

  if (invitation.expiresAt.toMillis() < Date.now()) {
    await inviteDoc.ref.delete(); // Clean up expired token
    throw new HttpsError("deadline-exceeded", "Invitation token has expired.");
  }

  try {
    await admin.auth().getUserByEmail(invitation.email);
    await inviteDoc.ref.delete(); // Clean up token
    throw new HttpsError(
      "already-exists",
      "A user with this email address already exists. Please try logging in or resetting your password."
    );
  } catch (error: any) {
    if (error.code !== "auth/user-not-found") {
      throw error; // Some other error occurred
    }
  }

  let newUserRecord;
  try {
    newUserRecord = await admin.auth().createUser({
      email: invitation.email,
      password: password,
      displayName: fullName,
    });
  } catch (error: any) {
    logger.error("Error creating Firebase Auth user from invite:", error);
    throw new HttpsError(
      "internal",
      "Failed to create user account from invitation.",
      error.message
    );
  }

  const userProfile: UserProfile = {
    id: newUserRecord.uid,
    name: fullName,
    email: invitation.email,
    role: invitation.role,
    organizationId: invitation.organizationId,
    status: UserStatus.Active,
  };

  await db.collection("users").doc(newUserRecord.uid).set(userProfile);
  await inviteDoc.ref.delete(); // Clean up used invitation

  return {
    uid: newUserRecord.uid,
    email: userProfile.email,
    role: userProfile.role,
    organizationId: userProfile.organizationId,
    message: "User account activated successfully.",
  };
});

// --- Callable Function: Admin Deletes User ---
export const deleteUserByAdmin = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated to delete users."
    );
  }

  const adminUid = request.auth.uid;
  const {userIdToDelete} = request.data;

  if (!userIdToDelete) {
    throw new HttpsError("invalid-argument", "Missing userIdToDelete.");
  }

  const adminClaims = request.auth.token;
  if (adminClaims.role !== "Admin") {
    throw new HttpsError(
      "permission-denied",
      "Only admins can delete users."
    );
  }

  if (adminUid === userIdToDelete) {
    throw new HttpsError("permission-denied", "Admins cannot delete their own account.");
  }

  try {
    await admin.auth().deleteUser(userIdToDelete);
    await db.collection("users").doc(userIdToDelete).delete();
    logger.info(`Successfully deleted user ${userIdToDelete} by admin ${adminUid}`);
    return {success: true, message: "User deleted successfully."};
  } catch (error: any) {
    logger.error(`Error deleting user ${userIdToDelete} by admin ${adminUid}:`, error);
    throw new HttpsError("internal", "Failed to delete user.", error.message);
  }
});


// --- Firestore Trigger: Manage Custom User Claims ---
export const onUserDocumentWrite = onDocumentWritten("users/{userId}", async (event) => {
    const userId = event.params.userId;
    if (!event.data?.after.exists) {
      logger.info(`User document ${userId} deleted. Skipping custom claims update.`);
      return null;
    }

    const userData = event.data.after.data() as UserProfile;
    const oldUserData = event.data.before?.exists ? event.data.before.data() as UserProfile : null;

    const newOrganizationId = userData.organizationId;
    const newRole = userData.role;

    if (
      oldUserData &&
      oldUserData.organizationId === newOrganizationId &&
      oldUserData.role === newRole
    ) {
      logger.info(`User ${userId} data updated, but organizationId and role remain unchanged. No custom claims update needed.`);
      return null;
    }

    if (!newOrganizationId || !newRole) {
      logger.error(
        `User ${userId} document is missing organizationId or role. Cannot set custom claims.`
      );
      return null;
    }

    try {
      const claimsToSet = {
        organizationId: newOrganizationId,
        role: newRole,
      };
      await admin.auth().setCustomUserClaims(userId, claimsToSet);
      logger.info(
        `Custom claims set for user ${userId}:`, claimsToSet
      );
    } catch (error) {
      logger.error(
        `Error setting custom claims for user ${userId}:`,
        error
      );
    }
    return null;
  });

// --- Secure Gemini API Proxy Functions ---

const getGeminiResponse = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt,
    config: {responseMimeType: "application/json"},
  });

  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  return jsonStr;
};

export const generateProjectIdeas = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  const {prompt} = request.data;
  if (!prompt) {
    throw new HttpsError("invalid-argument", "Prompt is required.");
  }
  try {
    const jsonResponse = await getGeminiResponse(prompt);
    return JSON.parse(jsonResponse);
  } catch (error: any) {
    logger.error("Error calling Gemini API for ideas:", error);
    throw new HttpsError("internal", "Failed to generate ideas.", error.message);
  }
});

export const analyzeTaskComment = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  const {prompt} = request.data;
  if (!prompt) {
    throw new HttpsError("invalid-argument", "Prompt is required.");
  }
  try {
    const jsonResponse = await getGeminiResponse(prompt);
    return JSON.parse(jsonResponse);
  } catch (error: any) {
    logger.error("Error calling Gemini API for sentiment:", error);
    throw new HttpsError("internal", "Failed to analyze sentiment.", error.message);
  }
});

export const generateMeetingAgenda = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  const {prompt} = request.data;
  if (!prompt) {
    throw new HttpsError("invalid-argument", "Prompt is required.");
  }
  try {
    const jsonResponse = await getGeminiResponse(prompt);
    return JSON.parse(jsonResponse);
  } catch (error: any) {
    logger.error("Error calling Gemini API for agenda:", error);
    throw new HttpsError("internal", "Failed to generate agenda.", error.message);
  }
});

export const generateProjectInsights = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  const {prompt} = request.data;
  if (!prompt) {
    throw new HttpsError("invalid-argument", "Prompt is required.");
  }
  try {
    const jsonResponse = await getGeminiResponse(prompt);
    return JSON.parse(jsonResponse);
  } catch (error: any) {
    logger.error("Error calling Gemini API for insights:", error);
    throw new HttpsError("internal", "Failed to generate insights.", error.message);
  }
});