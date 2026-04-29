"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";
import { createPlan } from "@/actions/super-admin/plan-actions";
import { toast } from "sonner";
import { Portal } from "@/components/common/portal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlanModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>([""]);

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

    const res = await createPlan(data);
    
    if (res.success) {
      toast.success("Plan created successfully!");
      onClose();
    } else {
      toast.error(res.error || "Failed to create plan");
    }
    
    setIsSubmitting(false);
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
                    <h2 className="text-xl font-display font-bold text-foreground">Create Subscription Plan</h2>
                    <button type="button" onClick={onClose} title="Close" className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="planName" className="text-sm font-bold text-foreground/70">Plan Name</label>
                      <input id="planName" required name="name" type="text" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter plan name" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="planPrice" className="text-sm font-bold text-foreground/70">Price (₹)</label>
                        <input id="planPrice" required name="price" type="number" step="0.01" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter price" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="planDuration" className="text-sm font-bold text-foreground/70">Duration (Days)</label>
                        <input id="planDuration" required name="duration" type="number" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter duration" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="maxCheckIns" className="text-sm font-bold text-foreground/70">Max Check-ins</label>
                        <input id="maxCheckIns" name="maxCheckIns" type="number" defaultValue={0} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 text-sm transition-colors" placeholder="0 = unlmt" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="ptSessions" className="text-sm font-bold text-foreground/70">PT Sessions</label>
                        <input id="ptSessions" name="ptSessions" type="number" title="PT Sessions" defaultValue={0} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-brand-orange/50 text-sm transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="guestPasses" className="text-sm font-bold text-foreground/70">Guest Passes</label>
                        <input id="guestPasses" name="guestPasses" type="number" title="Guest Passes" defaultValue={0} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-brand-orange/50 text-sm transition-colors" />
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
                        {isSubmitting ? "Creating Plan..." : "Create Subscription Plan"}
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
