"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Dumbbell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn, formatCurrency, formatNumber, delay } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { AttendanceHeatmap } from "@/components/dashboard/attendance-heatmap";
import { UpcomingSchedule } from "@/components/dashboard/upcoming-schedule";
import { SkeletonStatGrid, SkeletonChart } from "@/components/loaders/eagle-loader";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Admin Dashboard
// ═══════════════════════════════════════════════════════════════

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  todayRevenue: number;
  monthlyRevenue: number;
  todayAttendance: number;
  pendingPayments: number;
  newMembersThisMonth: number;
  expiringSoon: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    todayAttendance: 0,
    pendingPayments: 0,
    newMembersThisMonth: 0,
    expiringSoon: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      await delay(800); // Simulate API call
      setStats({
        totalMembers: 1247,
        activeMembers: 1089,
        todayRevenue: 45200,
        monthlyRevenue: 1245000,
        todayAttendance: 342,
        pendingPayments: 23,
        newMembersThisMonth: 45,
        expiringSoon: 12,
      });
      setIsLoading(false);
    }
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Admin <span className="text-gold-gradient">Dashboard</span>
          </h1>
          <p className="text-sm text-white/40">Welcome back! Here&apos;s what&apos;s happening at Eagle Gym.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs text-neon-green font-medium">System Online</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Members"
          value={stats.totalMembers}
          trend="+12%"
          trendUp
          sparklineData={[820, 932, 901, 1034, 1090, 1130, 1247]}
          color="gold"
        />
        <StatCard
          icon={CreditCard}
          label="Today&apos;s Revenue"
          value={formatCurrency(stats.todayRevenue, { showSymbol: true, decimals: 0 })}
          trend="+8.5%"
          trendUp
          sparklineData={[32000, 38000, 35000, 42000, 39000, 41000, 45200]}
          color="green"
          subtitle="vs yesterday ₹41,600"
        />
        <StatCard
          icon={Activity}
          label="Active Now"
          value={stats.todayAttendance}
          trend="+5.2%"
          trendUp
          sparklineData={[280, 310, 295, 340, 320, 355, 342]}
          color="cyan"
          subtitle="Peak: 6:00 PM - 8:00 PM"
        />
        <StatCard
          icon={AlertTriangle}
          label="Pending Dues"
          value={stats.pendingPayments}
          trend="-3"
          trendUp={false}
          color="crimson"
          subtitle="₹1,24,500 total pending"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <RevenueChart />
        </motion.div>

        {/* Upcoming Schedule */}
        <motion.div variants={itemVariants}>
          <UpcomingSchedule />
        </motion.div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Heatmap */}
        <motion.div variants={itemVariants}>
          <AttendanceHeatmap />
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <ActivityFeed />
        </motion.div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Calendar}
          label="New This Month"
          value={stats.newMembersThisMonth}
          color="gold"
        />
        <SummaryCard
          icon={Clock}
          label="Expiring Soon"
          value={stats.expiringSoon}
          color="orange"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Active Subscriptions"
          value={stats.activeMembers}
          color="green"
        />
        <SummaryCard
          icon={XCircle}
          label="Inactive Members"
          value={stats.totalMembers - stats.activeMembers}
          color="crimson"
        />
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Summary Card (smaller stat card)
// ═══════════════════════════════════════════════════════════════

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: "gold" | "green" | "cyan" | "crimson" | "orange";
}) {
  const colorMap = {
    gold: "from-gold-500/20 to-gold-500/5 text-gold-400",
    green: "from-neon-green/20 to-neon-green/5 text-neon-green",
    cyan: "from-electric-cyan/20 to-electric-cyan/5 text-electric-cyan",
    crimson: "from-crimson/20 to-crimson/5 text-crimson",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-400",
  };

  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-mono font-bold text-white">{formatNumber(value)}</p>
        <p className="text-xs text-white/40">{label}</p>
      </div>
    </div>
  );
}