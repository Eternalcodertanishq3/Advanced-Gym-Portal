"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Dashboard Consistent OTP Verification Page
// ═══════════════════════════════════════════════════════════════

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Identity verified!");
      router.push("/");
    } catch {
      toast.error("Invalid verification code");
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

      <div className="relative z-10 w-full max-w-[480px] px-6">
        <motion.div
          className="surface-card p-8 text-center sm:p-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
            <ShieldCheck className="h-8 w-8 text-brand-orange" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Verify Identity</h1>
          <p className="mb-10 text-sm font-medium text-txt-secondary">
            We've sent a secure 6-digit code to your email. <br className="hidden sm:block" />
            Please enter it below to confirm access.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  aria-label={`Digit ${i + 1}`}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-14 w-11 rounded-xl border-2 border-surface-border bg-surface-sunken text-center text-2xl font-bold text-foreground outline-none transition-all focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 sm:h-16 sm:w-14"
                />
              ))}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary h-12 w-full text-base font-bold shadow-brand-glow"
              >
                {isLoading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 text-xs font-bold text-txt-tertiary transition-colors hover:text-brand-orange"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Resend code in 0:59
              </button>
            </div>
          </form>

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
