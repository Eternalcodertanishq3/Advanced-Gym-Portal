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
    <div className="surface-card flex h-full flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <RefreshCw className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
            <p className="text-xs text-muted-foreground">Latest actions across the system</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-1">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-success">Live</span>
        </div>
      </div>

      {/* Activity List */}
      <div className="scrollbar-thin max-h-[380px] flex-1 space-y-0.5 overflow-y-auto pr-1">
        {displayActivities.map((activity, index) => {
          const config = activityConfig[activity.action] || activityConfig.UPDATE;
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="group flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-muted/40"
            >
              {/* Icon Container */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/20 shadow-sm",
                  config.bg,
                )}
              >
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">
                    <p className="text-[12px] leading-tight text-foreground/90">
                      <span className="font-bold">{config.label}</span>{" "}
                      <span className="lowercase text-muted-foreground">{activity.entityType}</span>
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">by {activity.user}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-[9px] font-bold text-muted-foreground opacity-60">
                    {formatRelative(new Date(activity.time))}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Last {displayActivities.length} Events
        </p>
        <button className="text-xs font-bold text-primary transition-all hover:underline">
          View All Logs
        </button>
      </div>
    </div>
  );
}
