"use server";
// Force IDE re-evaluation
import { prisma } from "@/lib/prisma";
import { SECURITY } from "@/lib/constants";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function resetInitialPassword(newPassword: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, SECURITY.BCRYPT_ROUNDS);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
        passwordResetRequired: false,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
