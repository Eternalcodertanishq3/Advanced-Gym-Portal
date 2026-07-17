import { auth } from "@/auth";
import { hasPermission } from "@/lib/permissions";

import { prisma } from "@/lib/prisma";

export async function getEquipment(page = 1, limit = 10, search = "") {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "manage:equipment")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const skip = (page - 1) * limit;
    const whereClause: any = {};
    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }

    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        where: whereClause,
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.equipment.count({ where: whereClause }),
    ]);

    return {
      success: true,
      data: { equipment, pagination: { total, pages: Math.ceil(total / limit), page, limit } },
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function markEquipmentUnderMaintenance(id: string, notes?: string) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "manage:equipment")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const item = await prisma.equipment.update({
      where: { id },
      data: {
        status: "UNDER_MAINTENANCE",
        notes: notes ? `[MAINTENANCE] ${notes}` : undefined,
      },
    });
    require("next/cache").revalidatePath("/admin/equipment");
    return { success: true, data: item };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
