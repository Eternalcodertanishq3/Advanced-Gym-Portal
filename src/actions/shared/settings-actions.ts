"use server";

import { auth } from "@/auth";

import { prisma, resolveTenantId } from "@/lib/prisma";
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
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const tenantId = resolveTenantId() || null;
    const setting = await prisma.gymSetting.upsert({
      where: { key_tenantId: { key, tenantId: tenantId || "" } },
      update: { value, updatedBy: "ADMIN" },
      create: { key, value, tenantId, updatedBy: "ADMIN" },
    });
    revalidatePath("/admin/settings");
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
