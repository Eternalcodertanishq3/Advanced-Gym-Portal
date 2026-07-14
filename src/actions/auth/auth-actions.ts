"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string) {
  const session = await auth();
  if (!session?.user || (session.user.id !== userId && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        member: true,
        trainer: true,
        receptionist: true,
        worker: true
      }
    });
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(userId: string, data: { name?: string, phone?: string }) {
  const session = await auth();
  if (!session?.user || (session.user.id !== userId && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data
    });
    revalidatePath("/");
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
