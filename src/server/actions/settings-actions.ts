"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGymSettings() {
  try {
    const settings = await prisma.gymSetting.findMany();
    // transform into key-value map
    const settingsMap = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    return { success: true, data: settingsMap };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateGymSetting(key: string, value: any) {
  try {
    const setting = await prisma.gymSetting.upsert({
      where: { key },
      update: { value, updatedBy: "ADMIN" },
      create: { key, value, updatedBy: "ADMIN" }
    });
    revalidatePath("/admin/settings");
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

