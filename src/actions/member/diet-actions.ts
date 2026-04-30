"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Fetches diet plans assigned to the authenticated member.
 */
export async function getMemberDiets() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) {
      return { success: false, error: "Member profile not found" };
    }

    const plans = await prisma.dietPlan.findMany({
      where: {
        OR: [
          { memberId: member.id },
          { isTemplate: true }
        ]
      },
      include: {
        meals: {
          orderBy: { sortOrder: 'asc' }
        },
        trainer: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: plans };
  } catch (error) {
    console.error("Error fetching member diets:", error);
    return { success: false, error: "Failed to load nutrition data" };
  }
}
