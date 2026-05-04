import React from "react";
import { getDashboardStats } from "@/actions/super-admin/dashboard-actions";
import { StatCard } from "@/app/(dashboard)/admin/components/stat-card";
import { Users, IndianRupee, Shield, Activity } from "lucide-react";
import { motion } from "framer-motion";

export async function StatsGrid() {
  const { stats } = await getDashboardStats();
  
  const defaultStats = {
    totalRevenue: 0,
    activeMembersCount: 0,
    activeStaffCount: 0,
    revenueTrend: "+0.0%",
    membersTrend: "Live",
    revenueSparkline: [0, 0, 0, 0, 0, 0, 0],
    membersSparkline: [0, 0, 0, 0, 0, 0, 0]
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<IndianRupee className="w-6 h-6" />}
        label="Total System Revenue"
        value={currentStats.totalRevenue}
        trend={currentStats.revenueTrend}
        trendUp={!currentStats.revenueTrend.startsWith('-')}
        color="orange"
        sparklineData={currentStats.revenueSparkline}
      />
      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="Active Gym Members"
        value={currentStats.activeMembersCount}
        trend={currentStats.membersTrend}
        trendUp={!currentStats.membersTrend.startsWith('-')}
        color="info"
        sparklineData={currentStats.membersSparkline}
      />
      <StatCard
        icon={<Shield className="w-6 h-6" />}
        label="Active Staff / Admins"
        value={currentStats.activeStaffCount}
        trend="Live"
        trendUp={true}
        color="purple"
        sparklineData={[0, 0, currentStats.activeStaffCount]}
      />
      <StatCard
        icon={<Activity className="w-6 h-6" />}
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

import { GlobalComparisonCharts } from "./global-comparison-charts";

export async function BranchComparisonWrapper() {
  const { stats } = await getDashboardStats();
  return <GlobalComparisonCharts data={stats?.branchComparison || []} />;
}
