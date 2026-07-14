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
      toast.error("New passwords do not match");
      return;
    }
    if (formData.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
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
      <div className="surface-card relative overflow-hidden rounded-[2.5rem] border border-border/50 p-10 shadow-xl">
        {/* Decoration */}
        {/* Removed shield icon as requested */}

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
              <Key className="h-6 w-6 text-brand-orange" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                Security Protocol
              </h2>
              <p className="text-sm font-medium text-txt-tertiary">
                Update your credentials to maintain account integrity.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-black uppercase tracking-widest text-txt-tertiary">
                Current Password
              </label>
              <div className="group relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                  className="h-14 rounded-2xl border-border/50 bg-surface-sunken pl-6 pr-12 font-medium transition-all focus:border-brand-orange/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary transition-colors hover:text-brand-orange"
                >
                  {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase tracking-widest text-txt-tertiary">
                  New Password
                </label>
                <div className="group relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={formData.new}
                    onChange={(e) => setFormData({ ...formData, new: e.target.value })}
                    className="h-14 rounded-2xl border-border/50 bg-surface-sunken pl-6 pr-12 font-medium transition-all focus:border-brand-orange/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary transition-colors hover:text-brand-orange"
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase tracking-widest text-txt-tertiary">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  className="h-14 rounded-2xl border-border/50 bg-surface-sunken pl-6 font-medium transition-all focus:border-brand-orange/50"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-brand-navy/50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
              <p className="text-xs font-medium leading-relaxed text-txt-tertiary">
                Password must be at least{" "}
                <span className="font-bold text-foreground">8 characters long</span> and include a
                mix of uppercase, numbers, and special characters for maximum defense.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="hover:bg-brand-orange-dark flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-brand-orange font-bold text-white shadow-xl shadow-brand-orange/20 transition-all active:scale-95"
            >
              <Shield className="h-5 w-5" />
              {loading ? "Initializing..." : "Update Security Credentials"}
            </Button>
          </form>

          <div className="border-t border-border/50 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground">Two-Factor Authentication</h4>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                  Recommended for all elite members
                </p>
              </div>
              <Button
                variant="outline"
                className="h-10 cursor-not-allowed rounded-xl border-border/50 px-4 text-[10px] font-black uppercase tracking-widest opacity-50"
              >
                Enable
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
