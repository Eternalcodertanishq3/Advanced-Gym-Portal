"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  UserPlus,
  CreditCard,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Search,
  Bell,
  Calendar,
  Zap,
} from "lucide-react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Receptionist Dashboard
// ═══════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

export default function ReceptionistDashboardPage() {
  const [checkInQuery, setCheckInQuery] = useState("");
  const [recentCheckIns, setRecentCheckIns] = useState([
    { id: "1", name: "Rahul Patel", time: "06:15 AM", status: "checked-in" },
    { id: "2", name: "Priya Sharma", time: "06:42 AM", status: "checked-in" },
    { id: "3", name: "Amit Kumar", time: "07:10 AM", status: "checked-out" },
    { id: "4", name: "Neha Gupta", time: "07:35 AM", status: "checked-in" },
    { id: "5", name: "Vikram Singh", time: "08:00 AM", status: "checked-in" },
  ]);

  const handleQuickCheckIn = () => {
    if (!checkInQuery.trim()) {
      toast.error("Please enter member name or ID");
      return;
    }
    toast.success(`Checked in ${checkInQuery}`);
    setCheckInQuery("");
  };

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
            Reception <span className="text-gold-gradient">Desk</span>
          </h1>
          <p className="text-sm text-white/40">Quick actions for daily operations</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-cyan/10 border border-electric-cyan/20">
          <Clock className="w-3 h-3 text-electric-cyan" />
          <span className="text-xs text-electric-cyan font-mono">
            {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </motion.div>

      {/* Quick Action Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          icon={QrCode}
          label="Quick Check-In"
          description="Scan QR or search member"
          color="gold"
          href="/receptionist/check-in"
        />
        <QuickActionCard
          icon={UserPlus}
          label="Walk-In Register"
          description="New member registration"
          color="green"
          href="/receptionist/walk-in"
        />
        <QuickActionCard
          icon={CreditCard}
          label="Collect Payment"
          description="Record cash/card/UPI"
          color="cyan"
          href="/receptionist/payments"
        />
        <QuickActionCard
          icon={Users}
          label="View Members"
          description="Search & view profiles"
          color="purple"
          href="/receptionist/members"
        />
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Checked In Today"
          value={142}
          trend="+12"
          trendUp
          color="green"
        />
        <StatCard
          icon={CreditCard}
          label="Today's Collection"
          value={formatCurrency(45200, { showSymbol: true, decimals: 0 })}
          trend="+₹8,500"
          trendUp
          color="gold"
        />
        <StatCard
          icon={UserPlus}
          label="New Registrations"
          value={3}
          color="cyan"
        />
        <StatCard
          icon={Bell}
          label="Pending Dues"
          value={23}
          color="crimson"
          subtitle="₹1,24,500 total"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Check-In */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Quick Check-In</h3>
                <p className="text-xs text-white/30">Search by name, phone, or member ID</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Enter member name or ID..."
                  value={checkInQuery}
                  onChange={(e) => setCheckInQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickCheckIn()}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-gold-500/30 transition-all"
                />
              </div>
              <button
                onClick={handleQuickCheckIn}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-liquid-gold to-liquid-orange text-obsidian-950 font-semibold text-sm hover:brightness-110 transition-all active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Check In
              </button>
            </div>

            {/* Recent Check-Ins */}
            <div>
              <h4 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
                Recent Activity
              </h4>
              <div className="space-y-2">
                {recentCheckIns.map((checkIn, index) => (
                  <motion.div
                    key={checkIn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                          checkIn.status === "checked-in"
                            ? "bg-neon-green/10 text-neon-green"
                            : "bg-white/5 text-white/30"
                        )}
                      >
                        {checkIn.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm text-white">{checkIn.name}</p>
                        <p className="text-xs text-white/30">{checkIn.time}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        checkIn.status === "checked-in"
                          ? "bg-neon-green/10 text-neon-green"
                          : "bg-white/5 text-white/30"
                      )}
                    >
                      {checkIn.status === "checked-in" ? "Checked In" : "Checked Out"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Summary */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-cyan/20 to-electric-cyan/5 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-electric-cyan" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Today&apos;s Summary</h3>
                <p className="text-xs text-white/30">Overview for {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long" })}</p>
              </div>
            </div>

            <div className="space-y-4">
              <SummaryRow
                icon={Users}
                label="Total Check-ins"
                value="142"
                change="+12"
                positive
              />
              <SummaryRow
                icon={CreditCard}
                label="Revenue"
                value="₹45,200"
                change="+₹8,500"
                positive
              />
              <SummaryRow
                icon={UserPlus}
                label="New Members"
                value="3"
                change="+2"
                positive
              />
              <SummaryRow
                icon={Zap}
                label="Peak Hour"
                value="6:00 PM"
                change="Busy"
                neutral
              />
              <SummaryRow
                icon={TrendingUp}
                label="Occupancy"
                value="78%"
                change="+5%"
                positive
              />
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-white/30">
                <span>Shift started at</span>
                <span className="text-white/60 font-mono">6:00 AM</span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/30 mt-1">
                <span>Shift ends at</span>
                <span className="text-white/60 font-mono">2:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Quick Action Card
// ═══════════════════════════════════════════════════════════════

function QuickActionCard({
  icon: Icon,
  label,
  description,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  color: "gold" | "green" | "cyan" | "purple";
  href: string;
}) {
  const colorMap = {
    gold: "from-gold-500/20 to-gold-500/5 text-gold-400 hover:shadow-gold-500/10",
    green: "from-neon-green/20 to-neon-green/5 text-neon-green hover:shadow-neon-green/10",
    cyan: "from-electric-cyan/20 to-electric-cyan/5 text-electric-cyan hover:shadow-electric-cyan/10",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400 hover:shadow-purple-500/10",
  };

  return (
    <motion.a
      href={href}
      className={cn(
        "group flex flex-col p-5 rounded-2xl glass-card border border-white/5",
        "hover:border-gold-500/20 transition-all duration-300",
        "active:scale-[0.98]"
      )}
      whileHover={{ y: -4 }}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
          colorMap[color]
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-white mb-1">{label}</h3>
      <p className="text-xs text-white/30">{description}</p>
      <div className="mt-3 flex items-center gap-1 text-xs text-white/20 group-hover:text-gold-400 transition-colors">
        <span>Open</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </motion.a>
  );
}

// ═══════════════════════════════════════════════════════════════
// Summary Row
// ═══════════════════════════════════════════════════════════════

function SummaryRow({
  icon: Icon,
  label,
  value,
  change,
  positive,
  neutral,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  neutral?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-white/40" />
        </div>
        <div>
          <p className="text-xs text-white/40">{label}</p>
          <p className="text-sm font-medium text-white">{value}</p>
        </div>
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          positive ? "text-neon-green" : neutral ? "text-white/40" : "text-crimson"
        )}
      >
        {change}
      </span>
    </div>
  );
}