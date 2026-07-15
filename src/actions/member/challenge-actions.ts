"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Fetches all active community challenges and the member's participation status.
 */
export async function getChallenges() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!member) return { success: false, error: "Member not found" };

    const challenges = await prisma.challenge.findMany({
      where: { isActive: true },
      include: {
        participants: {
          where: { memberId: member.id },
        },
        _count: {
          select: { participants: true },
        },
      },
    });

    return { success: true, data: challenges };
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return { success: false, error: "Failed to sync challenge data" };
  }
}

/**
 * Joins a community challenge.
 */
export async function joinChallenge(challengeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!member) return { success: false, error: "Member not found" };

    await prisma.challengeParticipant.create({
      data: {
        challengeId,
        memberId: member.id,
        progress: 0,
      },
    });

    revalidatePath("/member/challenges");
    return { success: true };
  } catch (error) {
    console.error("Error joining challenge:", error);
    return { success: false, error: "Failed to join challenge" };
  }
}
