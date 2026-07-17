import { resolveTenantId, tenantStorage } from "../../src/lib/prisma";
import { headers } from "next/headers";

// Mock next/headers module
jest.mock("next/headers", () => ({
  headers: jest.fn()
}));

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Integration Tests: Multi-Tenant Context Resolution
// ═══════════════════════════════════════════════════════════════

describe("Multi-Tenant Context Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve tenantId from AsyncLocalStorage store if present", async () => {
    await tenantStorage.run({ tenantId: "tenant_abc_123" }, async () => {
      const tenantId = await resolveTenantId();
      expect(tenantId).toBe("tenant_abc_123");
    });
  });

  it("should fallback to HTTP request header x-tenant-id if AsyncLocalStorage is empty", async () => {
    // Mock headers return value
    const mockHeaders = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === "x-tenant-id") return "tenant_header_789";
        return null;
      })
    };
    (headers as jest.Mock).mockResolvedValue(mockHeaders);

    const tenantId = await resolveTenantId();
    expect(tenantId).toBe("tenant_header_789");
    expect(mockHeaders.get).toHaveBeenCalledWith("x-tenant-id");
  });

  it("should return undefined if neither store nor headers exist (safe for CLI context)", async () => {
    (headers as jest.Mock).mockRejectedValue(
      new Error("Headers are not available outside request context")
    );

    const tenantId = await resolveTenantId();
    expect(tenantId).toBeUndefined();
  });
});
