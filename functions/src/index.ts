import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";

admin.initializeApp();
const db = admin.firestore();

// Enums and Interfaces
enum UserRole {
  Admin = "admin",
  TeamMember = "team_member",
}

enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

interface UserProfile {
  id: string;
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
  logoUrl: string;
}

interface Invitation {
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  token: string;
  createdAt: admin.firestore.Timestamp;
  expiresAt: admin.firestore.Timestamp;
}

// Helper function
function generateSecureToken(length: number): string {
  const crypto = require("crypto");
  return crypto.randomBytes(length).toString("hex");
}

// utils/validation.ts
class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): string | null {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }
    return null;
  }

  static validateRole(role: string): boolean {
    return Object.values(UserRole).includes(role as UserRole);
  }
}

// utils/auth.ts
class AuthUtils {
  static async requireAuth(request: any): Promise<void> {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }
  }

  static async requireRole(
    request: any,
    allowedRoles: UserRole[]
  ): Promise<void> {
    await this.requireAuth(request);
    
    // Get user profile to check role
    const userProfile = await this.getUserProfile(request.auth!.uid);
    if (!userProfile || !allowedRoles.includes(userProfile.role)) {
      throw new HttpsError(
        "permission-denied",
        `Insufficient permissions. Required: ${allowedRoles.join(", ")}`
      );
    }
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = await db.collection("users").doc(uid).get();
    return userDoc.exists ? (userDoc.data() as UserProfile) : null;
  }

  static async setCustomClaims(uid: string, claims: Record<string, any>): Promise<void> {
    await admin.auth().setCustomUserClaims(uid, claims);
  }
}

// utils/organization.ts
class OrganizationUtils {
  static async getOrganizationById(id: string): Promise<Organization | null> {
    const orgDoc = await db.collection("organizations").doc(id).get();
    return orgDoc.exists ? (orgDoc.data() as Organization) : null;
  }

  static async getOrganizationByInviteCode(
    inviteCode: string
  ): Promise<Organization | null> {
    const orgQuery = await db
      .collection("organizations")
      .where("inviteCode", "==", inviteCode)
      .limit(1)
      .get();

    return orgQuery.empty ? null : (orgQuery.docs[0].data() as Organization);
  }

  static generateInviteCode(orgName: string): string {
    const prefix = orgName.substring(0, 3).toUpperCase();
    const suffix = generateSecureToken(4);
    return `${prefix}-${suffix}`;
  }
}

// utils/invitation.ts
class InvitationUtils {
  static async createInvitation(
    email: string,
    role: UserRole,
    organizationId: string,
    organizationName: string
  ): Promise<string> {
    const token = generateSecureToken(32);
    const invitation: Invitation = {
      email,
      role,
      organizationId,
      organizationName,
      token,
      createdAt: admin.firestore.Timestamp.now(),
      expiresAt: admin.firestore.Timestamp.fromMillis(
        Date.now() + CONFIG.INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      ),
    };

    await db.collection("invitations").add(invitation);
    return token;
  }

  static async validateInvitation(token: string): Promise<Invitation> {
    const inviteQuery = await db
      .collection("invitations")
      .where("token", "==", token)
      .limit(1)
      .get();

    if (inviteQuery.empty) {
      throw new HttpsError("not-found", "Invalid invitation token.");
    }

    const inviteDoc = inviteQuery.docs[0];
    const invitation = inviteDoc.data() as Invitation;

    if (invitation.expiresAt.toMillis() < Date.now()) {
      await inviteDoc.ref.delete();
      throw new HttpsError("deadline-exceeded", "Invitation token has expired.");
    }

    return invitation;
  }

  static async deleteInvitation(token: string): Promise<void> {
    const inviteQuery = await db
      .collection("invitations")
      .where("token", "==", token)
      .limit(1)
      .get();

    if (!inviteQuery.empty) {
      await inviteQuery.docs[0].ref.delete();
    }
  }

  static async cleanupExpiredInvitations(): Promise<void> {
    const expiredQuery = await db
      .collection("invitations")
      .where("expiresAt", "<", admin.firestore.Timestamp.now())
      .get();

    const batch = db.batch();
    expiredQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

// config/constants.ts
export const CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  INVITATION_EXPIRY_DAYS: 7,
  INVITE_CODE_LENGTH: 8,
  TOKEN_LENGTH: 32,
  GEMINI_MODEL: "gemini-1.5-flash",
};

// --- Improved Sign-up Function ---
export const signUpUser = onCall(async (request) => {
  const { email, password, fullName, mode, organizationName, inviteCode } =
    request.data;

  // Validate required fields
  if (!email || !password || !fullName || !mode) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  if (!ValidationUtils.validateEmail(email)) {
    throw new HttpsError("invalid-argument", "Invalid email format.");
  }

  const passwordError = ValidationUtils.validatePassword(password);
  if (passwordError) {
    throw new HttpsError("invalid-argument", passwordError);
  }

  if (mode === "create" && !organizationName) {
    throw new HttpsError(
      "invalid-argument",
      "Organization name required for create mode."
    );
  }

  if (mode === "join" && !inviteCode) {
    throw new HttpsError(
      "invalid-argument",
      "Invite code required for join mode."
    );
  }

  // Check if user already exists
  try {
    await admin.auth().getUserByEmail(email);
    throw new HttpsError(
      "already-exists",
      "User with this email already exists."
    );
  } catch (error: any) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  let userOrganizationId: string;
  let userRole: UserRole;

  if (mode === "create") {
    // Create new organization
    userOrganizationId = db.collection("organizations").doc().id;
    userRole = UserRole.Admin;

    const newOrg: Organization = {
      id: userOrganizationId,
      name: organizationName,
      inviteCode: OrganizationUtils.generateInviteCode(organizationName),
      logoUrl: `https://via.placeholder.com/150/0000FF/FFFFFF?Text=${organizationName
        .charAt(0)
        .toUpperCase()}`,
    };

    await db.collection("organizations").doc(userOrganizationId).set(newOrg);
  } else {
    // Join existing organization
    const organization = await OrganizationUtils.getOrganizationByInviteCode(
      inviteCode
    );
    if (!organization) {
      throw new HttpsError("not-found", "Invalid organization invite code.");
    }
    userOrganizationId = organization.id;
    userRole = UserRole.TeamMember;
  }

  // Create user account
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

  // Create user profile
  const userProfile: UserProfile = {
    id: newUserRecord.uid,
    name: fullName,
    email,
    role: userRole,
    organizationId: userOrganizationId,
    status: UserStatus.Active,
  };

  await db.collection("users").doc(newUserRecord.uid).set(userProfile);

  // Set custom claims
  await AuthUtils.setCustomClaims(newUserRecord.uid, {
    role: userRole,
    organizationId: userOrganizationId,
  });

  return {
    uid: newUserRecord.uid,
    email: userProfile.email,
    role: userProfile.role,
    organizationId: userProfile.organizationId,
    message: "User signed up successfully.",
  };
});

// --- Accept Invitation Function ---
export const acceptInvitation = onCall(async (request) => {
  const { token, password, fullName } = request.data;

  if (!token || !password || !fullName) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  const passwordError = ValidationUtils.validatePassword(password);
  if (passwordError) {
    throw new HttpsError("invalid-argument", passwordError);
  }

  // Validate invitation
  const invitation = await InvitationUtils.validateInvitation(token);

  // Check if user already exists
  try {
    await admin.auth().getUserByEmail(invitation.email);
    throw new HttpsError(
      "already-exists",
      "User with this email already exists."
    );
  } catch (error: any) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  // Create user account
  let newUserRecord;
  try {
    newUserRecord = await admin.auth().createUser({
      email: invitation.email,
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

  // Create user profile
  const userProfile: UserProfile = {
    id: newUserRecord.uid,
    name: fullName,
    email: invitation.email,
    role: invitation.role,
    organizationId: invitation.organizationId,
    status: UserStatus.Active,
  };

  await db.collection("users").doc(newUserRecord.uid).set(userProfile);

  // Set custom claims
  await AuthUtils.setCustomClaims(newUserRecord.uid, {
    role: invitation.role,
    organizationId: invitation.organizationId,
  });

  // Delete the invitation
  await InvitationUtils.deleteInvitation(token);

  return {
    uid: newUserRecord.uid,
    email: userProfile.email,
    role: userProfile.role,
    organizationId: userProfile.organizationId,
    message: "Invitation accepted successfully.",
  };
});

// --- Improved Admin Invite Function ---
export const adminInviteUser = onCall(async (request) => {
  await AuthUtils.requireRole(request, [UserRole.Admin]);

  const { email, role } = request.data;
  const userProfile = await AuthUtils.getUserProfile(request.auth!.uid);
  
  if (!userProfile) {
    throw new HttpsError("not-found", "User profile not found.");
  }

  const organizationId = userProfile.organizationId;

  if (!email || !role) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  if (!ValidationUtils.validateEmail(email)) {
    throw new HttpsError("invalid-argument", "Invalid email format.");
  }

  if (!ValidationUtils.validateRole(role)) {
    throw new HttpsError("invalid-argument", "Invalid role specified.");
  }

  // Check for existing user
  const existingUser = await db
    .collection("users")
    .where("email", "==", email)
    .where("organizationId", "==", organizationId)
    .limit(1)
    .get();

  if (!existingUser.empty) {
    throw new HttpsError(
      "already-exists",
      `User with email ${email} already exists in this organization.`
    );
  }

  // Check for existing invitation
  const existingInvite = await db
    .collection("invitations")
    .where("email", "==", email)
    .where("organizationId", "==", organizationId)
    .limit(1)
    .get();

  if (!existingInvite.empty) {
    throw new HttpsError(
      "already-exists",
      `An active invitation for ${email} already exists.`
    );
  }

  const organization = await OrganizationUtils.getOrganizationById(
    organizationId
  );
  if (!organization) {
    throw new HttpsError("not-found", "Organization not found.");
  }

  const invitationToken = await InvitationUtils.createInvitation(
    email,
    role as UserRole,
    organizationId,
    organization.name
  );

  logger.info(
    `Invitation created for ${email} to organization ${organizationId}`
  );

  return {
    message: `Invitation sent to ${email}.`,
    invitationToken,
  };
});

// --- Scheduled Function for Cleanup ---
export const cleanupExpiredInvitations = onSchedule(
  "every 24 hours",
  async () => {
    try {
      await InvitationUtils.cleanupExpiredInvitations();
      logger.info("Expired invitations cleanup completed");
    } catch (error) {
      logger.error("Error during invitation cleanup:", error);
    }
  }
);

// --- Fixed Gemini Integration ---
const getGeminiResponse = async (prompt: string): Promise<any> => {
  // Improved API key retrieval
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new HttpsError(
      "failed-precondition",
      "Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: CONFIG.GEMINI_MODEL,
  });

  try {
    const result: GenerateContentResult = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    let jsonStr = text.trim();
    
    // Fixed regex pattern for code fences
    const fenceRegex = /^```(?:\w+)?\s*\n?([\s\S]*?)\n?\s*```$/;
    const match = jsonStr.match(fenceRegex);
    
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      logger.warn("Failed to parse JSON response from Gemini:", parseError);
      return { content: jsonStr };
    }
  } catch (error: any) {
    logger.error("Gemini API error:", error);
    throw new HttpsError(
      "internal",
      "AI service temporarily unavailable. Please try again later."
    );
  }
};

// --- Consolidated Gemini Functions ---
export const generateAIContent = onCall(async (request) => {
  await AuthUtils.requireAuth(request);

  const { prompt, type } = request.data;
  if (!prompt || !type) {
    throw new HttpsError("invalid-argument", "Prompt and type are required.");
  }

  const validTypes = ["ideas", "sentiment", "agenda", "insights"];
  if (!validTypes.includes(type)) {
    throw new HttpsError("invalid-argument", "Invalid content type.");
  }

  try {
    const response = await getGeminiResponse(prompt);
    return {
      type,
      content: response,
      timestamp: admin.firestore.Timestamp.now(),
    };
  } catch (error: any) {
    logger.error(`Error generating ${type} content:`, error);
    throw error;
  }
});

// --- Get Organization Info ---
export const getOrganization = onCall(async (request) => {
  await AuthUtils.requireAuth(request);

  const userProfile = await AuthUtils.getUserProfile(request.auth!.uid);
  if (!userProfile) {
    throw new HttpsError("not-found", "User profile not found.");
  }

  const organization = await OrganizationUtils.getOrganizationById(
    userProfile.organizationId
  );
  
  if (!organization) {
    throw new HttpsError("not-found", "Organization not found.");
  }

  return organization;
});

// --- Get Organization Members ---
export const getOrganizationMembers = onCall(async (request) => {
  await AuthUtils.requireAuth(request);

  const userProfile = await AuthUtils.getUserProfile(request.auth!.uid);
  if (!userProfile) {
    throw new HttpsError("not-found", "User profile not found.");
  }

  const membersQuery = await db
    .collection("users")
    .where("organizationId", "==", userProfile.organizationId)
    .where("status", "==", UserStatus.Active)
    .get();

  const members = membersQuery.docs.map(doc => doc.data() as UserProfile);
  
  return {
    members,
    total: members.length,
  };
});