"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Trash2 } from "lucide-react";
import { createBranch, updateBranch, deleteBranch } from "@/actions/super-admin/branch-actions";
import { toast } from "sonner";
import { Portal } from "@/components/common/portal";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Branch {
  id: string;
  name: string;
  location: string;
  address: string | null;
  phone: string | null;
  status: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branch?: Branch | null;
}

export function BranchModal({ isOpen, onClose, branch }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      status: formData.get("status") as any || "ACTIVE",
    };

    let res;
    if (branch) {
      res = await updateBranch(branch.id, data);
    } else {
      res = await createBranch(data);
    }
    
    if (res.success) {
      toast.success(branch ? "Branch updated successfully!" : "Branch created successfully!");
      onClose();
    } else {
      toast.error(res.error || (branch ? "Failed to update branch" : "Failed to create branch"));
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!branch) return;
    if (!confirm("Are you sure you want to delete this branch? It will be marked as CLOSED.")) return;

    setIsDeleting(true);
    const res = await deleteBranch(branch.id);
    if (res.success) {
      toast.success("Branch closed successfully!");
      onClose();
    } else {
      toast.error(res.error || "Failed to delete branch");
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
                      {branch ? "Edit Branch" : "Create New Branch"}
                    </h2>
                    <div className="flex items-center gap-2">
                      {branch && (
                        <button 
                          onClick={handleDelete}
                          disabled={isDeleting}
                          title="Delete Branch"
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
                      <label htmlFor="branchName" className="text-sm font-bold text-foreground/70">Branch Name</label>
                      <input id="branchName" required name="name" type="text" defaultValue={branch?.name} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter branch name" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="branchLocation" className="text-sm font-bold text-foreground/70">Location (Short Area)</label>
                      <input id="branchLocation" required name="location" type="text" defaultValue={branch?.location} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter area/city" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="branchAddress" className="text-sm font-bold text-foreground/70">Full Address</label>
                      <textarea id="branchAddress" name="address" rows={3} defaultValue={branch?.address || ""} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter complete address..." />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="branchPhone" className="text-sm font-bold text-foreground/70">Contact Phone</label>
                        <input id="branchPhone" name="phone" type="text" defaultValue={branch?.phone || ""} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-orange/50 transition-colors" placeholder="Enter contact phone" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="branchStatus" className="text-sm font-bold text-foreground/70">Status</label>
                        <Select name="status" defaultValue={branch?.status || "ACTIVE"}>
                          <SelectTrigger id="branchStatus" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 h-11 text-foreground focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border shadow-2xl rounded-xl z-[1100]">
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? (branch ? "Updating Branch..." : "Creating Branch...") : (branch ? "Update Branch" : "Save Branch Details")}
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
