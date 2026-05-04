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
  Zap
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
    getDashboardStats()
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
      bg: "bg-blue-50 dark:bg-blue-400/10" 
    },
    { 
      label: "Active Branches", 
      value: systemStats?.activeBranches?.toString() || "1", 
      icon: MapPin, 
      color: "text-brand-orange", 
      bg: "bg-brand-orange/5 dark:bg-brand-orange/10" 
    },
    { 
      label: "System Revenue", 
      value: formatCurrency(systemStats?.totalRevenue || 0), 
      icon: Activity, 
      color: "text-emerald-600 dark:text-emerald-400", 
      bg: "bg-emerald-50 dark:bg-emerald-400/10" 
    },
    { 
      label: "System Health", 
      value: "99.9%", 
      icon: Shield, 
      color: "text-purple-600 dark:text-purple-400", 
      bg: "bg-purple-50 dark:bg-purple-400/10" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Banner — Themed Styling */}
      <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden glass-card border-border shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 via-transparent to-transparent dark:from-brand-orange/5" />
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-[0.03]" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12 flex flex-col sm:flex-row items-end sm:items-center gap-6 bg-gradient-to-t from-background via-background/60 to-transparent dark:from-card dark:via-card/40">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-muted border-4 border-background flex items-center justify-center text-4xl font-black text-brand-orange shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-brand-orange/30">
              {(user.firstName?.[0] || "A").toUpperCase()}
              {(user.lastName?.[0] || "").toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-brand-orange text-white shadow-lg shadow-brand-orange/40 ring-4 ring-background">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h1 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight uppercase">
                {user.firstName} <span className="text-brand-orange">{user.lastName}</span>
              </h1>
              <div className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm self-center sm:self-auto",
                getRoleBadgeClass(user.role)
              )}>
                {getRoleLabel(user.role)}
              </div>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-5 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-orange/60" />
                <span className="text-xs font-bold tracking-wide">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-orange/60" />
                <span className="text-xs font-bold tracking-wide uppercase">Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
          <div className="glass-card p-8 shadow-md relative overflow-hidden">
            <h3 className="text-xs font-black text-foreground mb-8 flex items-center gap-3 tracking-[0.2em] uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              System Overview
            </h3>
            
            <div className="space-y-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="p-4 rounded-2xl bg-muted/30 border border-border group hover:border-brand-orange/20 hover:bg-muted/50 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", stat.bg)}>
                          <Icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] mb-0.5">{stat.label}</p>
                          <p className="text-xl font-display font-black text-foreground tracking-tight">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="glass-card p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-orange/5 blur-3xl rounded-full" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <Zap className="w-4 h-4 text-brand-orange" />
              <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.25em]">Admin Protocol</h4>
            </div>
            <p className="text-sm text-muted-foreground font-bold leading-relaxed relative z-10">
              Your profile info is visible across internal administration logs. Keep your contact details updated for system alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
