import { test, expect } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════
 * 🦅 GymFlow SaaS — Playwright E2E Login Flow Tests
 * ═══════════════════════════════════════════════════════════════
 */
test.describe("Login E2E Flow", () => {
  test("should redirect unauthenticated users visiting dashboard to login", async ({ page }) => {
    // Attempt to access protected dashboard layout
    await page.goto("/admin/settings");

    // Should be redirected to NextAuth login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("should display login elements successfully", async ({ page }) => {
    await page.goto("/login");

    // Verify presence of email input, password input, and submit button
    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    const submitBtn = page.locator("button[type='submit']");

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });
});
