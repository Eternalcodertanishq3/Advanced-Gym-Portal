"use client";

import React, { useState } from "react";
import { Check, Zap, Star, Shield, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MEMBERSHIP_FEATURES } from "@/lib/constants/features";
import { subscribeToPlan } from "@/actions/member/subscription-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  plans: any[];
}

export function SelectPlanClient({ plans }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await subscribeToPlan(planId);
      if (res.success) {
        toast.success("Welcome to the team! Your subscription is now active.");
        router.push("/member");
      } else {
        toast.error(res.error || "Failed to subscribe.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest"
        >
          <Zap className="w-3 h-3" />
          Elevate Your Training
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-obsidian-950 font-display tracking-tight"
        >
          Choose Your <span className="text-brand-orange">Flight Path</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-obsidian-500 max-w-2xl mx-auto text-lg font-medium"
        >
          Unlock the full potential of Eagle Gym. Select a membership tier that fits your goals and start your transformation today.
        </motion.p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, index) => {
          const isPopular = plan.name.toLowerCase().includes("gold") || plan.name.toLowerCase().includes("popular");
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                "relative p-8 rounded-3xl border transition-all flex flex-col h-full overflow-hidden",
                isPopular 
                  ? "bg-white border-brand-orange shadow-xl shadow-brand-orange/10 scale-105 z-10" 
                  : "bg-surface-card border-surface-sunken hover:border-brand-orange/30 shadow-sm"
              )}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 px-6 py-2 rounded-bl-2xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Recommended
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-obsidian-950 font-display mb-3">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-obsidian-950">₹{plan.price}</span>
                  <span className="text-obsidian-500 text-sm font-medium">/ {plan.duration} Days</span>
                </div>
                <p className="mt-4 text-sm text-obsidian-600 leading-relaxed font-medium">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-5 mb-10">
                <div className="h-px bg-surface-sunken w-full" />
                <div className="space-y-4">
                  {MEMBERSHIP_FEATURES.map((feature) => {
                    const isIncluded = plan.features.includes(feature.id);
                    return (
                      <div key={feature.id} className={cn("flex items-start gap-4", !isIncluded && "opacity-30")}>
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          isIncluded ? "bg-brand-orange/10 text-brand-orange" : "bg-obsidian-100 text-obsidian-400"
                        )}>
                          {isIncluded ? <Check className="w-3 h-3 stroke-[3px]" /> : <Shield className="w-3 h-3" />}
                        </div>
                        <span className={cn("text-sm font-medium", isIncluded ? "text-obsidian-700" : "text-obsidian-400")}>
                          {feature.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={!!loading}
                className={cn(
                  "w-full py-7 rounded-2xl font-bold transition-all mt-auto text-base",
                  "bg-brand-orange hover:bg-brand-orange-dark text-white shadow-lg shadow-brand-orange/20"
                )}
              >
                {loading === plan.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-6 pt-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-obsidian-400 text-xs font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-orange" />
            Secure Payment Processing
          </span>
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 text-brand-orange" />
            30-Day Money Back Guarantee
          </span>
        </div>
        <p className="text-obsidian-300 text-[10px] uppercase tracking-[0.2em] font-bold">
          Eagle Gym — Rise Above. Transform Beyond.
        </p>
      </motion.div>
    </div>
  );
}
