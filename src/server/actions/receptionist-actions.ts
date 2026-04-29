"use server";

import { prisma } from "@/lib/prisma";

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
          }
        }
      })
    ]);

    const todayCollection = todayPayments.reduce((sum, p) => sum + Number(p.total), 0);
    const recentCheckIns = recentCheckInsRaw.map(a => ({
      id: a.id,
      name: `${a.member.user?.firstName || "Member"} ${a.member.user?.lastName || ""}`.trim(),
      time: a.date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: "checked-in"
    }));

    return {
      success: true,
      data: {
        todayCheckIns,
        pendingPayments,
        todayClasses,
        newWalkIns,
        todayCollection,
        recentCheckIns
      }
    };
  } catch (error: any) {
    console.error("Error fetching receptionist stats:", error);
    return { success: false, error: error.message || "Failed to fetch stats" };
  }
}
