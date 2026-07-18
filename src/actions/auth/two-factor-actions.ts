"use server";

import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/notification-service";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * 🦅 GymFlow SaaS — Multi-Factor Authentication (2FA) Actions
 */

/**
 * 1. Check if 2FA is required and generate OTP if enabled
 */
export async function check2FARequired(emailInput: string, passwordInput: string) {
  try {
    if (!emailInput || !passwordInput) {
      return { success: false, error: "Email and password are required" };
    }

    const email = emailInput.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return { success: false, error: "Invalid email or password" };
    }

    const passwordMatches = await bcrypt.compare(passwordInput, user.password);
    if (!passwordMatches) {
      return { success: false, error: "Invalid email or password" };
    }

    // Check account status
    if (user.status === "SUSPENDED" || user.status === "INACTIVE") {
      return { success: false, error: "Account is suspended or inactive" };
    }

    if (!user.twoFactorEnabled) {
      return { success: true, requires2FA: false };
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 300000); // 5-minute expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: otp,
        twoFactorExpires: expires,
      },
    });

    // Send 2FA email
    const emailResult = await NotificationService.sendEmail({
      to: user.email,
      subject: "Your 2FA Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #f1f1f1; borderRadius: 12px;">
          <h2 style="color: #f97316; font-size: 20px; font-weight: bold; margin-bottom: 16px;">GymFlow SaaS — Multi-Factor Authentication</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Hello ${user.firstName},<br/><br/>
            Your one-time 2FA security verification code is:
          </p>
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; tracking-wider: 4px; color: #f97316; background-color: #fcf6f0; padding: 12px 30px; border-radius: 12px; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 11px; line-height: 1.6;">
            This code will expire in 5 minutes. If you did not trigger this request, please secure your password immediately.
          </p>
        </div>
      `,
    });

    if (!emailResult.success) {
      return { success: false, error: "Failed to send 2FA verification email" };
    }

    return { success: true, requires2FA: true };
  } catch (error: unknown) {
    console.error("2FA Pre-verification error:", error);
    return { success: false, error: "Internal server error" };
  }
}

/**
 * 2. Validate OTP code for Login
 */
export async function verify2FAOtp(emailInput: string, otpInput: string) {
  try {
    if (!emailInput || !otpInput) {
      return { success: false, error: "Email and OTP are required" };
    }

    const email = emailInput.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.twoFactorCode || !user.twoFactorExpires) {
      return { success: false, error: "No active 2FA request found for this account" };
    }

    if (user.twoFactorExpires < new Date()) {
      return { success: false, error: "2FA code has expired. Please request a new one." };
    }

    if (user.twoFactorCode !== otpInput.trim()) {
      return { success: false, error: "Invalid verification code. Please try again." };
    }

    // Clear code after successful verification to prevent reuse
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: null,
        twoFactorExpires: null,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("2FA Verification error:", error);
    return { success: false, error: "Internal server error" };
  }
}

/**
 * 3. Toggle 2FA settings for the logged-in user
 */
export async function toggleUser2FA(enabled: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: enabled,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Toggle 2FA error:", error);
    return { success: false, error: "Failed to update 2FA settings" };
  }
}
