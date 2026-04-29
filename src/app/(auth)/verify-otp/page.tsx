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
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 dark:opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-[480px] px-6">
        <motion.div
          className="surface-card p-8 sm:p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-6 border border-brand-orange/20">
            <ShieldCheck className="w-8 h-8 text-brand-orange" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Verify Identity</h1>
          <p className="text-txt-secondary text-sm mb-10 font-medium">
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
                  className="w-11 h-14 sm:w-14 sm:h-16 rounded-xl border-2 border-surface-border bg-surface-sunken text-center text-2xl font-bold text-foreground focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 outline-none transition-all"
                />
              ))}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full h-12 text-base font-bold shadow-brand-glow"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="inline-flex items-center gap-2 text-xs font-bold text-txt-tertiary hover:text-brand-orange transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend code in 0:59
              </button>
            </div>
          </form>

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
