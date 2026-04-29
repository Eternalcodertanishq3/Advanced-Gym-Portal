"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMembers(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      user: {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } }
        ]
      }
    } : {};

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
          subscription: {
            include: {
              plan: true
            }
          }
        },
        orderBy: { joinDate: 'desc' }
      }),
      prisma.member.count({ where })
    ]);

    return {
      success: true,
      data: members,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    console.error("Error fetching members:", error);
    return { success: false, error: error.message || "Failed to fetch members" };
  }
}

export async function getMemberById(id: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: true,
        subscription: {
          include: {
            plan: true
          }
        },
        trainer: {
          include: {
            user: true
          }
        },
        attendance: {
          take: 5,
          orderBy: { date: 'desc' }
        },
        payments: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    return { success: true, data: member };
  } catch (error: any) {
    console.error("Error fetching member:", error);
    return { success: false, error: error.message || "Failed to fetch member details" };
  }
}
