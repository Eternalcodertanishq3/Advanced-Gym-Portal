import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DashboardContainer } from "@/components/layout/dashboard-container";
import type { Role } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Protected Dashboard Layout
// ═══════════════════════════════════════════════════════════════

import { getMemberFeatures } from "@/lib/membership";

import { getTenantDetails } from "@/lib/tenant";

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

  const tenant = getTenantDetails();
  const allowedFeatures = await getMemberFeatures();
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background mesh gradient to support liquid glass refraction */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 dark:opacity-30 pointer-events-none" />

      {/* Sidebar */}
      <Sidebar 
        user={session.user as any} 
        allowedFeatures={allowedFeatures} 
        tenantName={tenant.name}
      />

      {/* Topbar — Fixed at the top, outside main flow */}
      <Topbar user={session.user} />

      {/* Main Content Area */}
      <DashboardContainer>
        <main className="pt-24 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </DashboardContainer>
    </div>
  );
}