"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createBranch } from "@/actions/super-admin/branch-actions";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBranchModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
    };

    const res = await createBranch(data);
    
    if (res.success) {
      toast.success("Branch created successfully!");
      onClose();
    } else {
      toast.error(res.error || "Failed to create branch");
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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6 bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">Create New Branch</h2>
              <button onClick={onClose} title="Close" className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Branch Name</label>
                <input required name="name" type="text" className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-green/50 transition-colors" placeholder="e.g. Eagle Gym - Downtown" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Location (Short Area)</label>
                <input required name="location" type="text" className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-green/50 transition-colors" placeholder="e.g. Downtown, NY" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Full Address</label>
                <textarea name="address" rows={3} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-green/50 transition-colors" placeholder="Enter complete address..." />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Contact Phone</label>
                <input name="phone" type="text" className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-green/50 transition-colors" placeholder="+1 (555) 000-0000" />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-neon-green to-green-500 text-obsidian-950 font-bold rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? "Creating Branch..." : "Create Branch"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
