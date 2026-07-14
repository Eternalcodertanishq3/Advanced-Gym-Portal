import { Role } from "./enums";

export const PERMISSIONS = {
  MANAGE_MEMBERS: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST],
  MANAGE_TRAINERS: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  MANAGE_WORKERS: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  MANAGE_INVENTORY: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  MANAGE_FINANCE: [Role.SUPER_ADMIN, Role.ADMIN],
  VIEW_REPORTS: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  MANAGE_CLASSES: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.TRAINER],
  QUICK_CHECKIN: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST],
  MANAGE_SETTINGS: [Role.SUPER_ADMIN, Role.ADMIN],
};

export function hasPermission(
  userRole: Role | string | undefined,
  permissionLevel: Role[],
): boolean {
  if (!userRole) return false;
  return permissionLevel.includes(userRole as Role);
}
