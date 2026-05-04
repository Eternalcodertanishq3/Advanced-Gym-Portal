"use client";

import React, { useState } from "react";
import { 
  Check, 
  Zap, 
  Star, 
  Shield, 
  ArrowRight, 
  Loader2, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Building2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MEMBERSHIP_FEATURES } from "@/lib/constants/features";
import { subscribeToPlan } from "@/actions/member/subscription-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  plans: any[];
  customPaymentMethods?: any[];
  branches?: any[];
  userBranchId?: string | null;
}

const DEFAULT_PAYMENT_METHODS = [
  { id: "UPI", label: "UPI / QR Code", icon: Smartphone, description: "Google Pay, PhonePe, Paytm" },
  { id: "CARD", label: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "CASH", label: "Cash Payment", icon: Banknote, description: "Pay at the gym reception" },
  { id: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2, description: "IMPS, NEFT, RTGS" },
];

export function SelectPlanClient({ plans, customPaymentMethods, branches = [], userBranchId }: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(userBranchId || "");
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const router = useRouter();

  const activePaymentMethods = customPaymentMethods && customPaymentMethods.length > 0 
    ? customPaymentMethods 
    : DEFAULT_PAYMENT_METHODS;

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    if (!selectedBranchId) {
      toast.error("Please select a branch first");
      return;
    }

    setLoading(true);
    try {
      const res = await subscribeToPlan({
        planId: selectedPlan.id,
        paymentMethod: paymentMethod,
        branchId: selectedBranchId
      });
      if (res.success) {
        toast.success("Request Sent! Please complete the payment to activate your account.");
        router.push("/member/subscription");
      } else {
        toast.error(res.error || "Failed to process request.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
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
          className="text-4xl md:text-5xl font-bold text-white font-display tracking-tight"
        >
          Choose Your <span className="text-brand-orange">Flight Path</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 max-w-2xl mx-auto text-lg font-medium"
        >
          Unlock the full potential of Eagle Gym. Select a membership tier that fits your goals and start your transformation today.
        </motion.p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, index) => {
          const isPopular = plan.name.toLowerCase().includes("gold") || plan.name.toLowerCase().includes("platinum");
          
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
                  : "bg-brand-navy-light/20 border-white/10 hover:border-brand-orange/30 shadow-sm"
              )}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 px-6 py-2 rounded-bl-2xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Recommended
                </div>
              )}

              <div className="mb-8">
                <h3 className={cn(
                  "text-2xl font-bold font-display mb-3",
                  isPopular ? "text-obsidian-950" : "text-white"
                )}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "text-5xl font-bold",
                    isPopular ? "text-obsidian-950" : "text-white"
                  )}>₹{plan.price}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    isPopular ? "text-obsidian-500" : "text-white/40"
                  )}>/ {plan.duration} Days</span>
                </div>
                <p className={cn(
                  "mt-4 text-sm leading-relaxed font-medium",
                  isPopular ? "text-obsidian-600" : "text-white/60"
                )}>{plan.description}</p>
              </div>

              <div className="flex-1 space-y-5 mb-10">
                <div className={cn(
                  "h-px w-full",
                  isPopular ? "bg-obsidian-100" : "bg-white/10"
                )} />
                <div className="space-y-4">
                  {MEMBERSHIP_FEATURES.map((feature) => {
                    const isIncluded = plan.features.includes(feature.id);
                    return (
                      <div key={feature.id} className={cn("flex items-start gap-4", !isIncluded && "opacity-20")}>
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          isIncluded 
                            ? "bg-brand-orange/10 text-brand-orange" 
                            : (isPopular ? "bg-obsidian-100 text-obsidian-400" : "bg-white/5 text-white/20")
                        )}>
                          {isIncluded ? <Check className="w-3 h-3 stroke-[3px]" /> : <Shield className="w-3 h-3" />}
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          isIncluded 
                            ? (isPopular ? "text-obsidian-700" : "text-white/80") 
                            : (isPopular ? "text-obsidian-400" : "text-white/20")
                        )}>
                          {feature.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={() => setSelectedPlan(plan)}
                className={cn(
                  "w-full py-7 rounded-2xl font-bold transition-all mt-auto text-base group",
                  isPopular 
                    ? "bg-brand-orange hover:bg-brand-orange-dark text-white shadow-lg shadow-brand-orange/20"
                    : "bg-white/10 hover:bg-brand-orange text-white border border-white/10 hover:border-brand-orange"
                )}
              >
                <div className="flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Payment Selection Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-[480px] bg-obsidian-950 border-white/10 p-0 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Branch Selection (Only if not assigned) */}
            {!userBranchId && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Select Your Branch</label>
                <div className="grid grid-cols-1 gap-2">
                  {branches.map((branch: any) => (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all duration-200",
                        selectedBranchId === branch.id
                          ? "bg-brand-orange/20 border-brand-orange text-white"
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                      )}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold">{branch.name}</span>
                        <span className="text-[10px] opacity-70">{branch.location}</span>
                      </div>
                      {selectedBranchId === branch.id && (
                        <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                Secure <span className="text-brand-orange">Checkout</span>
              </DialogTitle>
              <DialogDescription className="text-white/60">
                You are subscribing to the <span className="text-white font-bold">{selectedPlan?.name}</span> plan for ₹{selectedPlan?.price}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Select Payment Method</label>
              <div className="grid grid-cols-1 gap-2">
                {activePaymentMethods.map((method: any) => {
                  const Icon = method.icon === "Smartphone" ? Smartphone : 
                              method.icon === "CreditCard" ? CreditCard :
                              method.icon === "Banknote" ? Banknote :
                              method.icon === "Building2" ? Building2 : CreditCard;
                  const isSelected = paymentMethod === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                        isSelected 
                          ? "bg-brand-orange/10 border-brand-orange text-white" 
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isSelected ? "bg-brand-orange text-white" : "bg-white/5 text-white/40 group-hover:text-white/60"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={cn("font-bold text-sm", isSelected ? "text-white" : "text-white/80")}>{method.label}</p>
                        <p className="text-[10px] text-white/40">{method.description}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "border-brand-orange bg-brand-orange" : "border-white/10"
                      )}>
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[4px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-brand-orange shrink-0" />
              <p className="text-[10px] leading-relaxed text-white/60 font-medium">
                Note: Manual payment methods require confirmation from the gym admin. Your subscription will be activated once the payment is verified.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white/5 border-t border-white/5 flex flex-col gap-3">
            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-6 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold shadow-lg shadow-brand-orange/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                `Pay ₹${selectedPlan?.price} & Join Now`
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedPlan(null)}
              className="w-full text-white/40 hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-6 pt-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/40 text-xs font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-orange" />
            Secure Payment Processing
          </span>
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 text-brand-orange" />
            Professional Trainers
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-brand-orange" />
            Modern Equipment
          </span>
        </div>
        <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">
          Eagle Gym — Rise Above. Transform Beyond.
        </p>
      </motion.div>
    </div>
  );
}
