"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getBranchContext } from "@/lib/action-utils";

export async function getAttendanceLogs(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    const { branchId } = await getBranchContext();
    
    let where: any = {};

    if (branchId) {
      where.member = {
        user: {
          branchId: branchId
        }
      };
    }

    if (search) {
      where.member = {
        ...where.member,
        user: {
          ...where.member?.user,
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      };
    }

    const [logs, total] = await Promise.all([
      prisma.attendance.findMany({
        where: where,
        include: {
          member: {
            include: {
              user: {
                select: { firstName: true, lastName: true, email: true, avatar: true }
              }
            }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.attendance.count({ where: where })
    ]);

    return { 
      success: true, 
      data: {
        logs,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkInMember(memberId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeSession = await prisma.attendance.findFirst({
      where: {
        memberId,
        date: { gte: today },
      }
    });

    if (activeSession) {
      return { success: false, error: "Member is already checked in today." };
    }

    const now = new Date();
    const attendance = await prisma.attendance.create({
      data: {
        member: { connect: { id: memberId } },
        date: now,
        checkIn: now,
        status: "PRESENT"
      }
    });

    revalidatePath("/admin/attendance");
    return { success: true, data: attendance };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkOutMember(attendanceId: string) {
  try {
    const attendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        checkOut: new Date()
      }
    });
    
    revalidatePath("/admin/attendance");
    return { success: true, data: attendance };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Searches for a member by phone or member ID (specifically for Kiosk mode).
 */
export async function searchMemberByPhone(query: string) {
  try {
    if (!query || query.length < 3) return { success: false, error: "Query too short" };

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { user: { phone: { contains: query } } },
          { id: { contains: query } }
        ]
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
        subscription: { include: { plan: true } }
      }
    });

    if (!member) return { success: false, error: "Member not found" };

    return { success: true, data: member };
  } catch (error: any) {
    return { success: false, error: "Search failed" };
  }
}

