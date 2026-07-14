import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRedirectPath } from "@/lib/auth";
import type { Role } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Role-Based Dashboard Redirect Hub
// ═══════════════════════════════════════════════════════════════

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role as Role;
  const redirectPath = getRedirectPath(userRole);

  redirect(redirectPath);
}
