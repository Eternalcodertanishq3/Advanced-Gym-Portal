import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

// This is the config used by the edge-compatible middleware
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const mustReset = (auth?.user as any)?.passwordResetRequired;
      const pathname = nextUrl.pathname;
      const isResetPage = pathname === "/reset-password";

      // If user must reset password, force them to the reset page
      if (isLoggedIn && mustReset && !isResetPage) {
        return Response.redirect(new URL("/reset-password", nextUrl));
      }

      // If already reset or not needed, don't let them stay on reset page
      if (isLoggedIn && !mustReset && isResetPage) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // Map roles to their dashboards
      const dashboardMap: Record<string, string> = {
        SUPER_ADMIN: "/super-admin",
        ADMIN: "/admin",
        RECEPTIONIST: "/receptionist",
        TRAINER: "/trainer",
        MEMBER: "/member",
        WORKER: "/worker",
      };

      const userDashboard = role ? dashboardMap[role] || "/dashboard" : "/dashboard";

      // Protect admin routes
      if (pathname.startsWith("/super-admin")) {
        if (!isLoggedIn) return false;
        if (role !== "SUPER_ADMIN") return Response.redirect(new URL(userDashboard, nextUrl));
        return true;
      }

      // If logged in and on root or login, redirect to dashboard immediately
      if (isLoggedIn && (pathname === "/" || pathname === "/login")) {
        return Response.redirect(new URL(userDashboard, nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.passwordResetRequired = (user as any).passwordResetRequired;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as any;
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        (session.user as any).passwordResetRequired = token.passwordResetRequired as boolean;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
