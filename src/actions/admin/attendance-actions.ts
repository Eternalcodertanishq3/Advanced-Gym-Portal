"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getBranchContext } from "@/lib/action-utils";
import { auth } from "@/auth";

export async function getAttendanceLogs(page = 1, limit = 10, search = "") {
  try {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (Math.max(1, page) - 1) * safeLimit;

    const { branchId } = await getBranchContext();

    const where: any = {};

    if (branchId) {
      where.member = {
        user: {
          branchId: branchId,
        },
      };
    }

    if (search) {
      where.member = {
        ...where.member,
        user: {
          ...where.member?.user,
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        },
      };
    }

    const [logs, total] = await Promise.all([
      prisma.attendance.findMany({
        where: where,
        include: {
          member: {
            include: {
              user: {
                select: { firstName: true, lastName: true, email: true, avatar: true },
              },
            },
          },
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.attendance.count({ where: where }),
    ]);

    return {
      success: true,
      data: {
        logs,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function checkInMember(memberId: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cooldownWindow = new Date(now.getTime() - 60_000); // 60s debounce

    // Atomic Transaction: Check-in idempotency & single-session enforcement
    const attendance = await prisma.$transaction(async (tx) => {
      // 1. Double-scan cooldown protection (Idempotency)
      const recentScan = await tx.attendance.findFirst({
        where: {
          memberId,
          checkIn: { gte: cooldownWindow },
        },
      });
      if (recentScan) {
        return recentScan; // Safely return existing check-in without duplicating
      }

      // 2. Active daily session check
      const activeSession = await tx.attendance.findFirst({
        where: {
          memberId,
          date: { gte: today },
          checkOut: null,
        },
      });

      if (activeSession) {
        throw new Error("Member is already checked in today.");
      }

      return tx.attendance.create({
        data: {
          member: { connect: { id: memberId } },
          date: today,
          checkIn: now,
          status: "PRESENT",
        },
      });
    });

    revalidatePath("/admin/attendance");
    return { success: true, data: attendance };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function checkOutMember(attendanceId: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const attendance = await prisma.$transaction(async (tx) => {
      const record = await tx.attendance.findUnique({ where: { id: attendanceId } });
      if (!record) throw new Error("Attendance record not found");
      if (record.checkOut) return record; // Idempotent return

      return tx.attendance.update({
        where: { id: attendanceId },
        data: { checkOut: new Date() },
      });
    });

    revalidatePath("/admin/attendance");
    return { success: true, data: attendance };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Searches for a member by phone or member ID (specifically for Kiosk mode).
 */
export async function searchMemberByPhone(query: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    if (!query || query.length < 3) return { success: false, error: "Query too short" };

    const member = await prisma.member.findFirst({
      where: {
        OR: [{ user: { phone: { contains: query } } }, { id: { contains: query } }],
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
        subscription: { include: { plan: true } },
      },
    });

    if (!member) return { success: false, error: "Member not found" };

    return { success: true, data: member };
  } catch (error: unknown) {
    return { success: false, error: "Search failed" };
  }
}
