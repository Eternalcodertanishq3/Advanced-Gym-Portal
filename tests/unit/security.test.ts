import { rateLimit } from "../../src/lib/rate-limit";
import { PasswordSchema } from "../../src/lib/validators";
import crypto from "crypto";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Unit Tests: Security Hardening & Rate Limiting
// ═══════════════════════════════════════════════════════════════

describe("Security Hardening Unit Tests", () => {
  describe("Rate Limiting Helper", () => {
    it("should allow requests and return remaining quota if Redis client is not initialized", async () => {
      const res = await rateLimit("test_ip", 10, 60);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(10);
    });
  });

  describe("Password Validator Strength Tests", () => {
    it("should accept strong passwords matching SaaS requirements", () => {
      const result = PasswordSchema.safeParse("GymFlow@Secure123!");
      expect(result.success).toBe(true);
    });

    it("should reject weak passwords lacking uppercase letters", () => {
      const result = PasswordSchema.safeParse("gymflow@secure123!");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Password must contain at least one uppercase letter");
      }
    });

    it("should reject weak passwords lacking special characters", () => {
      const result = PasswordSchema.safeParse("GymFlowSecure123");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Password must contain at least one special character");
      }
    });

    it("should reject short passwords", () => {
      const result = PasswordSchema.safeParse("G@1s");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Password must be at least 8 characters");
      }
    });
  });

  describe("Timing Safe Signature Comparison", () => {
    function safeCompare(a: string, b: string): boolean {
      const bufA = Buffer.from(a, "utf-8");
      const bufB = Buffer.from(b, "utf-8");
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    }

    it("should return true for identical signatures", () => {
      const sig = "abc123xyz789";
      expect(safeCompare(sig, sig)).toBe(true);
    });

    it("should return false for different signatures", () => {
      expect(safeCompare("abc123xyz789", "different_sig")).toBe(false);
    });

    it("should handle different length buffers gracefully without throwing", () => {
      expect(() => safeCompare("abc", "abcdef")).not.toThrow();
      expect(safeCompare("abc", "abcdef")).toBe(false);
    });
  });
});
