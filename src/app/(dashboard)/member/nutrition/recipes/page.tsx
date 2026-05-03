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
  ChevronLeft
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
    <div className="w-full h-full p-6 md:p-10 space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Link 
            href="/member/nutrition" 
            className="flex items-center gap-2 text-xs font-black text-brand-orange uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-display font-bold text-foreground leading-tight">
            Recipe <span className="text-brand-orange">Bank</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium max-w-md">
            The culinary blueprint for your transformation. Every recipe is verified for macro-accuracy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
              <Input 
                placeholder="Search blueprints..." 
                className="pl-11 h-14 rounded-2xl bg-surface-sunken border-border/50 focus:border-brand-orange/50 shadow-inner"
              />
           </div>
           <Button variant="outline" className="h-14 px-6 rounded-2xl border-border/50 font-bold w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
           </Button>
        </div>
      </div>

      {/* Featured / Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {['Breakfast', 'Power Lunch', 'Elite Dinner', 'Snacks'].map((cat, idx) => (
           <div key={cat} className="surface-card p-6 rounded-3xl border border-border/50 hover:border-brand-orange/30 transition-all cursor-pointer group flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-sunken flex items-center justify-center group-hover:scale-110 transition-transform">
                 {idx === 0 && <Clock className="w-6 h-6 text-brand-orange" />}
                 {idx === 1 && <Flame className="w-6 h-6 text-brand-orange" />}
                 {idx === 2 && <Utensils className="w-6 h-6 text-brand-orange" />}
                 {idx === 3 && <TrendingUp className="w-6 h-6 text-brand-orange" />}
              </div>
              <p className="text-xs font-black text-foreground uppercase tracking-widest">{cat}</p>
           </div>
         ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe: any) => (
          <div 
            key={recipe.id} 
            className="surface-card rounded-[2.5rem] border border-border/50 overflow-hidden group hover:border-brand-orange/50 transition-all flex flex-col shadow-xl hover:shadow-brand-orange/5"
          >
            {/* Image Placeholder */}
            <div className="h-56 bg-surface-sunken relative overflow-hidden">
               {recipe.image ? (
                 <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                    <Utensils className="w-12 h-12 text-txt-tertiary/20" />
                 </div>
               )}
               <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 rounded-full bg-brand-navy/80 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                    {recipe.category || "General"}
                  </div>
               </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-display font-bold text-foreground leading-tight group-hover:text-brand-orange transition-colors">
                  {recipe.name}
                </h3>
                <p className="text-xs text-txt-secondary line-clamp-2 font-medium">
                  {recipe.description || "High-performance meal designed to optimize recovery and hormone balance."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 my-6">
                 <div className="p-3 rounded-2xl bg-surface-sunken border border-border/30 text-center">
                    <p className="text-sm font-bold text-foreground">{recipe.calories || "350"}</p>
                    <p className="text-[8px] font-black text-txt-tertiary uppercase tracking-tighter">Kcal</p>
                 </div>
                 <div className="p-3 rounded-2xl bg-surface-sunken border border-border/30 text-center">
                    <p className="text-sm font-bold text-foreground">{recipe.protein?.toString() || "30"}g</p>
                    <p className="text-[8px] font-black text-txt-tertiary uppercase tracking-tighter">Prot</p>
                 </div>
                 <div className="p-3 rounded-2xl bg-surface-sunken border border-border/30 text-center">
                    <p className="text-sm font-bold text-foreground">{recipe.carbs?.toString() || "45"}g</p>
                    <p className="text-[8px] font-black text-txt-tertiary uppercase tracking-tighter">Carbs</p>
                 </div>
              </div>

              <button className="w-full py-4 rounded-2xl bg-surface-sunken border border-border/50 text-foreground font-bold text-xs uppercase tracking-widest hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all flex items-center justify-center gap-2">
                View Blueprint
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {recipes.length === 0 && (
          <div className="col-span-full py-24 text-center surface-card border-dashed border-2 rounded-[3rem] border-border/50 bg-surface-sunken/10">
             <Leaf className="w-16 h-16 text-txt-tertiary/20 mx-auto mb-6" />
             <h3 className="text-xl font-display font-bold text-foreground">Archive Empty</h3>
             <p className="text-sm text-txt-secondary max-w-xs mx-auto mt-2 font-medium">
               Our elite chefs are currently drafting new performance protocols. Check back soon.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
