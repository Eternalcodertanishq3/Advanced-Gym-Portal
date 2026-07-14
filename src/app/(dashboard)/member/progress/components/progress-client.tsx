"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Target,
  Camera,
  Plus,
  ChevronRight,
  Activity,
  Scale,
  Ruler,
  Calendar,
  Zap,
  Info,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addMeasurement, addProgressPhoto } from "@/actions/member/progress-actions";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/portal";
import { formatDate } from "@/lib/utils";

// New Component Imports
import { StatCard } from "./stat-card";
import { MeasurementModal } from "./modals/measurement-modal";
import { PhotoUploadModal } from "./modals/photo-upload-modal";
import { ComparisonTool } from "./comparison-tool";

interface Props {
  data: {
    measurements: any[];
    photos: any[];
    goals: any[];
  };
}

export function ProgressClient({ data }: Props) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as "metrics" | "photos" | "goals" | null;

  const [activeTab, setActiveTab] = useState<"metrics" | "photos" | "goals">(
    initialTab || "metrics",
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Prepare chart data
  const chartData = data.measurements.map((m) => ({
    date: formatDate(m.createdAt, "dd MMM"),
    weight: Number(m.weight),
    bodyFat: Number(m.bodyFat),
  }));

  const latest = data.measurements[data.measurements.length - 1] || {};
  const prev = data.measurements[data.measurements.length - 2] || latest;

  const weightDiff = Number(latest.weight || 0) - Number(prev.weight || 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 duration-500 animate-in fade-in slide-in-from-bottom-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-4 font-display text-3xl font-bold tracking-tight text-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
              <TrendingUp className="h-6 w-6 text-brand-orange" />
            </div>
            Evolution <span className="text-brand-orange">Tracker</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-txt-secondary">
            Your journey in numbers. Every gram counts.
          </p>
        </div>

        <div className="flex rounded-2xl border border-border bg-surface-elevated p-1">
          <button
            onClick={() => setActiveTab("metrics")}
            className={cn(
              "rounded-xl px-6 py-2 text-xs font-bold transition-all",
              activeTab === "metrics"
                ? "bg-brand-orange text-white shadow-lg"
                : "text-txt-tertiary hover:text-foreground",
            )}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={cn(
              "rounded-xl px-6 py-2 text-xs font-bold transition-all",
              activeTab === "photos"
                ? "bg-brand-orange text-white shadow-lg"
                : "text-txt-tertiary hover:text-foreground",
            )}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={cn(
              "rounded-xl px-6 py-2 text-xs font-bold transition-all",
              activeTab === "goals"
                ? "bg-brand-orange text-white shadow-lg"
                : "text-txt-tertiary hover:text-foreground",
            )}
          >
            Goals
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "metrics" ? (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Current Weight"
                value={`${latest.weight || "--"} kg`}
                trend={weightDiff}
                unit="kg"
                icon={<Scale className="h-6 w-6" />}
                color="orange"
              />
              <StatCard
                label="Body Fat"
                value={`${latest.bodyFat || "--"} %`}
                trend={0}
                unit="%"
                icon={<Activity className="h-6 w-6" />}
                color="info"
              />
              <StatCard
                label="Chest"
                value={`${latest.chest || "--"} cm`}
                trend={0}
                unit="cm"
                icon={<Ruler className="h-6 w-6" />}
                color="purple"
              />
              <StatCard
                label="Waist"
                value={`${latest.waist || "--"} cm`}
                trend={0}
                unit="cm"
                icon={<Ruler className="h-6 w-6" />}
                color="success"
              />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="surface-card rounded-[2.5rem] border border-border/50 p-8 lg:col-span-2">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                    <Activity className="h-5 w-5 text-brand-orange" /> Weight Evolution
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-brand-orange" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                        Weight
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F26522" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#F26522" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#666"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#666"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={["dataMin - 2", "dataMax + 2"]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1A1A1A",
                          border: "1px solid #333",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                        itemStyle={{ color: "#F26522" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#F26522"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorWeight)"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Panel: Recent Logs Table */}
              <div className="surface-card flex flex-col rounded-[2.5rem] p-8">
                <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <HistoryIcon className="h-5 w-5 text-brand-orange" /> Log History
                </h3>
                <div className="custom-scrollbar max-h-[350px] flex-1 space-y-4 overflow-y-auto pr-2">
                  {data.measurements
                    .slice()
                    .reverse()
                    .map((m, i) => (
                      <div
                        key={m.id}
                        className="group flex items-center justify-between rounded-2xl border border-border/50 bg-surface-sunken/50 p-4 transition-all hover:border-brand-orange/30"
                      >
                        <div>
                          <p className="text-xs font-bold text-foreground">{m.weight} kg</p>
                          <p className="text-[10px] font-medium text-txt-tertiary">
                            {formatDate(m.createdAt)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-surface-elevated p-2 text-txt-tertiary transition-colors group-hover:text-brand-orange">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="hover:bg-brand-orange-dark mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 text-sm font-bold text-white shadow-lg shadow-brand-orange/10 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  New Measurement
                </button>
              </div>
            </div>
          </motion.div>
        ) : activeTab === "photos" ? (
          <motion.div
            key="photos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between rounded-[2rem] border border-border/50 bg-surface-sunken/50 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
                  <ImageIcon className="h-6 w-6 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Transformation Archive</h3>
                  <p className="text-xs font-medium text-txt-tertiary">
                    Analyze your evolution with our side-by-side comparison engine.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowComparison(true)}
                className="hover:bg-brand-orange-dark h-12 rounded-2xl bg-brand-orange px-8 font-bold shadow-lg shadow-brand-orange/20 transition-all active:scale-95"
              >
                Compare Progress
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div
                onClick={() => setShowPhotoModal(true)}
                className="group flex aspect-[3/4] cursor-pointer flex-col items-center justify-center space-y-4 rounded-[2.5rem] border-2 border-dashed border-border transition-all hover:border-brand-orange/50"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated transition-transform group-hover:scale-110">
                  <Camera className="h-8 w-8 text-txt-tertiary transition-colors group-hover:text-brand-orange" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground">Upload Progress</p>
                  <p className="text-xs text-txt-tertiary">Keep visual track of gains</p>
                </div>
              </div>
              {data.photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="group relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-surface-sunken shadow-xl"
                >
                  <img
                    src={photo.photoUrl}
                    alt="Progress"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                      {photo.photoType}
                    </p>
                    <p className="text-xl font-bold text-white">{photo.weight} kg</p>
                    <p className="text-xs font-medium text-white/60">
                      {formatDate(photo.createdAt)}
                    </p>
                  </div>
                  <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                    {formatDate(photo.createdAt, "MMM yyyy")}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {data.goals.map((goal, idx) => {
              const progress = Math.min(
                (Number(goal.currentValue) / Number(goal.targetValue)) * 100,
                100,
              );
              return (
                <div
                  key={goal.id}
                  className="surface-card group flex flex-col rounded-[2.5rem] border border-border/50 p-8 transition-all hover:border-brand-orange/30"
                >
                  <div className="mb-8 flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
                      <Trophy
                        className={cn(
                          "h-7 w-7",
                          goal.isAchieved ? "text-success" : "text-brand-orange",
                        )}
                      />
                    </div>
                    {goal.isAchieved && (
                      <span className="animate-pulse rounded-full bg-success-soft px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-success">
                        Goal Achieved
                      </span>
                    )}
                  </div>

                  <div className="mb-8 flex-1 space-y-2">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                      {goal.title}
                    </h3>
                    <p className="text-sm font-medium text-txt-secondary">
                      {goal.description || "Specific target set for your fitness journey."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-display text-4xl font-bold text-foreground">
                          {goal.currentValue}{" "}
                          <span className="text-lg font-medium text-txt-tertiary">{goal.unit}</span>
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                          Current Progress
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {goal.targetValue} {goal.unit}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                          Target
                        </p>
                      </div>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full border border-border/30 bg-surface-sunken">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={cn(
                          "h-full shadow-lg",
                          goal.isAchieved
                            ? "bg-success shadow-success/20"
                            : "bg-brand-orange shadow-brand-orange/20",
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-border/30 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                        Ends {goal.deadline ? formatDate(goal.deadline) : "No Deadline"}
                      </p>
                      <p className="flex items-center gap-1 text-xs font-bold text-brand-orange">
                        {Math.round(progress)}% Complete
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="group flex aspect-square cursor-pointer flex-col items-center justify-center space-y-4 rounded-[2.5rem] border-2 border-dashed border-border p-12 transition-all hover:border-brand-orange/50 sm:aspect-auto">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated transition-transform group-hover:scale-110">
                <Plus className="h-8 w-8 text-txt-tertiary transition-colors group-hover:text-brand-orange" />
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground">Set New Goal</p>
                <p className="text-xs text-txt-tertiary">Define your next milestone</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MeasurementModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        latest={latest}
      />

      <PhotoUploadModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        latestWeight={latest.weight}
      />

      {showComparison && (
        <ComparisonTool photos={data.photos} onClose={() => setShowComparison(false)} />
      )}
    </div>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 8v4l3 3" />
      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
  );
}
