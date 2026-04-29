"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useMemo } from "react";
import { ROLE_HIERARCHY } from "@/lib/constants";
import type { Role } from "@/lib/constants";

export function useAuth() {
  const { data: session, status, update } = useSession();

  const user = session?.user;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const isAdmin = useMemo(() => {
    if (!user?.role) return false;
    return user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  }, [user?.role]);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const hasRole = (requiredRole: Role) => {
    if (!user?.role) return false;
    const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
    return userLevel >= requiredLevel;
  };

  return {
    user,
    session,
    status,
    isAuthenticated,
    isLoading,
    isAdmin,
    isSuperAdmin,
    hasRole,
    signIn,
    signOut,
    update,
  };
}
