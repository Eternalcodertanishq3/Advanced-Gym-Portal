"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createBranch } from "@/actions/super-admin/branch-actions";
import { toast } from "sonner";
import { Portal } from "@/components/common/portal";

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
                    <h2 className="text-xl font-display font-bold text-foreground">Create New Branch</h2>
                    <button type="button" onClick={onClose} title="Close" className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="createBranchName" className="text-sm font-bold text-foreground/70">Branch Name</label>
                      <input id="createBranchName" required name="name" type="text" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter branch name" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="createBranchLocation" className="text-sm font-bold text-foreground/70">Location (Short Area)</label>
                      <input id="createBranchLocation" required name="location" type="text" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter area/city" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="createBranchAddress" className="text-sm font-bold text-foreground/70">Full Address</label>
                      <textarea id="createBranchAddress" name="address" rows={3} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter complete address..." />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="createBranchPhone" className="text-sm font-bold text-foreground/70">Contact Phone</label>
                      <input id="createBranchPhone" name="phone" type="text" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter contact phone" />
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? "Creating Branch..." : "Create Branch"}
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
