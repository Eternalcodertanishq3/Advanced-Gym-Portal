import { Suspense } from "react";
import { DashboardClient } from "./components/dashboard-client";
import { StatsGrid, RecentLogsList, BranchComparisonWrapper } from "./components/dashboard-data";
import { StatSkeleton, LogsSkeleton } from "./components/dashboard-skeletons";

export default async function SuperAdminDashboard() {
  return (
    <DashboardClient
      statsChild={
        <Suspense fallback={<StatSkeleton />}>
          <StatsGrid />
        </Suspense>
      }
      chartsChild={
        <Suspense fallback={<LogsSkeleton />}>
          <BranchComparisonWrapper />
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
