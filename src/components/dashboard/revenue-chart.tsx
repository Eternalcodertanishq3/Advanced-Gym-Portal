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

const revenueData = [
  { month: "Jan", revenue: 850000, expenses: 620000, profit: 230000, members: 890 },
  { month: "Feb", revenue: 920000, expenses: 640000, profit: 280000, members: 945 },
  { month: "Mar", revenue: 1100000, expenses: 680000, profit: 420000, members: 1020 },
  { month: "Apr", revenue: 1050000, expenses: 700000, profit: 350000, members: 1080 },
  { month: "May", revenue: 1245000, expenses: 720000, profit: 525000, members: 1150 },
  { month: "Jun", revenue: 1180000, expenses: 710000, profit: 470000, members: 1190 },
  { month: "Jul", revenue: 1350000, expenses: 750000, profit: 600000, members: 1247 },
];

const attendanceData = [
  { day: "Mon", morning: 120, afternoon: 80, evening: 200 },
  { day: "Tue", morning: 110, afternoon: 90, evening: 220 },
  { day: "Wed", morning: 130, afternoon: 85, evening: 210 },
  { day: "Thu", morning: 115, afternoon: 95, evening: 230 },
  { day: "Fri", morning: 100, afternoon: 70, evening: 250 },
  { day: "Sat", morning: 180, afternoon: 150, evening: 280 },
  { day: "Sun", morning: 200, afternoon: 160, evening: 150 },
];

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
  const [timeRange, setTimeRange] = useState("7months");

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
            <span>Last 7 Months</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Export */}
          <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-gold-400 transition-colors">
            <Download className="w-4 h-4" />
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
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
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
                tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
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
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#39FF14"
                strokeWidth={2}
                fill="url(#profitGradient)"
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
              <Bar dataKey="morning" name="Morning (5AM-12PM)" fill="#FFD700" radius={[4, 4, 0, 0]} />
              <Bar dataKey="afternoon" name="Afternoon (12PM-5PM)" fill="#00F0FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="evening" name="Evening (5PM-10PM)" fill="#FF3131" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
        <div>
          <p className="text-xs text-white/30 mb-1">Total Revenue</p>
          <p className="text-lg font-mono font-bold text-gold-400">
            {formatCurrency(7695000, { showSymbol: true, decimals: 0 })}
          </p>
          <p className="text-[10px] text-neon-green mt-0.5">+18.5% vs last period</p>
        </div>
        <div>
          <p className="text-xs text-white/30 mb-1">Net Profit</p>
          <p className="text-lg font-mono font-bold text-neon-green">
            {formatCurrency(2875000, { showSymbol: true, decimals: 0 })}
          </p>
          <p className="text-[10px] text-neon-green mt-0.5">37.4% margin</p>
        </div>
        <div>
          <p className="text-xs text-white/30 mb-1">Avg. Monthly</p>
          <p className="text-lg font-mono font-bold text-white">
            {formatCurrency(1099285, { showSymbol: true, decimals: 0 })}
          </p>
          <p className="text-[10px] text-white/20 mt-0.5">Per month</p>
        </div>
      </div>
    </div>
  );
}