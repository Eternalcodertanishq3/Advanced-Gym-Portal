"use server";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { SECURITY } from "@/lib/constants";
import { serializeData } from "@/lib/utils";

export async function getStaff(page = 1, limit = 10, search = "") {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "manage:staff")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (Math.max(1, page) - 1) * safeLimit;

    let whereClause: any = {};
    if (search) {
      whereClause = {
        user: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      };
    }

    const [workers, total] = await Promise.all([
      prisma.worker.findMany({
        where: whereClause,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, avatar: true, phone: true },
          },
        },
        orderBy: { joiningDate: "desc" },
        skip,
        take: safeLimit,
      }),
      prisma.worker.count({ where: whereClause }),
    ]);

    return {
      success: true,
      data: serializeData({
        staff: workers,
        pagination: { total, pages: Math.ceil(total / safeLimit), page, limit: safeLimit },
      }),
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Fetches attendance records for staff members.
 */
export async function getStaffAttendance(limit = 20) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "manage:staff")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const attendance = await prisma.attendance.findMany({
      where: {
        user: { role: { not: "MEMBER" } },
      },
      include: {
        user: { select: { firstName: true, lastName: true, role: true, avatar: true } },
      },
      orderBy: { date: "desc" },
      take: safeLimit,
    });

    return { success: true, data: serializeData(attendance) };
  } catch (error: unknown) {
    return { success: false, error: "Failed to load staff attendance" };
  }
}

export async function getStaffById(id: string) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "manage:staff")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!worker) return { success: false, error: "Staff member not found" };
    return { success: true, data: serializeData(worker) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function createStaff(data: any) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "manage:staff")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(
      SECURITY.DEFAULT_TEMP_PASSWORD(),
      SECURITY.BCRYPT_ROUNDS,
    );

    // Atomic Transaction: Concurrency-safe duplicate check and staff creation
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.user.findFirst({
        where: {
          OR: [{ email: data.email }, { phone: data.phone }],
        },
      });
      if (existing) throw new Error("A user with this email or phone already exists.");

      const user = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: "WORKER",
          status: "ACTIVE",
          passwordResetRequired: true,
        },
      });

      const worker = await tx.worker.create({
        data: {
          userId: user.id,
          department: data.department || "GENERAL",
          shiftStart: data.shiftStart || "06:00",
          shiftEnd: data.shiftEnd || "22:00",
          salary: data.salary,
        },
      });

      return worker;
    });

    require("next/cache").revalidatePath("/admin/staff");
    return { success: true, data: serializeData(result) };
  } catch (error: unknown) {
    console.error("Error creating staff:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "Email or phone number already exists." };
    }
    return {
      success: false,
      error: (error instanceof Error ? error.message : String(error)) || "Failed to onboard staff",
    };
  }
}

export async function updateStaff(id: string, data: any) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "manage:staff")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const worker = await tx.worker.update({
        where: { id },
        data: {
          department: data.department,
          shiftStart: data.shiftStart,
          shiftEnd: data.shiftEnd,
          salary: data.salary,
          isActive: data.isActive,
          user: {
            update: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
            },
          },
        },
        include: { user: true },
      });
      return worker;
    });

    require("next/cache").revalidatePath("/admin/staff");
    return { success: true, data: serializeData(result) };
  } catch (error: unknown) {
    console.error("Error updating staff:", error);
    return {
      success: false,
      error: (error instanceof Error ? error.message : String(error)) || "Failed to update staff",
    };
  }
}
