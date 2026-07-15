"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMemberProgress(memberId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }
  // Verify memberId belongs to the current user or is manager
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (
    !member ||
    (member.userId !== session.user.id &&
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "ADMIN")
  ) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const logs = await prisma.workoutLog.findMany({
      where: {
        memberId,
      },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: logs };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
