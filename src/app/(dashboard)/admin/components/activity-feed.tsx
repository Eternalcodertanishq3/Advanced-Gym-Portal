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
  action: string;
  entityType: string;
  user: string;
  time: string;
  role?: string;
  target?: string;
}

const activityConfig: Record<
  string,
  {
    icon: LucideIcon;
    color: string;
    bg: string;
    label: string;
  }
> = {
  CREATE: {
    icon: UserPlus,
    color: "text-success",
    bg: "bg-success/10",
    label: "Created new",
  },
  UPDATE: {
    icon: Edit3,
    color: "text-primary",
    bg: "bg-primary/10",
    label: "Updated",
  },
  DELETE: {
    icon: Trash2,
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Deleted",
  },
  LOGIN: {
    icon: LogIn,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "User login",
  },
  CHECKIN: {
    icon: UserCheck,
    color: "text-success",
    bg: "bg-success/10",
    label: "Check-in",
  },
};

export function ActivityFeed({ data = [] }: { data?: ActivityItem[] }) {
  const displayActivities = data.length > 0 ? data : [];
  return (
    <div className="surface-card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
            <p className="text-xs text-muted-foreground">Latest actions across the system</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-success font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 space-y-0.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
        {displayActivities.map((activity, index) => {
          const config = activityConfig[activity.action] || activityConfig.UPDATE;
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-all group"
            >
              {/* Icon Container */}
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border/20 shadow-sm",
                  config.bg
                )}
              >
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">
                    <p className="text-[12px] text-foreground/90 leading-tight">
                      <span className="font-bold">{config.label}</span>
                      {" "}
                      <span className="text-muted-foreground lowercase">
                        {activity.entityType}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      by {activity.user}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap shrink-0 opacity-60">
                    {formatRelative(new Date(activity.time))}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Last {displayActivities.length} Events
        </p>
        <button className="text-xs font-bold text-primary hover:underline transition-all">
          View All Logs
        </button>
      </div>
    </div>
  );
}