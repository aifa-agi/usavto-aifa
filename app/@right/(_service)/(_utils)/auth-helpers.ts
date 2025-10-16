// @/app/@right/(_service)/(_utils)/auth-helpers.ts

/**
 * Authentication & Authorization Utilities
 * 
 * Centralized role-based access control (RBAC) utilities for API routes.
 * Provides session checking, role validation, and privileged user verification.
 * 
 * Usage:
 * - Import requirePrivilegedUser() in any API route handler
 * - Call it at the beginning of POST/PUT/DELETE handlers
 * - Returns { success: true, session, userRole, isPrivileged } on success
 * - Returns { success: false, response } with NextResponse on failure
 */

import { NextResponse } from "next/server";
import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";

// -------------------- Types --------------------

export type UserRole =
  | "guest"
  | "architect"
  | "admin"
  | "editor"
  | "authUser"
  | "subscriber"
  | "customer"
  | "apiUser";

export const PRIVILEGED_ROLES: UserRole[] = ["architect", "admin", "editor"];

interface AuthSuccessResult {
  success: true;
  session: any;
  userRole: UserRole;
  isPrivileged: boolean;
}

interface AuthFailureResult {
  success: false;
  response: NextResponse;
}

export type AuthResult = AuthSuccessResult | AuthFailureResult;

// -------------------- Helpers --------------------

/**
 * Extract user role from NextAuth session
 * Uses session.user.type field as defined in auth.ts
 */
export function getUserRole(session: any): UserRole {
  const userType = session?.user?.type;

  if (!userType) return "guest";

  const validRoles: UserRole[] = [
    "guest",
    "architect",
    "admin",
    "editor",
    "authUser",
    "subscriber",
    "customer",
    "apiUser",
  ];

  return validRoles.includes(userType as UserRole)
    ? (userType as UserRole)
    : "guest";
}

/**
 * Check if a role has privileged access
 */
export function isPrivilegedRole(role?: string | null): boolean {
  if (!role) return false;
  return PRIVILEGED_ROLES.includes(role as UserRole);
}

/**
 * Get current session and determine user privileges
 * Returns session info or null if no session exists
 */
export async function getSessionInfo(): Promise<{
  session: any;
  userRole: UserRole;
  isPrivileged: boolean;
} | null> {
  try {
    const session = await auth();

    if (!session) {
      return null;
    }

    const userRole = getUserRole(session);
    const isPrivileged = isPrivilegedRole(userRole);

    return {
      session,
      userRole,
      isPrivileged,
    };
  } catch (err) {
    console.error("❌ Failed to get session:", err);
    return null;
  }
}

// -------------------- Main Authorization Function --------------------

/**
 * Require privileged user for API route access
 * 
 * This function checks if the current user has privileged access (architect, admin, or editor).
 * Use this at the beginning of sensitive API routes to enforce authorization.
 * 
 * @param requestId - Optional unique request ID for logging (generated if not provided)
 * @param customMessage - Optional custom error message for unauthorized access
 * @returns AuthResult - Either success with session info or failure with NextResponse
 * 
 * @example
 * ```
 * export async function POST(req: NextRequest) {
 *   const requestId = crypto.randomUUID();
 *   
 *   // Check authorization
 *   const authResult = await requirePrivilegedUser(requestId);
 *   
 *   if (!authResult.success) {
 *     return authResult.response; // Return 401/403 error
 *   }
 *   
 *   // Continue with authorized logic
 *   const { session, userRole, isPrivileged } = authResult;
 *   
 *   // Your protected code here...
 * }
 * ```
 */
export async function requirePrivilegedUser(
  requestId?: string,
  customMessage?: string
): Promise<AuthResult> {
  const reqId = requestId || crypto.randomUUID();

  console.log(`[${reqId}] 🔐 Checking user authorization...`);

  // Get session information
  const sessionInfo = await getSessionInfo();

  // No session found - user is not authenticated
  if (!sessionInfo) {
    console.error(`[${reqId}] ❌ AUTHORIZATION FAILED: No session found`);
    console.error(`[${reqId}] ❌ User must be logged in to access this resource`);

    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: customMessage || "Authentication required. Please log in to access this resource.",
          error: "UNAUTHORIZED",
          userRole: "guest",
        },
        { status: 401 }
      ),
    };
  }

  const { session, userRole, isPrivileged } = sessionInfo;

  console.log(`[${reqId}] 👤 User authenticated: ${session?.user?.email || "unknown"}`);
  console.log(`[${reqId}] 👤 User role: ${userRole}`);
  console.log(`[${reqId}] 👤 Privileged access: ${isPrivileged ? "YES ✅" : "NO ❌"}`);

  // User is authenticated but doesn't have privileged role
  if (!isPrivileged) {
    console.error(`[${reqId}] ❌ AUTHORIZATION FAILED: Insufficient privileges`);
    console.error(`[${reqId}] ❌ Required roles: ${PRIVILEGED_ROLES.join(", ")}`);
    console.error(`[${reqId}] ❌ User role: ${userRole}`);

    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message:
            customMessage ||
            `Access denied. This resource requires one of the following roles: ${PRIVILEGED_ROLES.join(", ")}. Your role: ${userRole}`,
          error: "FORBIDDEN",
          userRole,
          requiredRoles: PRIVILEGED_ROLES,
        },
        { status: 403 }
      ),
    };
  }

  // Authorization successful
  console.log(`[${reqId}] ✅ AUTHORIZATION SUCCESSFUL`);
  console.log(`[${reqId}] ✅ User "${userRole}" has privileged access`);

  return {
    success: true,
    session,
    userRole,
    isPrivileged,
  };
}

/**
 * Optional: Require specific role(s)
 * More granular than requirePrivilegedUser - checks for exact role match
 * 
 * @example
 * ```
 * const authResult = await requireRole(["admin", "architect"], requestId);
 * ```
 */
export async function requireRole(
  allowedRoles: UserRole[],
  requestId?: string,
  customMessage?: string
): Promise<AuthResult> {
  const reqId = requestId || crypto.randomUUID();

  console.log(`[${reqId}] 🔐 Checking specific role authorization...`);
  console.log(`[${reqId}] 🔐 Allowed roles: ${allowedRoles.join(", ")}`);

  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    console.error(`[${reqId}] ❌ AUTHORIZATION FAILED: No session found`);

    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: customMessage || "Authentication required. Please log in to access this resource.",
          error: "UNAUTHORIZED",
          userRole: "guest",
        },
        { status: 401 }
      ),
    };
  }

  const { session, userRole, isPrivileged } = sessionInfo;

  console.log(`[${reqId}] 👤 User authenticated: ${session?.user?.email || "unknown"}`);
  console.log(`[${reqId}] 👤 User role: ${userRole}`);

  if (!allowedRoles.includes(userRole)) {
    console.error(`[${reqId}] ❌ AUTHORIZATION FAILED: Role mismatch`);
    console.error(`[${reqId}] ❌ Required roles: ${allowedRoles.join(", ")}`);
    console.error(`[${reqId}] ❌ User role: ${userRole}`);

    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message:
            customMessage ||
            `Access denied. This resource requires one of the following roles: ${allowedRoles.join(", ")}. Your role: ${userRole}`,
          error: "FORBIDDEN",
          userRole,
          requiredRoles: allowedRoles,
        },
        { status: 403 }
      ),
    };
  }

  console.log(`[${reqId}] ✅ AUTHORIZATION SUCCESSFUL`);
  console.log(`[${reqId}] ✅ User role "${userRole}" matches required roles`);

  return {
    success: true,
    session,
    userRole,
    isPrivileged,
  };
}
