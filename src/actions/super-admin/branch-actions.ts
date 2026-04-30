"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ensureSuperAdmin, recordAudit } from "@/lib/action-utils";

export async function getBranches() {
  try {
    await ensureSuperAdmin();
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        users: {
          where: { role: "MEMBER", status: "ACTIVE" }
        }
      }
    });

    // Map to include activeMembers count
    const mappedBranches = branches.map(b => ({
      ...b,
      activeMembers: b.users.length,
      manager: b.managerId ? "Assigned" : "Pending"
    }));

    return { success: true, branches: mappedBranches };
  } catch (error: any) {
    console.error("Failed to fetch branches:", error);
    return { success: false, error: "Failed to load branches" };
  }
}

export async function createBranch(data: {
  name: string;
  location: string;
  address: string;
  phone: string;
}) {
  try {
    const user = await ensureSuperAdmin();
    const branch = await prisma.branch.create({
      data: {
        ...data,
        status: "ACTIVE"
      },
    });

    await recordAudit({
      userId: user.id,
      action: "CREATE",
      entityType: "BRANCH",
      entityId: branch.id,
      newValue: branch
    });

    revalidatePath("/super-admin/branches");
    return { success: true, branch };
  } catch (error: any) {
    console.error("Failed to create branch:", error);
    return { success: false, error: "Failed to create branch" };
  }
}

export async function updateBranch(id: string, data: Partial<{
  name: string;
  location: string;
  address: string;
  phone: string;
  status: "ACTIVE" | "MAINTENANCE" | "CLOSED";
}>) {
  try {
    const user = await ensureSuperAdmin();
    const oldBranch = await prisma.branch.findUnique({ where: { id } });
    
    const branch = await prisma.branch.update({
      where: { id },
      data,
    });

    await recordAudit({
      userId: user.id,
      action: "UPDATE",
      entityType: "BRANCH",
      entityId: branch.id,
      oldValue: oldBranch,
      newValue: branch
    });
    revalidatePath("/super-admin/branches");
    return { success: true, branch };
  } catch (error: any) {
    console.error("Failed to update branch:", error);
    return { success: false, error: "Failed to update branch" };
  }
}

export async function deleteBranch(id: string) {
  try {
    const user = await ensureSuperAdmin();
    const oldBranch = await prisma.branch.findUnique({ where: { id } });

    // Soft delete by setting status to CLOSED
    await prisma.branch.update({
      where: { id },
      data: { status: "CLOSED" },
    });

    await recordAudit({
      userId: user.id,
      action: "DELETE",
      entityType: "BRANCH",
      entityId: id,
      oldValue: oldBranch,
      newValue: { status: "CLOSED" }
    });
    revalidatePath("/super-admin/branches");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete branch:", error);
    return { success: false, error: "Failed to delete branch" };
  }
}
