"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { getSuperAdminRevenueStats } from "@/server/actions/analytics-actions";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

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
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-wide font-display flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-brand-orange" />
          Financial Analytics
        </h1>
        <p className="text-sm text-muted-foreground">Real-time revenue monitoring, churn analysis, and fiscal forecasting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="MRR (Monthly Recurring)"
          value={stats?.mrr || 0}
          trend="+0.0%"
          trendUp={true}
          color="orange"
          sparklineData={stats?.revenueSparkline || []}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="ARR (Annual Run Rate)"
          value={stats?.arr || 0}
          trend="+0.0%"
          trendUp={true}
          color="info"
          sparklineData={stats?.revenueSparkline.map(v => v * 12) || []}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Churn Rate"
          value={`${stats?.churnRate || 0}%`}
          trend="Live"
          trendUp={false}
          color="success"
          sparklineData={[3, 2.8, 2.6, 2.4, 2.4, stats?.churnRate || 0]}
        />
      </div>

      <div className="surface-card p-6 rounded-2xl border border-border flex flex-col relative overflow-hidden group min-h-[450px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,93,38,0.03),transparent_70%)] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-orange" />
              Revenue Growth Analysis
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Twelve-month fiscal trajectory and branch performance aggregations.</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-bold uppercase tracking-wider">
            Live Database Sync
          </div>
        </div>

        <div className="flex-1 w-full h-full relative z-10">
          {stats?.chartData ? (
            <RevenueChart data={stats.chartData} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground italic text-sm">
              Insufficient data for visual modeling
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
