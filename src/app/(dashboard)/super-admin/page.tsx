import React, { Suspense } from "react";
import { DashboardClient } from "./components/dashboard-client";
import { StatsGrid, RecentLogsList } from "./components/dashboard-data";
import { StatSkeleton, LogsSkeleton } from "./components/dashboard-skeletons";

export default async function SuperAdminDashboard() {
  return (
    <DashboardClient 
      statsChild={
        <Suspense fallback={<StatSkeleton />}>
          <StatsGrid />
        </Suspense>
      }
      logsChild={
        <Suspense fallback={<LogsSkeleton />}>
          <RecentLogsList />
        </Suspense>
      }
    />
  );
}
