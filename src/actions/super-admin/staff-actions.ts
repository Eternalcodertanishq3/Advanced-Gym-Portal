"use server";
// Force IDE re-evaluation
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { ensureSuperAdmin, recordAudit } from "@/lib/action-utils";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function getStaff() {
  try {
    await ensureSuperAdmin();
    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER, Role.WORKER]
        }
      },
      include: {
        branch: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedStaff = staff.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.status,
      branchName: user.branch?.name || "Global / Unassigned",
      branchId: user.branchId,
      lastActive: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never",
    }));

    return { success: true, staff: mappedStaff };
  } catch (error: any) {
    console.error("Failed to fetch staff:", error);
    return { success: false, error: "Failed to load staff members" };
  }
}

export async function inviteStaff(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  branchId?: string;
}) {
  try {
    const superAdmin = await ensureSuperAdmin();
    
    // Check if user exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] }
    });

    if (existing) {
      return { success: false, error: "User with this email or phone already exists" };
    }

    // Generate a secure random temporary password
    const tempPassword = crypto.randomBytes(6).toString('hex'); // 12 chars hex
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword, 
        role: data.role,
        status: "ACTIVE",
        passwordResetRequired: true,
        branchId: data.branchId === "none" ? null : data.branchId,
      } as any
    });

    await recordAudit({
      userId: superAdmin.id,
      action: "CREATE",
      entityType: "USER_STAFF",
      entityId: user.id,
      newValue: user
    });

    // Also create the specific role record
    if (data.role === "TRAINER") {
      await prisma.trainer.create({ data: { userId: user.id } });
    } else if (data.role === "RECEPTIONIST") {
      await prisma.receptionist.create({ data: { userId: user.id } });
    } else if (data.role === "ADMIN") {
      await prisma.admin.create({ data: { userId: user.id } });
    } else if (data.role === "SUPER_ADMIN") {
      await prisma.superAdmin.create({ data: { userId: user.id } });
    } else if (data.role === "WORKER") {
      await prisma.worker.create({ data: { userId: user.id } });
    }

    revalidatePath("/super-admin/admins");
    return { success: true, user, tempPassword };
  } catch (error: any) {
    console.error("Failed to invite staff:", error);
    return { success: false, error: "Failed to invite staff member" };
  }
}

export async function updateStaff(id: string, data: Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  branchId: string;
}>) {
  try {
    const superAdmin = await ensureSuperAdmin();
    const oldUser = await prisma.user.findUnique({ where: { id } });

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        branchId: data.branchId === "none" ? null : data.branchId
      },
    });

    await recordAudit({
      userId: superAdmin.id,
      action: "UPDATE",
      entityType: "USER_STAFF",
      entityId: id,
      oldValue: oldUser,
      newValue: user
    });
    revalidatePath("/super-admin/admins");
    return { success: true, user };
  } catch (error: any) {
    console.error("Failed to update staff:", error);
    return { success: false, error: "Failed to update staff member" };
  }
}

export async function deleteStaff(id: string) {
  try {
    const superAdmin = await ensureSuperAdmin();
    const oldUser = await prisma.user.findUnique({ where: { id } });

    // Soft delete by setting status to INACTIVE
    await prisma.user.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    await recordAudit({
      userId: superAdmin.id,
      action: "DELETE",
      entityType: "USER_STAFF",
      entityId: id,
      oldValue: oldUser,
      newValue: { status: "INACTIVE" }
    });
    revalidatePath("/super-admin/admins");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete staff:", error);
    return { success: false, error: "Failed to delete staff member" };
  }
}
