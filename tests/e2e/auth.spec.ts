import { PasswordSchema, LoginSchema } from "../../src/lib/validators";
import bcryptjs from "bcryptjs";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — End-to-End Simulation: Auth Validations & Hashing
// ═══════════════════════════════════════════════════════════════

describe("Authentication Schemes Simulation", () => {
  describe("Password Validator Schema", () => {
    it("should reject passwords failing uppercase criteria", () => {
      const result = PasswordSchema.safeParse("password123!");
      expect(result.success).toBe(false);
    });

    it("should reject passwords failing special character criteria", () => {
      const result = PasswordSchema.safeParse("Password123");
      expect(result.success).toBe(false);
    });

    it("should reject passwords failing length constraints", () => {
      const result = PasswordSchema.safeParse("P1!");
      expect(result.success).toBe(false);
    });

    it("should accept valid, secure passwords", () => {
      const result = PasswordSchema.safeParse("EagleGym@2026");
      expect(result.success).toBe(true);
    });
  });

  describe("Login Payload Verification", () => {
    it("should accept valid email and password format", () => {
      const payload = {
        email: "superadmin@eaglegym.com",
        password: "EagleGymPassword123!",
        rememberMe: true
      };
      const result = LoginSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const payload = {
        email: "superadmin_eaglegym.com",
        password: "EagleGymPassword123!"
      };
      const result = LoginSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("Bcrypt Password Hashing & Verification", () => {
    const rawPassword = "EagleGym@2026";

    it("should securely hash password and verify it successfully", async () => {
      const hashed = await bcryptjs.hash(rawPassword, 10);
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(rawPassword);

      const matches = await bcryptjs.compare(rawPassword, hashed);
      expect(matches).toBe(true);

      const mismatch = await bcryptjs.compare("WrongPassword!", hashed);
      expect(mismatch).toBe(false);
    });
  });
});
