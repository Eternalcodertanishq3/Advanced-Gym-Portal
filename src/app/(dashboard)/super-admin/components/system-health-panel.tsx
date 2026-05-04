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
      <div className="glass-card p-6 rounded-2xl border border-border flex flex-col items-center justify-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange/40 mb-2" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Scanning Infrastructure...</p>
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
      sub: `${data?.database?.latency ?? 0}ms latency`
    },
    { 
      name: "Payments Gateway", 
      status: data?.payments?.status || "Active", 
      health: Math.round(data?.payments?.health ?? 100), 
      icon: Zap, 
      color: "text-amber-500",
      sub: data?.payments?.stuckCount > 0 ? `${data.payments.stuckCount} stuck payments` : "No delays"
    },
    { 
      name: "System Core", 
      status: data?.system?.status || "Operational", 
      health: Math.round(data?.system?.health ?? 100), 
      icon: Shield, 
      color: "text-emerald-500",
      sub: data?.system?.errorCount > 0 ? `${data.system.errorCount} recent errors` : "0 recent errors"
    },
  ];

  const overallHealth = Math.round(modules.reduce((acc, m) => acc + m.health, 0) / modules.length);

  return (
    <div className="glass-card p-6 rounded-2xl border border-border relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.03),transparent_70%)]" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            Infrastructure Status
          </h3>
          <p className="text-xs text-muted-foreground">Real-time health monitoring of system core</p>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all",
          overallHealth > 90 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", overallHealth > 90 ? "bg-emerald-500" : "bg-amber-500")} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {overallHealth > 90 ? "All Systems Normal" : "Degraded Performance"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {modules.map((m) => (
          <div key={m.name} className="flex flex-col p-4 rounded-xl bg-muted/30 border border-border/50 transition-all hover:border-border hover:bg-muted/50 gap-3">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm", m.color)}>
                <m.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{m.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{m.sub}</p>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">Health</span>
                <span className="text-sm font-mono font-bold text-foreground">{m.health}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000", 
                    m.health > 90 ? "bg-emerald-500" : m.health > 70 ? "bg-blue-500" : "bg-rose-500"
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
