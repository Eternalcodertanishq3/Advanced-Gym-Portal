"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getStaff() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER, Role.WORKER]
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
}) {
  try {
    // Check if user exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] }
    });

    if (existing) {
      return { success: false, error: "User with this email or phone already exists" };
    }

    // Default password for invited staff (in real app, send invite email to set password)
    const defaultPassword = "EagleGymPassword123!"; // Note: Use bcrypt to hash in a real setup before saving

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: defaultPassword, // Placeholder
        role: data.role,
        status: "ACTIVE",
      }
    });

    // Also create the specific role record
    if (data.role === "TRAINER") {
      await prisma.trainer.create({ data: { userId: user.id } });
    } else if (data.role === "RECEPTIONIST") {
      await prisma.receptionist.create({ data: { userId: user.id } });
    } else if (data.role === "ADMIN") {
      await prisma.admin.create({ data: { userId: user.id } });
    } else if (data.role === "WORKER") {
      await prisma.worker.create({ data: { userId: user.id } });
    }

    revalidatePath("/super-admin/admins");
    return { success: true, user };
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
}>) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
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
    // Soft delete by setting status to INACTIVE
    await prisma.user.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
    revalidatePath("/super-admin/admins");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete staff:", error);
    return { success: false, error: "Failed to delete staff member" };
  }
}
