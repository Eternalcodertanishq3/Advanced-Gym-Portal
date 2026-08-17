"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { serializeData } from "@/lib/utils";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — GDPR / DPDP Compliance & Data Lifecycle Engine
// Right-to-be-Forgotten PII anonymization & 1-click Data Portability Export
// ═══════════════════════════════════════════════════════════════

/**
 * 1-Click Data Portability Export: Exports all personal records for a member
 */
export async function exportMemberData(memberId: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN" &&
      session.user.id !== memberId)
  ) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
        subscription: {
          include: { plan: true },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
        attendance: {
          take: 100,
          orderBy: { date: "desc" },
        },
        classBookings: {
          include: { schedule: { include: { class: true } } },
        },
        dietPlans: true,
        workoutPlans: true,
      },
    });

    if (!member) return { success: false, error: "Member profile not found" };

    return {
      success: true,
      data: serializeData({
        exportedAt: new Date().toISOString(),
        complianceStandard: "GDPR / DPDP Article 20 (Right to Data Portability)",
        profile: member,
      }),
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export member data",
    };
  }
}

/**
 * Right-to-be-Forgotten: Irreversibly scrubs PII while preserving financial totals for accounting
 */
export async function anonymizeMemberData(memberId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const member = await tx.member.findUnique({
        where: { id: memberId },
        include: { user: true },
      });

      if (!member) throw new Error("Member not found");

      // Generate irreversible pseudorandom hash token
      const anonymizedToken = crypto.randomBytes(8).toString("hex");
      const anonymizedEmail = `deleted.user.${anonymizedToken}@anonymized.local`;
      const anonymizedPhone = `+00${Date.now().toString().slice(-8)}`;

      // 1. Scrub User PII
      await tx.user.update({
        where: { id: member.userId },
        data: {
          firstName: "Anonymized",
          lastName: "User",
          email: anonymizedEmail,
          phone: anonymizedPhone,
          avatar: null,
          status: "INACTIVE",
          deletedAt: new Date(),
        },
      });

      // 2. Scrub Member PII & notes
      const updatedMember = await tx.member.update({
        where: { id: memberId },
        data: {
          address: null,
          emergencyContact: null,
          dateOfBirth: null,
          notes: null,
          city: null,
          state: null,
          pincode: null,
          status: "INACTIVE",
          deletedAt: new Date(),
        },
      });

      // 3. Record Audit Log for regulatory compliance
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE",
          entityType: "MEMBER_GDPR_ERASURE",
          entityId: memberId,
          newValue: { status: "ANONYMIZED", scrubbedAt: new Date().toISOString() },
        },
      });

      return updatedMember;
    });

    revalidatePath("/admin/members");
    revalidatePath("/super-admin/audit-logs");

    return {
      success: true,
      message: "Member personal data has been irreversibly scrubbed and anonymized.",
      data: serializeData(result),
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to anonymize member data",
    };
  }
}

/**
 * 1-Click Tenant Data Export for Gym Owners
 */
export async function exportTenantData(tenantId: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "SUPER_ADMIN" && (session.user as any).tenantId !== tenantId)
  ) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        branches: true,
        plans: true,
        _count: {
          select: {
            users: true,
            payments: true,
            attendance: true,
          },
        },
      },
    });

    if (!tenant) return { success: false, error: "Tenant not found" };

    return {
      success: true,
      data: serializeData({
        exportedAt: new Date().toISOString(),
        tenant,
      }),
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export tenant data",
    };
  }
}
