"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SECURITY } from "@/lib/constants";

export async function getStaff(page = 1, limit = 10, search = "") {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const skip = (page - 1) * limit;

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
        take: limit,
      }),
      prisma.worker.count({ where: whereClause }),
    ]);

    return {
      success: true,
      data: { staff: workers, pagination: { total, pages: Math.ceil(total / limit), page, limit } },
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
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        user: { role: { not: "MEMBER" } },
      },
      include: {
        user: { select: { firstName: true, lastName: true, role: true, avatar: true } },
      },
      orderBy: { date: "desc" },
      take: limit,
    });

    return { success: true, data: attendance };
  } catch (error: unknown) {
    return { success: false, error: "Failed to load staff attendance" };
  }
}

export async function getStaffById(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!worker) return { success: false, error: "Staff member not found" };
    return { success: true, data: worker };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function createStaff(data: any) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(
      SECURITY.DEFAULT_TEMP_PASSWORD(),
      SECURITY.BCRYPT_ROUNDS,
    );

    const result = await prisma.$transaction(async (tx) => {
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

    revalidatePath("/admin/staff");
    return { success: true, data: result };
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
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
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

    revalidatePath("/admin/staff");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Error updating staff:", error);
    return {
      success: false,
      error: (error instanceof Error ? error.message : String(error)) || "Failed to update staff",
    };
  }
}
