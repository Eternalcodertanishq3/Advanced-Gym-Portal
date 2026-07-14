import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PasswordForm } from "@/app/(dashboard)/admin/components/settings/password-form";
import {
  Settings,
  ShieldCheck,
  Bell,
  Key,
  History,
  Lock,
  Smartphone,
  Eye,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Super Admin Settings (Themed & Production Ready)
// ═══════════════════════════════════════════════════════════════

export default async function SuperAdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-8 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-foreground">
            Account <span className="text-brand-orange">Settings</span>
          </h1>
          <p className="mt-1 text-sm font-black uppercase tracking-widest text-muted-foreground">
            Manage your security and account preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="h-auto flex-wrap rounded-2xl border border-border bg-card p-1.5 shadow-md">
          <TabsTrigger
            value="security"
            className="gap-2 rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-brand-orange data-[state=active]:text-white"
          >
            <ShieldCheck className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-2 rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-brand-orange data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            className="gap-2 rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-brand-orange data-[state=active]:text-white"
          >
            <History className="h-4 w-4" />
            Active Sessions
          </TabsTrigger>
        </TabsList>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <TabsContent value="security" className="m-0 focus-visible:outline-none">
              <PasswordForm />
            </TabsContent>

            <TabsContent value="notifications" className="m-0 focus-visible:outline-none">
              <div className="glass-card relative overflow-hidden p-12 text-center shadow-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,93,38,0.03),transparent)]" />
                <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-orange/20 bg-brand-orange/10">
                  <Bell className="h-10 w-10 text-brand-orange" />
                </div>
                <h3 className="relative z-10 mb-3 text-xl font-black uppercase tracking-tight text-foreground">
                  Notification Center
                </h3>
                <p className="relative z-10 mx-auto max-w-sm text-sm font-bold leading-relaxed text-muted-foreground">
                  System-wide notification protocols are managed at the branch level. Personalized
                  admin alerts will be enabled in the next deployment cycle.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="m-0 focus-visible:outline-none">
              <div className="glass-card overflow-hidden shadow-lg">
                <div className="border-b border-border bg-muted/30 p-8">
                  <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-foreground">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" />
                    Current Device
                  </h3>
                </div>
                <div className="p-8">
                  <div className="group flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-6 transition-all duration-300 hover:border-brand-orange/20">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-orange/20 bg-brand-orange/10 transition-transform group-hover:scale-110">
                        <Smartphone className="h-6 w-6 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-base font-black text-foreground">Windows PC — Chrome</p>
                        <p className="mt-0.5 text-xs font-black uppercase tracking-widest text-brand-orange">
                          Active Now
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full border border-border bg-muted px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-orange shadow-inner">
                      Current
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          {/* Right Sidebar: Security Tips */}
          <div className="space-y-6">
            <div className="glass-card relative overflow-hidden p-8 shadow-lg">
              <div className="absolute right-0 top-0 p-4 opacity-[0.03]">
                <Lock className="h-24 w-24" />
              </div>
              <h3 className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-foreground">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" />
                Security Checklist
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Strong Password", status: "Active", icon: Key },
                  { label: "2FA Authentication", status: "Recommended", icon: Smartphone },
                  { label: "Email Verified", status: "Verified", icon: ShieldCheck },
                  { label: "Last Login", status: "2 mins ago", icon: Eye },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="group flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4 transition-all duration-300 hover:border-brand-orange/20"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-brand-orange" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                          item.status === "Recommended"
                            ? "bg-brand-orange/10 text-brand-orange"
                            : "bg-emerald-500/10 text-emerald-500",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card group relative overflow-hidden p-8 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent" />
              <div className="relative z-10 mb-6 flex items-center gap-3">
                <Zap className="h-4 w-4 text-brand-orange" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-orange">
                  Security Protocol
                </h4>
              </div>
              <div className="relative z-10 mb-6 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full shadow-inner",
                      i <= 4 ? "bg-brand-orange" : "bg-muted",
                    )}
                  />
                ))}
              </div>
              <p className="relative z-10 text-xs font-bold leading-relaxed text-muted-foreground">
                Your account security is <span className="text-brand-orange">High</span>.
                Multi-factor authentication is recommended for all root-level administrative
                accounts.
              </p>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
