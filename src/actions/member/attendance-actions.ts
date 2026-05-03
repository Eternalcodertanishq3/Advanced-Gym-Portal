"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * Fetches attendance records for the current member.
 */
export async function getAttendanceHistory(month?: number, year?: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) return { success: false, error: "Member not found" };

    const now = new Date();
    const queryMonth = month !== undefined ? month : now.getMonth();
    const queryYear = year !== undefined ? year : now.getFullYear();

    const startDate = new Date(queryYear, queryMonth, 1);
    const endDate = new Date(queryYear, queryMonth + 1, 0, 23, 59, 59);

    const attendance = await prisma.attendance.findMany({
      where: {
        memberId: member.id,
        checkIn: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        branch: { select: { name: true } }
      },
      orderBy: { checkIn: "desc" }
    });

    return { success: true, data: attendance };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return { success: false, error: "Failed to sync attendance logs" };
  }
}

/**
 * Fetches attendance summary stats.
 */
export async function getAttendanceStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) return { success: false, error: "Member not found" };

    const totalLogs = await prisma.attendance.count({
      where: { memberId: member.id }
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyLogs = await prisma.attendance.count({
      where: { 
        memberId: member.id,
        checkIn: { gte: startOfMonth }
      }
    });

    return { 
      success: true, 
      data: {
        total: totalLogs,
        thisMonth: monthlyLogs,
        streak: 5, // Mocked for now
        lastCheckIn: await prisma.attendance.findFirst({
           where: { memberId: member.id },
           orderBy: { checkIn: "desc" }
        })
      }
    };
  } catch (error) {
    return { success: false, error: "Failed to retrieve stats" };
  }
}
