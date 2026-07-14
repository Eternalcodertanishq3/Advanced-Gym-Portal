import { auth, signIn, signOut } from "@/auth";
import { ROLE_HIERARCHY } from "./constants";
import type { Role } from "./constants";

/**
 * Helper to get the authenticated user from a request (Server Side)
 */
export async function getAuthUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Check if current user has required role
 */
export function hasRequiredRole(userRole: Role, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
}

/**
 * Role-based redirect path
 */
export function getRedirectPath(role: Role): string {
  const paths: Record<Role, string> = {
    SUPER_ADMIN: "/super-admin",
    ADMIN: "/admin",
    MANAGER: "/admin",
    RECEPTIONIST: "/receptionist",
    TRAINER: "/trainer",
    MEMBER: "/member",
    WORKER: "/worker",
  };
  return paths[role] ?? "/member";
}

export { auth, signIn, signOut };