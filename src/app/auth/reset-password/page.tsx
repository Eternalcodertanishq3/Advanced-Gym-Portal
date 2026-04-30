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
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 flex items-center justify-center mb-4 border border-brand-orange/30">
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-success" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-brand-orange" />
            )}
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">
            {isSuccess ? "Password Updated" : "Secure Your Account"}
          </h1>
          <p className="text-white/60 text-sm">
            {isSuccess 
              ? "Your password has been changed. Redirecting to dashboard..." 
              : "You are logging in with a temporary password. Please set a new, private password to continue."}
          </p>
        </div>

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50 transition-colors"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    required
                    name="confirm"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50 transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-orange text-white font-bold rounded-2xl shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? "Updating..." : "Update Password & Continue"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
