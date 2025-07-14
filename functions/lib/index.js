"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserDocumentWrite = exports.deleteUserByAdmin = exports.completeInvitedUserSetup = exports.adminInviteUser = exports.signUpUser = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const logger = __importStar(require("firebase-functions/logger"));
const genai_1 = require("@google/genai");
admin.initializeApp();
const db = admin.firestore();
// --- Enums (mirroring your frontend types.ts for consistency) ---
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "Admin";
    UserRole["ProjectManager"] = "ProjectManager";
    UserRole["TeamMember"] = "TeamMember";
})(UserRole || (UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["Active"] = "Active";
    UserStatus["Invited"] = "Invited";
    UserStatus["Deactivated"] = "Deactivated";
})(UserStatus || (UserStatus = {}));
const generateSecureToken = (length = 48) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
// --- Callable Function: User Self Sign-up ---
exports.signUpUser = (0, https_1.onCall)(async (request) => {
    const { email, password, fullName, mode, // "create" or "join"
    organizationName, // if mode === "create"
    inviteCode, // if mode === "join"
     } = request.data;
    if (!email ||
        !password ||
        !fullName ||
        !mode ||
        (mode === "create" && !organizationName) ||
        (mode === "join" && !inviteCode)) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields for sign-up.");
    }
    if (password.length < 8) { // Basic validation, match client-side
        throw new https_1.HttpsError("invalid-argument", "Password must be at least 8 characters long.");
    }
    let userOrganizationId;
    let userRole;
    // Check if email already exists
    try {
        await admin.auth().getUserByEmail(email);
        throw new https_1.HttpsError("already-exists", "A user with this email address already exists.");
    }
    catch (error) {
        if (error.code !== "auth/user-not-found") {
            // Rethrow if it's not the "user-not-found" error we expect
            throw error;
        }
        // User does not exist, proceed
    }
    if (mode === "create") {
        userOrganizationId = db.collection("organizations").doc().id;
        userRole = UserRole.Admin;
        const newOrg = {
            id: userOrganizationId,
            name: organizationName,
            // Simple invite code generation, make more robust if needed
            inviteCode: `${organizationName.substring(0, 4).toUpperCase()}${generateSecureToken(4)}`,
            logoUrl: `https://via.placeholder.com/150/0000FF/FFFFFF?Text=${organizationName.charAt(0).toUpperCase()}`, // Placeholder
        };
        await db.collection("organizations").doc(userOrganizationId).set(newOrg);
    }
    else { // mode === "join"
        const orgQuery = await db
            .collection("organizations")
            .where("inviteCode", "==", inviteCode)
            .limit(1)
            .get();
        if (orgQuery.empty) {
            throw new https_1.HttpsError("not-found", "Invalid organization invite code.");
        }
        const orgDoc = orgQuery.docs[0].data();
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
    }
    catch (error) {
        logger.error("Error creating Firebase Auth user:", error);
        throw new https_1.HttpsError("internal", "Failed to create user account.", error.message);
    }
    const userProfile = {
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
exports.adminInviteUser = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "User must be authenticated to invite users.");
    }
    const adminClaims = request.auth.token;
    if (adminClaims.role !== UserRole.Admin) {
        throw new https_1.HttpsError("permission-denied", "Only admins can invite users.");
    }
    const organizationId = adminClaims.organizationId;
    if (!organizationId) {
        throw new https_1.HttpsError("permission-denied", "Admin user does not belong to an organization.");
    }
    const { email: invitedUserEmail, fullName: invitedUserFullName, role: invitedUserRole } = request.data;
    if (!invitedUserEmail || !invitedUserFullName || !invitedUserRole) {
        throw new https_1.HttpsError("invalid-argument", "Missing email, full name, or role for invited user.");
    }
    if (!Object.values(UserRole).includes(invitedUserRole)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid role specified.");
    }
    const existingUserQuery = await db.collection("users")
        .where("email", "==", invitedUserEmail)
        .where("organizationId", "==", organizationId)
        .limit(1)
        .get();
    if (!existingUserQuery.empty) {
        throw new https_1.HttpsError("already-exists", `User with email ${invitedUserEmail} already exists in this organization.`);
    }
    const existingInviteQuery = await db.collection("invitations")
        .where("email", "==", invitedUserEmail)
        .where("organizationId", "==", organizationId)
        .limit(1)
        .get();
    if (!existingInviteQuery.empty) {
        throw new https_1.HttpsError("already-exists", `An active invitation for ${invitedUserEmail} already exists for this organization.`);
    }
    const organizationDoc = await db.collection("organizations").doc(organizationId).get();
    if (!organizationDoc.exists) {
        throw new https_1.HttpsError("not-found", "Admin's organization not found.");
    }
    const organizationData = organizationDoc.data();
    const invitationToken = generateSecureToken();
    const invitation = {
        email: invitedUserEmail,
        role: invitedUserRole,
        organizationId: organizationId,
        organizationName: organizationData.name,
        token: invitationToken,
        createdAt: admin.firestore.Timestamp.now(),
        expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    await db.collection("invitations").add(invitation);
    logger.info(`Invitation created for ${invitedUserEmail} to organization ${organizationId}. ` +
        `Token: ${invitationToken}. ` +
        `Invite Link: https://[YOUR_APP_DOMAIN]/set-password?token=${invitationToken}`);
    return {
        message: `Invitation sent to ${invitedUserEmail}.`,
        invitationToken: invitationToken,
    };
});
// --- Callable Function: Invited User Completes Setup ---
exports.completeInvitedUserSetup = (0, https_1.onCall)(async (request) => {
    const { invitationToken, password, fullName } = request.data;
    if (!invitationToken || !password || !fullName) {
        throw new https_1.HttpsError("invalid-argument", "Missing token, password, or full name.");
    }
    if (password.length < 8) {
        throw new https_1.HttpsError("invalid-argument", "Password must be at least 8 characters long.");
    }
    const inviteQuery = await db
        .collection("invitations")
        .where("token", "==", invitationToken)
        .limit(1)
        .get();
    if (inviteQuery.empty) {
        throw new https_1.HttpsError("not-found", "Invalid invitation token.");
    }
    const inviteDoc = inviteQuery.docs[0];
    const invitation = inviteDoc.data();
    if (invitation.expiresAt.toMillis() < Date.now()) {
        await inviteDoc.ref.delete(); // Clean up expired token
        throw new https_1.HttpsError("deadline-exceeded", "Invitation token has expired.");
    }
    try {
        await admin.auth().getUserByEmail(invitation.email);
        await inviteDoc.ref.delete(); // Clean up token
        throw new https_1.HttpsError("already-exists", "A user with this email address already exists. Please try logging in or resetting your password.");
    }
    catch (error) {
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
    }
    catch (error) {
        logger.error("Error creating Firebase Auth user from invite:", error);
        throw new https_1.HttpsError("internal", "Failed to create user account from invitation.", error.message);
    }
    const userProfile = {
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
exports.deleteUserByAdmin = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "User must be authenticated to delete users.");
    }
    const adminUid = request.auth.uid;
    const { userIdToDelete } = request.data;
    if (!userIdToDelete) {
        throw new https_1.HttpsError("invalid-argument", "Missing userIdToDelete.");
    }
    const adminClaims = request.auth.token;
    if (adminClaims.role !== "Admin") {
        throw new https_1.HttpsError("permission-denied", "Only admins can delete users.");
    }
    if (adminUid === userIdToDelete) {
        throw new https_1.HttpsError("permission-denied", "Admins cannot delete their own account.");
    }
    try {
        await admin.auth().deleteUser(userIdToDelete);
        await db.collection("users").doc(userIdToDelete).delete();
        logger.info(`Successfully deleted user ${userIdToDelete} by admin ${adminUid}`);
        return { success: true, message: "User deleted successfully." };
    }
    catch (error) {
        logger.error(`Error deleting user ${userIdToDelete} by admin ${adminUid}:`, error);
        throw new https_1.HttpsError("internal", "Failed to delete user.", error.message);
    }
});
// --- Firestore Trigger: Manage Custom User Claims ---
exports.onUserDocumentWrite = (0, firestore_1.onDocumentWritten)("users/{userId}", async (event) => {
    const userId = event.params.userId;
    if (!event.data?.after.exists) {
        logger.info(`User document ${userId} deleted. Skipping custom claims update.`);
        return null;
    }
    const userData = event.data.after.data();
    const oldUserData = event.data.before?.exists ? event.data.before.data() : null;
    const newOrganizationId = userData.organizationId;
    const newRole = userData.role;
    if (oldUserData &&
        oldUserData.organizationId === newOrganizationId &&
        oldUserData.role === newRole) {
        logger.info(`User ${userId} data updated, but organizationId and role remain unchanged. No custom claims update needed.`);
        return null;
    }
    if (!newOrganizationId || !newRole) {
        logger.error(`User ${userId} document is missing organizationId or role. Cannot set custom claims.`);
        return null;
    }
    try {
        const claimsToSet = {
            organizationId: newOrganizationId,
            role: newRole,
        };
        await admin.auth().setCustomUserClaims(userId, claimsToSet);
        logger.info(`Custom claims set for user ${userId}:`, claimsToSet);
    }
    catch (error) {
        logger.error(`Error setting custom claims for user ${userId}:`, error);
    }
    return null;
});
// --- Secure Gemini API Proxy Functions ---
const getGeminiResponse = async (prompt) => {
    // Get API key from Firebase Functions config
    const apiKey = process.env.FUNCTIONS_EMULATOR ?
        process.env.API_KEY : // Use local .env in emulator
        process.env.FIREBASE_CONFIG ?
            JSON.parse(process.env.FIREBASE_CONFIG).gemini.api_key : // Parse from FIREBASE_CONFIG
            null; // Fallback
    if (!apiKey) {
        throw new Error("Gemini API key not found. Please set it using 'firebase functions:config:set gemini.api_key=YOUR_API_KEY'");
    }
    const genAI = new genai_1.GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-preview-0514" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*
        ? (. *  ?  : )
            ?  :  : , s;
     * `` `$/s;
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
    ;
};
//# sourceMappingURL=index.js.map