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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="bg-mesh-gradient absolute inset-0 opacity-30 dark:opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6">
        <motion.div
          className="surface-card p-8 text-center sm:p-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {!isSent ? (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
                <KeyRound className="h-8 w-8 text-brand-orange" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-foreground">Forgot Password?</h1>
              <p className="mb-10 text-sm font-medium text-txt-secondary">
                No worries, we'll send you reset instructions to your registered email.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label htmlFor="email" className="label-text">
                    Email Address
                  </label>
                  <div className="group relative">
                    <Mail
                      className={cn(
                        "absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 transition-colors",
                        isFocused ? "text-brand-orange" : "text-txt-tertiary",
                      )}
                    />
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
                  className="btn-primary h-12 w-full text-base font-bold shadow-brand-glow"
                >
                  {isLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="duration-500 animate-in fade-in zoom-in">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-success/20 bg-success/10">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-foreground">Check your email</h1>
              <p className="mb-10 text-sm font-medium leading-relaxed text-txt-secondary">
                We've sent a password reset link to <br />
                <span className="font-bold text-foreground">{email}</span>
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-sm font-bold text-brand-orange underline underline-offset-4 transition-colors hover:text-brand-orange-hover"
              >
                Didn't receive the email? Click to retry
              </button>
            </div>
          )}

          <div className="mt-10 border-t border-surface-border pt-6">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 text-sm font-bold text-txt-tertiary transition-all hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
