"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";
import { createPlan } from "@/actions/super-admin/plan-actions";
import { toast } from "sonner";

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6 bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">Create Subscription Plan</h2>
              <button onClick={onClose} title="Close" className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Plan Name</label>
                <input required name="name" type="text" className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors" placeholder="e.g. Diamond Pro" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Price (₹)</label>
                  <input required name="price" type="number" step="0.01" className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors" placeholder="1500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Duration (Days)</label>
                  <input required name="duration" type="number" className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 transition-colors" placeholder="30" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Max Check-ins</label>
                  <input name="maxCheckIns" type="number" defaultValue={0} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gold-500/50 text-sm" placeholder="0 = unlmt" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">PT Sessions</label>
                  <input name="ptSessions" type="number" title="PT Sessions" defaultValue={0} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gold-500/50 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Guest Passes</label>
                  <input name="guestPasses" type="number" title="Guest Passes" defaultValue={0} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gold-500/50 text-sm" />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/70">Features</label>
                  <button type="button" onClick={handleAddFeature} className="text-xs text-gold-500 hover:text-gold-400 flex items-center gap-1 font-medium">
                    <Plus className="w-3 h-3" /> Add Feature
                  </button>
                </div>
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      required
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50"
                      placeholder={`Feature ${idx + 1}`}
                    />
                    {features.length > 1 && (
                      <button type="button" onClick={() => handleRemoveFeature(idx)} title="Remove Feature" className="p-2 text-white/30 hover:text-red-400 transition-colors">
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
                  className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? "Creating Plan..." : "Create Subscription Plan"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
