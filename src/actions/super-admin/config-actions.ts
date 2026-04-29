"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    const updatedBy = "admin-placeholder"; // Get from session in production

    const operations = Object.entries(data).map(([key, value]) => 
      prisma.gymSetting.upsert({
        where: { key },
        update: { value, updatedBy },
        create: { key, value, updatedBy }
      })
    );

    await Promise.all(operations);

    revalidatePath("/super-admin/system-config");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update system config:", error);
    return { success: false, error: "Failed to update system settings" };
  }
}
