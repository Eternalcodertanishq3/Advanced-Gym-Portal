import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PasswordForm } from "@/components/dashboard/settings/password-form";
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  Key, 
  History,
  Lock,
  Smartphone,
  Eye,
  Zap
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground tracking-tight uppercase">
            Account <span className="text-brand-orange">Settings</span>
          </h1>
          <p className="text-sm font-black text-muted-foreground mt-1 uppercase tracking-widest">Manage your security and account preferences</p>
        </div>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="bg-card border border-border p-1.5 h-auto rounded-2xl flex-wrap shadow-md">
          <TabsTrigger value="security" className="gap-2 px-8 py-3 rounded-xl data-[state=active]:bg-brand-orange data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all">
            <ShieldCheck className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 px-8 py-3 rounded-xl data-[state=active]:bg-brand-orange data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2 px-8 py-3 rounded-xl data-[state=active]:bg-brand-orange data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all">
            <History className="w-4 h-4" />
            Active Sessions
          </TabsTrigger>
        </TabsList>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TabsContent value="security" className="m-0 focus-visible:outline-none">
              <PasswordForm />
            </TabsContent>

            <TabsContent value="notifications" className="m-0 focus-visible:outline-none">
              <div className="glass-card p-12 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,93,38,0.03),transparent)]" />
                <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto mb-6 relative z-10">
                  <Bell className="w-10 h-10 text-brand-orange" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-tight relative z-10">Notification Center</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto font-bold relative z-10 leading-relaxed">
                  System-wide notification protocols are managed at the branch level. Personalized admin alerts will be enabled in the next deployment cycle.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="m-0 focus-visible:outline-none">
              <div className="glass-card overflow-hidden shadow-lg">
                <div className="p-8 border-b border-border bg-muted/30">
                  <h3 className="text-xs font-black text-foreground flex items-center gap-3 uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                    Current Device
                  </h3>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/20 border border-border group hover:border-brand-orange/20 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center transition-transform group-hover:scale-110">
                        <Smartphone className="w-6 h-6 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-base font-black text-foreground">Windows PC — Chrome</p>
                        <p className="text-xs text-brand-orange font-black uppercase tracking-widest mt-0.5">Active Now</p>
                      </div>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-muted border border-border text-[10px] font-black text-brand-orange uppercase tracking-widest shadow-inner">
                      Current
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          {/* Right Sidebar: Security Tips */}
          <div className="space-y-6">
            <div className="glass-card p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Lock className="w-24 h-24" />
              </div>
              <h3 className="text-xs font-black text-foreground mb-8 flex items-center gap-3 tracking-[0.2em] uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
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
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border group hover:border-brand-orange/20 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-brand-orange transition-colors" />
                        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">{item.label}</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        item.status === "Recommended" ? "bg-brand-orange/10 text-brand-orange" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-8 relative overflow-hidden group shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Zap className="w-4 h-4 text-brand-orange" />
                <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.25em]">Security Protocol</h4>
              </div>
              <div className="flex items-center gap-2 mb-6 relative z-10">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={cn(
                    "h-1.5 flex-1 rounded-full shadow-inner",
                    i <= 4 ? "bg-brand-orange" : "bg-muted"
                  )} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed relative z-10">
                Your account security is <span className="text-brand-orange">High</span>. Multi-factor authentication is recommended for all root-level administrative accounts.
              </p>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
