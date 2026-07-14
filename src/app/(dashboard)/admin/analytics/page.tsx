"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  Users,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
} from "lucide-react";
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
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { formatCurrency, cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/use-analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAnalyticsChartsData } from "@/actions/admin/analytics-actions";

const tooltipContentStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  border: "1px solid #EDECE8",
};

const SkeletonStatGrid = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-32 rounded-xl" />
    ))}
  </div>
);

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const { data: stats, isLoading: statsLoading } = useAnalytics();
  const [chartData, setChartData] = useState<any>(null);
  const [isChartsLoading, setIsChartsLoading] = useState(true);

  useEffect(() => {
    async function loadCharts() {
      setIsChartsLoading(true);
      const res = await getAnalyticsChartsData();
      if (res.success) {
        setChartData(res.data);
      }
      setIsChartsLoading(false);
    }
    loadCharts();
  }, []);

  if (statsLoading || isChartsLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <SkeletonStatGrid count={4} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const { revenueData, categoryData, attendanceData } = chartData || {
    revenueData: [],
    categoryData: [],
    attendanceData: [],
  };

  const StatCard = ({ title, value, icon, trend, trendValue, description, loading }: any) => (
    <Card className="group overflow-hidden border-surface-sunken bg-surface-card shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-xl border border-surface-sunken bg-surface-base p-2.5 text-obsidian-900 transition-colors group-hover:bg-brand-navy group-hover:text-white">
            {icon}
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold",
                trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trendValue}%
            </div>
          )}
        </div>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <h3 className="mb-1 font-display text-3xl font-bold text-obsidian-950">{value}</h3>
            <p className="text-sm font-medium uppercase tracking-wider text-obsidian-500">
              {title}
            </p>
            {description && <p className="mt-2 text-xs text-obsidian-400">{description}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Business <span className="text-brand-orange">Insights</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Real-time analytics and performance metrics for Eagle Gym.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] border-surface-sunken bg-surface-card">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-surface-sunken bg-surface-card">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.monthlyRevenue || 0)}
          icon={<CreditCard className="h-5 w-5" />}
          trend="up"
          trendValue={stats?.revenueGrowth || 0}
          description="Total revenue collected this month"
          loading={statsLoading}
        />
        <StatCard
          title="Active Members"
          value={stats?.activeMembers || 0}
          icon={<Users className="h-5 w-5" />}
          trend="up"
          trendValue={stats?.memberGrowth || 0}
          description="Members with active subscriptions"
          loading={statsLoading}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendanceRate || 0}%`}
          icon={<Calendar className="h-5 w-5" />}
          trend={(stats?.attendanceRate ?? 0) > 10 ? "up" : "down"}
          trendValue={stats?.attendanceRate || 0}
          description="Average daily member turnout"
          loading={statsLoading}
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats?.conversionRate || 0}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="up"
          trendValue={stats?.conversionRate || 0}
          description="Member conversion from base"
          loading={statsLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Area Chart */}
        <Card className="overflow-hidden border-surface-sunken bg-surface-card shadow-sm lg:col-span-2">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="font-display text-xl font-bold text-obsidian-950">
              Revenue Growth
            </CardTitle>
            <CardDescription>Monthly revenue vs number of active members</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDECE8" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #EDECE8",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke="#0F172A"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMembers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Distribution */}
        <Card className="overflow-hidden border-surface-sunken bg-surface-card shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="font-display text-xl font-bold text-obsidian-950">
              Revenue Split
            </CardTitle>
            <CardDescription>By product and service category</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex h-[250px] w-full items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipContentStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {categoryData.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-obsidian-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-obsidian-950">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Chart */}
      <Card className="overflow-hidden border-surface-sunken bg-surface-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <div>
            <CardTitle className="font-display text-xl font-bold text-obsidian-950">
              Daily Attendance
            </CardTitle>
            <CardDescription>Average member visits per day of week</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="font-bold text-brand-orange">
            View Reports
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDECE8" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "#FAFAF8" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #EDECE8",
                  }}
                />
                <Bar dataKey="count" fill="#0F172A" radius={[6, 6, 0, 0]} barSize={40}>
                  {attendanceData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 100 ? "#F97316" : "#0F172A"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
