"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEquipment(page = 1, limit = 10, search = "") {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const skip = (page - 1) * limit;
    let whereClause: any = {};
    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }

    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.equipment.count({ where: whereClause })
    ]);

    return { 
      success: true, 
      data: { equipment, pagination: { total, pages: Math.ceil(total / limit), page, limit } }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markEquipmentUnderMaintenance(id: string, notes?: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const item = await prisma.equipment.update({
      where: { id },
      data: { 
        status: "UNDER_MAINTENANCE",
        notes: notes ? `[MAINTENANCE] ${notes}` : undefined
      }
    });
    revalidatePath("/admin/equipment");
    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

