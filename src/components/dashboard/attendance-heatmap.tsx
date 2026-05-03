"use client";

import { useState, useEffect } from "react";
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

import { getAttendanceHeatmapData } from "@/server/actions/attendance-heatmap-actions";
import { toast } from "sonner";

interface DayData {
  date: string;
  count: number;
  intensity: number; // 0-4
}

const intensityColors = [
  "bg-muted/50 hover:bg-muted",          // 0 - Low
  "bg-primary/20 hover:bg-primary/30",    // 1
  "bg-primary/40 hover:bg-primary/50",    // 2
  "bg-primary/60 hover:bg-primary/70",    // 3
  "bg-primary/80 hover:bg-primary/90",    // 4 - High
];

const intensityLabels = ["< 5", "5-10", "10-20", "20-30", "30+"];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AttendanceHeatmap() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [data, setData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const res = await getAttendanceHeatmapData(year, month);
      if (res?.success && res.data) {
        // Fill in missing days with 0 counts
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthData: DayData[] = [];
        
        for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = new Date(year, month, d).toISOString().split('T')[0];
          const existing = res.data.find(item => item.date.startsWith(dateStr));
          
          if (existing) {
            monthData.push(existing);
          } else {
            monthData.push({
              date: new Date(year, month, d).toISOString(),
              count: 0,
              intensity: 0
            });
          }
        }
        setData(monthData);
      } else {
        toast.error("Failed to load attendance data");
      }
      setIsLoading(false);
    }
    fetchData();
  }, [year, month]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = data.length;

  // Calculate stats
  const totalAttendance = data.reduce((sum, d) => sum + d.count, 0);
  const avgDaily = daysInMonth > 0 ? Math.round(totalAttendance / daysInMonth) : 0;
  const bestDay = data.length > 0 ? data.reduce((max, d) => (d.count > max.count ? d : max), data[0]) : { count: 0 };
  const peakDays = data.filter((d) => d.intensity === 4).length;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const emptyCells = Array(firstDayOfMonth).fill(null);

  return (
    <div className="surface-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Attendance Heatmap</h3>
            <p className="text-xs text-muted-foreground">Daily check-in patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-foreground min-w-[100px] text-center">
            {formatDate(currentDate, "MMMM yyyy")}
          </span>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
          <p className="text-lg font-bold text-foreground">{totalAttendance.toLocaleString()}</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Daily Avg</p>
          <p className="text-lg font-bold text-primary">{avgDaily}</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Peak Days</p>
          <p className="text-lg font-bold text-success">{peakDays}</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Best Day</p>
          <p className="text-lg font-bold text-primary">
            {bestDay.count}
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[10px] text-muted-foreground py-1 font-bold">
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
                "aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative group border border-border/10",
                intensityColors[day.intensity]
              )}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <span
                className={cn(
                  "text-xs font-bold",
                  day.intensity >= 3 ? "text-primary-foreground" : "text-foreground/60"
                )}
              >
                {index + 1}
              </span>

              {/* Tooltip */}
              {hoveredDay?.date === day.date && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 surface-card p-2 rounded-lg whitespace-nowrap shadow-xl border border-primary/20">
                  <p className="text-xs font-bold text-foreground">
                    {formatDate(day.date, "dd MMM yyyy")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-bold">{day.count}</span>
                    <span className="text-[10px] text-muted-foreground">check-ins</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground font-bold">Less</span>
          {intensityColors.map((color, i) => (
            <div
              key={i}
              className={cn("w-4 h-4 rounded shadow-sm", color.split(" ")[0])}
              title={intensityLabels[i]}
            />
          ))}
          <span className="text-[10px] text-muted-foreground font-bold">More</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1 font-bold">
            <Clock className="w-3 h-3" />
            Updated just now
          </span>
        </div>
      </div>
    </div>
  );
}