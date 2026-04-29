"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  UserCheck,
  ChevronRight,
  Dumbbell,
  Flame,
  Circle,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Upcoming Schedule Widget
// ═══════════════════════════════════════════════════════════════

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: "class" | "pt" | "event";
  trainer?: string;
  room?: string;
  attendees?: number;
  maxCapacity?: number;
  status: "upcoming" | "ongoing" | "completed";
}

const todaySchedule: ScheduleItem[] = [
  {
    id: "1",
    time: "06:00 AM",
    title: "Morning Yoga",
    type: "class",
    trainer: "Priya Sharma",
    room: "Studio A",
    attendees: 18,
    maxCapacity: 25,
    status: "completed",
  },
  {
    id: "2",
    time: "07:30 AM",
    title: "HIIT Blast",
    type: "class",
    trainer: "Rahul Patel",
    room: "Main Floor",
    attendees: 22,
    maxCapacity: 30,
    status: "ongoing",
  },
  {
    id: "3",
    time: "09:00 AM",
    title: "PT Session - Aditya",
    type: "pt",
    trainer: "Vikram Singh",
    room: "PT Zone 2",
    status: "upcoming",
  },
  {
    id: "4",
    time: "10:30 AM",
    title: "Zumba Dance",
    type: "class",
    trainer: "Neha Gupta",
    room: "Studio B",
    attendees: 15,
    maxCapacity: 20,
    status: "upcoming",
  },
  {
    id: "5",
    time: "05:00 PM",
    title: "CrossFit Training",
    type: "class",
    trainer: "Rahul Patel",
    room: "Main Floor",
    attendees: 28,
    maxCapacity: 30,
    status: "upcoming",
  },
  {
    id: "6",
    time: "07:00 PM",
    title: "Spinning Class",
    type: "class",
    trainer: "Amit Kumar",
    room: "Cardio Zone",
    attendees: 12,
    maxCapacity: 20,
    status: "upcoming",
  },
];

const statusConfig = {
  completed: {
    icon: Circle,
    color: "text-white/20",
    bg: "bg-white/5",
    label: "Done",
  },
  ongoing: {
    icon: Flame,
    color: "text-neon-green",
    bg: "bg-neon-green/10",
    label: "Live",
  },
  upcoming: {
    icon: Clock,
    color: "text-gold-400",
    bg: "bg-gold-500/10",
    label: "Upcoming",
  },
};

const typeConfig = {
  class: { icon: Dumbbell, label: "Class" },
  pt: { icon: UserCheck, label: "PT Session" },
  event: { icon: Calendar, label: "Event" },
};

export function UpcomingSchedule() {
  const today = new Date();

  return (
    <div className="glass-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-cyan/20 to-electric-cyan/5 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-electric-cyan" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Today&apos;s Schedule</h3>
            <p className="text-xs text-white/30">{formatDate(today, "EEEE, dd MMM")}</p>
          </div>
        </div>
        <Link
          href="/admin/classes"
          className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition-colors"
        >
          View All
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-white/5" />

        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
          {todaySchedule.map((item, index) => {
            const status = statusConfig[item.status];
            const type = typeConfig[item.type];
            const StatusIcon = status.icon;
            const TypeIcon = type.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative flex items-start gap-3 pl-2 py-2 rounded-xl transition-all duration-200",
                  item.status === "ongoing" && "bg-neon-green/5 border border-neon-green/10",
                  item.status === "upcoming" && "hover:bg-white/5"
                )}
              >
                {/* Status dot */}
                <div
                  className={cn(
                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    status.bg
                  )}
                >
                  <StatusIcon className={cn("w-4 h-4", status.color)} />
                  {item.status === "ongoing" && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-neon-green/20" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn("text-xs font-mono font-medium", status.color)}>
                      {item.time}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        status.bg,
                        status.color
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-white/30">
                      <TypeIcon className="w-3 h-3" />
                      {type.label}
                    </span>
                    {item.trainer && (
                      <span className="flex items-center gap-1 text-[10px] text-white/30">
                        <UserCheck className="w-3 h-3" />
                        {item.trainer}
                      </span>
                    )}
                    {item.room && (
                      <span className="text-[10px] text-white/20">{item.room}</span>
                    )}
                  </div>
                  {item.attendees !== undefined && item.maxCapacity && (
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-white/30">
                          {item.attendees}/{item.maxCapacity} booked
                        </span>
                        <span
                          className={cn(
                            item.attendees / item.maxCapacity > 0.9
                              ? "text-crimson"
                              : "text-neon-green"
                          )}
                        >
                          {Math.round((item.attendees / item.maxCapacity) * 100)}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.attendees / item.maxCapacity > 0.9
                              ? "bg-crimson"
                              : "bg-neon-green"
                          )}
                          style={{
                            width: `${(item.attendees / item.maxCapacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer summary */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-mono font-bold text-white">6</p>
            <p className="text-[10px] text-white/30">Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-mono font-bold text-neon-green">1</p>
            <p className="text-[10px] text-white/30">Live</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-mono font-bold text-gold-400">4</p>
            <p className="text-[10px] text-white/30">Upcoming</p>
          </div>
        </div>
        <Link
          href="/admin/classes/schedules"
          className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          Manage
        </Link>
      </div>
    </div>
  );
}