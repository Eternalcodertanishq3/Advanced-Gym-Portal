"use client";

import React, { useState } from "react";
import { Shield, Key, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/actions/member/profile-actions";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ current: "", new: "", confirm: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new !== formData.confirm) {
      return toast.error("New passwords do not match");
    }
    if (formData.new.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    setLoading(true);
    const res = await updatePassword({ current: formData.current, new: formData.new });
    if (res.success) {
      toast.success("Password updated successfully");
      setFormData({ current: "", new: "", confirm: "" });
    } else {
      toast.error(res.error || "Failed to update password");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="surface-card p-10 rounded-[2.5rem] border border-border/50 shadow-xl overflow-hidden relative">
        {/* Decoration */}
        {/* Removed shield icon as requested */}

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-brand-glow">
              <Key className="w-6 h-6 text-brand-orange" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground uppercase tracking-tight">Security Protocol</h2>
              <p className="text-sm text-txt-tertiary font-medium">Update your credentials to maintain account integrity.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-txt-tertiary uppercase tracking-widest ml-1">Current Password</label>
              <div className="relative group">
                <Input 
                  type={showCurrent ? "text" : "password"}
                  value={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                  className="h-14 bg-surface-sunken border-border/50 rounded-2xl pl-6 pr-12 focus:border-brand-orange/50 transition-all font-medium"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary hover:text-brand-orange transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-txt-tertiary uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <Input 
                    type={showNew ? "text" : "password"}
                    value={formData.new}
                    onChange={(e) => setFormData({ ...formData, new: e.target.value })}
                    className="h-14 bg-surface-sunken border-border/50 rounded-2xl pl-6 pr-12 focus:border-brand-orange/50 transition-all font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary hover:text-brand-orange transition-colors"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-txt-tertiary uppercase tracking-widest ml-1">Confirm New Password</label>
                <Input 
                  type="password"
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  className="h-14 bg-surface-sunken border-border/50 rounded-2xl pl-6 focus:border-brand-orange/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-navy/50 border border-border/50 flex items-start gap-4">
               <AlertCircle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
               <p className="text-xs text-txt-tertiary leading-relaxed font-medium">
                 Password must be at least <span className="text-foreground font-bold">8 characters long</span> and include a mix of uppercase, numbers, and special characters for maximum defense.
               </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-2xl shadow-xl shadow-brand-orange/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Shield className="w-5 h-5" />
              {loading ? "Initializing..." : "Update Security Credentials"}
            </Button>
          </form>

          <div className="pt-8 border-t border-border/50">
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-sm font-bold text-foreground">Two-Factor Authentication</h4>
                   <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mt-1">Recommended for all elite members</p>
                </div>
                <Button variant="outline" className="rounded-xl border-border/50 font-black text-[10px] uppercase tracking-widest h-10 px-4 opacity-50 cursor-not-allowed">
                  Enable
                </Button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
