import React from "react";
import { getDashboardStats } from "@/actions/super-admin/dashboard-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users, DollarSign, Shield, Activity } from "lucide-react";
import { motion } from "framer-motion";

export async function StatsGrid() {
  const { stats } = await getDashboardStats();
  
  const defaultStats = {
    totalRevenue: 0,
    activeMembersCount: 0,
    activeStaffCount: 0,
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={DollarSign}
        label="Total System Revenue"
        value={currentStats.totalRevenue}
        trend="+0.0%"
        trendUp={true}
        color="orange"
        sparklineData={[0, 0, 0, 0, currentStats.totalRevenue]}
      />
      <StatCard
        icon={Users}
        label="Active Gym Members"
        value={currentStats.activeMembersCount}
        trend="Live"
        trendUp={true}
        color="info"
        sparklineData={[0, 0, 0, currentStats.activeMembersCount]}
      />
      <StatCard
        icon={Shield}
        label="Active Staff / Admins"
        value={currentStats.activeStaffCount}
        trend="Live"
        trendUp={true}
        color="purple"
        sparklineData={[0, 0, currentStats.activeStaffCount]}
      />
      <StatCard
        icon={Activity}
        label="System Health (API)"
        value="100%"
        trend="Stable"
        trendUp={true}
        color="success"
        sparklineData={[100, 100, 100, 100]}
      />
    </div>
  );
}

export async function RecentLogsList() {
  const { recentLogs } = await getDashboardStats();
  const logs = recentLogs || [];

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 relative z-10">
        <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No audit logs found yet.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 space-y-3">
      {logs.map((log: any) => (
        <div key={log.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border">
          <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-electric-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{log.action}</p>
            <p className="text-xs text-muted-foreground">{log.user?.firstName || "System"} • {new Date(log.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
