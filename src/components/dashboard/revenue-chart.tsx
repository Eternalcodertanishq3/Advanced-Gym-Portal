"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { TrendingUp, Download, Calendar, ChevronDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Revenue Analytics Chart
// ═══════════════════════════════════════════════════════════════

type ChartView = "revenue" | "members" | "attendance";

import { useEffect } from "react";
import { getAnalyticsChartsData } from "@/server/actions/analytics-actions";
import { SkeletonChart } from "@/components/loaders/eagle-loader";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-3 border border-gold-500/20 shadow-xl">
      <p className="text-xs text-white/40 mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-white/60">{entry.name}:</span>
          <span className="text-xs font-mono font-medium text-white">
            {entry.name === "Members"
              ? entry.value
              : formatCurrency(entry.value, { showSymbol: true, decimals: 0 })}
          </span>
        </div>
      ))}
    </div>
  );
};

export function RevenueChart() {
  const [chartView, setChartView] = useState<ChartView>("revenue");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getAnalyticsChartsData();
      if (res.success) {
        setData(res.data);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) return <SkeletonChart />;

  const { revenueData, attendanceData } = data || { revenueData: [], attendanceData: [] };

  const totalRevenue = revenueData.reduce((sum: number, d: any) => sum + d.revenue, 0);
  const avgMonthly = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
            <p className="text-xs text-white/30">Track your gym&apos;s financial performance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5">
            {(["revenue", "members", "attendance"] as ChartView[]).map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                  chartView === view
                    ? "bg-gold-500/20 text-gold-400"
                    : "text-white/40 hover:text-white/60"
                )}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Time Range */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white/60 text-xs transition-colors">
            <Calendar className="w-3 h-3" />
            <span>Last 6 Months</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === "revenue" ? (
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
                tickFormatter={(value) => `₹${formatCurrency(value, { showSymbol: false, decimals: 0 })}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#FFD700"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          ) : chartView === "members" ? (
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="membersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="members"
                name="Members"
                stroke="#00F0FF"
                strokeWidth={2}
                fill="url(#membersGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" name="Avg Check-ins" fill="#FFD700" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
        <div>
          <p className="text-xs text-white/30 mb-1">Total Period Revenue</p>
          <p className="text-lg font-mono font-bold text-gold-400">
            {formatCurrency(totalRevenue, { showSymbol: true, decimals: 0 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/30 mb-1">Avg. Monthly</p>
          <p className="text-lg font-mono font-bold text-white">
            {formatCurrency(avgMonthly, { showSymbol: true, decimals: 0 })}
          </p>
        </div>
      </div>
    </div>
  );
}