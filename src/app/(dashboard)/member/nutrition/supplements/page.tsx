import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Pill, Zap, Clock, ShieldCheck, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Supplement Tracker | Eagle Gym",
  description: "Manage your daily supplement stack and performance boosters.",
};

export default async function SupplementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const products = await prisma.product.findMany({
    where: { category: "SUPPLEMENT", isActive: true },
    take: 5
  });

  const activeStack = products.map(product => ({
    id: product.id,
    name: product.name,
    dosage: "As Prescribed",
    time: "Daily",
    purpose: product.description || "Health & Performance",
    status: "Pending",
    icon: <Zap className="w-5 h-5 text-brand-orange" />
  }));

  return (
    <div className="w-full h-full p-6 space-y-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Supplement <span className="text-brand-orange">Stack</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Optimize your recovery and performance with a smart supplement routine.</p>
        </div>
        <Button className="bg-brand-orange hover:bg-brand-orange-dark font-bold gap-2 px-6">
          <Pill className="w-4 h-4" />
          Add Supplement
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Stack */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <Clock className="w-6 h-6 text-brand-orange" />
            Daily Routine
          </h3>
          <div className="space-y-4">
            {activeStack.length === 0 ? (
              <div className="py-12 text-center surface-card border-dashed border-2">
                <p className="text-txt-tertiary">No supplements found in the store.</p>
              </div>
            ) : (
              activeStack.map((sup) => (
                <div key={sup.id} className="surface-card p-5 group hover:border-brand-orange/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-surface-sunken flex items-center justify-center border border-border/50">
                      {sup.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground group-hover:text-brand-orange transition-colors">{sup.name}</h4>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                          sup.status === "Taken" ? "bg-success-soft text-success" : "bg-surface-elevated text-txt-tertiary"
                        }`}>
                          {sup.status}
                        </span>
                      </div>
                      <p className="text-xs text-txt-tertiary font-medium">{sup.dosage} • {sup.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest hidden sm:block truncate max-w-[150px]">{sup.purpose}</span>
                    <button 
                      aria-label={`View details for ${sup.name}`}
                      className="p-2 rounded-lg bg-surface-elevated text-txt-tertiary hover:text-brand-orange"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shop Supplements */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-brand-orange" />
            Gym Store
          </h3>
          <div className="surface-card p-6 bg-brand-navy border-none relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h4 className="text-lg font-display font-bold text-white mb-2">Refill Your Stack</h4>
              <p className="text-sm text-white/60 mb-6">Get 10% member discount on all premium supplements at the Eagle Gym Store.</p>
              <Button className="w-full bg-brand-orange hover:bg-brand-orange-dark border-none shadow-lg shadow-brand-orange/20">
                Browse Shop
              </Button>
            </div>
          </div>

          <div className="surface-card p-6 space-y-4">
            <h4 className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">Stack Insights</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-txt-secondary">Consistency</span>
                <span className="font-bold text-success">92%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
                <div className="h-full bg-success w-[92%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
