"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Fetches all achievements and which ones the member has earned.
 */
export async function getMemberAchievements() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const [allAchievements, userAchievements] = await Promise.all([
      prisma.achievement.findMany({
        orderBy: { xpValue: "asc" },
      }),
      prisma.userAchievement.findMany({
        where: { userId: session.user.id },
        include: {
          achievement: true,
        },
      }),
    ]);

    // Map all achievements with a "locked" or "unlocked" state
    const mappedAchievements = allAchievements.map((achievement) => {
      const earned = userAchievements.find((ua) => ua.achievementId === achievement.id);
      return {
        ...achievement,
        unlocked: !!earned,
        unlockedAt: earned?.achievedAt || null,
      };
    });

    return {
      success: true,
      data: {
        achievements: mappedAchievements,
        earnedCount: userAchievements.length,
        totalCount: allAchievements.length,
      },
    };
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return { success: false, error: "Failed to load achievements" };
  }
}

/**
 * Awards XP to a member and records the transaction.
 */
export async function awardXP(userId: string, amount: number, reason: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN" &&
      session.user.id !== userId)
  ) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const [xpTransaction, updatedUser] = await prisma.$transaction([
      prisma.xPTransaction.create({
        data: { userId, amount, reason },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: amount } },
      }),
    ]);

    return { success: true, data: { xpTransaction, currentXP: updatedUser.xp } };
  } catch (error) {
    console.error("Error awarding XP:", error);
    return { success: false, error: "Failed to award XP" };
  }
}

/**
 * Fetches the global leaderboard for the gym.
 */
export async function getLeaderboard(limit = 10) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  try {
    const topMembers = await prisma.user.findMany({
      where: { role: "MEMBER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        xp: true,
        member: { select: { joinDate: true } },
      },
      orderBy: { xp: "desc" },
      take: limit,
    });

    return { success: true, data: topMembers };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { success: false, error: "Failed to load leaderboard" };
  }
}
