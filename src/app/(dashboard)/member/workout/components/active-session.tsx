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
  Minus
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
      if (!isPaused) setSessionTime(prev => prev + 1);
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRest = () => {
    setRestTime(currentExercise.rest);
    setIsResting(true);
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    restIntervalRef.current = setInterval(() => {
      setRestTime(prev => {
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
      actualWeight: currentWeight
    };

    setCompletedExercises(prev => {
      const filtered = prev.filter(e => e.id !== currentExercise.id);
      return [...filtered, logEntry];
    });
    
    if (currentIdx < plan.exercises.length - 1) {
      setCurrentIdx(prev => prev + 1);
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
      actualWeight: currentWeight
    };

    const finalExercises = completedExercises.find(e => e.id === currentExercise.id)
      ? completedExercises
      : [...completedExercises, lastEntry];

    const res = await logWorkoutSession({
      workoutPlanId: plan.id,
      duration: Math.floor(sessionTime / 60),
      caloriesBurned: Math.floor(sessionTime / 10),
      feeling: "GREAT",
      completedExercises: finalExercises
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
    <div className="fixed inset-0 z-[100] bg-background flex flex-col p-4 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
        <button 
          onClick={onClose}
          className="p-3 rounded-2xl bg-surface-elevated text-txt-tertiary hover:text-foreground transition-all border border-border/50"
          aria-label="Close session"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-1 animate-pulse">Session Active</p>
          <div className="flex items-center gap-3 justify-center">
            <Timer className="w-4 h-4 text-txt-tertiary" />
            <span className="text-2xl font-display font-bold text-foreground tabular-nums">{formatTime(sessionTime)}</span>
          </div>
        </div>

        <button 
          onClick={() => setIsPaused(!isPaused)}
          className={cn(
            "p-3 rounded-2xl transition-all border border-border/50",
            isPaused ? "bg-brand-orange text-white" : "bg-surface-elevated text-txt-tertiary"
          )}
          aria-label={isPaused ? "Play session" : "Pause session"}
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto w-full mb-12">
        <div className="flex justify-between items-end mb-2">
           <p className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">Progress</p>
           <p className="text-sm font-bold text-foreground">{Math.round(progress)}%</p>
        </div>
        <div className="w-full h-3 bg-surface-sunken rounded-full overflow-hidden border border-border/30 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand-orange rounded-full shadow-[0_0_15px_rgba(242,101,34,0.4)]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentExercise.id}
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            className="w-full surface-card p-8 md:p-12 rounded-[3rem] border border-border/50 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
          >
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Dumbbell className="w-48 h-48 -rotate-12" />
             </div>

             <div className="relative z-10 space-y-2 mb-10">
                <Badge className="bg-brand-orange/10 text-brand-orange border-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
                  Exercise {currentIdx + 1} of {plan.exercises.length}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight uppercase tracking-tight">
                  {currentExercise.name}
                </h2>
                <p className="text-sm text-txt-secondary font-medium tracking-wide">Target: <span className="text-foreground">{currentExercise.muscleGroup || "Compound Movement"}</span></p>
             </div>

             {/* Dynamic Logging Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl relative z-10">
                <div className="p-6 rounded-[2rem] bg-surface-sunken/50 border border-border/50 group hover:border-brand-orange/30 transition-all flex flex-col items-center">
                   <p className="text-xs font-bold text-txt-tertiary uppercase tracking-widest mb-4">Goal Sets</p>
                   <p className="text-5xl font-display font-bold text-foreground">{currentExercise.sets}</p>
                </div>
                
                {/* Reps Counter */}
                <div className="p-6 rounded-[2rem] bg-surface-elevated border border-brand-orange/20 group hover:border-brand-orange/50 transition-all flex flex-col items-center">
                   <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">Actual Reps</p>
                   <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentReps(Math.max(0, currentReps - 1))} aria-label="Decrease reps" className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-foreground hover:bg-brand-orange hover:text-white transition-all"><Minus className="w-4 h-4" /></button>
                      <span className="text-5xl font-display font-bold text-foreground w-12">{currentReps}</span>
                      <button onClick={() => setCurrentReps(currentReps + 1)} aria-label="Increase reps" className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-foreground hover:bg-brand-orange hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
                   </div>
                </div>

                {/* Weight Counter */}
                <div className="p-6 rounded-[2rem] bg-surface-elevated border border-brand-orange/20 group hover:border-brand-orange/50 transition-all flex flex-col items-center">
                   <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">Actual Weight (kg)</p>
                   <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))} aria-label="Decrease weight" className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-foreground hover:bg-brand-orange hover:text-white transition-all"><Minus className="w-4 h-4" /></button>
                      <span className="text-4xl font-display font-bold text-foreground w-20">{currentWeight}</span>
                      <button onClick={() => setCurrentWeight(currentWeight + 2.5)} aria-label="Increase weight" className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-foreground hover:bg-brand-orange hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
                   </div>
                </div>
             </div>

             {/* Rest Timer Overlay */}
             {isResting && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="absolute inset-0 bg-brand-navy/95 z-20 flex flex-col items-center justify-center p-8 backdrop-blur-md"
               >
                  <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                     <svg className="w-full h-full transform -rotate-90">
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
                          animate={{ strokeDashoffset: 440 - (440 * (restTime / currentExercise.rest)) }}
                          className="text-brand-orange"
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-display font-bold text-white tabular-nums">{restTime}</span>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Seconds</span>
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6">Rest Period</h3>
                  <div className="flex gap-4">
                     <button 
                       onClick={() => setIsResting(false)}
                       className="px-8 py-3 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all"
                     >
                       Skip Rest
                     </button>
                     <button 
                       onClick={() => setRestTime(prev => prev + 10)}
                       className="px-8 py-3 rounded-2xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-dark transition-all shadow-lg shadow-brand-orange/20"
                     >
                       +10s
                     </button>
                  </div>
               </motion.div>
             )}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls */}
        <div className="w-full flex items-center gap-6 mt-12">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="w-16 h-16 rounded-3xl bg-surface-elevated flex items-center justify-center text-txt-tertiary hover:text-brand-orange hover:border-brand-orange/30 transition-all border border-border/50 disabled:opacity-20 shadow-lg shadow-black/20"
              aria-label="Previous exercise"
              title="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

           <div className="flex-1 flex gap-4">
               <button 
                 onClick={handleStartRest}
                 disabled={isResting}
                 className="flex-1 h-16 rounded-3xl bg-brand-orange/5 flex items-center justify-center gap-3 text-brand-orange font-bold border border-brand-orange/20 hover:bg-brand-orange hover:text-white transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-brand-orange/5"
               >
                 <Timer className="w-5 h-5" />
                 Start Rest
               </button>

              {currentIdx === plan.exercises.length - 1 ? (
                <button 
                  onClick={handleFinish}
                  disabled={logging}
                  className="flex-[2] h-16 rounded-3xl bg-success text-white font-bold text-lg shadow-xl shadow-success/20 hover:bg-success-dark transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {logging ? <RotateCcw className="w-6 h-6 animate-spin" /> : <Trophy className="w-6 h-6" />}
                  Finish Strong
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="flex-[2] h-16 rounded-3xl bg-brand-orange text-white font-bold text-lg shadow-xl shadow-brand-orange/20 hover:bg-brand-orange-dark transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  Done Set
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
           </div>
        </div>
      </div>
      
      {/* Bottom Info Bar */}
      <div className="mt-8 max-w-4xl mx-auto w-full flex items-center justify-between p-4 rounded-3xl bg-surface-sunken/50 border border-border/30">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
               <Info className="w-5 h-5 text-brand-orange" />
            </div>
            <p className="text-xs text-txt-secondary font-medium">Focus on <span className="text-foreground font-bold">slow eccentrics</span> and explosive concentric movements.</p>
         </div>
         <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-orange" />
            <span className="text-xs font-bold text-foreground">Peak Power</span>
         </div>
      </div>
    </div>
  );
}
