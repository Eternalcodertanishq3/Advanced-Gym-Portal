"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { resetInitialPassword } from "@/actions/auth/reset-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const res = await resetInitialPassword(password);

    if (res.success) {
      setIsSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      toast.error(res.error || "Failed to update password");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1117] p-4">
      {/* Subtle Background Accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-brand-orange/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-success/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
            {isSuccess ? (
              <CheckCircle2 className="h-8 w-8 text-success" />
            ) : (
              <ShieldAlert className="h-8 w-8 text-brand-orange" />
            )}
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
            {isSuccess ? "Password Updated" : "Secure Your Account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSuccess
              ? "Your password has been changed successfully. Redirecting you to the dashboard..."
              : "You're logging in with a temporary password. For your security, please set a new private password."}
          </p>
        </div>

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-bold text-foreground/70">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-12 text-foreground transition-all placeholder:text-muted-foreground/30 focus:border-brand-orange/50 focus:outline-none"
                    placeholder="Create secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-sm font-bold text-foreground/70">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    required
                    name="confirm"
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-12 text-foreground transition-all placeholder:text-muted-foreground/30 focus:border-brand-orange/50 focus:outline-none"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 font-bold text-white shadow-lg shadow-brand-orange/20 transition-all hover:-translate-y-0.5 hover:shadow-brand-orange/40 active:translate-y-0 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
              {isSubmitting ? "Updating Security..." : "Secure Account & Login"}
            </button>

            <div className="flex items-center justify-center gap-2 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-success">
                End-to-End Encrypted
              </span>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
