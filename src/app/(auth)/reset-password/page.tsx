"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resetInitialPassword } from "@/actions/auth/reset-actions";
import { resetPasswordWithToken } from "@/actions/auth/reset-token-actions";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Dashboard Consistent Reset Password Page
// ═══════════════════════════════════════════════════════════════

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

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
      if (token) {
        // Token reset flow (from forgot-password email link)
        const res = await resetPasswordWithToken(token, password);
        if (res.success) {
          toast.success("Password updated! Please log in with your new credentials.");
          router.push("/login");
        } else {
          toast.error(res.error || "Failed to reset password");
        }
      } else {
        // Initial password reset flow (logged in user)
        const res = await resetInitialPassword(password);
        if (res.success) {
          toast.success("Password updated! Please log in with your new credentials.");
          signOut({ callbackUrl: "/login" });
        } else {
          toast.error(res.error || "Failed to reset password");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Premium Background Pattern (Consistent with Login) */}
      <div className="absolute inset-0 z-0">
        <div className="bg-mesh-gradient absolute inset-0 opacity-30 dark:opacity-20" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6">
        {/* Brand Identity */}
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
            <Dumbbell className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-foreground">
            EAGLE <span className="text-brand-orange">GYM</span>
          </h1>
        </motion.div>

        <motion.div
          className="surface-card p-8 sm:p-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
              <ShieldCheck className="h-8 w-8 text-brand-orange" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Secure Your Account</h2>
            <p className="mt-1 text-xs text-txt-tertiary">
              You are using a temporary password. Please set a new permanent password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="password" crude-label="true" className="label-text">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className={cn(
                      "absolute left-4 top-1/2 z-10 h-4.5 w-4.5 -translate-y-1/2 transition-colors",
                      focusedField === "password" ? "text-brand-orange" : "text-txt-tertiary",
                    )}
                  />
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
                <label htmlFor="confirmPassword" crude-label="true" className="label-text">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck
                    className={cn(
                      "absolute left-4 top-1/2 z-10 h-4.5 w-4.5 -translate-y-1/2 transition-colors",
                      focusedField === "confirmPassword"
                        ? "text-brand-orange"
                        : "text-txt-tertiary",
                    )}
                  />
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

            <div className="flex gap-3 rounded-xl border border-brand-orange/10 bg-brand-orange/5 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-brand-orange" />
              <p className="text-[10px] leading-relaxed text-txt-secondary">
                For your security, choose a password that you haven't used before and include a mix
                of letters, numbers, and symbols.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary group h-12 w-full text-sm font-bold shadow-brand-glow"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Update Password
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
          Eagle Gym Management System v2.0
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
