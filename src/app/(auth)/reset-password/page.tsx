"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowRight, CheckCircle2, Dumbbell, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resetInitialPassword } from "@/actions/auth/reset-actions";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Dashboard Consistent Reset Password Page
// ═══════════════════════════════════════════════════════════════

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetInitialPassword(password);
      if (res.success) {
        toast.success("Password updated! Please log in with your new password.");
        router.push("/login");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Premium Background Pattern (Consistent with Login) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 dark:opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6">
        {/* Brand Identity */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20 mb-3">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            EAGLE <span className="text-brand-orange">GYM</span>
          </h1>
        </motion.div>

        <motion.div
          className="surface-card p-8 sm:p-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-4 border border-brand-orange/20">
              <ShieldCheck className="w-8 h-8 text-brand-orange" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Secure Your Account</h2>
            <p className="text-txt-tertiary text-xs mt-1">You are using a temporary password. Please set a new permanent password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="password" crude-label="true" className="label-text">New Password</label>
                <div className="relative">
                  <Lock className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors z-10",
                    focusedField === "password" ? "text-brand-orange" : "text-txt-tertiary"
                  )} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="surface-input pl-11"
                    placeholder="Minimum 8 characters"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" crude-label="true" className="label-text">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors z-10",
                    focusedField === "confirmPassword" ? "text-brand-orange" : "text-txt-tertiary"
                  )} />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    className="surface-input pl-11"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-brand-orange shrink-0" />
              <p className="text-[10px] leading-relaxed text-txt-secondary">
                For your security, choose a password that you haven't used before and include a mix of letters, numbers, and symbols.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-12 text-sm font-bold shadow-brand-glow group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>
        
        <p className="text-center mt-8 text-[10px] text-txt-tertiary uppercase tracking-widest font-bold">
          Eagle Gym Management System v2.0
        </p>
      </div>
    </div>
  );
}
