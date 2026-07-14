import { hasPermission, canManageRole, canAccessRoute, isRoleHigher } from "../../src/lib/rbac";
import { ROLES, PERMISSIONS } from "../../src/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Unit Tests: Role-Based Access Control (RBAC)
// ═══════════════════════════════════════════════════════════════

describe("RBAC System Unit Tests", () => {
  describe("hasPermission", () => {
    it("should allow SUPER_ADMIN to have administrative privileges", () => {
      expect(hasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.ADMIN_CREATE)).toBe(true);
      expect(hasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.SYSTEM_CONFIG)).toBe(true);
    });

    it("should restrict normal MEMBER from managing staff", () => {
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.STAFF_CREATE)).toBe(false);
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.PLAN_DELETE)).toBe(false);
    });

    it("should allow MEMBER to read workouts and log diets", () => {
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.WORKOUT_READ)).toBe(true);
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.DIET_READ)).toBe(true);
    });
  });

  describe("canManageRole", () => {
    it("should allow SUPER_ADMIN to manage all roles", () => {
      expect(canManageRole(ROLES.SUPER_ADMIN, ROLES.ADMIN)).toBe(true);
      expect(canManageRole(ROLES.SUPER_ADMIN, ROLES.MEMBER)).toBe(true);
      expect(canManageRole(ROLES.SUPER_ADMIN, ROLES.SUPER_ADMIN)).toBe(true);
    });

    it("should allow ADMIN to manage lower roles but not other Admins or Super Admins", () => {
      expect(canManageRole(ROLES.ADMIN, ROLES.MEMBER)).toBe(true);
      expect(canManageRole(ROLES.ADMIN, ROLES.TRAINER)).toBe(true);
      expect(canManageRole(ROLES.ADMIN, ROLES.ADMIN)).toBe(false);
      expect(canManageRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)).toBe(false);
    });
  });

  describe("canAccessRoute", () => {
    it("should restrict dashboard paths based on authorization checks", () => {
      expect(canAccessRoute(ROLES.SUPER_ADMIN, "/super-admin/backups")).toBe(true);
      expect(canAccessRoute(ROLES.ADMIN, "/super-admin/settings")).toBe(false);
      expect(canAccessRoute(ROLES.ADMIN, "/admin/members")).toBe(true);
      expect(canAccessRoute(ROLES.MEMBER, "/member/workout")).toBe(true);
      expect(canAccessRoute(ROLES.MEMBER, "/admin/members")).toBe(false);
    });
  });

  describe("isRoleHigher", () => {
    it("should validate strict hierarchy checking", () => {
      expect(isRoleHigher(ROLES.SUPER_ADMIN, ROLES.ADMIN)).toBe(true);
      expect(isRoleHigher(ROLES.ADMIN, ROLES.MEMBER)).toBe(true);
      expect(isRoleHigher(ROLES.MEMBER, ROLES.SUPER_ADMIN)).toBe(false);
    });
  });
});
