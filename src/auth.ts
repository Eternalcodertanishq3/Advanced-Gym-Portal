import NextAuth from "next-auth";
// Force IDE re-evaluation
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import Resend from "next-auth/providers/resend";
import Passkey from "next-auth/providers/passkey";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as any;
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        (session.user as any).branchId = token.branchId as string;
        (session.user as any).passwordResetRequired = token.passwordResetRequired as boolean;

        // Impersonation check (runs on Node server, safe from edge constraints)
        const isOriginalAdmin = token.role === "SUPER_ADMIN" || token.role === "ADMIN";
        if (isOriginalAdmin) {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            const impersonatedId = cookieStore.get("impersonated_user_id")?.value;

            if (impersonatedId) {
              const targetUser = await prisma.user.findUnique({
                where: { id: impersonatedId },
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  branchId: true,
                  status: true,
                },
              });
              if (targetUser) {
                session.user.id = targetUser.id;
                session.user.email = targetUser.email;
                session.user.name = `${targetUser.firstName} ${targetUser.lastName}`;
                session.user.firstName = targetUser.firstName;
                session.user.lastName = targetUser.lastName;
                session.user.role = targetUser.role as any;
                session.user.status = targetUser.status;
                (session.user as any).branchId = targetUser.branchId;
                session.user.impersonatorId = token.id as string;
              }
            }
          } catch (err) {
            console.error("Failed to load impersonation profile:", err);
          }
        }
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorVerified: { label: "TwoFactorVerified", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcryptjs.compare(
          credentials.password as string,
          user.password,
        );

        if (passwordsMatch) {
          // If 2FA is active on the account, check verification status
          if (user.twoFactorEnabled && credentials.twoFactorVerified !== "true") {
            throw new Error("2FA_REQUIRED");
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            branchId: user.branchId,
            passwordResetRequired: (user as any).passwordResetRequired,
          };
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "GymFlow SaaS <noreply@gymflow.io>",
    }),
    Passkey,
  ],
});
