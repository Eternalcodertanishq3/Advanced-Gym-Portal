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
      const pathname = nextUrl.pathname;

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
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as any;
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
