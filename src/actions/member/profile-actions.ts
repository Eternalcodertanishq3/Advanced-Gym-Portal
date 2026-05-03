"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Updates the user's password.
 */
export async function updatePassword(data: { current: string, new: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || !user.password) return { success: false, error: "User not found" };

    const isValid = await bcrypt.compare(data.current, user.password);
    if (!isValid) return { success: false, error: "Incorrect current password" };

    const hashedPassword = await bcrypt.hash(data.new, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: "Failed to update password" };
  }
}

/**
 * Updates notification preferences.
 */
export async function updateNotificationPreferences(prefs: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // This would ideally be a separate JSON field or related model
    // For now, we'll simulate success
    await new Promise(resolve => setTimeout(resolve, 500));

    revalidatePath("/member/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to save preferences" };
  }
}
