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
    <div className="min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest"
          >
            <Zap className="w-3 h-3" />
            Elevate Your Training
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white font-display tracking-tight"
          >
            Choose Your <span className="text-brand-orange">Flight Path</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-2xl mx-auto"
          >
            Unlock the full potential of Eagle Gym. Select a membership tier that fits your goals and start your transformation today.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isPopular = plan.name.toLowerCase().includes("gold") || plan.name.toLowerCase().includes("popular");
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={cn(
                  "relative glass-card p-8 rounded-3xl border transition-all flex flex-col h-full",
                  isPopular 
                    ? "border-brand-orange shadow-2xl shadow-brand-orange/10 scale-105 z-10" 
                    : "border-white/10 hover:border-white/20"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-orange text-white text-[10px] font-black uppercase tracking-tighter shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white font-display mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-white/40 text-sm">/ {plan.duration} Days</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  <p className="text-sm text-white/60">{plan.description}</p>
                  
                  <div className="space-y-3">
                    {MEMBERSHIP_FEATURES.map((feature) => {
                      const isIncluded = plan.features.includes(feature.id);
                      return (
                        <div key={feature.id} className={cn("flex items-start gap-3", !isIncluded && "opacity-30")}>
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                            isIncluded ? "bg-brand-orange/20 text-brand-orange" : "bg-white/5 text-white/20"
                          )}>
                            {isIncluded ? <Check className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          </div>
                          <div className="flex flex-col">
                            <span className={cn("text-sm", isIncluded ? "text-white/80 font-medium" : "text-white/40")}>
                              {feature.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={!!loading}
                  className={cn(
                    "w-full py-6 rounded-2xl font-bold transition-all mt-auto",
                    isPopular 
                      ? "bg-brand-orange hover:bg-brand-orange-dark text-white shadow-xl shadow-brand-orange/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  )}
                >
                  {loading === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Subscribe Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Background Decoration */}
                <div 
                  className="absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-10 pointer-events-none"
                  style={{ backgroundColor: plan.color || "#F26522" }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/30 text-xs"
        >
          All plans include 24/7 access to the community portal. GST may apply based on plan selection.
        </motion.div>
      </div>
    </div>
  );
}
