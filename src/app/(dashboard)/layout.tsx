import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DashboardContainer } from "@/components/layout/dashboard-container";
import type { Role } from "@/lib/constants";
import { ImpersonationBanner } from "@/components/layout/impersonation-banner";
import { ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Protected Dashboard Layout
// ═══════════════════════════════════════════════════════════════

import { getMemberFeatures } from "@/lib/membership";

import { getTenantDetails } from "@/lib/tenant";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  const tenant = await getTenantDetails();
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

  // Fetch system settings for maintenance/emergency lock checks
  const settings = await prisma.gymSetting.findMany({
    where: { tenantId: tenant.id || null },
  });
  const settingsMap = settings.reduce((acc: any, setting: any) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});

  const isMaintenance = settingsMap["maintenance_mode"] === true;
  const isEmergencyLock = settingsMap["emergency_lock"] === true;
  const isAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";

  // Redirect to maintenance if active (except admin)
  if (isMaintenance && !isAdmin) {
    redirect("/maintenance");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Impersonation Banner */}
      {session.user.impersonatorId && <ImpersonationBanner />}

      {/* Emergency Lock Alert Banner */}
      {isEmergencyLock && (
        <div className="relative z-50 flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-center text-sm font-semibold tracking-wide text-white">
          <ShieldAlert className="h-4 w-4 animate-pulse" />
          SYSTEM LOCK ACTIVE: Write operations are disabled for all members and staff.
        </div>
      )}

      {/* Ambient background mesh gradient to support liquid glass refraction */}
      <div className="bg-mesh-gradient pointer-events-none absolute inset-0 opacity-60 dark:opacity-30" />

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
        <main className="min-h-screen pt-24">
          <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </DashboardContainer>
    </div>
  );
}
