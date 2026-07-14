"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Clock,
  TrendingUp,
  ChevronRight,
  Play,
  CheckCircle2,
  Calendar,
  Zap,
  Info,
  Flame,
  X,
  Trophy,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { logWorkoutSession } from "@/actions/member/workout-actions";
import { Badge } from "@/components/ui/badge";
import { ActiveSession } from "./active-session";

interface Props {
  data: {
    plans: any[];
    recentLogs: any[];
  };
}

export function WorkoutClient({ data }: Props) {
  const [activeTab, setActiveTab] = useState<"plans" | "history">("plans");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [isLogging, setIsLogging] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartWorkout = (plan: any) => {
    setSelectedPlan(plan);
    setIsWorkoutActive(true);
    setCurrentExerciseIdx(0);
  };

  const handleCompleteWorkout = async () => {
    setIsLogging(true);
    const res = await logWorkoutSession({
      workoutPlanId: selectedPlan.id,
      duration: selectedPlan.estimatedDuration || 45,
      caloriesBurned: 350, // Mocked for now
      feeling: "GREAT",
      completedExercises: selectedPlan.exercises.map((e: any) => ({ id: e.id, completed: true })),
    });

    if (res.success) {
      toast.success("Workout logged! Great job!");
      setIsWorkoutActive(false);
      setSelectedPlan(null);
    } else {
      toast.error(res.error);
    }
    setIsLogging(false);
  };

  if (isWorkoutActive && selectedPlan) {
    return <ActiveSession plan={selectedPlan} onClose={() => setIsWorkoutActive(false)} />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 duration-500 animate-in fade-in slide-in-from-bottom-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-4 font-display text-3xl font-bold tracking-tight text-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
              <Dumbbell className="h-6 w-6 text-brand-orange" />
            </div>
            Training <span className="text-brand-orange">Arena</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-txt-secondary">
            Visualize your growth and crush your goals.
          </p>
        </div>

        <div className="flex rounded-2xl border border-border bg-surface-elevated p-1">
          <button
            onClick={() => setActiveTab("plans")}
            className={cn(
              "rounded-xl px-6 py-2 text-xs font-bold transition-all",
              activeTab === "plans"
                ? "bg-brand-orange text-white shadow-lg"
                : "text-txt-tertiary hover:text-foreground",
            )}
          >
            Assigned Plans
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "rounded-xl px-6 py-2 text-xs font-bold transition-all",
              activeTab === "history"
                ? "bg-brand-orange text-white shadow-lg"
                : "text-txt-tertiary hover:text-foreground",
            )}
          >
            Recent Activity
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "plans" ? (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {data.plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="surface-card group flex flex-col rounded-3xl border border-border/50 p-6 transition-all hover:border-brand-orange/30"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-sunken transition-transform group-hover:scale-110">
                    <Zap
                      className={cn(
                        "h-6 w-6",
                        plan.difficulty === "ADVANCED" ? "text-danger" : "text-brand-orange",
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {plan.memberId && (
                      <Badge className="h-5 border-none bg-brand-orange px-2 text-[8px] font-bold tracking-tighter text-white">
                        TRAINER ASSIGNED
                      </Badge>
                    )}
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                        plan.difficulty === "ADVANCED"
                          ? "bg-danger-soft text-danger"
                          : "bg-success-soft text-success",
                      )}
                    >
                      {plan.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-brand-orange">
                    {plan.name}
                  </h3>
                  <p className="line-clamp-2 min-h-[32px] text-xs text-txt-secondary">
                    {plan.description || "Personalized training program assigned by your coach."}
                  </p>
                </div>

                <div className="my-6 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-surface-sunken p-3">
                    <Clock className="h-4 w-4 text-txt-tertiary" />
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {plan.estimatedDuration || 45}m
                      </p>
                      <p className="text-[8px] uppercase tracking-wider text-txt-tertiary">
                        Duration
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-surface-sunken p-3">
                    <Dumbbell className="h-4 w-4 text-txt-tertiary" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{plan.exercises.length}</p>
                      <p className="text-[8px] uppercase tracking-wider text-txt-tertiary">
                        Exercises
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartWorkout(plan)}
                  className="hover:bg-brand-orange-dark flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 text-sm font-bold text-white shadow-lg shadow-brand-orange/10 transition-all"
                >
                  <Play className="h-4 w-4" />
                  Start Workout
                </button>
              </motion.div>
            ))}

            {data.plans.length === 0 && (
              <div className="surface-card col-span-full rounded-3xl border-2 border-dashed border-border py-20 text-center">
                <Dumbbell className="mx-auto mb-4 h-12 w-12 text-txt-tertiary/20" />
                <h3 className="text-lg font-bold text-foreground">No Plans Assigned</h3>
                <p className="text-sm text-txt-secondary">
                  Talk to your trainer to get your first program.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {data.recentLogs.map((log, idx) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="surface-card flex items-center justify-between rounded-2xl border border-border/50 p-5 transition-all hover:border-brand-orange/30"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-soft">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">{log.workoutPlan.name}</h4>
                    <p className="mt-1 flex items-center gap-2 text-xs text-txt-tertiary">
                      <Calendar className="h-3.5 w-3.5" />
                      {mounted
                        ? new Date(log.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "--"}{" "}
                      • {log.duration} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden flex-col items-end sm:flex">
                    <p className="text-sm font-bold text-foreground">
                      +{log.caloriesBurned || 300}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                      KCAL
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-elevated p-2 text-txt-secondary">
                    <History className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}

            {data.recentLogs.length === 0 && (
              <div className="surface-card rounded-3xl border-2 border-dashed border-border py-20 text-center">
                <History className="mx-auto mb-4 h-12 w-12 text-txt-tertiary/20" />
                <h3 className="text-lg font-bold text-foreground">No Workout History</h3>
                <p className="text-sm text-txt-secondary">
                  Complete your first session to see logs here.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return <Clock className={cn("animate-spin", className)} />;
}
