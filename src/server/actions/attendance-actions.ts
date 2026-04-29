"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAttendanceLogs(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        member: {
          user: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ]
          }
        }
      };
    }

    const [logs, total] = await Promise.all([
      prisma.attendance.findMany({
        where: whereClause,
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
      prisma.attendance.count({ where: whereClause })
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

