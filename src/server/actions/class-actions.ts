"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClasses(page = 1, limit = 10, search = "") {
  try {
    const skip = (page - 1) * limit;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        name: { contains: search, mode: "insensitive" }
      };
    }

    const [classes, total] = await Promise.all([
      prisma.gymClass.findMany({
        where: whereClause,
        include: {
          trainer: {
            include: { user: { select: { firstName: true, lastName: true } } }
          },
          schedules: {
            include: {
              _count: {
                select: { bookings: true }
              }
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.gymClass.count({ where: whereClause })
    ]);

    return { 
      success: true, 
      data: {
        classes,
        pagination: { total, pages: Math.ceil(total / limit), page, limit }
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createClass(data: { name: string, description?: string, trainerId: string, category: any, capacity: number, duration: number }) {
  try {
    const gymClass = await prisma.gymClass.create({
      data: {
        name: data.name,
        description: data.description,
        trainerId: data.trainerId,
        category: data.category,
        maxCapacity: data.capacity,
        duration: data.duration,
      }
    });

    revalidatePath("/admin/classes");
    return { success: true, data: gymClass };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getClassById(id: string) {
  try {
    const cls = await prisma.gymClass.findUnique({
      where: { id },
      include: {
        trainer: { include: { user: true } },
        schedules: true
      }
    });
    if (!cls) return { success: false, error: "Class not found" };
    return { success: true, data: cls };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateClass(id: string, data: any) {
  try {
    const cls = await prisma.gymClass.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        trainerId: data.trainerId,
        category: data.category,
        maxCapacity: Number(data.capacity),
        duration: Number(data.duration),
        isActive: data.isActive,
      }
    });

    revalidatePath("/admin/classes");
    return { success: true, data: cls };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteClass(id: string) {
  try {
    await prisma.gymClass.delete({
      where: { id }
    });

    revalidatePath("/admin/classes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function bookClass(scheduleId: string) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) return { success: false, error: "Member profile not found" };

    // Check if already booked
    const existing = await prisma.classBooking.findFirst({
      where: {
        scheduleId,
        memberId: member.id,
        status: "CONFIRMED"
      }
    });

    if (existing) return { success: false, error: "You have already booked this class session." };

    // Check capacity
    const schedule = await prisma.classSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        class: true,
        _count: {
          select: { bookings: { where: { status: "CONFIRMED" } } }
        }
      }
    });

    if (!schedule) return { success: false, error: "Class schedule not found" };
    if (schedule._count.bookings >= schedule.class.maxCapacity) {
      return { success: false, error: "This class is fully booked." };
    }

    const booking = await prisma.classBooking.create({
      data: {
        scheduleId,
        memberId: member.id,
        status: "CONFIRMED"
      }
    });

    revalidatePath("/member/classes");
    return { success: true, data: booking };
  } catch (error: any) {
    console.error("Error booking class:", error);
    return { success: false, error: error.message || "Failed to book class" };
  }
}
