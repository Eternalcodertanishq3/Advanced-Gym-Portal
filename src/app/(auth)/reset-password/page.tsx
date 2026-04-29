"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 dark:opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6">
        <motion.div
          className="surface-card p-8 sm:p-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-6 border border-brand-orange/20">
              <Lock className="w-8 h-8 text-brand-orange" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-txt-secondary text-sm font-medium">Create a new secure password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="password" className="label-text">New Password</label>
                <div className="relative">
                  <Lock className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors",
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
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="label-text">Confirm New Password</label>
                <div className="relative">
                  <ShieldCheck className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors",
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
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-12 text-base font-bold shadow-brand-glow"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Update Password
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
