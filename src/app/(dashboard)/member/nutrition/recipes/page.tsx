import React from "react";
import { getRecipes } from "@/actions/member/diet-actions";
import {
  Utensils,
  Clock,
  Flame,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  Leaf,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const metadata = {
  title: "Recipe Bank | Eagle Gym",
  description: "Explore performance-boosting recipes curated by our elite trainers.",
};

export default async function RecipesPage() {
  const res = await getRecipes();
  const recipes = res.success ? res.data : [];

  return (
    <div className="mx-auto h-full w-full max-w-7xl space-y-12 p-6 duration-500 animate-in fade-in md:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="space-y-4">
          <Link
            href="/member/nutrition"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-orange transition-transform hover:translate-x-[-4px]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-display text-5xl font-bold leading-tight text-foreground">
            Recipe <span className="text-brand-orange">Bank</span>
          </h1>
          <p className="max-w-md text-sm font-medium text-txt-secondary">
            The culinary blueprint for your transformation. Every recipe is verified for
            macro-accuracy.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary" />
            <Input
              placeholder="Search blueprints..."
              className="h-14 rounded-2xl border-border/50 bg-surface-sunken pl-11 shadow-inner focus:border-brand-orange/50"
            />
          </div>
          <Button
            variant="outline"
            className="h-14 w-full rounded-2xl border-border/50 px-6 font-bold sm:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Featured / Categories */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {["Breakfast", "Power Lunch", "Elite Dinner", "Snacks"].map((cat, idx) => (
          <div
            key={cat}
            className="surface-card group flex cursor-pointer flex-col items-center gap-3 rounded-3xl border border-border/50 p-6 text-center transition-all hover:border-brand-orange/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-sunken transition-transform group-hover:scale-110">
              {idx === 0 && <Clock className="h-6 w-6 text-brand-orange" />}
              {idx === 1 && <Flame className="h-6 w-6 text-brand-orange" />}
              {idx === 2 && <Utensils className="h-6 w-6 text-brand-orange" />}
              {idx === 3 && <TrendingUp className="h-6 w-6 text-brand-orange" />}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-foreground">{cat}</p>
          </div>
        ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe: any) => (
          <div
            key={recipe.id}
            className="surface-card group flex flex-col overflow-hidden rounded-[2.5rem] border border-border/50 shadow-xl transition-all hover:border-brand-orange/50 hover:shadow-brand-orange/5"
          >
            {/* Image Placeholder */}
            <div className="relative h-56 overflow-hidden bg-surface-sunken">
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Utensils className="h-12 w-12 text-txt-tertiary/20" />
                </div>
              )}
              <div className="absolute left-4 top-4">
                <div className="rounded-full border border-white/10 bg-brand-navy/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                  {recipe.category || "General"}
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-8">
              <div className="flex-1 space-y-3">
                <h3 className="font-display text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-brand-orange">
                  {recipe.name}
                </h3>
                <p className="line-clamp-2 text-xs font-medium text-txt-secondary">
                  {recipe.description ||
                    "High-performance meal designed to optimize recovery and hormone balance."}
                </p>
              </div>

              <div className="my-6 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-border/30 bg-surface-sunken p-3 text-center">
                  <p className="text-sm font-bold text-foreground">{recipe.calories || "350"}</p>
                  <p className="text-[8px] font-black uppercase tracking-tighter text-txt-tertiary">
                    Kcal
                  </p>
                </div>
                <div className="rounded-2xl border border-border/30 bg-surface-sunken p-3 text-center">
                  <p className="text-sm font-bold text-foreground">
                    {recipe.protein?.toString() || "30"}g
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-tighter text-txt-tertiary">
                    Prot
                  </p>
                </div>
                <div className="rounded-2xl border border-border/30 bg-surface-sunken p-3 text-center">
                  <p className="text-sm font-bold text-foreground">
                    {recipe.carbs?.toString() || "45"}g
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-tighter text-txt-tertiary">
                    Carbs
                  </p>
                </div>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border/50 bg-surface-sunken py-4 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-brand-orange hover:bg-brand-orange hover:text-white">
                View Blueprint
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {recipes.length === 0 && (
          <div className="surface-card col-span-full rounded-[3rem] border-2 border-dashed border-border/50 bg-surface-sunken/10 py-24 text-center">
            <Leaf className="mx-auto mb-6 h-16 w-16 text-txt-tertiary/20" />
            <h3 className="font-display text-xl font-bold text-foreground">Archive Empty</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-txt-secondary">
              Our elite chefs are currently drafting new performance protocols. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
