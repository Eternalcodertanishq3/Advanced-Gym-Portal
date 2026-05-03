import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Apple, Flame, Droplets, Footprints, Zap, ChevronRight, Lock, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Nutrition Dashboard | Eagle Gym",
  description: "Track your meals, macros, and hydration goals.",
};

export default async function NutritionPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: {
      dietPlans: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { meals: { orderBy: { sortOrder: 'asc' } } }
      }
    }
  });

  if (!member) redirect("/member");

  const activePlan = member.dietPlans?.[0];

  // Calculate totals from meals
  const totals = activePlan?.meals.reduce((acc: any, meal: any) => {
    acc.calories += meal.calories || 0;
    acc.protein += Number(meal.protein) || 0;
    acc.carbs += Number(meal.carbs) || 0;
    acc.fats += Number(meal.fats) || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return (
    <div className="w-full h-full p-6 space-y-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Nutrition <span className="text-brand-orange">Dashboard</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Fuel your performance with personalized diet tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-border/50 font-bold">Log Water</Button>
          <Button className="bg-brand-orange hover:bg-brand-orange-dark font-bold px-6">Add Meal</Button>
        </div>
      </div>

      {!activePlan ? (
        <div className="py-20 text-center surface-card border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-surface-sunken flex items-center justify-center mx-auto mb-4">
            <Apple className="w-8 h-8 text-brand-orange" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Active Diet Plan</h3>
          <p className="text-sm text-txt-tertiary max-w-[300px] mx-auto mb-8">
            Consult with your trainer to get a personalized nutrition strategy tailored to your goals.
          </p>
          <Button variant="outline" className="border-border/50">Request Nutrition Plan</Button>
        </div>
      ) : (
        <>
          {/* Macro Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <MacroCard 
              label="Calories" 
              value={totals.calories.toLocaleString()} 
              unit="kcal" 
              progress={Math.min(100, Math.floor((totals.calories / (activePlan.totalCalories || 2400)) * 100))}
              icon={<Flame className="w-5 h-5 text-brand-orange" />}
              color="orange"
            />
            <MacroCard 
              label="Protein" 
              value={Math.round(totals.protein).toString()} 
              unit="g" 
              progress={Math.min(100, Math.round(totals.protein))}
              icon={<Zap className="w-5 h-5 text-info" />}
              color="info"
            />
            <MacroCard 
              label="Carbs" 
              value={Math.round(totals.carbs).toString()} 
              unit="g" 
              progress={Math.min(100, Math.round(totals.carbs / 2))}
              icon={<Apple className="w-5 h-5 text-success" />}
              color="success"
            />
            <MacroCard 
              label="Fats" 
              value={Math.round(totals.fats).toString()} 
              unit="g" 
              progress={Math.min(100, Math.round(totals.fats))}
              icon={<Droplets className="w-5 h-5 text-danger" />}
              color="danger"
            />
          </div>

          {/* Today's Meals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                <PieChart className="w-6 h-6 text-brand-orange" />
                Today's Meals
              </h3>
              <div className="space-y-4">
                {activePlan.meals.map((meal: any) => (
                  <div key={meal.id} className="surface-card p-5 group hover:border-brand-orange/30 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-surface-sunken flex flex-col items-center justify-center border border-border/50">
                        <span className="text-[8px] font-black text-brand-orange uppercase">{meal.time || "AM"}</span>
                        <span className="text-sm font-bold text-foreground">{meal.calories}</span>
                        <span className="text-[7px] font-bold text-txt-tertiary uppercase">kcal</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-brand-orange transition-colors">{meal.name}</h4>
                        <p className="text-xs text-txt-tertiary font-medium">
                          {meal.protein ? `${meal.protein}g P • ` : ""}
                          {meal.carbs ? `${meal.carbs}g C • ` : ""}
                          {meal.fats ? `${meal.fats}g F` : ""}
                        </p>
                      </div>
                    </div>
                    <button 
                      aria-label={`View details for ${meal.name}`}
                      className="p-2 rounded-lg bg-surface-elevated text-txt-tertiary hover:text-brand-orange"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Insights */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                <Zap className="w-6 h-6 text-brand-orange" />
                Quick Actions
              </h3>
              <div className="surface-card p-6 space-y-4">
                <div className="p-4 rounded-xl bg-surface-sunken border border-border/50 flex items-center justify-between group cursor-pointer hover:bg-surface-elevated transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-info-soft flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Hydration</p>
                      <p className="text-[10px] text-txt-tertiary font-medium">Log intake to see progress</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-txt-tertiary group-hover:text-info transition-colors" />
                </div>

                <div className="p-4 rounded-xl bg-surface-sunken border border-border/50 flex items-center justify-between group cursor-pointer hover:bg-surface-elevated transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success-soft flex items-center justify-center">
                      <Apple className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Recipe Book</p>
                      <p className="text-[10px] text-txt-tertiary font-medium">Coming Soon</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-txt-tertiary group-hover:text-success transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MacroCard({ label, value, unit, progress, icon, color }: any) {
  const colors: any = {
    orange: "bg-brand-orange",
    info: "bg-info",
    success: "bg-success",
    danger: "bg-danger"
  };

  return (
    <div className="surface-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-lg font-display font-bold text-foreground">{value}<span className="text-xs font-bold text-txt-tertiary ml-0.5">{unit}</span></p>
          <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">{label}</p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} transition-all duration-1000`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
