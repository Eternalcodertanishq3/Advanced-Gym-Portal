"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReceptionistDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayCheckIns,
      pendingPayments,
      todayClasses,
      newWalkIns,
      todayPayments,
      recentCheckInsRaw
    ] = await Promise.all([
      prisma.attendance.count({ where: { date: { gte: today } } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.gymClass.count({ where: { isActive: true } }),
      prisma.member.count({ where: { joinDate: { gte: today } } }),
      prisma.payment.findMany({
        where: { status: "COMPLETED", createdAt: { gte: today } },
        select: { total: true }
      }),
      prisma.attendance.findMany({
        where: { date: { gte: today } },
        take: 5,
        orderBy: { checkIn: 'desc' },
        include: {
          member: {
            include: { user: true }
          },
          user: {
            select: { firstName: true, lastName: true }
          }
        }
      })
    ]);

    const todayCollection = todayPayments.reduce((sum, p) => sum + Number(p.total), 0);
    const recentCheckIns = recentCheckInsRaw.map(a => {
      const person = a.member?.user || (a as any).user;
      return {
        id: a.id,
        name: person ? `${person.firstName} ${person.lastName}`.trim() : "Unknown",
        time: a.date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        status: "checked-in"
      };
    });

    return { success: true, data: { todayCheckIns, pendingPayments, todayClasses, todayCollection, recentCheckIns, newWalkIns } };
  } catch (error: any) {
    console.error("Error fetching receptionist stats:", error);
    return { success: false, error: error.message || "Failed to fetch stats" };
  }
}

/**
 * Generates a temporary visitor pass.
 */
export async function generateVisitorPass(data: {
  name: string;
  phone: string;
  email?: string;
  purpose: string;
  validUntil: Date;
}) {
  try {
    const pass = await prisma.visitorPass.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        purpose: data.purpose,
        validUntil: data.validUntil,
        passCode: `GUEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        createdBy: "RECEPTIONIST" // Should ideally be session user ID
      }
    });

    return { success: true, data: pass };
  } catch (error: any) {
    return { success: false, error: "Failed to generate pass" };
  }
}

export async function getReceptionists(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    let where: any = {};

    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ]
      };
    }

    const [receptionists, total] = await Promise.all([
      prisma.receptionist.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.receptionist.count({ where })
    ]);

    return {
      success: true,
      data: receptionists,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    console.error("Error fetching receptionists:", error);
    return { success: false, error: error.message || "Failed to fetch receptionists" };
  }
}

export async function getReceptionistById(id: string) {
  try {
    const rec = await prisma.receptionist.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!rec) return { success: false, error: "Receptionist not found" };
    return { success: true, data: rec };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createReceptionist(data: any) {
  try {
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("Eagle@123", 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: "RECEPTIONIST",
          status: "ACTIVE",
          passwordResetRequired: true,
        },
      });

      const rec = await tx.receptionist.create({
        data: {
          userId: user.id,
          shiftStart: data.shiftStart || "06:00",
          shiftEnd: data.shiftEnd || "22:00",
          salary: data.salary,
        },
      });

      return rec;
    });

    revalidatePath("/admin/receptionists");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error creating receptionist:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Email or phone number already exists." };
    }
    return { success: false, error: error.message || "Failed to onboard staff" };
  }
}

export async function updateReceptionist(id: string, data: any) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const rec = await tx.receptionist.update({
        where: { id },
        data: {
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
            }
          }
        },
        include: { user: true }
      });
      return rec;
    });

    revalidatePath("/admin/receptionists");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating receptionist:", error);
    return { success: false, error: error.message || "Failed to update staff" };
  }
}
