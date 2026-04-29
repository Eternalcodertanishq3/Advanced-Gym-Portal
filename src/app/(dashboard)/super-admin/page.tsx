import React from "react";
import { getDashboardStats } from "@/actions/super-admin/dashboard-actions";
import { DashboardClient } from "./components/dashboard-client";

export default async function SuperAdminDashboard() {
  const { stats, recentLogs } = await getDashboardStats();

  const defaultStats = {
    totalRevenue: 0,
    activeMembersCount: 0,
    activeStaffCount: 0,
  };

  return <DashboardClient stats={stats || defaultStats} recentLogs={recentLogs || []} />;
}
