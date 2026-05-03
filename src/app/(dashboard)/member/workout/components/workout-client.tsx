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
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { logWorkoutSession } from "@/actions/member/workout-actions";
import { Badge } from "@/components/ui/badge";

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
      completedExercises: selectedPlan.exercises.map((e: any) => ({ id: e.id, completed: true }))
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
    const currentExercise = selectedPlan.exercises[currentExerciseIdx];
    const progress = ((currentExerciseIdx + 1) / selectedPlan.exercises.length) * 100;

    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col p-6 animate-in fade-in duration-500">
        {/* Active Mode Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            aria-label="Close active session"
            onClick={() => setIsWorkoutActive(false)}
            className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center border border-border"
          >
            <X className="w-5 h-5 text-txt-secondary" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest">Active Session</p>
            <h3 className="text-lg font-bold text-foreground">{selectedPlan.name}</h3>
          </div>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-surface-sunken rounded-full overflow-hidden mb-12 border border-border/30">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand-orange shadow-brand-glow"
          />
        </div>

        {/* Main Exercise View */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          <motion.div 
            key={currentExercise.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg surface-card p-10 rounded-[3rem] text-center space-y-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Dumbbell className="w-32 h-32" />
            </div>

            <div className="space-y-2 relative z-10">
              <p className="text-brand-orange font-bold text-sm tracking-widest uppercase">Exercise {currentExerciseIdx + 1} of {selectedPlan.exercises.length}</p>
              <h2 className="text-4xl font-display font-bold text-foreground leading-tight uppercase">{currentExercise.name}</h2>
              <p className="text-txt-secondary font-medium">{currentExercise.muscleGroup || "Compound"}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="p-6 rounded-3xl bg-surface-sunken border border-border/50">
                <p className="text-4xl font-display font-bold text-foreground">{currentExercise.sets}</p>
                <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mt-1">Sets</p>
              </div>
              <div className="p-6 rounded-3xl bg-surface-sunken border border-border/50">
                <p className="text-4xl font-display font-bold text-foreground">{currentExercise.reps}</p>
                <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mt-1">Reps / Sec</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-orange/5 border border-brand-orange/10 flex items-center gap-3 justify-center relative z-10">
               <Info className="w-4 h-4 text-brand-orange" />
               <p className="text-xs text-brand-orange/80 font-medium">Rest {currentExercise.rest}s between sets</p>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 w-full max-w-lg">
            <button 
              disabled={currentExerciseIdx === 0}
              onClick={() => setCurrentExerciseIdx(prev => prev - 1)}
              className="flex-1 py-5 rounded-3xl bg-surface-elevated border border-border font-bold text-foreground disabled:opacity-30 transition-all hover:bg-surface-base active:scale-95"
            >
              Previous
            </button>
            {currentExerciseIdx === selectedPlan.exercises.length - 1 ? (
              <button 
                onClick={handleCompleteWorkout}
                disabled={isLogging}
                className="flex-[2] py-5 rounded-3xl bg-success text-white font-bold shadow-lg shadow-success/20 transition-all hover:bg-success-dark active:scale-95 flex items-center justify-center gap-3"
              >
                {isLogging ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5" />}
                Complete Session
              </button>
            ) : (
              <button 
                onClick={() => setCurrentExerciseIdx(prev => prev + 1)}
                className="flex-[2] py-5 rounded-3xl bg-brand-orange text-white font-bold shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange-dark active:scale-95 flex items-center justify-center gap-3"
              >
                Next Exercise
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-display flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-brand-glow">
              <Dumbbell className="w-6 h-6 text-brand-orange" />
            </div>
            Training <span className="text-brand-orange">Arena</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1 font-medium">Visualize your growth and crush your goals.</p>
        </div>
        
        <div className="flex bg-surface-elevated p-1 rounded-2xl border border-border">
          <button 
            onClick={() => setActiveTab("plans")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === "plans" ? "bg-brand-orange text-white shadow-lg" : "text-txt-tertiary hover:text-foreground"
            )}
          >
            Assigned Plans
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === "history" ? "bg-brand-orange text-white shadow-lg" : "text-txt-tertiary hover:text-foreground"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.plans.map((plan, idx) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="surface-card p-6 rounded-3xl border border-border/50 hover:border-brand-orange/30 transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface-sunken flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className={cn("w-6 h-6", plan.difficulty === 'ADVANCED' ? "text-danger" : "text-brand-orange")} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {plan.memberId && (
                      <Badge className="bg-brand-orange text-white border-none text-[8px] h-5 px-2 font-bold tracking-tighter">
                        TRAINER ASSIGNED
                      </Badge>
                    )}
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      plan.difficulty === 'ADVANCED' ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
                    )}>
                      {plan.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-brand-orange transition-colors">{plan.name}</h3>
                  <p className="text-xs text-txt-secondary line-clamp-2 min-h-[32px]">{plan.description || "Personalized training program assigned by your coach."}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 my-6">
                  <div className="p-3 rounded-xl bg-surface-sunken flex items-center gap-3">
                    <Clock className="w-4 h-4 text-txt-tertiary" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{plan.estimatedDuration || 45}m</p>
                      <p className="text-[8px] text-txt-tertiary uppercase tracking-wider">Duration</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-sunken flex items-center gap-3">
                    <Dumbbell className="w-4 h-4 text-txt-tertiary" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{plan.exercises.length}</p>
                      <p className="text-[8px] text-txt-tertiary uppercase tracking-wider">Exercises</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleStartWorkout(plan)}
                  className="w-full py-4 rounded-2xl bg-brand-orange text-white font-bold text-sm shadow-lg shadow-brand-orange/10 hover:bg-brand-orange-dark transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Workout
                </button>
              </motion.div>
            ))}
            
            {data.plans.length === 0 && (
              <div className="col-span-full py-20 text-center surface-card rounded-3xl border-2 border-dashed border-border">
                <Dumbbell className="w-12 h-12 text-txt-tertiary/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground">No Plans Assigned</h3>
                <p className="text-sm text-txt-secondary">Talk to your trainer to get your first program.</p>
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
                className="surface-card p-5 rounded-2xl border border-border/50 hover:border-brand-orange/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-success-soft flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">{log.workoutPlan.name}</h4>
                    <p className="text-xs text-txt-tertiary flex items-center gap-2 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(log.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })} • {log.duration} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <p className="text-sm font-bold text-foreground">+{log.caloriesBurned || 300}</p>
                    <p className="text-[10px] text-txt-tertiary uppercase font-bold tracking-widest">KCAL</p>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-elevated text-txt-secondary">
                    <History className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}

            {data.recentLogs.length === 0 && (
              <div className="py-20 text-center surface-card rounded-3xl border-2 border-dashed border-border">
                <History className="w-12 h-12 text-txt-tertiary/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground">No Workout History</h3>
                <p className="text-sm text-txt-secondary">Complete your first session to see logs here.</p>
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
