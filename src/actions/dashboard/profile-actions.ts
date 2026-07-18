"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SECURITY } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  const validated = profileSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: validated.data,
    });

    revalidatePath("/(dashboard)", "layout");
    return { success: true, message: "Profile updated successfully" };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { error: "Email or phone already in use" };
    }
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());
  const validated = passwordSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { currentPassword, newPassword } = validated.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) return { error: "User not found" };
    if (!user.password) {
      return {
        error:
          "This account does not use a password login (OAuth/Magic Link active). Contact support to add a password.",
      };
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) return { error: "Incorrect current password" };

    const hashedPassword = await bcrypt.hash(newPassword, SECURITY.BCRYPT_ROUNDS);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    return { error: "Failed to change password" };
  }
}

export async function requestAccountDeletion() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    const member = await prisma.member.findFirst({
      where: { userId: session.user.id },
      include: {
        subscription: true,
      },
    });

    const hasActiveSubscription =
      member && member.subscription && member.subscription.status === "ACTIVE";

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        deletionRequested: true,
        deletionRequestedAt: new Date(),
      },
    });

    if (hasActiveSubscription) {
      return {
        success: true,
        message:
          "Account deletion requested. Please ensure you cancel any active subscriptions to prevent recurring charges.",
      };
    }

    return {
      success: true,
      message:
        "Your account deletion request has been submitted. Our compliance team will process it shortly.",
    };
  } catch (error) {
    return { error: "Failed to submit deletion request" };
  }
}
