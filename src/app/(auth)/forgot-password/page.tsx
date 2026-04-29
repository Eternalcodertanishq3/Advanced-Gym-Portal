"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Dashboard Consistent Forgot Password Page
// ═══════════════════════════════════════════════════════════════

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch {
      toast.error("Failed to send reset link");
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
          className="surface-card p-8 sm:p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {!isSent ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-6 border border-brand-orange/20">
                <KeyRound className="w-8 h-8 text-brand-orange" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h1>
              <p className="text-txt-secondary text-sm mb-10 font-medium">
                No worries, we'll send you reset instructions to your registered email.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label htmlFor="email" className="label-text">Email Address</label>
                  <div className="relative group">
                    <Mail className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors",
                      isFocused ? "text-brand-orange" : "text-txt-tertiary"
                    )} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="surface-input pl-11"
                      placeholder="admin@eaglegym.in"
                    />
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
                      Send Reset Link
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 border border-success/20">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
              <p className="text-txt-secondary text-sm mb-10 font-medium leading-relaxed">
                We've sent a password reset link to <br/>
                <span className="text-foreground font-bold">{email}</span>
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-brand-orange hover:text-brand-orange-hover text-sm font-bold transition-colors underline underline-offset-4"
              >
                Didn't receive the email? Click to retry
              </button>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-surface-border">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-txt-tertiary hover:text-foreground transition-all group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
