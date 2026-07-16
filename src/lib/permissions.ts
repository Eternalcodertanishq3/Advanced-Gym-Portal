import { auth } from "@/auth";

export type Permission =
  | "manage:tenants" // Super Admin
  | "manage:system" // Super Admin
  | "view:audit-logs" // Super Admin
  | "manage:branches" // Super Admin, Admin
  | "manage:members" // Admin, Receptionist
  | "view:members" // Admin, Receptionist, Trainer
  | "manage:trainers" // Admin
  | "manage:staff" // Admin
  | "manage:plans" // Admin
  | "manage:payments" // Admin, Receptionist
  | "delete:payments" // Admin
  | "manage:inventory" // Admin, Receptionist
  | "manage:equipment" // Admin, Worker
  | "manage:diet" // Trainer, Admin
  | "manage:workout" // Trainer, Admin
  | "export:csv" // Admin
  | "import:csv" // Admin
  | "view:own-profile"; // All

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: [
    "manage:tenants",
    "manage:system",
    "view:audit-logs",
    "manage:branches",
    "manage:members",
    "view:members",
    "manage:trainers",
    "manage:staff",
    "manage:plans",
    "manage:payments",
    "delete:payments",
    "manage:inventory",
    "manage:equipment",
    "manage:diet",
    "manage:workout",
    "export:csv",
    "import:csv",
    "view:own-profile",
  ],
  ADMIN: [
    "manage:branches",
    "manage:members",
    "view:members",
    "manage:trainers",
    "manage:staff",
    "manage:plans",
    "manage:payments",
    "delete:payments",
    "manage:inventory",
    "manage:equipment",
    "manage:diet",
    "manage:workout",
    "export:csv",
    "import:csv",
    "view:own-profile",
  ],
  RECEPTIONIST: [
    "view:members",
    "manage:members",
    "manage:payments",
    "manage:inventory",
    "view:own-profile",
  ],
  TRAINER: ["view:members", "manage:diet", "manage:workout", "view:own-profile"],
  WORKER: ["manage:equipment", "view:own-profile"],
  MEMBER: ["view:own-profile"],
  MANAGER: [
    "manage:members",
    "view:members",
    "manage:payments",
    "manage:inventory",
    "manage:equipment",
    "view:own-profile",
  ],
};

export function hasPermission(role: string | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

export async function ensurePermission(permission: Permission) {
  const session = await auth();
  if (!session?.user?.role || !hasPermission(session.user.role, permission)) {
    throw new Error("Unauthorized: Missing required permission: " + permission);
  }
  return session.user;
}
