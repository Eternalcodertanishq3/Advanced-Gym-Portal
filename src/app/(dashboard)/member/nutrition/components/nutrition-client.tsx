"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Droplets,
  Apple,
  ChevronRight,
  Plus,
  X,
  Flame,
  Zap,
  PieChart,
  Utensils,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logWater, logMeal } from "@/actions/member/diet-actions";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Props {
  stats: {
    todayWater: number;
    waterGoal: number;
    recipesCount: number;
    waterLogs?: any[];
    mealLogs?: any[];
  };
  activePlan: any;
  totals: any;
}

export function NutritionClient({ stats, activePlan, totals }: Props) {
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [waterAmount, setWaterAmount] = useState(250);
  const [isLogging, setIsLogging] = useState(false);
  const [currentStats, setCurrentStats] = useState(stats);
  const [mealLogs, setMealLogs] = useState<any[]>(stats.mealLogs || []);
  const [showMealModal, setShowMealModal] = useState(false);
  const [mealData, setMealData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogWater = async () => {
    setIsLogging(true);
    const res = await logWater(waterAmount);
    if (res.success) {
      toast.success(`Logged ${waterAmount}ml of water!`);
      setCurrentStats((prev) => ({
        ...prev,
        todayWater: prev.todayWater + waterAmount,
        waterLogs: [res.data, ...(prev.waterLogs || [])],
      }));
      setShowWaterModal(false);
    } else {
      toast.error("Failed to log water");
    }
    setIsLogging(false);
  };

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealData.name || !mealData.calories) {
      toast.error("Please provide at least a name and calories.");
      return;
    }

    setIsLoggingMeal(true);
    const res = await logMeal({
      name: mealData.name,
      calories: parseInt(mealData.calories),
      protein: mealData.protein ? parseFloat(mealData.protein) : undefined,
      carbs: mealData.carbs ? parseFloat(mealData.carbs) : undefined,
      fats: mealData.fats ? parseFloat(mealData.fats) : undefined,
    });

    if (res.success) {
      toast.success("Meal logged successfully!");
      setShowMealModal(false);
      setMealLogs((prev) => [res.data, ...prev]);
      setMealData({ name: "", calories: "", protein: "", carbs: "", fats: "" });
      // In a real app, we'd trigger a router.refresh() here
    } else {
      toast.error(res.error || "Failed to log meal");
    }
    setIsLoggingMeal(false);
  };

  const waterProgress = Math.min(100, (currentStats.todayWater / currentStats.waterGoal) * 100);

  return (
    <>
      <div className="space-y-10 duration-500 animate-in fade-in">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 font-display text-3xl font-bold uppercase tracking-tight text-foreground">
              Nutrition <span className="text-brand-orange">Command</span>
            </h1>
            <p className="text-sm font-medium text-txt-secondary">
              Precision fueling for peak athletic performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowWaterModal(true)}
              variant="outline"
              className="h-12 rounded-2xl border-border/50 px-6 font-bold transition-all hover:bg-brand-orange/10 hover:text-brand-orange"
            >
              <Droplets className="mr-2 h-4 w-4" />
              Log Water
            </Button>
            <Button
              onClick={() => setShowMealModal(true)}
              className="hover:bg-brand-orange-dark h-12 rounded-2xl bg-brand-orange px-8 font-bold shadow-lg shadow-brand-orange/20 transition-all active:scale-95"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </div>
        </div>

        {/* Macro Overview */}
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <MacroCard
            label="Energy"
            value={totals?.calories?.toLocaleString() || "0"}
            unit="kcal"
            progress={
              activePlan
                ? Math.min(
                    100,
                    Math.floor((totals.calories / (activePlan.totalCalories || 2400)) * 100),
                  )
                : 0
            }
            icon={<Flame className="h-5 w-5 text-brand-orange" />}
            color="orange"
          />
          <MacroCard
            label="Repair"
            value={Math.round(totals?.protein || 0).toString()}
            unit="g"
            progress={activePlan ? Math.min(100, Math.round(totals.protein)) : 0}
            icon={<Zap className="h-5 w-5 text-info" />}
            color="info"
          />
          <MacroCard
            label="Fuel"
            value={Math.round(totals?.carbs || 0).toString()}
            unit="g"
            progress={activePlan ? Math.min(100, Math.round(totals.carbs / 2)) : 0}
            icon={<Apple className="h-5 w-5 text-success" />}
            color="success"
          />
          <MacroCard
            label="Vitality"
            value={Math.round(totals?.fats || 0).toString()}
            unit="g"
            progress={activePlan ? Math.min(100, Math.round(totals.fats)) : 0}
            icon={<Droplets className="h-5 w-5 text-danger" />}
            color="danger"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Daily Protocol Column */}
          <div className="space-y-6 lg:col-span-2">
            <h3 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wider text-foreground">
              <PieChart className="h-6 w-6 text-brand-orange" />
              Daily Protocol
            </h3>

            {!activePlan ? (
              <div className="surface-card flex h-full min-h-[400px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-border/50 px-6 py-16 text-center duration-700 animate-in zoom-in">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
                  <Utensils className="h-10 w-10 text-brand-orange" />
                </div>
                <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
                  No Mission Configured
                </h2>
                <p className="mb-8 max-w-sm text-sm leading-relaxed text-txt-tertiary">
                  Your personalized nutrition strategy hasn't been deployed yet. Contact your squad
                  leader (trainer) to initialize.
                </p>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-border/50 px-8 font-bold"
                >
                  Request Deployment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activePlan.meals.map((meal: any) => (
                  <div
                    key={meal.id}
                    className="surface-card group flex items-center justify-between rounded-[2rem] border border-border/50 p-6 transition-all hover:border-brand-orange/30"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface-sunken transition-transform group-hover:scale-105">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-brand-orange">
                          {meal.time || "AM"}
                        </span>
                        <span className="font-display text-lg font-bold leading-none text-foreground">
                          {meal.calories}
                        </span>
                        <span className="text-[8px] font-bold uppercase text-txt-tertiary">
                          kcal
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground transition-colors group-hover:text-brand-orange">
                          {meal.name}
                        </h4>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                          {meal.protein ? `${meal.protein}g P • ` : ""}
                          {meal.carbs ? `${meal.carbs}g C • ` : ""}
                          {meal.fats ? `${meal.fats}g F` : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      aria-label={`View details for ${meal.name}`}
                      className="rounded-xl border border-border/50 bg-surface-elevated p-3 text-txt-tertiary transition-all hover:text-brand-orange"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tactical Insights Column */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wider text-foreground">
              <Zap className="h-6 w-6 text-brand-orange" />
              Tactical Insights
            </h3>
            <div className="surface-card space-y-8 rounded-[2.5rem] border border-border/50 p-8">
              {/* Hydration Widget */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
                      <Droplets className="h-6 w-6 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Hydration</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                        {currentStats.todayWater}ml / {currentStats.waterGoal}ml
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-brand-orange">
                    {Math.round(waterProgress)}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-border/30 bg-surface-sunken p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${waterProgress}%` }}
                    className="h-full rounded-full bg-brand-orange shadow-[0_0_10px_rgba(242,101,34,0.3)]"
                  />
                </div>

                {/* Hydration Logs */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-txt-tertiary">
                      Hydration Log
                    </p>
                    <p className="text-[10px] font-bold uppercase text-brand-orange">Today</p>
                  </div>
                  <div className="custom-scrollbar max-h-[220px] space-y-2 overflow-y-auto pr-1">
                    {currentStats.waterLogs && currentStats.waterLogs.length > 0 ? (
                      currentStats.waterLogs.map((log: any) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between rounded-xl border border-border/30 bg-surface-sunken p-3 transition-colors hover:border-brand-orange/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-brand-orange" />
                            <span className="text-xs font-bold text-foreground">
                              {log.amount}ml
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-txt-tertiary">
                            {mounted
                              ? new Date(log.date || log.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "--:--"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-[10px] italic text-txt-tertiary">
                        No water logged today
                      </p>
                    )}
                  </div>
                </div>

                {/* Meal Logs */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-txt-tertiary">
                      Daily Meal Feed
                    </p>
                  </div>
                  <div className="custom-scrollbar max-h-[220px] space-y-2 overflow-y-auto pr-1">
                    {mealLogs.length > 0 ? (
                      mealLogs.map((log: any) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between rounded-xl border border-border/30 bg-surface-sunken p-3 transition-colors hover:border-brand-orange/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-success" />
                            <div>
                              <p className="text-xs font-bold text-foreground">{log.name}</p>
                              <p className="text-[9px] font-bold uppercase text-txt-tertiary">
                                {log.calories} kcal
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-medium text-txt-tertiary">
                            {mounted
                              ? new Date(log.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "--:--"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-[10px] italic text-txt-tertiary">
                        No meals logged yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <Link
                  href="/member/nutrition/recipes"
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border/50 bg-surface-sunken p-5 transition-all hover:border-success/30 hover:bg-success/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-success/20 bg-success/10 transition-transform group-hover:scale-105">
                      <Utensils className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Recipe Bank</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                        {currentStats.recipesCount} blueprints available
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-txt-tertiary transition-transform group-hover:translate-x-1 group-hover:text-success" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Logging Modal Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showWaterModal && (
              <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowWaterModal(false)}
                  className="absolute inset-0 bg-black/60"
                />

                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border bg-surface-card p-8 shadow-2xl"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        Log <span className="text-brand-orange">Hydration</span>
                      </h2>
                      <p className="mt-1 text-xs text-txt-tertiary">
                        Track your daily water intake
                      </p>
                    </div>
                    <button
                      onClick={() => setShowWaterModal(false)}
                      title="Close Modal"
                      aria-label="Close Modal"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-txt-tertiary transition-all hover:text-brand-orange"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-8 grid grid-cols-2 gap-4">
                    {[250, 500, 750, 1000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setWaterAmount(amount)}
                        className={cn(
                          "flex flex-col items-center gap-3 rounded-3xl border-2 p-6 transition-all",
                          waterAmount === amount
                            ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-brand-orange/20"
                            : "border-transparent bg-surface-sunken text-txt-secondary hover:border-brand-orange/30",
                        )}
                      >
                        <Droplets
                          className={cn(
                            "h-6 w-6",
                            waterAmount === amount ? "text-white" : "text-txt-tertiary",
                          )}
                        />
                        <span className="font-bold">{amount}ml</span>
                      </button>
                    ))}
                  </div>

                  <div className="mb-8 rounded-[2rem] border border-border/50 bg-surface-sunken p-6 text-center">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange">
                      Selected Intake
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-display text-4xl font-bold text-foreground">
                        {waterAmount}
                      </span>
                      <span className="text-sm font-bold uppercase text-txt-tertiary">ml</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleLogWater}
                    disabled={isLogging}
                    className="hover:bg-brand-orange-dark h-14 w-full rounded-2xl bg-brand-orange font-bold text-white shadow-xl shadow-brand-orange/20 transition-all active:scale-95"
                  >
                    {isLogging ? "Processing..." : "Confirm Intake"}
                  </Button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* Add Meal Modal Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showMealModal && (
              <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMealModal(false)}
                  className="absolute inset-0 bg-black/60"
                />

                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border bg-surface-card p-8 shadow-2xl"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        Log <span className="text-brand-orange">Meal</span>
                      </h2>
                      <p className="mt-1 text-xs text-txt-tertiary">Record your nutrition intake</p>
                    </div>
                    <button
                      onClick={() => setShowMealModal(false)}
                      aria-label="Close modal"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-txt-tertiary transition-all hover:text-brand-orange"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleLogMeal} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                        Meal Name
                      </Label>
                      <Input
                        placeholder="e.g. Grilled Chicken Salad"
                        value={mealData.name}
                        onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                        className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 transition-all focus:bg-surface-sunken"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                          Calories (kcal)
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={mealData.calories}
                          onChange={(e) => setMealData({ ...mealData, calories: e.target.value })}
                          className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 transition-all focus:bg-surface-sunken"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                          Protein (g)
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={mealData.protein}
                          onChange={(e) => setMealData({ ...mealData, protein: e.target.value })}
                          className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 transition-all focus:bg-surface-sunken"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                          Carbs (g)
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={mealData.carbs}
                          onChange={(e) => setMealData({ ...mealData, carbs: e.target.value })}
                          className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 transition-all focus:bg-surface-sunken"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
                          Fats (g)
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={mealData.fats}
                          onChange={(e) => setMealData({ ...mealData, fats: e.target.value })}
                          className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 transition-all focus:bg-surface-sunken"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoggingMeal}
                      className="hover:bg-brand-orange-dark h-14 w-full rounded-2xl bg-brand-orange font-bold text-white shadow-xl shadow-brand-orange/20 transition-all active:scale-95"
                    >
                      {isLoggingMeal ? "Saving Mission Log..." : "Confirm Meal Log"}
                    </Button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function MacroCard({ label, value, unit, progress, icon, color }: any) {
  const colors: any = {
    orange: "bg-brand-orange shadow-[0_0_15px_rgba(242,101,34,0.3)]",
    info: "bg-info shadow-[0_0_15px_rgba(0,186,255,0.3)]",
    success: "bg-success shadow-[0_0_15px_rgba(0,199,134,0.3)]",
    danger: "bg-danger shadow-[0_0_15px_rgba(234,67,53,0.3)]",
  };

  return (
    <div className="surface-card group space-y-6 rounded-[2rem] border border-border/50 p-6 transition-colors hover:border-border">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-surface-sunken transition-transform group-hover:scale-110">
          {icon}
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold tabular-nums text-foreground">
            {value}
            <span className="ml-1 text-xs font-black uppercase text-txt-tertiary">{unit}</span>
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-txt-tertiary">
            {label}
          </p>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full border border-border/30 bg-surface-sunken p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full rounded-full transition-all duration-1000 ${colors[color]}`}
        />
      </div>
    </div>
  );
}
