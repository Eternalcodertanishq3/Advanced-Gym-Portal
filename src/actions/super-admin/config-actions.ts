"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ensureSuperAdmin, recordAudit } from "@/lib/action-utils";

export async function getSystemConfig() {
  try {
    const settings = await prisma.gymSetting.findMany();
    
    // Map settings array to a more useful object
    const config: Record<string, any> = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });

    return { success: true, config };
  } catch (error: any) {
    console.error("Failed to fetch system config:", error);
    return { success: false, error: "Failed to load system settings" };
  }
}

export async function updateSystemConfig(data: Record<string, any>) {
  try {
    const user = await ensureSuperAdmin();
    const updatedBy = user.id;

    // Fetch old values for audit logging
    const oldSettings = await prisma.gymSetting.findMany({
      where: { key: { in: Object.keys(data) } }
    });
    const oldValue: Record<string, any> = {};
    oldSettings.forEach(s => oldValue[s.key] = s.value);

    const operations = Object.entries(data).map(([key, value]) => 
      prisma.gymSetting.upsert({
        where: { key },
        update: { value, updatedBy },
        create: { key, value, updatedBy }
      })
    );

    await Promise.all(operations);

    await recordAudit({
      userId: user.id,
      action: "UPDATE",
      entityType: "SYSTEM_CONFIG",
      entityId: "GLOBAL",
      oldValue,
      newValue: data
    });

    revalidatePath("/super-admin/system-config");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update system config:", error);
    return { success: false, error: "Failed to update system settings" };
  }
}
