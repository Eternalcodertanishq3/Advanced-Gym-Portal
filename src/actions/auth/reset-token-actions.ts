"use server";

import { prisma } from "@/lib/prisma";
import { SECURITY } from "@/lib/constants";
import { NotificationService } from "@/lib/notification-service";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

const emailSchema = z.string().email();

/**
 * 🦅 GymFlow SaaS — Password Reset & Email Verification Actions
 */

/**
 * 1. Request Password Reset Link
 */
export async function requestPasswordReset(emailInput: string) {
  try {
    const validated = emailSchema.safeParse(emailInput);
    if (!validated.success) {
      return { success: false, error: "Invalid email format" };
    }

    const email = validated.data.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    // Prevent email enumeration: return success even if user not found
    if (!user) {
      return { success: true };
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1 Hour Expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    const emailResult = await NotificationService.sendEmail({
      to: user.email,
      subject: "Reset your GymFlow SaaS Password",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #f1f1f1; borderRadius: 12px;">
          <h2 style="color: #f97316; font-size: 20px; font-weight: bold; margin-bottom: 16px;">GymFlow SaaS — Password Reset Request</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Hello ${user.firstName},<br/><br/>
            We received a request to reset your password. Click the button below to secure your account:
          </p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #64748b; font-size: 11px; line-height: 1.6;">
            If you did not request a password reset, you can safely ignore this email. This link will expire in 1 hour.
          </p>
        </div>
      `,
    });

    if (!emailResult.success) {
      return { success: false, error: "Failed to deliver reset email" };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Forgot password request error:", error);
    return { success: false, error: "Internal server error" };
  }
}

/**
 * 2. Reset Password using reset token
 */
export async function resetPasswordWithToken(token: string, newPasswordInput: string) {
  try {
    if (!token) {
      return { success: false, error: "Missing reset token" };
    }

    if (newPasswordInput.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long" };
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { success: false, error: "Invalid or expired password reset token" };
    }

    const hashedPassword = await bcrypt.hash(newPasswordInput, SECURITY.BCRYPT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordResetRequired: false,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Token password reset error:", error);
    return { success: false, error: "Internal server error" };
  }
}

/**
 * 3. Send Email Verification Link
 */
export async function sendEmailVerification(emailInput: string) {
  try {
    const validated = emailSchema.safeParse(emailInput);
    if (!validated.success) {
      return { success: false, error: "Invalid email format" };
    }

    const email = validated.data.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const token = crypto.randomUUID();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: token,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify-email?token=${token}`;

    const emailResult = await NotificationService.sendEmail({
      to: user.email,
      subject: "Verify your GymFlow SaaS Account",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #f1f1f1; borderRadius: 12px;">
          <h2 style="color: #f97316; font-size: 20px; font-weight: bold; margin-bottom: 16px;">Welcome to GymFlow SaaS</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Hello ${user.firstName},<br/><br/>
            Thank you for registering. Please click the button below to verify your email address:
          </p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${verificationUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 8px; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #64748b; font-size: 11px; line-height: 1.6;">
            If you did not create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (!emailResult.success) {
      return { success: false, error: "Failed to deliver verification email" };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Verification email request error:", error);
    return { success: false, error: "Internal server error" };
  }
}

/**
 * 4. Verify Email using token
 */
export async function verifyEmailWithToken(token: string) {
  try {
    if (!token) {
      return { success: false, error: "Missing verification token" };
    }

    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return { success: false, error: "Invalid email verification token" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Verify email error:", error);
    return { success: false, error: "Internal server error" };
  }
}
