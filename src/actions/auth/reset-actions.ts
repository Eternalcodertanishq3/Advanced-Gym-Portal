"use server";
// Force IDE re-evaluation
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function resetInitialPassword(newPassword: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
        passwordResetRequired: false,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
