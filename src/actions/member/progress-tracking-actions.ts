"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMemberProgress(memberId: string) {
  try {
    const logs = await prisma.workoutLog.findMany({
      where: {
        memberId
      },
      orderBy: { createdAt: 'asc' }
    });
    return { success: true, data: logs };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
