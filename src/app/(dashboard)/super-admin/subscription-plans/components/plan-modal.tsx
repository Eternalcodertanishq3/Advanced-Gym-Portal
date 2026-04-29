"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, Trash2 } from "lucide-react";
import { createPlan, updatePlan, deletePlan } from "@/actions/super-admin/plan-actions";
import { toast } from "sonner";
import { Portal } from "@/components/common/portal";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  maxCheckIns: number;
  ptSessions: number;
  guestPasses: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null; // If plan is provided, we are editing
}

export function PlanModal({ isOpen, onClose, plan }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [features, setFeatures] = useState<string[]>([""]);

  useEffect(() => {
    if (plan) {
      setFeatures(plan.features.length > 0 ? plan.features : [""]);
    } else {
      setFeatures([""]);
    }
  }, [plan, isOpen]);

  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      duration: parseInt(formData.get("duration") as string),
      price: parseFloat(formData.get("price") as string),
      maxCheckIns: parseInt(formData.get("maxCheckIns") as string) || 0,
      ptSessions: parseInt(formData.get("ptSessions") as string) || 0,
      guestPasses: parseInt(formData.get("guestPasses") as string) || 0,
      features: features.filter(f => f.trim() !== ""),
    };

    let res;
    if (plan) {
      res = await updatePlan(plan.id, data);
    } else {
      res = await createPlan(data);
    }
    
    if (res.success) {
      toast.success(plan ? "Plan updated successfully!" : "Plan created successfully!");
      onClose();
    } else {
      toast.error(res.error || (plan ? "Failed to update plan" : "Failed to create plan"));
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!plan) return;
    if (!confirm("Are you sure you want to delete this plan? This action cannot be undone.")) return;

    setIsDeleting(true);
    const res = await deletePlan(plan.id);
    if (res.success) {
      toast.success("Plan deleted successfully!");
      onClose();
    } else {
      toast.error(res.error || "Failed to delete plan");
    }
    setIsDeleting(false);
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={onClose}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="pointer-events-auto w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-foreground">
                      {plan ? "Edit Subscription Plan" : "Create Subscription Plan"}
                    </h2>
                    <div className="flex items-center gap-2">
                      {plan && (
                        <button 
                          onClick={handleDelete}
                          disabled={isDeleting}
                          title="Delete Plan"
                          className="p-2 hover:bg-danger/10 rounded-lg text-danger/50 hover:text-danger transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      )}
                      <button type="button" onClick={onClose} title="Close" className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="planNameEdit" className="text-sm font-bold text-foreground/70">Plan Name</label>
                      <input id="planNameEdit" required name="name" type="text" title="Plan Name" defaultValue={plan?.name} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter plan name" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="planPriceEdit" className="text-sm font-bold text-foreground/70">Price (₹)</label>
                        <input id="planPriceEdit" required name="price" type="number" step="0.01" title="Price" defaultValue={plan?.price} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter price" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="planDurationEdit" className="text-sm font-bold text-foreground/70">Duration (Days)</label>
                        <input 
                            id="planDurationEdit"
                            name="duration"
                            type="number" 
                            title="Duration in days"
                            defaultValue={plan?.duration}
                            required
                            placeholder="Enter duration"
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="maxCheckInsEdit" className="text-sm font-bold text-foreground/70">Max Check-ins</label>
                        <input id="maxCheckInsEdit" name="maxCheckIns" type="number" title="Max Check-ins" defaultValue={plan?.maxCheckIns || 0} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 text-sm transition-colors" placeholder="0 = unlmt" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="ptSessionsEdit" className="text-sm font-bold text-foreground/70">PT Sessions</label>
                        <input id="ptSessionsEdit" name="ptSessions" type="number" title="PT Sessions" defaultValue={plan?.ptSessions || 0} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-brand-orange/50 text-sm transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="guestPassesEdit" className="text-sm font-bold text-foreground/70">Guest Passes</label>
                        <input id="guestPassesEdit" name="guestPasses" type="number" title="Guest Passes" defaultValue={plan?.guestPasses || 0} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-brand-orange/50 text-sm transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-foreground/70">Features</label>
                        <button type="button" onClick={handleAddFeature} className="text-xs text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 font-bold">
                          <Plus className="w-3 h-3" /> Add Feature
                        </button>
                      </div>
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            required
                            type="text"
                            title={`Feature ${idx + 1}`}
                            value={feature}
                            onChange={(e) => handleFeatureChange(idx, e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors"
                            placeholder={`Enter feature description`}
                          />
                          {features.length > 1 && (
                            <button type="button" onClick={() => handleRemoveFeature(idx)} title="Remove Feature" className="p-2 text-muted-foreground/30 hover:text-danger transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? (plan ? "Updating Plan..." : "Creating Plan...") : (plan ? "Update Subscription Plan" : "Create Subscription Plan")}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
