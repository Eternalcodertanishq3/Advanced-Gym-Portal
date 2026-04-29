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
          <h1 className="text-2xl font-bold text-white tracking-wide font-display flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-gold-400" />
            Subscription Plans
          </h1>
          <p className="text-sm text-white/50 mt-1">Create and manage membership tiers and pricing.</p>
        </div>
        
        <motion.button 
          onClick={handleCreate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </motion.button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-obsidian-900/50">
          <DollarSign className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Subscription Plans Found</h3>
          <p className="text-white/50">Click "Create New Plan" to add your first membership tier.</p>
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
                  "relative p-6 rounded-2xl border backdrop-blur-xl flex flex-col group",
                  isPopular ? "bg-gradient-to-b from-gold-500/10 to-obsidian-950 border-gold-500/30" : "bg-obsidian-950/50 border-white/5 hover:border-white/10 transition-colors"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-500 text-obsidian-950 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">{formatCurrency(plan.price, { showSymbol: true, decimals: 0 })}</span>
                  <span className="text-white/40 text-sm mb-1">/ {plan.duration} Days</span>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-neon-green/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-neon-green" />
                      </div>
                      <span className="text-sm text-white/80">{feat}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleEdit(plan)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-bold transition-all",
                    isPopular ? "bg-gold-500 text-obsidian-950 hover:bg-gold-400 shadow-[0_0_10px_rgba(255,215,0,0.2)]" : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
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
