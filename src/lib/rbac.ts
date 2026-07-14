import { ROLES, ROLE_HIERARCHY, ROLE_PERMISSIONS, PERMISSIONS } from "./constants";
import type { Role, Permission } from "./constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Role-Based Access Control (RBAC)
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  if (!role || !permission) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Check if a role has ANY of the given permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  if (!role || !permissions.length) return false;
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Check if a role has ALL of the given permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  if (!role || !permissions.length) return false;
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if role A can manage role B (hierarchy check)
 * Super Admin can manage everyone
 * Admin can manage everyone except Super Admin and other Admins
 */
export function canManageRole(managerRole: Role, targetRole: Role): boolean {
  if (managerRole === ROLES.SUPER_ADMIN) return true;
  if (managerRole === ROLES.ADMIN) {
    return targetRole !== ROLES.SUPER_ADMIN && targetRole !== ROLES.ADMIN;
  }
  return false;
}

/**
 * Check if a user can access a specific resource (ownership check)
 * Users can always access their own resources
 * Higher roles can access lower role resources
 */
export function canAccessResource(
  userRole: Role,
  userId: string,
  resourceOwnerId: string,
  requiredPermission: Permission
): boolean {
  // Own resource
  if (userId === resourceOwnerId) return true;
  // Has explicit permission
  if (hasPermission(userRole, requiredPermission)) return true;
  return false;
}

/**
 * Check if role A has higher or equal hierarchy than role B
 */
export function isRoleHigherOrEqual(roleA: Role, roleB: Role): boolean {
  return (ROLE_HIERARCHY[roleA] ?? 0) >= (ROLE_HIERARCHY[roleB] ?? 0);
}

/**
 * Check if role A is strictly higher than role B
 */
export function isRoleHigher(roleA: Role, roleB: Role): boolean {
  return (ROLE_HIERARCHY[roleA] ?? 0) > (ROLE_HIERARCHY[roleB] ?? 0);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Get permissions that Admin is RESTRICTED from (vs Super Admin)
 * These are the ~2-5% restrictions Super Admin can toggle
 */
export function getAdminRestrictedPermissions(): Permission[] {
  return [
    PERMISSIONS.ADMIN_CREATE,
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.ADMIN_UPDATE,
    PERMISSIONS.ADMIN_DELETE,
    PERMISSIONS.ADMIN_PERMISSIONS,
    PERMISSIONS.PLAN_DELETE,
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.EXPORT_UNLIMITED,
    PERMISSIONS.ANALYTICS_CHURN,
  ];
}

/**
 * Check if Admin has a specific restriction
 */
export function isAdminRestricted(permission: Permission): boolean {
  return getAdminRestrictedPermissions().includes(permission);
}

/**
 * Filter permissions — remove restricted ones for Admin
 * Super Admin passes all, Admin gets filtered
 */
export function filterPermissionsByRole(
  role: Role,
  permissions: Permission[]
): Permission[] {
  if (role === ROLES.SUPER_ADMIN) return permissions;
  if (role === ROLES.ADMIN) {
    const restricted = getAdminRestrictedPermissions();
    return permissions.filter((p) => !restricted.includes(p));
  }
  return permissions.filter((p) => hasPermission(role, p));
}

/**
 * Middleware helper: Check route access
 */
export function canAccessRoute(role: Role, routePrefix: string): boolean {
  const routeMap: Record<string, Role[]> = {
    "/super-admin": [ROLES.SUPER_ADMIN],
    "/admin": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    "/receptionist": [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST],
    "/trainer": [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TRAINER],
    "/member": [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER, ROLES.MEMBER],
    "/worker": [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.WORKER],
  };

  for (const [prefix, allowedRoles] of Object.entries(routeMap)) {
    if (routePrefix.startsWith(prefix)) {
      return allowedRoles.includes(role);
    }
  }
  return false;
}

/**
 * Get dashboard home path based on role
 */
export function getRoleDashboard(role: Role): string {
  const dashboardMap: Record<Role, string> = {
    SUPER_ADMIN: "/super-admin",
    ADMIN: "/admin",
    MANAGER: "/admin",
    RECEPTIONIST: "/receptionist",
    TRAINER: "/trainer",
    MEMBER: "/member",
    WORKER: "/worker",
  };
  return dashboardMap[role] ?? "/";
}

/**
 * Get readable role label
 */
export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    MANAGER: "Manager",
    RECEPTIONIST: "Receptionist",
    TRAINER: "Trainer",
    MEMBER: "Member",
    WORKER: "Staff",
  };
  return labels[role] ?? role;
}

/**
 * Get role badge color class
 */
export function getRoleBadgeClass(role: Role): string {
  const classes: Record<Role, string> = {
    SUPER_ADMIN: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    ADMIN: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    MANAGER: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    RECEPTIONIST: "bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30",
    TRAINER: "bg-neon-green/20 text-neon-green border-neon-green/30",
    MEMBER: "bg-gold-500/20 text-gold-400 border-gold-500/30",
    WORKER: "bg-obsidian-400/20 text-obsidian-300 border-obsidian-400/30",
  };
  return classes[role] ?? "bg-obsidian-500/20 text-obsidian-300";
}

/**
 * Permission guard component helper
 * Returns true/false for conditional rendering
 */
export function usePermission(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return hasPermission(role, permission);
}

/**
 * Check if user can perform bulk operations
 */
export function canBulkOperate(role: Role): boolean {
  return hasAnyPermission(role, [
    PERMISSIONS.MEMBER_BULK,
    PERMISSIONS.IMPORT_DATA,
    PERMISSIONS.EXPORT_DATA,
  ]);
}

/**
 * Check export limit based on role
 */
export function getExportLimit(role: Role): number {
  if (role === ROLES.SUPER_ADMIN) return 100000;
  if (role === ROLES.ADMIN) return 5000;
  return 0;
}

/**
 * Validate that a role assignment is legal
 * (e.g., Admin cannot create Super Admin)
 */
export function isValidRoleAssignment(
  assignerRole: Role,
  targetRole: Role
): { valid: boolean; reason?: string } {
  if (assignerRole === ROLES.SUPER_ADMIN) return { valid: true };

  if (assignerRole === ROLES.ADMIN) {
    if (targetRole === ROLES.SUPER_ADMIN) {
      return { valid: false, reason: "Admin cannot assign Super Admin role" };
    }
    if (targetRole === ROLES.ADMIN) {
      return { valid: false, reason: "Admin cannot assign Admin role" };
    }
    return { valid: true };
  }

  return {
    valid: false,
    reason: "You don't have permission to assign roles",
  };
}

/**
 * Role-based sidebar navigation filter
 * Returns allowed nav items based on role
 */
export function getAllowedNavItems<T extends { requiredPermission?: Permission }>(
  role: Role,
  items: T[]
): T[] {
  return items.filter((item) => {
    if (!item.requiredPermission) return true;
    return hasPermission(role, item.requiredPermission);
  });
}