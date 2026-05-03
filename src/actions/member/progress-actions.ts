"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * Adds a new progress photo.
 */
export async function addProgressPhoto(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) {
      return { success: false, error: "Member profile not found" };
    }

    const file = formData.get("file") as File;
    const photoType = formData.get("photoType") as string || "FRONT";
    const weight = formData.get("weight") as string;

    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    // Ensure it's an image
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Create a safe filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `progress_${member.id}_${Date.now()}.${fileExtension}`;
    const uploadPath = join(process.cwd(), "public", "uploads", "progress", fileName);

    await writeFile(uploadPath, buffer);
    const photoUrl = `/uploads/progress/${fileName}`;

    const progressPhoto = await prisma.progressPhoto.create({
      data: {
        memberId: member.id,
        photoUrl,
        photoType,
        weight: weight ? parseFloat(weight) : null
      }
    });

    revalidatePath("/member/progress");
    return { success: true, data: progressPhoto };
  } catch (error) {
    console.error("Error uploading progress photo:", error);
    return { success: false, error: "Failed to upload photo" };
  }
}

/**
 * Fetches all progress data for the authenticated member.
 */
export async function getMemberProgress() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) {
      return { success: false, error: "Member profile not found" };
    }

    const [measurements, photos, goals] = await Promise.all([
      prisma.progress.findMany({
        where: { memberId: member.id },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.progressPhoto.findMany({
        where: { memberId: member.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.goal.findMany({
        where: { memberId: member.id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { 
      success: true, 
      data: {
        measurements,
        photos,
        goals
      }
    };
  } catch (error) {
    console.error("Error fetching progress:", error);
    return { success: false, error: "Failed to load progress data" };
  }
}

/**
 * Adds a new measurement entry.
 */
export async function addMeasurement(data: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id }
    });

    if (!member) {
      return { success: false, error: "Member profile not found" };
    }

    const progress = await prisma.progress.create({
      data: {
        memberId: member.id,
        ...data
      }
    });

    revalidatePath("/member/progress");
    return { success: true, data: progress };
  } catch (error) {
    console.error("Error adding measurement:", error);
    return { success: false, error: "Failed to save measurement" };
  }
}

/**
 * Updates progress on a goal.
 */
export async function updateGoalProgress(goalId: string, newValue: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal) return { success: false, error: "Goal not found" };

    const isAchieved = newValue >= Number(goal.targetValue);

    await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentValue: newValue,
        isAchieved,
        achievedAt: isAchieved ? new Date() : null
      }
    });

    revalidatePath("/member/progress");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update goal" };
  }
}
