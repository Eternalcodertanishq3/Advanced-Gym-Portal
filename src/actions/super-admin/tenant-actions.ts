"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ensureSuperAdmin } from "@/lib/action-utils";
import { z } from "zod";

const TenantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  subdomain: z.string().min(2, "Subdomain must be at least 2 characters").max(50).regex(/^[a-z0-9-]+$/, "Subdomain can only contain lowercase letters, numbers, and hyphens"),
  currency: z.string().length(3, "Currency code must be exactly 3 characters"),
  locale: z.string().min(2, "Locale is required").max(10),
  saasPlanId: z.string().optional(),
  saasExpiry: z.string().optional().nullable(),
});

export async function getTenants() {
  try {
    await ensureSuperAdmin();

    const tenants = await prisma.tenant.findMany({
      include: {
        saasPlan: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, data: tenants };
  } catch (error: any) {
    console.error("Failed to fetch tenants:", error);
    return { success: false, error: error.message || "Failed to load tenants." };
  }
}

export async function createTenant(rawValues: z.infer<typeof TenantSchema>) {
  try {
    await ensureSuperAdmin();

    const data = TenantSchema.parse(rawValues);

    const existing = await prisma.tenant.findFirst({
      where: { subdomain: data.subdomain }
    });

    if (existing) {
      return { success: false, error: `Subdomain '${data.subdomain}' is already taken.` };
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        subdomain: data.subdomain,
        currency: data.currency,
        locale: data.locale,
        saasPlanId: data.saasPlanId || null,
        saasStatus: "ACTIVE",
        saasExpiry: data.saasExpiry ? new Date(data.saasExpiry) : null,
      }
    });

    revalidatePath("/super-admin/tenants");
    return { success: true, data: tenant };
  } catch (error: any) {
    console.error("Failed to create tenant:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: error.message || "Failed to create tenant." };
  }
}

export async function updateTenant(id: string, rawValues: Partial<z.infer<typeof TenantSchema>>) {
  try {
    await ensureSuperAdmin();

    const data = TenantSchema.partial().parse(rawValues);

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...data,
        saasExpiry: data.saasExpiry ? new Date(data.saasExpiry) : undefined,
      }
    });

    revalidatePath("/super-admin/tenants");
    return { success: true, data: tenant };
  } catch (error: any) {
    console.error("Failed to update tenant:", error);
    return { success: false, error: error.message || "Failed to update tenant." };
  }
}

export async function suspendTenant(id: string) {
  try {
    await ensureSuperAdmin();

    const tenant = await prisma.tenant.update({
      where: { id },
      data: { saasStatus: "SUSPENDED" }
    });

    revalidatePath("/super-admin/tenants");
    return { success: true, data: tenant };
  } catch (error: any) {
    console.error("Failed to suspend tenant:", error);
    return { success: false, error: error.message || "Failed to suspend tenant." };
  }
}

export async function activateTenant(id: string) {
  try {
    await ensureSuperAdmin();

    const tenant = await prisma.tenant.update({
      where: { id },
      data: { saasStatus: "ACTIVE" }
    });

    revalidatePath("/super-admin/tenants");
    return { success: true, data: tenant };
  } catch (error: any) {
    console.error("Failed to activate tenant:", error);
    return { success: false, error: error.message || "Failed to activate tenant." };
  }
}
