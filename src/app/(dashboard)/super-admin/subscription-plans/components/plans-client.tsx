"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Check, Plus, Star } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { PlanModal } from "./plan-modal";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  maxCheckIns: number;
  ptSessions: number;
  guestPasses: number;
  sortOrder: number;
}

interface Props {
  plans: Plan[];
}

export function SubscriptionPlansClient({ plans }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleCreate = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wide font-display flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-brand-orange" />
            Subscription Plans
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage membership tiers and pricing.</p>
        </div>
        
        <motion.button 
          onClick={handleCreate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-5 py-2.5 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </motion.button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-muted/30">
          <DollarSign className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No Subscription Plans Found</h3>
          <p className="text-muted-foreground">Click "Create New Plan" to add your first membership tier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isPopular = i === 1; // Highlight the second plan usually
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative p-6 rounded-2xl border backdrop-blur-xl flex flex-col group transition-all duration-300",
                  isPopular 
                    ? "bg-card border-brand-orange/40 shadow-lg shadow-brand-orange/5 scale-[1.02]" 
                    : "bg-card border-border hover:border-brand-orange/20"
                )}
              >
                {isPopular && (
                  <div className="absolute top-4 right-4 bg-brand-orange/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white font-mono font-bold shadow-lg shadow-brand-orange/20 flex items-center gap-2 whitespace-nowrap">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-brand-orange transition-colors">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-3xl font-bold text-foreground">{formatCurrency(plan.price, { showSymbol: true, decimals: 0 })}</span>
                  <span className="text-muted-foreground/60 text-sm mb-1">/ {plan.duration} Days</span>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm text-foreground/80">{feat}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleEdit(plan)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-bold transition-all",
                    isPopular ? "bg-brand-orange text-white hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20" : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                  )}
                >
                  Edit Plan
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <PlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        plan={selectedPlan}
      />
    </div>
  );
}
