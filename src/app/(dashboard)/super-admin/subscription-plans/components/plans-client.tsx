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
    <div className="w-full space-y-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-wide text-foreground">
            <DollarSign className="h-6 w-6 text-brand-orange" />
            Subscription Plans
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage membership tiers and pricing.
          </p>
        </div>

        <motion.button
          onClick={handleCreate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-2.5 font-bold text-white shadow-lg shadow-brand-orange/20 transition-all hover:shadow-brand-orange/30 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Create New Plan
        </motion.button>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
          <DollarSign className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
          <h3 className="mb-2 text-xl font-bold text-foreground">No Subscription Plans Found</h3>
          <p className="text-muted-foreground">
            Click "Create New Plan" to add your first membership tier.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const isPopular = i === 1; // Highlight the second plan usually
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "group relative flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300",
                  isPopular
                    ? "scale-[1.02] border-brand-orange/40 bg-card shadow-lg shadow-brand-orange/5"
                    : "border-border bg-card hover:border-brand-orange/20",
                )}
              >
                {isPopular && (
                  <div className="absolute right-4 top-4 flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-orange/80 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-lg shadow-brand-orange/20 backdrop-blur-md">
                    <Star className="h-3 w-3" /> Most Popular
                  </div>
                )}

                <h3 className="mb-2 font-display text-xl font-bold text-foreground transition-colors group-hover:text-brand-orange">
                  {plan.name}
                </h3>
                <div className="mb-6 flex items-end gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {formatCurrency(plan.price, { showSymbol: true, decimals: 0 })}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground/60">
                    / {plan.duration} Days
                  </span>
                </div>

                <div className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span className="text-sm text-foreground/80">{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleEdit(plan)}
                  className={cn(
                    "w-full rounded-xl py-2.5 text-sm font-bold transition-all",
                    isPopular
                      ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-orange-hover"
                      : "border border-border bg-muted text-foreground hover:bg-muted/80",
                  )}
                >
                  Edit Plan
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <PlanModal open={isModalOpen} onClose={() => setIsModalOpen(false)} plan={selectedPlan} />
    </div>
  );
}
