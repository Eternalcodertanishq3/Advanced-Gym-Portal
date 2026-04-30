"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Utensils, 
  Clock, 
  PieChart, 
  ChevronRight, 
  Apple, 
  Beef, 
  Bean, 
  Droplets,
  Zap,
  Info,
  Calendar,
  ChevronDown,
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  plans: any[];
}

export function DietClient({ plans }: Props) {
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const activePlan = plans[selectedPlanIdx];

  if (!activePlan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Utensils className="w-16 h-16 text-txt-tertiary/20 mb-4" />
        <h2 className="text-xl font-bold text-foreground">No Diet Plan Assigned</h2>
        <p className="text-sm text-txt-secondary mt-2">Consult your trainer to receive a personalized nutrition guide.</p>
      </div>
    );
  }

  // Calculate totals for macros
  const totalMacros = activePlan.meals.reduce((acc: any, meal: any) => ({
    protein: acc.protein + (Number(meal.protein) || 0),
    carbs: acc.carbs + (Number(meal.carbs) || 0),
    fats: acc.fats + (Number(meal.fats) || 0),
    calories: acc.calories + (meal.calories || 0)
  }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto p-4 md:p-8">
      {/* Header & Plan Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-display flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-brand-glow">
              <Utensils className="w-6 h-6 text-brand-orange" />
            </div>
            Nutrition <span className="text-brand-orange">Command</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1 font-medium">Fueled for performance. Tracked for results.</p>
        </div>

        {plans.length > 1 && (
          <div className="relative group">
            <select 
              aria-label="Select diet plan"
              value={selectedPlanIdx}
              onChange={(e) => setSelectedPlanIdx(Number(e.target.value))}
              className="appearance-none bg-surface-elevated border border-border rounded-2xl px-6 py-3 pr-12 text-sm font-bold text-foreground outline-none focus:border-brand-orange/50 transition-all cursor-pointer"
            >
              {plans.map((p, i) => (
                <option key={p.id} value={i}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary pointer-events-none" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Daily Meal Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card rounded-[2.5rem] p-8 border border-border/50">
            <h2 className="text-xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-brand-orange" />
              Daily Meal Schedule
            </h2>

            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border/30">
              {activePlan.meals.map((meal: any, idx: number) => (
                <motion.div 
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-12 group"
                >
                  {/* Time Indicator */}
                  <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-surface-sunken border border-border flex items-center justify-center z-10 group-hover:border-brand-orange/50 transition-colors">
                    <Clock className="w-4 h-4 text-txt-tertiary group-hover:text-brand-orange transition-colors" />
                  </div>

                  <div className="surface-card p-6 rounded-3xl bg-surface-sunken/30 border border-border/50 group-hover:border-brand-orange/20 transition-all shadow-sm hover:shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em] mb-1">{meal.time}</p>
                        <h3 className="text-xl font-bold text-foreground">{meal.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-txt-tertiary">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated">
                          <Zap className="w-3.5 h-3.5 text-warning" />
                          {meal.calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <MacroMini label="Prot" value={`${meal.protein}g`} icon={Beef} color="danger" />
                      <MacroMini label="Carbs" value={`${meal.carbs}g`} icon={Bean} color="info" />
                      <MacroMini label="Fats" value={`${meal.fats}g`} icon={Droplets} color="warning" />
                      <MacroMini label="Fiber" value={`${meal.fiber || 0}g`} icon={Apple} color="success" />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border/30">
                       <p className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">Ingredients / Items</p>
                       <ul className="flex flex-wrap gap-2">
                         {meal.items.map((item: string, i: number) => (
                           <li key={i} className="px-3 py-1.5 rounded-xl bg-surface-elevated text-xs font-medium text-foreground border border-border/50">
                             {item}
                           </li>
                         ))}
                       </ul>
                    </div>

                    {meal.notes && (
                      <div className="mt-4 p-3 rounded-xl bg-brand-orange/5 border border-brand-orange/10 flex items-start gap-3">
                        <Info className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        <p className="text-[11px] text-brand-orange/80 font-medium leading-relaxed">{meal.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Macros Summary */}
        <div className="space-y-6">
          <div className="surface-card p-8 rounded-[2.5rem] space-y-8">
            <h3 className="text-lg font-display font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-5 h-5 text-brand-orange" /> Macro Distribution
            </h3>

            <div className="space-y-6">
               <MacroBar label="Protein" value={totalMacros.protein} total={250} color="bg-danger" unit="g" />
               <MacroBar label="Carbohydrates" value={totalMacros.carbs} total={300} color="bg-info" unit="g" />
               <MacroBar label="Fats" value={totalMacros.fats} total={80} color="bg-warning" unit="g" />
            </div>

            <div className="pt-6 border-t border-border/50">
               <div className="flex justify-between items-end">
                 <div>
                   <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-[0.2em] mb-1">Total Daily Budget</p>
                   <p className="text-4xl font-display font-bold text-foreground">{totalMacros.calories}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-success flex items-center gap-1 justify-end">
                     <Zap className="w-3.5 h-3.5" /> Optimal
                   </p>
                   <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mt-1">Calories / Day</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="surface-card p-8 rounded-[2.5rem] bg-brand-orange-soft/5 border-brand-orange/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
               <Scale className="w-16 h-16 text-brand-orange" />
             </div>
             <h3 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-2">Coach's Tip</h3>
             <p className="text-sm text-foreground/80 font-medium leading-relaxed italic">
               "Consistency is key. If you miss a meal, don't double up on the next one. Just get back on track with the schedule."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroMini({ label, value, icon: Icon, color }: any) {
  const colorMap: any = {
    danger: "text-danger bg-danger-soft/10",
    info: "text-info bg-info-soft/10",
    warning: "text-warning bg-warning-soft/10",
    success: "text-success bg-success-soft/10",
  };

  return (
    <div className="p-3 rounded-2xl bg-surface-elevated border border-border/30 flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", colorMap[color])}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xs font-bold text-foreground leading-none">{value}</p>
      </div>
    </div>
  );
}

function MacroBar({ label, value, total, color, unit }: any) {
  const percentage = Math.min((value / total) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <p className="text-xs font-bold text-foreground">{label}</p>
        <p className="text-xs font-bold text-txt-secondary">{value}{unit} <span className="text-[10px] text-txt-tertiary font-medium">/ {total}{unit}</span></p>
      </div>
      <div className="h-2 w-full bg-surface-sunken rounded-full overflow-hidden border border-border/30">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full shadow-sm", color)}
        />
      </div>
    </div>
  );
}
