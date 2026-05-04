"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { StatCard } from "@/app/(dashboard)/admin/components/stat-card";
import { QuickActions } from "@/app/(dashboard)/admin/components/quick-actions";
import { ActivityFeed } from "@/app/(dashboard)/admin/components/activity-feed";
import { RevenueChart } from "@/app/(dashboard)/admin/components/revenue-chart";
import { AttendanceHeatmap } from "@/app/(dashboard)/admin/components/attendance-heatmap";
import { UpcomingSchedule } from "@/app/(dashboard)/admin/components/upcoming-schedule";
import { SkeletonStatGrid, SkeletonChart } from "@/components/loaders/eagle-loader";
import { 
  getDashboardStats, 
  getAnalyticsChartsData, 
  getDashboardActivity, 
  getDashboardSchedules 
} from "@/actions/admin/analytics-actions";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Admin Dashboard
// ═══════════════════════════════════════════════════════════════

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  attendanceRate: number;
  activeClasses: number;
  todayRevenue: number;
  todayAttendance: number;
  pendingPayments: number;
  newMembersThisMonth: number;
  expiringSoon: number;
  attendanceSparkline: number[];
  revenueSparkline: number[];
}

interface ChartData {
  revenueData: { name: string; revenue: number }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({ revenueData: [] });
  const [activities, setActivities] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    todayAttendance: 0,
    pendingPayments: 0,
    newMembersThisMonth: 0,
    expiringSoon: 0,
    revenueGrowth: 0,
    attendanceRate: 0,
    activeClasses: 0,
    attendanceSparkline: [],
    revenueSparkline: [],
  });

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const [statsRes, chartsRes, activityRes, scheduleRes] = await Promise.all([
          getDashboardStats(),
          getAnalyticsChartsData(),
          getDashboardActivity(),
          getDashboardSchedules()
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (chartsRes.success && chartsRes.data) {
          setChartData({
            revenueData: chartsRes.data.revenueData.map((d: any) => ({
              name: d.month,
              revenue: d.revenue
            }))
          });
        }

        if (activityRes.success && activityRes.data) {
          setActivities(activityRes.data);
        }

        if (scheduleRes.success && scheduleRes.data) {
          setSchedules(scheduleRes.data);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse-fade">
        <SkeletonStatGrid count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonChart />
          </div>
          <SkeletonChart />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight mb-1">
            Admin <span className="text-brand-orange">Overview</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Welcome back! Here's what's happening at Eagle Gym.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-bold tracking-wide uppercase">System Online</span>
        </div>
      </motion.div>

      {/* Primary Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Members"
          value={stats.totalMembers}
          trend="+12%"
          trendUp
          sparklineData={stats.attendanceSparkline || []}
          color="navy"
        />
        <StatCard
          icon={<CreditCard className="w-6 h-6" />}
          label="Monthly Revenue"
          value={stats.monthlyRevenue}
          trend={`+${stats.revenueGrowth}%`}
          trendUp={stats.revenueGrowth >= 0}
          sparklineData={stats.revenueSparkline || []}
          color="success"
          subtitle={`₹${formatNumber(stats.todayRevenue)} today`}
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          label="Checked In Today"
          value={stats.todayAttendance}
          trendUp
          sparklineData={stats.attendanceSparkline || []}
          color="info"
          subtitle="Peak: 6:00 PM - 8:00 PM"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Pending Dues"
          value={stats.pendingPayments}
          trendUp={false}
          color="danger"
          subtitle="Action required"
        />
      </motion.div>

      {/* Secondary Summary Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={<Calendar className="w-6 h-6" />}
          label="New This Month"
          value={stats.newMembersThisMonth}
          color="orange"
        />
        <SummaryCard
          icon={<Clock className="w-6 h-6" />}
          label="Expiring Soon"
          value={stats.expiringSoon}
          color="warning"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          label="Active Subscriptions"
          value={stats.activeMembers}
          color="success"
        />
        <SummaryCard
          icon={<XCircle className="w-6 h-6" />}
          label="Inactive Members"
          value={stats.totalMembers - stats.activeMembers}
          color="danger"
        />
      </motion.div>

      {/* Main Content Row 1: Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <RevenueChart data={chartData.revenueData} />
        </motion.div>

        {/* Recent Activity (Moved up and capped) */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <ActivityFeed data={activities} />
        </motion.div>
      </div>

      {/* Main Content Row 2: Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Schedule */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <UpcomingSchedule data={schedules} />
        </motion.div>

        {/* Quick Actions (Positioned next to schedule) */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <QuickActions />
        </motion.div>
      </div>

      {/* Tertiary Grid: Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Heatmap */}
        <motion.div variants={itemVariants} className="lg:col-span-12">
          <AttendanceHeatmap />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Summary Card (smaller stat card)
// ═══════════════════════════════════════════════════════════════

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: "warning" | "success" | "info" | "danger" | "orange";
}) {
  const colorMap = {
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
    info: "bg-info-soft text-info",
    danger: "bg-danger-soft text-danger",
    orange: "bg-brand-orange-soft text-brand-orange",
  };

  return (
    <div className="surface-card p-5 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colorMap[color])}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground tracking-tight leading-none mb-1">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
