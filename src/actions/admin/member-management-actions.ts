"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getBranchContext } from "@/lib/action-utils";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { SECURITY } from "@/lib/constants";

export async function getMembers(page = 1, limit = 10, search = "", filterBranchId?: string) {
  try {
    const skip = (page - 1) * limit;

    const { branchId: contextBranchId, role } = await getBranchContext();

    // For SUPER_ADMIN, they can filter by any branch. For others, restrict to context branch.
    const effectiveBranchId =
      role === "SUPER_ADMIN" && filterBranchId && filterBranchId !== "ALL"
        ? filterBranchId
        : contextBranchId;

    let where: any = {};

    if (effectiveBranchId) {
      where.user = {
        branchId: effectiveBranchId,
      };
    }

    if (search) {
      const searchTerms = search.trim().split(/\s+/);

      where.user = {
        ...where.user,
        AND: searchTerms.map((term) => ({
          OR: [
            { firstName: { contains: term, mode: "insensitive" as const } },
            { lastName: { contains: term, mode: "insensitive" as const } },
            { email: { contains: term, mode: "insensitive" as const } },
            { phone: { contains: term, mode: "insensitive" as const } },
          ],
        })),
      };
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            include: {
              branch: true,
            },
          },
          subscription: {
            include: {
              plan: true,
            },
          },
        },
        orderBy: { joinDate: "desc" },
      }),
      prisma.member.count({ where }),
    ]);

    return {
      success: true,
      data: members,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("Error fetching members:", error);
    return { success: false, error: error.message || "Failed to fetch members" };
  }
}

export async function getMemberById(id: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "TRAINER" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: true,
        subscription: {
          include: {
            plan: true,
          },
        },
        trainer: {
          include: {
            user: true,
          },
        },
        attendance: {
          take: 5,
          orderBy: { date: "desc" },
        },
        payments: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    return { success: true, data: member };
  } catch (error: any) {
    console.error("Error fetching member:", error);
    return { success: false, error: error.message || "Failed to fetch member details" };
  }
}

export async function createMember(formData: any) {
  try {
    const { branchId: contextBranchId } = await getBranchContext();
    const branchId = formData.branchId || contextBranchId;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: formData.email }, { phone: formData.phone }],
      },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email or phone already exists." };
    }

    // Hash default password
    const hashedPassword = await bcrypt.hash(
      SECURITY.DEFAULT_TEMP_PASSWORD(),
      SECURITY.BCRYPT_ROUNDS,
    );

    // Create User and Member in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          password: hashedPassword,
          passwordResetRequired: true,
          role: "MEMBER",
          branchId: branchId,
          status: "ACTIVE",
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          status: "ACTIVE",
          joinDate: new Date(),
        },
      });

      // Record Activity
      const session = await auth();
      if (session?.user?.id) {
        await tx.auditLog.create({
          data: {
            userId: session.user.id,
            action: "CREATE",
            entityType: "MEMBER",
            entityId: member.id,
            newValue: { email: user.email, name: `${user.firstName} ${user.lastName}` },
          },
        });
      }

      return { user, member };
    });

    revalidatePath("/admin/members");
    revalidatePath("/super-admin/audit-logs");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error creating member:", error);
    return { success: false, error: error.message || "Failed to create member" };
  }
}

export async function updateMember(id: string, formData: any) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const member = await tx.member.update({
        where: { id },
        data: {
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
        },
      });

      await tx.user.update({
        where: { id: member.userId },
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
      });

      return member;
    });

    revalidatePath("/admin/members");
    revalidatePath(`/admin/members/${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating member:", error);
    return { success: false, error: error.message || "Failed to update member" };
  }
}
