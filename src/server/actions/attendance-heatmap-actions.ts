"use server";

import { prisma } from "@/lib/prisma";

export async function getAttendanceHeatmapData(year: number, month: number) {
  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const attendances = await prisma.attendance.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        _all: true
      }
    });

    // Map to a format the heatmap understands
    const data = attendances.map(a => {
      const count = a._count._all;
      let intensity = 0;
      if (count > 300) intensity = 4;
      else if (count > 250) intensity = 3;
      else if (count > 200) intensity = 2;
      else if (count > 150) intensity = 1;

      return {
        date: a.date.toISOString(),
        count,
        intensity
      };
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching heatmap data:", error);
    return { success: false, error: error.message || "Failed to fetch heatmap data" };
  }
}
