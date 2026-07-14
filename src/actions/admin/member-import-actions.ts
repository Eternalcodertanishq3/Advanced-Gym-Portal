"use server";

import { prisma as db } from "@/lib/prisma";
import { Role, UserStatus, MemberStatus, Gender, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { SECURITY } from "@/lib/constants";

export type ImportMemberData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

const BATCH_SIZE = 100; // Optimal batch size for Prisma transactions

export async function bulkImportMembers(data: ImportMemberData[], branchId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    // 1. Pre-hash default password to save CPU cycles during the loop
    const defaultPassword = await bcrypt.hash(
      SECURITY.DEFAULT_TEMP_PASSWORD(),
      SECURITY.BCRYPT_ROUNDS,
    );

    const results = {
      total: data.length,
      success: 0,
      failed: 0,
      duplicates: 0,
      errors: [] as string[],
    };

    // 2. Process in batches to prevent timeouts and memory overflow
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      await db.$transaction(async (tx) => {
        for (const item of batch) {
          try {
            // 3. Clean and Validate Data
            const email = item.email?.trim().toLowerCase();
            const firstName = item.firstName?.trim();
            const lastName = item.lastName?.trim();
            const phone = item.phone?.trim();

            if (!email || !firstName || !lastName) {
              results.failed++;
              results.errors.push(
                `Row ${i + batch.indexOf(item) + 1}: Missing mandatory fields (Email, FirstName, or LastName)`,
              );
              continue;
            }

            // Gender Normalization
            let gender: Gender | null = null;
            if (item.gender) {
              const cleanGender = item.gender.toString().trim().toUpperCase();
              if (cleanGender === "MALE" || cleanGender === "M") gender = Gender.MALE;
              else if (cleanGender === "FEMALE" || cleanGender === "F") gender = Gender.FEMALE;
              else if (cleanGender === "OTHER" || cleanGender === "O") gender = Gender.OTHER;
              else gender = Gender.OTHER; // Default to OTHER for unrecognized values
            }

            // Safe Date Parsing
            let dob = null;
            if (item.dateOfBirth) {
              const parsedDate = new Date(item.dateOfBirth);
              if (!isNaN(parsedDate.getTime())) {
                dob = parsedDate;
              }
            }

            // Check for existing user
            const existingUser = await tx.user.findFirst({
              where: {
                OR: [{ email }, ...(phone ? [{ phone }] : [])],
              },
            });

            if (existingUser) {
              results.duplicates++;
              continue;
            }

            // Create User and Member in one transaction
            await tx.user.create({
              data: {
                email,
                phone,
                password: defaultPassword,
                firstName,
                lastName,
                role: Role.MEMBER,
                status: UserStatus.ACTIVE,
                branchId: branchId,
                passwordResetRequired: true,
                member: {
                  create: {
                    gender: gender,
                    dateOfBirth: dob,
                    bloodGroup: item.bloodGroup?.trim(),
                    address: item.address?.trim(),
                    city: item.city?.trim(),
                    state: item.state?.trim(),
                    pincode: item.pincode?.trim(),
                    status: MemberStatus.ACTIVE,
                    joinDate: new Date(),
                  },
                },
              },
            });

            results.success++;
          } catch (err: any) {
            results.failed++;
            results.errors.push(`Row ${i + batch.indexOf(item) + 1}: ${err.message}`);
          }
        }
      });
    }

    // 4. Create single audit log for the entire operation (Smarter & Light)
    try {
      const session = await auth();
      if (session?.user?.id) {
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: "IMPORT",
            entityType: "MEMBER_BATCH",
            newValue: {
              total: results.total,
              success: results.success,
              failed: results.failed,
              duplicates: results.duplicates,
              branchId: branchId,
            },
          },
        });
      }
    } catch (logErr) {
      console.error("Failed to create audit log for import:", logErr);
    }

    return { success: true, results };
  } catch (error: any) {
    console.error("Bulk import failed:", error);
    return { success: false, error: error.message };
  }
}
