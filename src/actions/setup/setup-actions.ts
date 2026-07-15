"use server";

import prisma from "@/lib/prisma";
import { SECURITY } from "@/lib/constants";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

/**
 * Checks if the system requires initial setup (no super admins exist).
 */
export async function isSetupRequired() {
  try {
    const superAdminCount = await prisma.superAdmin.count();
    return superAdminCount === 0;
  } catch (error) {
    console.error("Setup check failed:", error);
    return false; // Fail safe to avoid infinite redirects if DB is down
  }
}

/**
 * Creates the very first Super Admin account.
 * This can only be called if no Super Admins exist.
 */
export async function createInitialSuperAdmin(data: any) {
  try {
    const exists = await prisma.superAdmin.count();
    if (exists > 0) {
      throw new Error("System already has a Super Admin.");
    }

    const hashedPassword = await bcrypt.hash(data.password, SECURITY.BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        passwordResetRequired: false,
        superAdmin: {
          create: {},
        },
      } as any,
    });

    revalidatePath("/");
    return { success: true, user };
  } catch (error: unknown) {
    console.error("Setup failed:", error);
    return {
      success: false,
      error:
        (error instanceof Error ? error.message : String(error)) ||
        "Failed to create master account",
    };
  }
}
