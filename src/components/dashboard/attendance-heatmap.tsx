"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Attendance Heatmap
// ═══════════════════════════════════════════════════════════════

interface DayData {
  date: string;
  count: number;
  intensity: number; // 0-4
}

const generateMockData = (year: number, month: number): DayData[] => {
  const days: DayData[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseCount = isWeekend ? 280 : 180;
    const randomVariation = Math.floor(Math.random() * 120) - 30;
    const count = Math.max(50, baseCount + randomVariation);

    let intensity = 0;
    if (count > 300) intensity = 4;
    else if (count > 250) intensity = 3;
    else if (count > 200) intensity = 2;
    else if (count > 150) intensity = 1;

    days.push({
      date: date.toISOString(),
      count,
      intensity,
    });
  }

  return days;
};

const intensityColors = [
  "bg-white/5 hover:bg-white/10",    // 0 - Low
  "bg-gold-500/20 hover:bg-gold-500/30",  // 1
  "bg-gold-500/40 hover:bg-gold-500/50",  // 2
  "bg-gold-500/60 hover:bg-gold-500/70",  // 3
  "bg-gold-500/80 hover:bg-gold-500/90",  // 4 - High
];

const intensityLabels = ["< 150", "150-200", "200-250", "250-300", "300+"];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AttendanceHeatmap() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const data = generateMockData(year, month);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = data.length;

  // Calculate stats
  const totalAttendance = data.reduce((sum, d) => sum + d.count, 0);
  const avgDaily = Math.round(totalAttendance / daysInMonth);
  const bestDay = data.reduce((max, d) => (d.count > max.count ? d : max), data[0]);
  const peakDays = data.filter((d) => d.intensity === 4).length;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const emptyCells = Array(firstDayOfMonth).fill(null);

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/5 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Attendance Heatmap</h3>
            <p className="text-xs text-white/30">Daily check-in patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-white min-w-[100px] text-center">
            {formatDate(currentDate, "MMMM yyyy")}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white/[0.03] rounded-xl p-3">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Total</p>
          <p className="text-lg font-mono font-bold text-white">{totalAttendance.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Daily Avg</p>
          <p className="text-lg font-mono font-bold text-gold-400">{avgDaily}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Peak Days</p>
          <p className="text-lg font-mono font-bold text-neon-green">{peakDays}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Best Day</p>
          <p className="text-lg font-mono font-bold text-electric-cyan">
            {bestDay.count}
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[10px] text-white/20 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for start of month */}
          {emptyCells.map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-lg" />
          ))}

          {/* Actual days */}
          {data.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative group",
                intensityColors[day.intensity]
              )}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  day.intensity >= 3 ? "text-obsidian-950" : "text-white/60"
                )}
              >
                {index + 1}
              </span>

              {/* Tooltip */}
              {hoveredDay?.date === day.date && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 glass-card p-2 rounded-lg whitespace-nowrap border border-gold-500/20">
                  <p className="text-xs font-medium text-white">
                    {formatDate(day.date, "dd MMM yyyy")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-3 h-3 text-gold-400" />
                    <span className="text-xs text-gold-400 font-mono">{day.count}</span>
                    <span className="text-[10px] text-white/30">check-ins</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/30">Less</span>
          {intensityColors.map((color, i) => (
            <div
              key={i}
              className={cn("w-4 h-4 rounded", color.split(" ")[0])}
              title={intensityLabels[i]}
            />
          ))}
          <span className="text-[10px] text-white/30">More</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-white/20">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated just now
          </span>
        </div>
      </div>
    </div>
  );
}