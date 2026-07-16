"use server";

import prisma, { resolveTenantId } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAudit } from "@/lib/action-utils";
import { ensurePermission } from "@/lib/permissions";
import { auth } from "@/auth";

export async function getSystemConfig() {
  try {
    await ensurePermission("manage:system");
    const settings = await prisma.gymSetting.findMany();

    // Map settings array to a more useful object
    const config: Record<string, any> = {};
    settings.forEach((s) => {
      config[s.key] = s.value;
    });

    return { success: true, config };
  } catch (error: unknown) {
    console.error("Failed to fetch system config:", error);
    return { success: false, error: "Failed to load system settings" };
  }
}

export async function updateSystemConfig(data: Record<string, any>) {
  try {
    const user = await ensurePermission("manage:system");
    const updatedBy = user.id;

    // Fetch old values for audit logging
    const oldSettings = await prisma.gymSetting.findMany({
      where: { key: { in: Object.keys(data) } },
    });
    const oldValue: Record<string, any> = {};
    oldSettings.forEach((s) => (oldValue[s.key] = s.value));

    const tenantId = resolveTenantId() || null;
    const operations = Object.entries(data).map(([key, value]) =>
      prisma.gymSetting.upsert({
        where: { key_tenantId: { key, tenantId: tenantId || "" } },
        update: { value, updatedBy },
        create: { key, value, tenantId, updatedBy },
      }),
    );

    await Promise.all(operations);

    await recordAudit({
      userId: user.id,
      action: "UPDATE",
      entityType: "SYSTEM_CONFIG",
      entityId: "GLOBAL",
      oldValue,
      newValue: data,
    });

    revalidatePath("/super-admin/system-config");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to update system config:", error);
    return { success: false, error: "Failed to update system settings" };
  }
}
