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
  Utensils
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
  const [mealData, setMealData] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "" });
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
      setCurrentStats(prev => ({ 
        ...prev, 
        todayWater: prev.todayWater + waterAmount,
        waterLogs: [res.data, ...(prev.waterLogs || [])]
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
      setMealLogs(prev => [res.data, ...prev]);
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
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-1 uppercase tracking-tight">
              Nutrition <span className="text-brand-orange">Command</span>
            </h1>
            <p className="text-sm text-txt-secondary font-medium">Precision fueling for peak athletic performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowWaterModal(true)}
              variant="outline" 
              className="rounded-2xl border-border/50 font-bold h-12 px-6 hover:bg-brand-orange/10 hover:text-brand-orange transition-all"
            >
              <Droplets className="w-4 h-4 mr-2" />
              Log Water
            </Button>
            <Button 
              onClick={() => setShowMealModal(true)}
              className="bg-brand-orange hover:bg-brand-orange-dark font-bold px-8 h-12 rounded-2xl shadow-lg shadow-brand-orange/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Meal
            </Button>
          </div>
        </div>

        {/* Macro Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <MacroCard 
            label="Energy" 
            value={totals?.calories?.toLocaleString() || "0"} 
            unit="kcal" 
            progress={activePlan ? Math.min(100, Math.floor((totals.calories / (activePlan.totalCalories || 2400)) * 100)) : 0}
            icon={<Flame className="w-5 h-5 text-brand-orange" />}
            color="orange"
          />
          <MacroCard 
            label="Repair" 
            value={Math.round(totals?.protein || 0).toString()} 
            unit="g" 
            progress={activePlan ? Math.min(100, Math.round(totals.protein)) : 0}
            icon={<Zap className="w-5 h-5 text-info" />}
            color="info"
          />
          <MacroCard 
            label="Fuel" 
            value={Math.round(totals?.carbs || 0).toString()} 
            unit="g" 
            progress={activePlan ? Math.min(100, Math.round(totals.carbs / 2)) : 0}
            icon={<Apple className="w-5 h-5 text-success" />}
            color="success"
          />
          <MacroCard 
            label="Vitality" 
            value={Math.round(totals?.fats || 0).toString()} 
            unit="g" 
            progress={activePlan ? Math.min(100, Math.round(totals.fats)) : 0}
            icon={<Droplets className="w-5 h-5 text-danger" />}
            color="danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Protocol Column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-display font-bold text-foreground flex items-center gap-3 uppercase tracking-wider">
              <PieChart className="w-6 h-6 text-brand-orange" />
              Daily Protocol
            </h3>
            
            {!activePlan ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 surface-card rounded-[3rem] border border-dashed border-border/50 text-center animate-in zoom-in duration-700 h-full min-h-[400px]">
                <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 mb-6 shadow-brand-glow">
                  <Utensils className="w-10 h-10 text-brand-orange" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">No Mission Configured</h2>
                <p className="text-sm text-txt-tertiary max-w-sm mb-8 leading-relaxed">
                  Your personalized nutrition strategy hasn't been deployed yet. Contact your squad leader (trainer) to initialize.
                </p>
                <Button variant="outline" className="border-border/50 h-12 px-8 rounded-2xl font-bold">Request Deployment</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activePlan.meals.map((meal: any) => (
                  <div key={meal.id} className="surface-card p-6 rounded-[2rem] group hover:border-brand-orange/30 transition-all flex items-center justify-between border border-border/50">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-surface-sunken flex flex-col items-center justify-center border border-border/50 group-hover:scale-105 transition-transform">
                        <span className="text-[10px] font-black text-brand-orange uppercase tracking-tighter">{meal.time || "AM"}</span>
                        <span className="text-lg font-display font-bold text-foreground leading-none">{meal.calories}</span>
                        <span className="text-[8px] font-bold text-txt-tertiary uppercase">kcal</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground group-hover:text-brand-orange transition-colors">{meal.name}</h4>
                        <p className="text-xs text-txt-tertiary font-bold uppercase tracking-widest mt-1">
                          {meal.protein ? `${meal.protein}g P • ` : ""}
                          {meal.carbs ? `${meal.carbs}g C • ` : ""}
                          {meal.fats ? `${meal.fats}g F` : ""}
                        </p>
                      </div>
                    </div>
                    <button 
                      aria-label={`View details for ${meal.name}`}
                      className="p-3 rounded-xl bg-surface-elevated text-txt-tertiary hover:text-brand-orange transition-all border border-border/50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tactical Insights Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold text-foreground flex items-center gap-3 uppercase tracking-wider">
              <Zap className="w-6 h-6 text-brand-orange" />
              Tactical Insights
            </h3>
            <div className="surface-card p-8 rounded-[2.5rem] space-y-8 border border-border/50">
              {/* Hydration Widget */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                        <Droplets className="w-6 h-6 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Hydration</p>
                        <p className="text-[10px] text-txt-tertiary font-bold uppercase tracking-widest">{currentStats.todayWater}ml / {currentStats.waterGoal}ml</p>
                      </div>
                   </div>
                   <span className="text-xs font-black text-brand-orange">{Math.round(waterProgress)}%</span>
                </div>
                <div className="h-2.5 w-full bg-surface-sunken rounded-full overflow-hidden border border-border/30 p-0.5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${waterProgress}%` }}
                     className="h-full bg-brand-orange rounded-full shadow-[0_0_10px_rgba(242,101,34,0.3)]"
                   />
                </div>

                {/* Hydration Logs */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-[0.2em]">Hydration Log</p>
                    <p className="text-[10px] font-bold text-brand-orange uppercase">Today</p>
                  </div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {currentStats.waterLogs && currentStats.waterLogs.length > 0 ? (
                      currentStats.waterLogs.map((log: any) => (
                        <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-sunken border border-border/30 hover:border-brand-orange/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand-orange" />
                            <span className="text-xs font-bold text-foreground">{log.amount}ml</span>
                          </div>
                          <span className="text-[10px] text-txt-tertiary font-medium">
                            {mounted ? new Date(log.date || log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-txt-tertiary italic text-center py-4">No water logged today</p>
                    )}
                  </div>
                </div>

                {/* Meal Logs */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-[0.2em]">Daily Meal Feed</p>
                  </div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {mealLogs.length > 0 ? (
                      mealLogs.map((log: any) => (
                        <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-sunken border border-border/30 hover:border-brand-orange/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <div>
                                <p className="text-xs font-bold text-foreground">{log.name}</p>
                                <p className="text-[9px] text-txt-tertiary font-bold uppercase">{log.calories} kcal</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-txt-tertiary font-medium">
                            {mounted ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-txt-tertiary italic text-center py-4">No meals logged yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <Link 
                  href="/member/nutrition/recipes"
                  className="p-5 rounded-2xl bg-surface-sunken border border-border/50 flex items-center justify-between group cursor-pointer hover:border-success/30 hover:bg-success/5 transition-all"
                 >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center border border-success/20 group-hover:scale-105 transition-transform">
                      <Utensils className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Recipe Bank</p>
                      <p className="text-[10px] text-txt-tertiary font-bold uppercase tracking-widest">{currentStats.recipesCount} blueprints available</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-txt-tertiary group-hover:text-success transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Logging Modal Portal */}
      {mounted && createPortal(
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
                className="relative w-full max-w-md bg-surface-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">Log <span className="text-brand-orange">Hydration</span></h2>
                    <p className="text-xs text-txt-tertiary mt-1">Track your daily water intake</p>
                  </div>
                  <button 
                    onClick={() => setShowWaterModal(false)}
                    title="Close Modal"
                    aria-label="Close Modal"
                    className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-txt-tertiary hover:text-brand-orange transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[250, 500, 750, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setWaterAmount(amount)}
                      className={cn(
                        "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3",
                        waterAmount === amount 
                          ? "bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20" 
                          : "bg-surface-sunken border-transparent text-txt-secondary hover:border-brand-orange/30"
                      )}
                    >
                      <Droplets className={cn("w-6 h-6", waterAmount === amount ? "text-white" : "text-txt-tertiary")} />
                      <span className="font-bold">{amount}ml</span>
                    </button>
                  ))}
                </div>

                <div className="bg-surface-sunken rounded-[2rem] p-6 mb-8 border border-border/50 text-center">
                  <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mb-2">Selected Intake</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold text-foreground">{waterAmount}</span>
                    <span className="text-sm font-bold text-txt-tertiary uppercase">ml</span>
                  </div>
                </div>

                <Button 
                  onClick={handleLogWater}
                  disabled={isLogging}
                  className="w-full h-14 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-2xl shadow-xl shadow-brand-orange/20 transition-all active:scale-95"
                >
                  {isLogging ? "Processing..." : "Confirm Intake"}
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Add Meal Modal Portal */}
      {mounted && createPortal(
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
                className="relative w-full max-w-md bg-surface-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">Log <span className="text-brand-orange">Meal</span></h2>
                    <p className="text-xs text-txt-tertiary mt-1">Record your nutrition intake</p>
                  </div>
                  <button 
                    onClick={() => setShowMealModal(false)}
                    aria-label="Close modal"
                    className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-txt-tertiary hover:text-brand-orange transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleLogMeal} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest ml-1">Meal Name</Label>
                    <Input 
                      placeholder="e.g. Grilled Chicken Salad" 
                      value={mealData.name}
                      onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                      className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 focus:bg-surface-sunken transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest ml-1">Calories (kcal)</Label>
                      <Input 
                        type="number"
                        placeholder="0" 
                        value={mealData.calories}
                        onChange={(e) => setMealData({ ...mealData, calories: e.target.value })}
                        className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 focus:bg-surface-sunken transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest ml-1">Protein (g)</Label>
                      <Input 
                        type="number"
                        placeholder="0" 
                        value={mealData.protein}
                        onChange={(e) => setMealData({ ...mealData, protein: e.target.value })}
                        className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 focus:bg-surface-sunken transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest ml-1">Carbs (g)</Label>
                      <Input 
                        type="number"
                        placeholder="0" 
                        value={mealData.carbs}
                        onChange={(e) => setMealData({ ...mealData, carbs: e.target.value })}
                        className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 focus:bg-surface-sunken transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest ml-1">Fats (g)</Label>
                      <Input 
                        type="number"
                        placeholder="0" 
                        value={mealData.fats}
                        onChange={(e) => setMealData({ ...mealData, fats: e.target.value })}
                        className="h-12 rounded-2xl border-border/50 bg-surface-sunken/50 focus:bg-surface-sunken transition-all"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isLoggingMeal}
                    className="w-full h-14 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-2xl shadow-xl shadow-brand-orange/20 transition-all active:scale-95"
                  >
                    {isLoggingMeal ? "Saving Mission Log..." : "Confirm Meal Log"}
                  </Button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function MacroCard({ label, value, unit, progress, icon, color }: any) {
  const colors: any = {
    orange: "bg-brand-orange shadow-[0_0_15px_rgba(242,101,34,0.3)]",
    info: "bg-info shadow-[0_0_15px_rgba(0,186,255,0.3)]",
    success: "bg-success shadow-[0_0_15px_rgba(0,199,134,0.3)]",
    danger: "bg-danger shadow-[0_0_15px_rgba(234,67,53,0.3)]"
  };

  return (
    <div className="surface-card p-6 rounded-[2rem] space-y-6 border border-border/50 group hover:border-border transition-colors">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-surface-sunken flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-bold text-foreground tabular-nums">
            {value}<span className="text-xs font-black text-txt-tertiary ml-1 uppercase">{unit}</span>
          </p>
          <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-[0.2em]">{label}</p>
        </div>
      </div>
      <div className="h-2 w-full bg-surface-sunken rounded-full overflow-hidden border border-border/30 p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full rounded-full transition-all duration-1000 ${colors[color]}`} 
        />
      </div>
    </div>
  );
}
