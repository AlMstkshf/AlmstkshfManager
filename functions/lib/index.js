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
exports.cleanupExpiredInvitations = exports.adminInviteUser = exports.signUpUser = exports.CONFIG = void 0;
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
const generative_ai_1 = require("@google/generative-ai");
admin.initializeApp();
const db = admin.firestore();
// Enums and Interfaces (assuming these are defined elsewhere and imported)
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["TeamMember"] = "team_member";
})(UserRole || (UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["Active"] = "active";
    UserStatus["Inactive"] = "inactive";
})(UserStatus || (UserStatus = {}));
// Helper function (assuming it's defined, e.g., using crypto)
function generateSecureToken(length) {
    const crypto = require("crypto");
    return crypto.randomBytes(length).toString("hex");
}
// utils/validation.ts
class ValidationUtils {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static validatePassword(password) {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
        }
        return null;
    }
    static validateRole(role) {
        return Object.values(UserRole).includes(role);
    }
}
// utils/auth.ts
class AuthUtils {
    static async requireAuth(request) {
        if (!request.auth) {
            throw new https_1.HttpsError("unauthenticated", "Authentication required.");
        }
    }
    static async requireRole(request, allowedRoles) {
        await this.requireAuth(request);
        const userRole = request.auth.token.role;
        if (!allowedRoles.includes(userRole)) {
            throw new https_1.HttpsError("permission-denied", `Insufficient permissions. Required: ${allowedRoles.join(", ")}`);
        }
    }
    static async getUserProfile(uid) {
        const userDoc = await db.collection("users").doc(uid).get();
        return userDoc.exists ? userDoc.data() : null;
    }
}
// utils/organization.ts
class OrganizationUtils {
    static async getOrganizationById(id) {
        const orgDoc = await db.collection("organizations").doc(id).get();
        return orgDoc.exists ? orgDoc.data() : null;
    }
    static async getOrganizationByInviteCode(inviteCode) {
        const orgQuery = await db
            .collection("organizations")
            .where("inviteCode", "==", inviteCode)
            .limit(1)
            .get();
        return orgQuery.empty ? null : orgQuery.docs[0].data();
    }
    static generateInviteCode(orgName) {
        const prefix = orgName.substring(0, 3).toUpperCase();
        const suffix = generateSecureToken(8);
        return `${prefix}-${suffix}`;
    }
}
// utils/invitation.ts
class InvitationUtils {
    static async createInvitation(email, role, organizationId, organizationName) {
        const token = generateSecureToken(64); // Increase token length
        const invitation = {
            email,
            role,
            organizationId,
            organizationName,
            token,
            createdAt: admin.firestore.Timestamp.now(),
            expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        await db.collection("invitations").add(invitation);
        return token;
    }
    static async validateInvitation(token) {
        const inviteQuery = await db
            .collection("invitations")
            .where("token", "==", token)
            .limit(1)
            .get();
        if (inviteQuery.empty) {
            throw new https_1.HttpsError("not-found", "Invalid invitation token.");
        }
        const inviteDoc = inviteQuery.docs[0];
        const invitation = inviteDoc.data();
        if (invitation.expiresAt.toMillis() < Date.now()) {
            await inviteDoc.ref.delete();
            throw new https_1.HttpsError("deadline-exceeded", "Invitation token has expired.");
        }
        return invitation;
    }
    static async cleanupExpiredInvitations() {
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
exports.CONFIG = {
    PASSWORD_MIN_LENGTH: 8,
    INVITATION_EXPIRY_DAYS: 7,
    INVITE_CODE_LENGTH: 8,
    TOKEN_LENGTH: 64,
    GEMINI_MODEL: "gemini-1.5-flash-preview-0514",
};
// --- Improved Sign-up Function ---
exports.signUpUser = (0, https_1.onCall)(async (request) => {
    const { email, password, fullName, mode, organizationName, inviteCode } = request.data;
    // Validate required fields
    if (!email || !password || !fullName || !mode) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields.");
    }
    if (!ValidationUtils.validateEmail(email)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid email format.");
    }
    const passwordError = ValidationUtils.validatePassword(password);
    if (passwordError) {
        throw new https_1.HttpsError("invalid-argument", passwordError);
    }
    if (mode === "create" && !organizationName) {
        throw new https_1.HttpsError("invalid-argument", "Organization name required for create mode.");
    }
    if (mode === "join" && !inviteCode) {
        throw new https_1.HttpsError("invalid-argument", "Invite code required for join mode.");
    }
    // Check if user already exists
    try {
        await admin.auth().getUserByEmail(email);
        throw new https_1.HttpsError("already-exists", "User with this email already exists.");
    }
    catch (error) {
        if (error.code !== "auth/user-not-found") {
            throw error;
        }
    }
    let userOrganizationId;
    let userRole;
    if (mode === "create") {
        // Create new organization
        userOrganizationId = db.collection("organizations").doc().id;
        userRole = UserRole.Admin;
        const newOrg = {
            id: userOrganizationId,
            name: organizationName,
            inviteCode: OrganizationUtils.generateInviteCode(organizationName),
            logoUrl: `https://via.placeholder.com/150/0000FF/FFFFFF?Text=${organizationName
                .charAt(0)
                .toUpperCase()}`,
        };
        await db.collection("organizations").doc(userOrganizationId).set(newOrg);
    }
    else {
        // Join existing organization
        const organization = await OrganizationUtils.getOrganizationByInviteCode(inviteCode);
        if (!organization) {
            throw new https_1.HttpsError("not-found", "Invalid organization invite code.");
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
    }
    catch (error) {
        logger.error("Error creating Firebase Auth user:", error);
        throw new https_1.HttpsError("internal", "Failed to create user account.", error.message);
    }
    // Create user profile
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
// --- Improved Admin Invite Function ---
exports.adminInviteUser = (0, https_1.onCall)(async (request) => {
    await AuthUtils.requireRole(request, [UserRole.Admin]);
    const { email, fullName, role } = request.data;
    const organizationId = request.auth.token.organizationId;
    if (!email || !fullName || !role) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields.");
    }
    if (!ValidationUtils.validateEmail(email)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid email format.");
    }
    if (!ValidationUtils.validateRole(role)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid role specified.");
    }
    // Check for existing user
    const existingUser = await db
        .collection("users")
        .where("email", "==", email)
        .where("organizationId", "==", organizationId)
        .limit(1)
        .get();
    if (!existingUser.empty) {
        throw new https_1.HttpsError("already-exists", `User with email ${email} already exists in this organization.`);
    }
    // Check for existing invitation
    const existingInvite = await db
        .collection("invitations")
        .where("email", "==", email)
        .where("organizationId", "==", organizationId)
        .limit(1)
        .get();
    if (!existingInvite.empty) {
        throw new https_1.HttpsError("already-exists", `An active invitation for ${email} already exists.`);
    }
    const organization = await OrganizationUtils.getOrganizationById(organizationId);
    if (!organization) {
        throw new https_1.HttpsError("not-found", "Organization not found.");
    }
    const invitationToken = await InvitationUtils.createInvitation(email, role, organizationId, organization.name);
    logger.info(`Invitation created for ${email} to organization ${organizationId}`);
    return {
        message: `Invitation sent to ${email}.`,
        invitationToken,
    };
});
// --- Scheduled Function for Cleanup ---
exports.cleanupExpiredInvitations = (0, scheduler_1.onSchedule)("every 24 hours", async () => {
    try {
        await InvitationUtils.cleanupExpiredInvitations();
        logger.info("Expired invitations cleanup completed");
    }
    catch (error) {
        logger.error("Error during invitation cleanup:", error);
    }
});
// --- Corrected Gemini Integration ---
const getGeminiResponse = async (prompt) => {
    // Get API key from Firebase Functions config
    const apiKey = process.env.FUNCTIONS_EMULATOR
        ? process.env.API_KEY // Use local .env in emulator
        : process.env.FIREBASE_CONFIG
            ? JSON.parse(process.env.FIREBASE_CONFIG).gemini.api_key // Parse from FIREBASE_CONFIG
            : null; // Fallback
    if (!apiKey) {
        throw new https_1.HttpsError("failed-precondition", "Gemini API key not found. Please set it using 'firebase functions:config:set gemini.api_key=YOUR_API_KEY'");
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: exports.CONFIG.GEMINI_MODEL,
    });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        let jsonStr = text.trim();
        // Fixed regex - all on one line
        const fenceRegex = /^```(\w*)?\s*
            ? (. *  ?  : )
                ?  :  : , s;
         * `` `$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    return JSON.parse(jsonStr);
  } catch (error: any) {
    logger.error("Gemini API error:", error);
    // It's better to throw a generic error to the client
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
    return await getGeminiResponse(prompt);
  } catch (error: any) {
    logger.error(`;
        Error;
        generating;
        $;
        {
            type;
        }
        content: `, error);
    // Re-throw the error to be caught by the client
    throw error;
  }
});;
    }
    finally { }
};
//# sourceMappingURL=index.js.map