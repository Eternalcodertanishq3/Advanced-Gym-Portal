"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  CreditCard,
  LogIn,
  Settings,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Ban,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { cn, formatRelative, formatDate } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Recent Activity Feed
// ═══════════════════════════════════════════════════════════════

interface ActivityItem {
  id: string;
  type: "member_created" | "payment_received" | "check_in" | "member_updated" | "member_deleted" | "subscription_expired" | "subscription_renewed" | "plan_changed" | "login" | "settings_changed" | "member_suspended";
  user: string;
  userAvatar?: string;
  target?: string;
  amount?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "member_created",
    user: "Admin",
    target: "Rahul Patel",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
  },
  {
    id: "2",
    type: "payment_received",
    user: "Receptionist",
    target: "Priya Sharma",
    amount: 2499,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
  },
  {
    id: "3",
    type: "check_in",
    user: "System",
    target: "Amit Kumar",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: "4",
    type: "subscription_expired",
    user: "System",
    target: "Vikram Singh",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  },
  {
    id: "5",
    type: "member_updated",
    user: "Trainer",
    target: "Neha Gupta",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
  },
  {
    id: "6",
    type: "payment_received",
    user: "Receptionist",
    target: "Aditya Rao",
    amount: 6999,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
  {
    id: "7",
    type: "settings_changed",
    user: "Super Admin",
    target: "Gym Working Hours",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
  },
  {
    id: "8",
    type: "member_suspended",
    user: "Admin",
    target: "Rajesh Verma",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
  },
  {
    id: "9",
    type: "subscription_renewed",
    user: "System",
    target: "Kiran Shah",
    amount: 1499,
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
  },
  {
    id: "10",
    type: "login",
    user: "Trainer",
    target: "Vikram Singh",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
  },
];

const activityConfig: Record<
  ActivityItem["type"],
  {
    icon: LucideIcon;
    color: string;
    bg: string;
    label: string;
  }
> = {
  member_created: {
    icon: UserPlus,
    color: "text-neon-green",
    bg: "bg-neon-green/10",
    label: "New member registered",
  },
  payment_received: {
    icon: CreditCard,
    color: "text-gold-400",
    bg: "bg-gold-500/10",
    label: "Payment received",
  },
  check_in: {
    icon: UserCheck,
    color: "text-electric-cyan",
    bg: "bg-electric-cyan/10",
    label: "Member checked in",
  },
  member_updated: {
    icon: Edit3,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    label: "Member details updated",
  },
  member_deleted: {
    icon: Trash2,
    color: "text-crimson",
    bg: "bg-crimson/10",
    label: "Member deleted",
  },
  subscription_expired: {
    icon: AlertCircle,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    label: "Subscription expired",
  },
  subscription_renewed: {
    icon: RefreshCw,
    color: "text-neon-green",
    bg: "bg-neon-green/10",
    label: "Subscription renewed",
  },
  plan_changed: {
    icon: Settings,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    label: "Plan changed",
  },
  login: {
    icon: LogIn,
    color: "text-white/40",
    bg: "bg-white/5",
    label: "User logged in",
  },
  settings_changed: {
    icon: Settings,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    label: "Settings updated",
  },
  member_suspended: {
    icon: Ban,
    color: "text-crimson",
    bg: "bg-crimson/10",
    label: "Member suspended",
  },
};

export function ActivityFeed() {
  return (
    <div className="glass-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <p className="text-xs text-white/30">Latest actions across the system</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/20">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[10px] text-neon-green font-medium">Live</span>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group"
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  config.bg
                )}
              >
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-white/80">
                      <span className="font-medium text-white">{config.label}</span>
                      {activity.target && (
                        <>
                          {" "}
                          — <span className="text-gold-400">{activity.target}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      by <span className="text-white/50">{activity.user}</span>
                    </p>
                  </div>
                  <span className="text-[10px] text-white/20 whitespace-nowrap shrink-0">
                    {formatRelative(activity.timestamp)}
                  </span>
                </div>

                {/* Amount badge for payments */}
                {activity.amount && (
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20">
                    <CreditCard className="w-3 h-3 text-gold-400" />
                    <span className="text-xs font-mono font-medium text-gold-400">
                      ₹{activity.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-xs text-white/20">
          Showing last {activities.length} activities
        </p>
        <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
          View All Logs
        </button>
      </div>
    </div>
  );
}