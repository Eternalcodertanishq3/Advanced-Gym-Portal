"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Power, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlanModal } from "./plan-modal";
import { togglePlanStatus, deletePlan } from "@/actions/super-admin/plan-actions";
import { toast } from "sonner";
import { MEMBERSHIP_FEATURES } from "@/lib/constants/features";

interface Props {
  initialPlans: any[];
}

export function PlanClient({ initialPlans }: Props) {
  const [plans, setPlans] = useState(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleCreate = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (plan: any) => {
    try {
      const res = await togglePlanStatus(plan.id, plan.isActive);
      if (res.success) {
        toast.success(`Plan ${plan.isActive ? "deactivated" : "activated"} successfully`);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan? This cannot be undone.")) return;
    
    try {
      const res = await deletePlan(id);
      if (res.success) {
        toast.success("Plan deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete plan");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">Subscription Plans</h1>
          <p className="text-sm text-white/50">Manage your membership tiers and feature access.</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold shadow-lg shadow-brand-orange/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {initialPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "glass-card p-6 rounded-2xl border transition-all relative overflow-hidden group",
                plan.isActive ? "border-white/10" : "border-white/5 opacity-60"
              )}
            >
              {/* Branding Stripe */}
              <div 
                className="absolute top-0 left-0 w-full h-1.5 opacity-80"
                style={{ backgroundColor: plan.color || "#F26522" }}
              />

              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-display">{plan.name}</h3>
                    {plan.isActive ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    {plan.duration} Days • {plan.gstIncluded ? "GST Inc." : "GST Extra"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">₹{plan.price}</p>
                  <p className="text-[10px] text-white/40">Base Price</p>
                </div>
              </div>

              <p className="text-sm text-white/60 line-clamp-2 min-h-[40px] mb-6">
                {plan.description || "No description provided."}
              </p>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {plan.features?.slice(0, 4).map((fId: string) => {
                    const feature = MEMBERSHIP_FEATURES.find(f => f.id === fId);
                    return (
                      <span key={fId} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                        {feature?.label || fId}
                      </span>
                    );
                  })}
                  {(plan.features?.length > 4) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                      +{plan.features.length - 4} more
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
                  <div className="text-center">
                    <p className="text-xs font-bold text-white">{plan.maxCheckIns || "∞"}</p>
                    <p className="text-[8px] uppercase tracking-tighter text-white/30">Checkins</p>
                  </div>
                  <div className="text-center border-x border-white/5">
                    <p className="text-xs font-bold text-white">{plan.ptSessions || "0"}</p>
                    <p className="text-[8px] uppercase tracking-tighter text-white/30">PT Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white">{plan.guestPasses || "0"}</p>
                    <p className="text-[8px] uppercase tracking-tighter text-white/30">Guest Passes</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-white/40 hover:text-white hover:bg-white/10"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-white/40 hover:text-red-400 hover:bg-red-400/10"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-[10px] h-7 px-3 rounded-full border",
                      plan.isActive 
                        ? "text-red-400 border-red-400/20 hover:bg-red-400/10"
                        : "text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/10"
                    )}
                    onClick={() => handleToggleStatus(plan)}
                  >
                    <Power className="w-3 h-3 mr-1.5" />
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>

              {/* Decorative Glow */}
              <div 
                className="absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-10 pointer-events-none"
                style={{ backgroundColor: plan.color || "#F26522" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {initialPlans.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card rounded-2xl border border-dashed border-white/10">
            <Plus className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white font-display">No plans created yet</h3>
            <p className="text-sm text-white/40 mb-6">Start by creating your first subscription tier.</p>
            <Button onClick={handleCreate} className="bg-brand-orange hover:bg-brand-orange-dark text-white">
              Create First Plan
            </Button>
          </div>
        )}
      </div>

      <PlanModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        plan={selectedPlan} 
      />
    </div>
  );
}
