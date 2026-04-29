import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { ROLES, ROLE_HIERARCHY } from "./constants";
import type { Role } from "./constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — NextAuth.js Configuration
// ═══════════════════════════════════════════════════════════════

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      role: Role;
      status: string;
      avatar?: string | null;
      phone?: string | null;
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    status: string;
    phone?: string | null;
    avatar?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    status: string;
    phone?: string | null;
    avatar?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: {
            member: true,
            trainer: true,
            receptionist: true,
            admin: true,
            superAdmin: true,
            worker: true,
          },
        });

        if (!user) {
          throw new Error("No account found with this email");
        }

        if (user.status === "SUSPENDED") {
          throw new Error("Your account has been suspended. Please contact admin.");
        }

        if (user.status === "PENDING") {
          throw new Error("Your account is pending approval. Please wait.");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password. Please try again.");
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role as Role,
          status: user.status,
          phone: user.phone,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.status = user.status;
        token.phone = user.phone;
        token.avatar = user.avatar;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session.name;
        token.avatar = session.avatar;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? `${token.firstName} ${token.lastName}`;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.phone = token.phone;
        session.user.avatar = token.avatar;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to role-based dashboard after login
      if (url.startsWith("/login") || url === baseUrl) {
        return `${baseUrl}/`;
      }
      return url;
    },
  },
  events: {
    async signIn({ user }) {
      // Log the sign-in for audit
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN",
          entityType: "User",
          entityId: user.id,
          newValue: { email: user.email, timestamp: new Date().toISOString() },
        },
      });
    },

    async signOut({ token }) {
      if (token?.id) {
        await prisma.auditLog.create({
          data: {
            userId: token.id,
            action: "LOGOUT",
            entityType: "User",
            entityId: token.id,
            newValue: { timestamp: new Date().toISOString() },
          },
        });
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
};

/**
 * Helper to get the authenticated user from a request
 */
export async function getAuthUser() {
  const { getServerSession } = await import("next-auth");
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

/**
 * Check if current user has required role
 */
export function hasRequiredRole(userRole: Role, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
}

/**
 * Role-based redirect path
 */
export function getRedirectPath(role: Role): string {
  const paths: Record<Role, string> = {
    SUPER_ADMIN: "/super-admin",
    ADMIN: "/admin",
    RECEPTIONIST: "/receptionist",
    TRAINER: "/trainer",
    MEMBER: "/member",
    WORKER: "/worker",
  };
  return paths[role] ?? "/member";
}