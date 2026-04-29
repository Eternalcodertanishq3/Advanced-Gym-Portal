"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      router.push("/dashboard");
    } catch {
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-obsidian-950">
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          className="glass-card p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-gold-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Identity</h1>
          <p className="text-white/40 text-sm mb-10">
            We've sent a 6-digit code to your email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2">
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
                  className="w-12 h-14 rounded-xl border border-white/10 bg-white/[0.03] text-center text-xl font-bold text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 outline-none transition-all"
                />
              ))}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-sm hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
              
              <button
                type="button"
                className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Resend code in 0:59
              </button>
            </div>
          </form>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 mt-10 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
