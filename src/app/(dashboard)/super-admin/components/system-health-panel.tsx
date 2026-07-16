"use client";

import React from "react";
import { Server, Database, Shield, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSystemHealth } from "@/actions/super-admin/dashboard-actions";

export default function SystemHealthPanel() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await getSystemHealth();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Health fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();

    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-card flex h-[300px] flex-col items-center justify-center rounded-3xl border border-border p-6">
        <Loader2 className="mb-2 h-8 w-8 animate-spin text-brand-orange/40" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Scanning Infrastructure...
        </p>
      </div>
    );
  }

  const modules = [
    {
      name: "Database Cluster",
      status: data?.database?.status || "Optimal",
      health: Math.round(data?.database?.health ?? 100),
      icon: Database,
      color: "text-blue-500",
      sub: `${data?.database?.latency ?? 0}ms latency`,
    },
    {
      name: "Payments Gateway",
      status: data?.payments?.status || "Active",
      health: Math.round(data?.payments?.health ?? 100),
      icon: Zap,
      color: "text-amber-500",
      sub:
        data?.payments?.stuckCount > 0 ? `${data.payments.stuckCount} stuck payments` : "No delays",
    },
    {
      name: "System Core",
      status: data?.system?.status || "Operational",
      health: Math.round(data?.system?.health ?? 100),
      icon: Shield,
      color: "text-emerald-500",
      sub:
        data?.system?.errorCount > 0
          ? `${data.system.errorCount} recent errors`
          : "0 recent errors",
    },
  ];

  const overallHealth = Math.round(modules.reduce((acc, m) => acc + m.health, 0) / modules.length);

  return (
    <div className="glass-card group relative overflow-hidden rounded-3xl border border-border p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.03),transparent_70%)]" />

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Server className="h-5 w-5 text-emerald-500" />
            Infrastructure Status
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time health monitoring of system core
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-all",
            overallHealth > 90
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
              : "border-amber-500/20 bg-amber-500/10 text-amber-500",
          )}
        >
          <div
            className={cn(
              "h-1.5 w-1.5 animate-pulse rounded-full",
              overallHealth > 90 ? "bg-emerald-500" : "bg-amber-500",
            )}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {overallHealth > 90 ? "All Systems Normal" : "Degraded Performance"}
          </span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {modules.map((m) => (
          <div
            key={m.name}
            className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-muted/30 p-4 transition-all hover:border-border hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-sm",
                  m.color,
                )}
              >
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{m.name}</p>
                <p className="text-[10px] uppercase tracking-tight text-muted-foreground">
                  {m.sub}
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Health</span>
                <span className="font-mono text-sm font-bold text-foreground">{m.health}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full transition-all duration-1000",
                    m.health > 90
                      ? "bg-emerald-500"
                      : m.health > 70
                        ? "bg-blue-500"
                        : "bg-rose-500",
                  )}
                  style={{ width: `${m.health}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
