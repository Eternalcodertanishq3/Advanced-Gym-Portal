"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getClasses(page = 1, limit = 10, search = "") {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  try {
    const skip = (page - 1) * limit;

    let whereClause: any = {};
    if (search) {
      whereClause = {
        name: { contains: search, mode: "insensitive" },
      };
    }

    const [classes, total] = await Promise.all([
      prisma.gymClass.findMany({
        where: whereClause,
        include: {
          trainer: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
          schedules: {
            include: {
              _count: {
                select: { bookings: true },
              },
            },
          },
        },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.gymClass.count({ where: whereClause }),
    ]);

    return {
      success: true,
      data: {
        classes,
        pagination: { total, pages: Math.ceil(total / limit), page, limit },
      },
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function createClass(data: {
  name: string;
  description?: string;
  trainerId: string;
  category: any;
  capacity: number;
  duration: number;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const gymClass = await prisma.gymClass.create({
      data: {
        name: data.name,
        description: data.description,
        trainerId: data.trainerId,
        category: data.category,
        maxCapacity: data.capacity,
        duration: data.duration,
      },
    });

    revalidatePath("/admin/classes");
    return { success: true, data: gymClass };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getClassById(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  try {
    const cls = await prisma.gymClass.findUnique({
      where: { id },
      include: {
        trainer: { include: { user: true } },
        schedules: true,
      },
    });
    if (!cls) return { success: false, error: "Class not found" };
    return { success: true, data: cls };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updateClass(id: string, data: any) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
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
      },
    });

    revalidatePath("/admin/classes");
    return { success: true, data: cls };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteClass(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.gymClass.delete({
      where: { id },
    });

    revalidatePath("/admin/classes");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function bookClass(scheduleId: string) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!member) return { success: false, error: "Member profile not found" };

    // Atomic Transaction: Database RLS & Concurrency-safe capacity check
    const tenantId = (session.user as any).tenantId;
    const { withTenantRLS } = await import("@/lib/rls");

    const booking = await withTenantRLS(tenantId, async (tx) => {
      const existing = await tx.classBooking.findFirst({
        where: { scheduleId, memberId: member.id, status: "CONFIRMED" },
      });
      if (existing) throw new Error("You have already booked this class session.");

      const schedule = await tx.classSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          class: true,
          _count: { select: { bookings: { where: { status: "CONFIRMED" } } } },
        },
      });

      if (!schedule) throw new Error("Class schedule not found");
      if (schedule._count.bookings >= schedule.class.maxCapacity) {
        throw new Error("This class is fully booked.");
      }

      return tx.classBooking.create({
        data: {
          scheduleId,
          memberId: member.id,
          status: "CONFIRMED",
        },
      });
    });

    revalidatePath("/member/classes");
    return { success: true, data: booking };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to book class";
    return { success: false, error: message };
  }
}
