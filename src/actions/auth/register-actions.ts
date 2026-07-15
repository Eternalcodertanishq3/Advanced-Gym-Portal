"use server";

import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { SECURITY } from "@/lib/constants";

const RegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export async function registerUser(rawValues: z.infer<typeof RegisterSchema>) {
  try {
    // 1. Validate inputs
    const data = RegisterSchema.parse(rawValues);

    // 2. Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        return { success: false, error: "A user with this email already exists." };
      }
      return { success: false, error: "A user with this phone number already exists." };
    }

    // 3. Hash password
    const hashedPassword = await bcryptjs.hash(data.password, SECURITY.BCRYPT_ROUNDS);

    // 4. Create User and Member within a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: "MEMBER",
          status: "ACTIVE", // Start as active member, pending plan payment
        },
      });

      await tx.member.create({
        data: {
          userId: newUser.id,
          status: "PENDING", // Subscription is pending
        },
      });

      return newUser;
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error: unknown) {
    console.error("User registration failed:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error:
        (error instanceof Error ? error.message : String(error)) ||
        "Failed to create user account.",
    };
  }
}
