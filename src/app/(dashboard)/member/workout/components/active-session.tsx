"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Clock,
  Dumbbell,
  CheckCircle2,
  History,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Info,
  Plus,
  Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logWorkoutSession } from "@/actions/member/workout-actions";
import { Badge } from "@/components/ui/badge";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  rest: number;
  muscleGroup: string | null;
}

interface Plan {
  id: string;
  name: string;
  estimatedDuration: number;
  exercises: Exercise[];
}

interface Props {
  plan: Plan;
  onClose: () => void;
}

export function ActiveSession({ plan, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<any[]>([]);
  const [logging, setLogging] = useState(false);

  // Rest Timer State
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentExercise = plan.exercises[currentIdx];
  const progress = ((currentIdx + 1) / plan.exercises.length) * 100;

  // Performance State
  const [currentReps, setCurrentReps] = useState(currentExercise.reps);
  const [currentWeight, setCurrentWeight] = useState(currentExercise.weight || 0);

  // Session Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Update inputs when exercise changes
  useEffect(() => {
    setCurrentReps(currentExercise.reps);
    setCurrentWeight(currentExercise.weight || 0);
  }, [currentIdx, currentExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRest = () => {
    setRestTime(currentExercise.rest);
    setIsResting(true);
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    restIntervalRef.current = setInterval(() => {
      setRestTime((prev) => {
        if (prev <= 1) {
          if (restIntervalRef.current) clearInterval(restIntervalRef.current);
          setIsResting(false);
          toast.info("Rest over! Get back to it!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleNext = () => {
    const logEntry = {
      id: currentExercise.id,
      completed: true,
      actualReps: currentReps,
      actualWeight: currentWeight,
    };

    setCompletedExercises((prev) => {
      const filtered = prev.filter((e) => e.id !== currentExercise.id);
      return [...filtered, logEntry];
    });

    if (currentIdx < plan.exercises.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setIsResting(false);
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    }
  };

  const handleFinish = async () => {
    setLogging(true);

    const lastEntry = {
      id: currentExercise.id,
      completed: true,
      actualReps: currentReps,
      actualWeight: currentWeight,
    };

    const finalExercises = completedExercises.find((e) => e.id === currentExercise.id)
      ? completedExercises
      : [...completedExercises, lastEntry];

    const res = await logWorkoutSession({
      workoutPlanId: plan.id,
      duration: Math.floor(sessionTime / 60),
      caloriesBurned: Math.floor(sessionTime / 10),
      feeling: "GREAT",
      completedExercises: finalExercises,
    });

    if (res.success) {
      toast.success("Workout masterpiece complete!");
      onClose();
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to log workout");
    }
    setLogging(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background p-4 md:p-8">
      {/* Header */}
      <div className="mx-auto mb-8 flex w-full max-w-4xl items-center justify-between">
        <button
          onClick={onClose}
          className="rounded-2xl border border-border/50 bg-surface-elevated p-3 text-txt-tertiary transition-all hover:text-foreground"
          aria-label="Close session"
          title="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          <p className="mb-1 animate-pulse text-[10px] font-bold uppercase tracking-widest text-brand-orange">
            Session Active
          </p>
          <div className="flex items-center justify-center gap-3">
            <Timer className="h-4 w-4 text-txt-tertiary" />
            <span className="font-display text-2xl font-bold tabular-nums text-foreground">
              {formatTime(sessionTime)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className={cn(
            "rounded-2xl border border-border/50 p-3 transition-all",
            isPaused ? "bg-brand-orange text-white" : "bg-surface-elevated text-txt-tertiary",
          )}
          aria-label={isPaused ? "Play session" : "Pause session"}
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mx-auto mb-12 w-full max-w-4xl">
        <div className="mb-2 flex items-end justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">Progress</p>
          <p className="text-sm font-bold text-foreground">{Math.round(progress)}%</p>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-border/30 bg-surface-sunken p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-brand-orange shadow-[0_0_15px_rgba(242,101,34,0.4)]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            className="surface-card relative flex w-full flex-col items-center overflow-hidden rounded-[3rem] border border-border/50 p-8 text-center shadow-2xl md:p-12"
          >
            {/* Background Decoration */}
            <div className="absolute right-0 top-0 p-12 opacity-5">
              <Dumbbell className="h-48 w-48 -rotate-12" />
            </div>

            <div className="relative z-10 mb-10 space-y-2">
              <Badge className="mb-4 border-none bg-brand-orange/10 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                Exercise {currentIdx + 1} of {plan.exercises.length}
              </Badge>
              <h2 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-5xl">
                {currentExercise.name}
              </h2>
              <p className="text-sm font-medium tracking-wide text-txt-secondary">
                Target:{" "}
                <span className="text-foreground">
                  {currentExercise.muscleGroup || "Compound Movement"}
                </span>
              </p>
            </div>

            {/* Dynamic Logging Stats */}
            <div className="relative z-10 grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group flex flex-col items-center rounded-[2rem] border border-border/50 bg-surface-sunken/50 p-6 transition-all hover:border-brand-orange/30">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                  Goal Sets
                </p>
                <p className="font-display text-5xl font-bold text-foreground">
                  {currentExercise.sets}
                </p>
              </div>

              {/* Reps Counter */}
              <div className="group flex flex-col items-center rounded-[2rem] border border-brand-orange/20 bg-surface-elevated p-6 transition-all hover:border-brand-orange/50">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-orange">
                  Actual Reps
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                    aria-label="Decrease reps"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-sunken text-foreground transition-all hover:bg-brand-orange hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 font-display text-5xl font-bold text-foreground">
                    {currentReps}
                  </span>
                  <button
                    onClick={() => setCurrentReps(currentReps + 1)}
                    aria-label="Increase reps"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-sunken text-foreground transition-all hover:bg-brand-orange hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Weight Counter */}
              <div className="group flex flex-col items-center rounded-[2rem] border border-brand-orange/20 bg-surface-elevated p-6 transition-all hover:border-brand-orange/50">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-orange">
                  Actual Weight (kg)
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))}
                    aria-label="Decrease weight"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-sunken text-foreground transition-all hover:bg-brand-orange hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-20 font-display text-4xl font-bold text-foreground">
                    {currentWeight}
                  </span>
                  <button
                    onClick={() => setCurrentWeight(currentWeight + 2.5)}
                    aria-label="Increase weight"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-sunken text-foreground transition-all hover:bg-brand-orange hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rest Timer Overlay */}
            {isResting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-brand-navy/95 p-8 backdrop-blur-md"
              >
                <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="440"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: 440 - 440 * (restTime / currentExercise.rest) }}
                      className="text-brand-orange"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-5xl font-bold tabular-nums text-white">
                      {restTime}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      Seconds
                    </span>
                  </div>
                </div>
                <h3 className="mb-6 text-2xl font-bold text-white">Rest Period</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsResting(false)}
                    className="rounded-2xl bg-white/10 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white/20"
                  >
                    Skip Rest
                  </button>
                  <button
                    onClick={() => setRestTime((prev) => prev + 10)}
                    className="hover:bg-brand-orange-dark rounded-2xl bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 transition-all"
                  >
                    +10s
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls */}
        <div className="mt-12 flex w-full items-center gap-6">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((prev) => prev - 1)}
            className="flex h-16 w-16 items-center justify-center rounded-3xl border border-border/50 bg-surface-elevated text-txt-tertiary shadow-lg shadow-black/20 transition-all hover:border-brand-orange/30 hover:text-brand-orange disabled:opacity-20"
            aria-label="Previous exercise"
            title="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="flex flex-1 gap-4">
            <button
              onClick={handleStartRest}
              disabled={isResting}
              className="flex h-16 flex-1 items-center justify-center gap-3 rounded-3xl border border-brand-orange/20 bg-brand-orange/5 font-bold text-brand-orange shadow-lg shadow-brand-orange/5 transition-all hover:bg-brand-orange hover:text-white active:scale-95 disabled:opacity-50"
            >
              <Timer className="h-5 w-5" />
              Start Rest
            </button>

            {currentIdx === plan.exercises.length - 1 ? (
              <button
                onClick={handleFinish}
                disabled={logging}
                className="flex h-16 flex-[2] items-center justify-center gap-3 rounded-3xl bg-success text-lg font-bold text-white shadow-xl shadow-success/20 transition-all hover:bg-success-dark active:scale-95"
              >
                {logging ? (
                  <RotateCcw className="h-6 w-6 animate-spin" />
                ) : (
                  <Trophy className="h-6 w-6" />
                )}
                Finish Strong
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="hover:bg-brand-orange-dark flex h-16 flex-[2] items-center justify-center gap-3 rounded-3xl bg-brand-orange text-lg font-bold text-white shadow-xl shadow-brand-orange/20 transition-all active:scale-95"
              >
                Done Set
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="mx-auto mt-8 flex w-full max-w-4xl items-center justify-between rounded-3xl border border-border/30 bg-surface-sunken/50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
            <Info className="h-5 w-5 text-brand-orange" />
          </div>
          <p className="text-xs font-medium text-txt-secondary">
            Focus on <span className="font-bold text-foreground">slow eccentrics</span> and
            explosive concentric movements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand-orange" />
          <span className="text-xs font-bold text-foreground">Peak Power</span>
        </div>
      </div>
    </div>
  );
}
