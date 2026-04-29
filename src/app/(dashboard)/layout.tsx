import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DashboardContainer } from "@/components/layout/dashboard-container";
import type { Role } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Protected Dashboard Layout
// ═══════════════════════════════════════════════════════════════

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role as Role;

  // Redirect suspended users
  if (session.user.status === "SUSPENDED") {
    redirect("/login?error=AccountSuspended");
  }

  // Redirect pending users
  if (session.user.status === "PENDING") {
    redirect("/login?error=AccountPending");
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <DashboardContainer>
        {/* Topbar */}
        <Topbar user={session.user} />

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </DashboardContainer>
    </div>
  );
}