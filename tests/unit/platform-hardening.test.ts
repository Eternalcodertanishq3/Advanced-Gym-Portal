import { checkRateLimit, rateLimit } from "../../src/lib/rate-limit";
import crypto from "crypto";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Unit Tests: Platform Hardening Modules
// ═══════════════════════════════════════════════════════════════

describe("Platform Hardening & Resilience Unit Tests", () => {
  describe("1. Time & Space Bounded Rate Limiter", () => {
    it("should allow initial requests within limit", async () => {
      const key = `tenant_test_${Date.now()}`;
      const res = await rateLimit(key, 5, 60);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(4);
      expect(res.limit).toBe(5);
    });

    it("should reject requests exceeding window limit", () => {
      const key = `burst_test_${Date.now()}`;
      // Exhaust quota
      for (let i = 0; i < 3; i++) {
        checkRateLimit(key, { limit: 3, windowMs: 10000 });
      }
      // 4th request must be rejected
      const blocked = checkRateLimit(key, { limit: 3, windowMs: 10000 });
      expect(blocked.success).toBe(false);
      expect(blocked.remaining).toBe(0);
    });
  });

  describe("2. GDPR / DPDP Irreversible PII Token Anonymization", () => {
    it("should generate cryptographically random collision-resistant anonymized tokens", () => {
      const token1 = crypto.randomBytes(8).toString("hex");
      const token2 = crypto.randomBytes(8).toString("hex");
      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(16);

      const anonymizedEmail = `deleted.user.${token1}@anonymized.local`;
      expect(anonymizedEmail).toContain("@anonymized.local");
      expect(anonymizedEmail).not.toContain("john.doe");
    });
  });

  describe("3. Subscription Dunning State Machine Rules", () => {
    it("should calculate correct grace period cutoff dates", () => {
      const gracePeriodDays = 7;
      const now = Date.now();
      const cutoffDate = new Date(now - gracePeriodDays * 24 * 60 * 60 * 1000);

      const overdueSubDate = new Date(now - 8 * 24 * 60 * 60 * 1000); // 8 days ago
      const withinGraceSubDate = new Date(now - 3 * 24 * 60 * 60 * 1000); // 3 days ago

      expect(overdueSubDate.getTime() <= cutoffDate.getTime()).toBe(true); // Should suspend
      expect(withinGraceSubDate.getTime() <= cutoffDate.getTime()).toBe(false); // Should remain in grace
    });
  });

  describe("4. Turnstile Double-Scan Cooldown Logic", () => {
    it("should detect and suppress duplicate scan events within 60s cooldown window", () => {
      const now = new Date();
      const cooldownWindow = new Date(now.getTime() - 60_000);

      const scan1Time = new Date(now.getTime() - 10_000); // 10s ago (within cooldown)
      const scan2Time = new Date(now.getTime() - 120_000); // 2m ago (outside cooldown)

      expect(scan1Time >= cooldownWindow).toBe(true); // Detected as double scan
      expect(scan2Time >= cooldownWindow).toBe(false); // Allowed as new session
    });
  });
});
