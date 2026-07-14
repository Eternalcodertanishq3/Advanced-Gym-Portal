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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  initialPlans: any[];
}

export function PlanClient({ initialPlans }: Props) {
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
      <PlanModal
        key={selectedPlan?.id || "new-plan"}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
      />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-obsidian-950 dark:text-white">
            Subscription Plans
          </h1>
          <p className="text-sm text-obsidian-500 dark:text-white/50">
            Manage your membership tiers and feature access.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="hover:bg-brand-orange-dark bg-brand-orange font-bold text-white shadow-lg shadow-brand-orange/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {initialPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-surface-card p-6 shadow-sm transition-all dark:bg-brand-navy",
                plan.isActive
                  ? "border-surface-border dark:border-white/10"
                  : "border-surface-border/50 opacity-60 dark:border-white/5",
              )}
            >
              {/* Branding Stripe */}
              <div
                className="absolute left-0 top-0 h-1.5 w-full opacity-80"
                style={{ backgroundColor: plan.color || "#F26522" }}
              />

              <div className="mb-4 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-obsidian-950 dark:text-white">
                      {plan.name}
                    </h3>
                    {plan.isActive ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-obsidian-400 dark:text-white/40">
                    {plan.duration} Days • {plan.gstIncluded ? "GST Inc." : "GST Extra"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-obsidian-950 dark:text-white">
                    ₹{plan.price}
                  </p>
                  <p className="text-[10px] text-obsidian-400 dark:text-white/40">Base Price</p>
                </div>
              </div>

              <p className="mb-6 line-clamp-2 min-h-[40px] text-sm text-obsidian-600 dark:text-white/60">
                {plan.description || "No description provided."}
              </p>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {plan.features?.slice(0, 4).map((fId: string) => {
                    const feature = MEMBERSHIP_FEATURES.find((f) => f.id === fId);
                    return (
                      <span
                        key={fId}
                        className="rounded-full border border-surface-border bg-surface-base px-2 py-0.5 text-[10px] text-obsidian-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                      >
                        {feature?.label || fId}
                      </span>
                    );
                  })}
                  {plan.features?.length > 4 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="cursor-pointer rounded-full border border-surface-border bg-surface-base px-2 py-0.5 text-[10px] text-obsidian-400 transition-colors hover:bg-surface-elevated hover:text-obsidian-950 dark:border-white/10 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white">
                          +{plan.features.length - 4} more
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 border-surface-border bg-surface-card p-4 shadow-2xl dark:border-white/10 dark:bg-brand-navy">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-obsidian-950 dark:text-white">
                            All Features
                          </h4>
                          <div className="grid grid-cols-1 gap-1.5">
                            {plan.features.map((fId: string) => {
                              const feature = MEMBERSHIP_FEATURES.find((f) => f.id === fId);
                              return (
                                <div
                                  key={fId}
                                  className="flex items-center gap-2 border-b border-surface-border/50 py-1 last:border-0 dark:border-white/5"
                                >
                                  <div className="h-1 w-1 rounded-full bg-brand-orange" />
                                  <span className="text-xs text-obsidian-600 dark:text-white/70">
                                    {feature?.label || fId}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-surface-border py-3 dark:border-white/5">
                  <div className="text-center">
                    <p className="text-xs font-bold text-obsidian-950 dark:text-white">
                      {plan.maxCheckIns || "∞"}
                    </p>
                    <p className="text-[8px] uppercase tracking-tighter text-obsidian-400 dark:text-white/30">
                      Checkins
                    </p>
                  </div>
                  <div className="border-x border-surface-border text-center dark:border-white/5">
                    <p className="text-xs font-bold text-obsidian-950 dark:text-white">
                      {plan.ptSessions || "0"}
                    </p>
                    <p className="text-[8px] uppercase tracking-tighter text-obsidian-400 dark:text-white/30">
                      PT Sessions
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-obsidian-950 dark:text-white">
                      {plan.guestPasses || "0"}
                    </p>
                    <p className="text-[8px] uppercase tracking-tighter text-obsidian-400 dark:text-white/30">
                      Guest Passes
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-obsidian-400 hover:bg-surface-elevated hover:text-obsidian-950 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-obsidian-400 hover:bg-red-50 hover:text-red-600 dark:text-white/40 dark:hover:bg-red-400/10 dark:hover:text-red-400"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 rounded-full border px-3 text-[10px]",
                      plan.isActive
                        ? "border-red-400/20 text-red-400 hover:bg-red-400/10"
                        : "border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/10",
                    )}
                    onClick={() => handleToggleStatus(plan)}
                  >
                    <Power className="mr-1.5 h-3 w-3" />
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>

              {/* Decorative Glow */}
              <div
                className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 opacity-10 blur-[60px]"
                style={{ backgroundColor: plan.color || "#F26522" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {initialPlans.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-surface-border bg-surface-card py-20 text-center dark:border-white/10 dark:bg-brand-navy">
          <Plus className="mx-auto mb-4 h-12 w-12 text-obsidian-200 dark:text-white/10" />
          <h3 className="font-display text-lg font-bold text-obsidian-950 dark:text-white">
            No plans created yet
          </h3>
          <p className="mb-6 text-sm text-obsidian-500 dark:text-white/40">
            Start by creating your first subscription tier.
          </p>
          <Button
            onClick={handleCreate}
            className="hover:bg-brand-orange-dark bg-brand-orange text-white"
          >
            Create First Plan
          </Button>
        </div>
      )}
    </div>
  );
}
