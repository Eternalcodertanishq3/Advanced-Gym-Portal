"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

export async function getAttendanceHeatmapData(year: number, month: number) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const attendances = await prisma.attendance.groupBy({
      by: ["date"],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        _all: true,
      },
    });

    // Map to a format the heatmap understands
    const data = attendances.map((a) => {
      const count = a._count._all;
      let intensity = 0;
      if (count > 300) intensity = 4;
      else if (count > 250) intensity = 3;
      else if (count > 200) intensity = 2;
      else if (count > 150) intensity = 1;

      return {
        date: a.date.toISOString(),
        count,
        intensity,
      };
    });

    return { success: true, data };
  } catch (error: unknown) {
    console.error("Error fetching heatmap data:", error);
    return {
      success: false,
      error:
        (error instanceof Error ? error.message : String(error)) || "Failed to fetch heatmap data",
    };
  }
}
