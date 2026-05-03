"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getMemberProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            branch: {
              select: {
                name: true,
              }
            },
          }
        },
        subscription: {
          include: {
            plan: true
          }
        },
        _count: {
          select: {
            attendance: {
              where: {
                date: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
              }
            }
          }
        }
      }
    });

    if (!member) {
      return { success: false, error: "Member profile not found" };
    }

    return { success: true, data: member };
  } catch (error) {
    console.error("Error fetching member profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}
