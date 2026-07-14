"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Fetches dashboard statistics for the authenticated worker.
 */
export async function getWorkerDashboardStats() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "WORKER") {
      return { success: false, error: "Unauthorized" };
    }

    const worker = await prisma.worker.findUnique({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            tasks: { where: { status: { not: "COMPLETED" } } },
            maintenanceLogs: { where: { status: "PENDING" } },
          },
        },
      },
    });

    if (!worker) return { success: false, error: "Worker profile not found" };

    const [recentTasks, faultyEquipment] = await Promise.all([
      prisma.task.findMany({
        where: { workerId: worker.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.equipment.count({
        where: { status: { in: ["UNDER_MAINTENANCE", "OUT_OF_ORDER"] } },
      }),
    ]);

    return {
      success: true,
      data: {
        pendingTasks: worker._count.tasks,
        activeMaintenance: worker._count.maintenanceLogs,
        faultyEquipment,
        recentTasks,
      },
    };
  } catch (error: any) {
    console.error("Error fetching worker stats:", error);
    return { success: false, error: "Failed to load dashboard data" };
  }
}

/**
 * Fetches tasks assigned to the authenticated worker.
 */
export async function getWorkerTasks() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const worker = await prisma.worker.findUnique({
      where: { userId: session.user.id },
    });

    if (!worker) return { success: false, error: "Worker not found" };

    const tasks = await prisma.task.findMany({
      where: { workerId: worker.id },
      orderBy: [
        { status: "asc" }, // PENDING first
        { dueDate: "asc" },
      ],
    });

    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, error: "Failed to load tasks" };
  }
}

/**
 * Updates the status of a specific task.
 */
export async function updateTaskStatus(taskId: string, status: string, photoProof?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const updateData: any = { status };
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
      if (photoProof) updateData.photoProof = photoProof;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    revalidatePath("/worker/tasks");
    revalidatePath("/worker");
    return { success: true, data: task };
  } catch (error) {
    return { success: false, error: "Failed to update task" };
  }
}

/**
 * Reports a maintenance issue for equipment.
 */
export async function reportMaintenanceIssue(equipmentId: string, issue: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const worker = await prisma.worker.findUnique({
      where: { userId: session.user.id },
    });

    if (!worker) return { success: false, error: "Worker not found" };

    // 1. Create Maintenance Log
    const log = await prisma.maintenanceLog.create({
      data: {
        equipmentId,
        issue,
        workerId: worker.id,
        status: "PENDING",
      },
    });

    // 2. Update Equipment Status
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: { status: "UNDER_MAINTENANCE" },
    });

    revalidatePath("/worker/equipment");
    return { success: true, data: log };
  } catch (error) {
    return { success: false, error: "Failed to report issue" };
  }
}

/**
 * Fetches maintenance logs assigned to or related to the worker's branch/status.
 */
export async function getMaintenanceLogs() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const logs = await prisma.maintenanceLog.findMany({
      include: {
        equipment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: logs };
  } catch (error) {
    return { success: false, error: "Failed to load maintenance logs" };
  }
}
