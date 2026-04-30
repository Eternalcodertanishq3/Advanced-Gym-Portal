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
  Filter
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
  Pie
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
  SelectValue 
} from "@/components/ui/select";
import { getAnalyticsChartsData } from "@/server/actions/analytics-actions";

const tooltipContentStyle = { 
  backgroundColor: '#FFFFFF', 
  borderRadius: '12px', 
  border: '1px solid #EDECE8'
};

const SkeletonStatGrid = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="space-y-8 animate-pulse">
        <SkeletonStatGrid count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><Skeleton className="h-[400px] rounded-2xl" /></div>
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const { revenueData, categoryData, attendanceData } = chartData || { revenueData: [], categoryData: [], attendanceData: [] };

  const StatCard = ({ title, value, icon, trend, trendValue, description, loading }: any) => (
    <Card className="bg-surface-card border-surface-sunken shadow-sm overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-surface-base border border-surface-sunken text-obsidian-900 group-hover:bg-brand-navy group-hover:text-white transition-colors">
            {icon}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
              trend === "up" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
            )}>
              {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
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
            <h3 className="text-3xl font-display font-bold text-obsidian-950 mb-1">{value}</h3>
            <p className="text-sm font-medium text-obsidian-500 uppercase tracking-wider">{title}</p>
            {description && <p className="text-xs text-obsidian-400 mt-2">{description}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Business <span className="text-brand-orange">Insights</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Real-time analytics and performance metrics for Eagle Gym.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-surface-card border-surface-sunken">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-surface-card border-surface-sunken">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Monthly Revenue" 
          value={formatCurrency(stats?.monthlyRevenue || 0)} 
          icon={<CreditCard className="w-5 h-5" />}
          trend="up"
          trendValue={stats?.revenueGrowth || 0}
          description="Total revenue collected this month"
          loading={statsLoading}
        />
        <StatCard 
          title="Active Members" 
          value={stats?.activeMembers || 0} 
          icon={<Users className="w-5 h-5" />}
          trend="up"
          trendValue={8.2}
          description="Members with active subscriptions"
          loading={statsLoading}
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${stats?.attendanceRate || 0}%`} 
          icon={<Calendar className="w-5 h-5" />}
          trend="down"
          trendValue={2.4}
          description="Average daily member turnout"
          loading={statsLoading}
        />
        <StatCard 
          title="Conversion Rate" 
          value="24.8%" 
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          trendValue={15.3}
          description="Visitor to member conversion"
          loading={statsLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2 bg-surface-card border-surface-sunken shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-xl font-display font-bold text-obsidian-950">Revenue Growth</CardTitle>
            <CardDescription>Monthly revenue vs number of active members</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDECE8" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '12px', 
                      border: '1px solid #EDECE8',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
        <Card className="bg-surface-card border-surface-sunken shadow-sm overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-display font-bold text-obsidian-950">Revenue Split</CardTitle>
            <CardDescription>By product and service category</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[250px] w-full flex items-center justify-center">
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
                  <Tooltip 
                    contentStyle={tooltipContentStyle} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {categoryData.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full bg-[var(--bg-color)]" 
                      style={{ '--bg-color': item.color } as React.CSSProperties} 
                    />
                    <span className="text-sm font-medium text-obsidian-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-obsidian-950">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Chart */}
      <Card className="bg-surface-card border-surface-sunken shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-display font-bold text-obsidian-950">Daily Attendance</CardTitle>
            <CardDescription>Average member visits per day of week</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-brand-orange font-bold">
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
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#FAFAF8' }}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #EDECE8'
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="#0F172A" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                >
                  {attendanceData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.count > 100 ? '#F97316' : '#0F172A'} 
                    />
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
