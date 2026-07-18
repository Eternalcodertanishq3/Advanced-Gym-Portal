"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { recordAudit } from "@/lib/action-utils";

/**
 * ═══════════════════════════════════════════════════════════════
 * 🦅 GymFlow SaaS — Admin Impersonation Actions
 * ═══════════════════════════════════════════════════════════════
 */

export async function impersonateUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return { success: false, error: "Unauthorized: Access Denied" };
  }

  // Prevent self-impersonation
  if (session.user.id === targetUserId) {
    return { success: false, error: "Cannot impersonate yourself" };
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!target) {
      return { success: false, error: "Target user not found" };
    }

    const cookieStore = await cookies();
    cookieStore.set("impersonated_user_id", targetUserId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    // Record audit log
    await recordAudit({
      userId: session.user.id,
      action: "UPDATE",
      entityType: "USER",
      entityId: targetUserId,
      newValue: { impersonation: "START" },
    });

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function stopImpersonating() {
  const cookieStore = await cookies();
  const impersonatedId = cookieStore.get("impersonated_user_id")?.value;

  cookieStore.delete("impersonated_user_id");

  if (impersonatedId) {
    const session = await auth();
    if (session?.user) {
      // Record audit log
      await recordAudit({
        userId: session.user.id,
        action: "UPDATE",
        entityType: "USER",
        entityId: impersonatedId,
        newValue: { impersonation: "STOP" },
      });
    }
  }

  return { success: true };
}
