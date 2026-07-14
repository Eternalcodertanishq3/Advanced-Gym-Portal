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
  Scale,
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
        <Utensils className="mb-4 h-16 w-16 text-txt-tertiary/20" />
        <h2 className="text-xl font-bold text-foreground">No Diet Plan Assigned</h2>
        <p className="mt-2 text-sm text-txt-secondary">
          Consult your trainer to receive a personalized nutrition guide.
        </p>
      </div>
    );
  }

  // Calculate totals for macros
  const totalMacros = activePlan.meals.reduce(
    (acc: any, meal: any) => ({
      protein: acc.protein + (Number(meal.protein) || 0),
      carbs: acc.carbs + (Number(meal.carbs) || 0),
      fats: acc.fats + (Number(meal.fats) || 0),
      calories: acc.calories + (meal.calories || 0),
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 },
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 duration-500 animate-in fade-in slide-in-from-bottom-4 md:p-8">
      {/* Header & Plan Selector */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-4 font-display text-3xl font-bold tracking-tight text-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
              <Utensils className="h-6 w-6 text-brand-orange" />
            </div>
            Nutrition <span className="text-brand-orange">Command</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-txt-secondary">
            Fueled for performance. Tracked for results.
          </p>
        </div>

        {plans.length > 1 && (
          <div className="group relative">
            <select
              aria-label="Select diet plan"
              value={selectedPlanIdx}
              onChange={(e) => setSelectedPlanIdx(Number(e.target.value))}
              className="cursor-pointer appearance-none rounded-2xl border border-border bg-surface-elevated px-6 py-3 pr-12 text-sm font-bold text-foreground outline-none transition-all focus:border-brand-orange/50"
            >
              {plans.map((p, i) => (
                <option key={p.id} value={i}>
                  {p.name} {p.memberId ? "⭐ (Assigned)" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT: Daily Meal Timeline */}
        <div className="space-y-6 lg:col-span-2">
          <div className="surface-card rounded-[2.5rem] border border-border/50 p-8">
            <h2 className="mb-8 flex items-center gap-3 font-display text-xl font-bold text-foreground">
              <Calendar className="h-5 w-5 text-brand-orange" />
              Daily Meal Schedule
            </h2>

            <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border/30">
              {activePlan.meals.map((meal: any, idx: number) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative pl-12"
                >
                  {/* Time Indicator */}
                  <div className="absolute left-0 top-1.5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-sunken transition-colors group-hover:border-brand-orange/50">
                    <Clock className="h-4 w-4 text-txt-tertiary transition-colors group-hover:text-brand-orange" />
                  </div>

                  <div className="surface-card rounded-3xl border border-border/50 bg-surface-sunken/30 p-6 shadow-sm transition-all hover:shadow-lg group-hover:border-brand-orange/20">
                    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                          {meal.time}
                        </p>
                        <h3 className="text-xl font-bold text-foreground">{meal.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-txt-tertiary">
                        <span className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1">
                          <Zap className="h-3.5 w-3.5 text-warning" />
                          {meal.calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <MacroMini
                        label="Prot"
                        value={`${meal.protein}g`}
                        icon={<Beef className="h-4 w-4" />}
                        color="danger"
                      />
                      <MacroMini
                        label="Carbs"
                        value={`${meal.carbs}g`}
                        icon={<Bean className="h-4 w-4" />}
                        color="info"
                      />
                      <MacroMini
                        label="Fats"
                        value={`${meal.fats}g`}
                        icon={<Droplets className="h-4 w-4" />}
                        color="warning"
                      />
                      <MacroMini
                        label="Fiber"
                        value={`${meal.fiber || 0}g`}
                        icon={<Apple className="h-4 w-4" />}
                        color="success"
                      />
                    </div>

                    <div className="space-y-3 border-t border-border/30 pt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                        Ingredients / Items
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {meal.items.map((item: string, i: number) => (
                          <li
                            key={i}
                            className="rounded-xl border border-border/50 bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {meal.notes && (
                      <div className="mt-4 flex items-start gap-3 rounded-xl border border-brand-orange/10 bg-brand-orange/5 p-3">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                        <p className="text-[11px] font-medium leading-relaxed text-brand-orange/80">
                          {meal.notes}
                        </p>
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
          <div className="surface-card space-y-8 rounded-[2.5rem] p-8">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wider text-foreground">
              <PieChart className="h-5 w-5 text-brand-orange" /> Macro Distribution
            </h3>

            <div className="space-y-6">
              <MacroBar
                label="Protein"
                value={totalMacros.protein}
                total={250}
                color="bg-danger"
                unit="g"
              />
              <MacroBar
                label="Carbohydrates"
                value={totalMacros.carbs}
                total={300}
                color="bg-info"
                unit="g"
              />
              <MacroBar
                label="Fats"
                value={totalMacros.fats}
                total={80}
                color="bg-warning"
                unit="g"
              />
            </div>

            <div className="border-t border-border/50 pt-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-tertiary">
                    Total Daily Budget
                  </p>
                  <p className="font-display text-4xl font-bold text-foreground">
                    {totalMacros.calories}
                  </p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-xs font-bold text-success">
                    <Zap className="h-3.5 w-3.5" /> Optimal
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Calories / Day
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card group relative overflow-hidden rounded-[2.5rem] border-brand-orange/10 bg-brand-orange-soft/5 p-8">
            <div className="absolute right-0 top-0 p-6 opacity-5 transition-transform group-hover:scale-110">
              <Scale className="h-16 w-16 text-brand-orange" />
            </div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-orange">
              Coach's Tip
            </h3>
            <p className="text-sm font-medium italic leading-relaxed text-foreground/80">
              "Consistency is key. If you miss a meal, don't double up on the next one. Just get
              back on track with the schedule."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroMini({ label, value, icon, color }: any) {
  const colorMap: any = {
    danger: "text-danger bg-danger-soft/10",
    info: "text-info bg-info-soft/10",
    warning: "text-warning bg-warning-soft/10",
    success: "text-success bg-success-soft/10",
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-surface-elevated p-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          colorMap[color],
        )}
      >
        {icon}
      </div>
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-txt-tertiary">
          {label}
        </p>
        <p className="text-xs font-bold leading-none text-foreground">{value}</p>
      </div>
    </div>
  );
}

function MacroBar({ label, value, total, color, unit }: any) {
  const percentage = Math.min((value / total) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <p className="text-xs font-bold text-foreground">{label}</p>
        <p className="text-xs font-bold text-txt-secondary">
          {value}
          {unit}{" "}
          <span className="text-[10px] font-medium text-txt-tertiary">
            / {total}
            {unit}
          </span>
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full border border-border/30 bg-surface-sunken">
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
