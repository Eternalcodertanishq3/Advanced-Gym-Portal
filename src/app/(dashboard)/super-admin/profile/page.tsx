import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/app/(dashboard)/admin/components/profile/profile-form";
import {
  Shield,
  Activity,
  Users,
  LayoutDashboard,
  Calendar,
  MapPin,
  Mail,
  Zap,
} from "lucide-react";
import { getRoleBadgeClass, getRoleLabel } from "@/lib/rbac";
import { cn, formatCurrency } from "@/lib/utils";
import { getDashboardStats } from "@/actions/super-admin/dashboard-actions";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Super Admin Profile (Themed & Production Ready)
// ═══════════════════════════════════════════════════════════════

export default async function SuperAdminProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch full user data and system stats in parallel
  const [user, dashboardData] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { superAdmin: true },
    }),
    getDashboardStats(),
  ]);

  if (!user) redirect("/login");

  const systemStats = dashboardData.success ? dashboardData.stats : null;

  // Real-time stats from the system
  const stats = [
    {
      label: "Total Members",
      value: systemStats?.activeMembersCount.toLocaleString() || "0",
      icon: Users,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-400/10",
    },
    {
      label: "Active Branches",
      value: systemStats?.activeBranches?.toString() || "1",
      icon: MapPin,
      color: "text-brand-orange",
      bg: "bg-brand-orange/5 dark:bg-brand-orange/10",
    },
    {
      label: "System Revenue",
      value: formatCurrency(systemStats?.totalRevenue || 0),
      icon: Activity,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-400/10",
    },
    {
      label: "System Health",
      value: "99.9%",
      icon: Shield,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-400/10",
    },
  ];

  return (
    <div className="space-y-8 duration-700 animate-in fade-in slide-in-from-bottom-4">
      {/* Header / Banner — Themed Styling */}
      <div className="glass-card relative h-48 overflow-hidden rounded-3xl border-border shadow-lg sm:h-64">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 via-transparent to-transparent dark:from-brand-orange/5" />
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-[0.03]" />

        <div className="absolute bottom-0 left-0 flex w-full flex-col items-end gap-6 bg-gradient-to-t from-background via-background/60 to-transparent p-8 dark:from-card dark:via-card/40 sm:flex-row sm:items-center sm:p-12">
          <div className="group relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-background bg-muted text-4xl font-black text-brand-orange shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-brand-orange/30 sm:h-32 sm:w-32">
              {(user.firstName?.[0] || "A").toUpperCase()}
              {(user.lastName?.[0] || "").toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 rounded-xl bg-brand-orange p-2.5 text-white shadow-lg shadow-brand-orange/40 ring-4 ring-background">
              <Shield className="h-5 w-5" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <h1 className="font-display text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
                {user.firstName} <span className="text-brand-orange">{user.lastName}</span>
              </h1>
              <div
                className={cn(
                  "inline-flex items-center self-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm sm:self-auto",
                  getRoleBadgeClass(user.role),
                )}
              >
                {getRoleLabel(user.role)}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-5 text-muted-foreground sm:justify-start">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-orange/60" />
                <span className="text-xs font-bold tracking-wide">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-orange/60" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <ProfileForm
            initialData={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
            }}
          />
        </div>

        {/* Right Column: System Impact Stats */}
        <div className="space-y-6">
          <div className="glass-card relative overflow-hidden p-8 shadow-md">
            <h3 className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-foreground">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" />
              System Overview
            </h3>

            <div className="space-y-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="group rounded-2xl border border-border bg-muted/30 p-4 transition-all duration-300 hover:border-brand-orange/20 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-110",
                          stat.bg,
                        )}
                      >
                        <Icon className={cn("h-5 w-5", stat.color)} />
                      </div>
                      <div>
                        <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="font-display text-xl font-black tracking-tight text-foreground">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card group relative overflow-hidden p-8 shadow-sm">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-orange/5 blur-3xl" />
            <div className="relative z-10 mb-4 flex items-center gap-3">
              <Zap className="h-4 w-4 text-brand-orange" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-orange">
                Admin Protocol
              </h4>
            </div>
            <p className="relative z-10 text-sm font-bold leading-relaxed text-muted-foreground">
              Your profile info is visible across internal administration logs. Keep your contact
              details updated for system alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
