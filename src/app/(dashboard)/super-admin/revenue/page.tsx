"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { StatCard } from "@/app/(dashboard)/admin/components/stat-card";
import { getSuperAdminRevenueStats } from "@/actions/admin/analytics-actions";
import { RevenueChart } from "@/app/(dashboard)/admin/components/revenue-chart";

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    mrr: number;
    arr: number;
    churnRate: number;
    revenueSparkline: number[];
    chartData: { name: string; revenue: number }[];
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await getSuperAdminRevenueStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-wide text-foreground">
          <DollarSign className="h-6 w-6 text-brand-orange" />
          Financial Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time revenue monitoring, churn analysis, and fiscal forecasting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="MRR (Monthly Recurring)"
          value={stats?.mrr || 0}
          trend="+0.0%"
          trendUp={true}
          color="orange"
          sparklineData={stats?.revenueSparkline || []}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="ARR (Annual Run Rate)"
          value={stats?.arr || 0}
          trend="+0.0%"
          trendUp={true}
          color="info"
          sparklineData={stats?.revenueSparkline?.map((v) => v * 12) || []}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Churn Rate"
          value={`${stats?.churnRate || 0}%`}
          trend="Live"
          trendUp={false}
          color="success"
          sparklineData={[3, 2.8, 2.6, 2.4, 2.4, stats?.churnRate || 0]}
        />
      </div>

      <div className="surface-card group relative flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-border p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,93,38,0.03),transparent_70%)]" />

        <div className="relative z-10 w-full flex-1">
          {stats?.chartData ? (
            <RevenueChart data={stats.chartData} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm italic text-muted-foreground">
              Insufficient data for visual modeling
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
