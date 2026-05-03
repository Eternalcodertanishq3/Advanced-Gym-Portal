"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Download,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn, formatNumber } from "@/lib/utils";
import { LiveOccupancy } from "@/components/dashboard/live-occupancy";
import { getLiveAttendanceData } from "@/server/actions/live-attendance-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Live Attendance Dashboard
// ═══════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminLiveAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    const res = await getLiveAttendanceData();
    if (res.success) {
      setData(res.data);
    } else {
      toast.error("Failed to update live data");
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Live Attendance</h1>
          <p className="text-muted-foreground mt-1">Monitor real-time gym occupancy and recent check-ins.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold">
            <Download className="w-4 h-4" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Live Occupancy Card */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <LiveOccupancy 
            current={data?.live.current}
            capacity={data?.live.capacity}
            lastHour={data?.live.lastHour}
            peakToday={data?.live.peakToday}
          />
        </motion.div>

        {/* Live Metrics Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Total Unique */}
          <motion.div variants={itemVariants} className="surface-card p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Unique Visitors</p>
                <h3 className="text-3xl font-display font-bold text-foreground">{data?.stats.totalUniqueToday}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-success" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">
                <span className="text-success font-bold">+12%</span> vs yesterday
              </span>
            </div>
          </motion.div>

          {/* Average Stay */}
          <motion.div variants={itemVariants} className="surface-card p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Average Stay</p>
                <h3 className="text-3xl font-display font-bold text-foreground">{data?.stats.averageStayMinutes}m</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Optimal duration: 45-60m</span>
            </div>
          </motion.div>

          {/* Busy Hour Prediction */}
          <motion.div variants={itemVariants} className="md:col-span-2 surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Peak Hour Prediction
              </h4>
              <span className="text-xs text-muted-foreground">Next 24 Hours</span>
            </div>
            <div className="h-24 flex items-end gap-1 px-2">
              {[30, 40, 20, 10, 5, 2, 8, 25, 45, 60, 80, 95, 70, 50, 40, 60, 85, 90, 65, 40, 30, 20, 15, 10].map((h, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 rounded-t-sm transition-all duration-500",
                    i === 17 ? "bg-primary shadow-[0_0_10px_rgba(232,93,38,0.5)]" : "bg-muted/30"
                  )} 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
              <span>6 AM</span>
              <span>12 PM</span>
              <span className="text-primary">6 PM (Peak)</span>
              <span>12 AM</span>
              <span>6 AM</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity Table/Feed */}
      <motion.div variants={itemVariants} className="surface-card">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Recent Check-ins</h3>
              <p className="text-xs text-muted-foreground">Chronological log of today&apos;s entries</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search member..." className="pl-9 h-9 w-[200px] sm:w-[250px] bg-muted/20 border-border/50" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/20">
                <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Member</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plan & Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Time In</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mode</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data?.recentCheckins.map((checkin: any) => (
                <tr key={checkin.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted border border-border overflow-hidden flex-shrink-0">
                        {checkin.avatar ? (
                          <img src={checkin.avatar} alt={checkin.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary font-bold">
                            {checkin.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{checkin.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{checkin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">{checkin.plan}</p>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        checkin.status === 'ACTIVE' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      )}>
                        {checkin.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">
                        {format(new Date(checkin.time), "hh:mm a")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50 px-2 py-1 rounded">
                      {checkin.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5">
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.recentCheckins.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No check-ins recorded today.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-center">
          <Button variant="link" className="text-xs font-bold text-primary uppercase tracking-widest">
            View All History
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
