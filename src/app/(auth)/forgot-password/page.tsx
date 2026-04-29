"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

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
    <div className="relative min-h-screen flex items-center justify-center bg-obsidian-950">
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          className="glass-card p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {!isSent ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-gold-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-white/40 text-sm mb-8">
                No worries, we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="text-xs font-medium text-white/60 uppercase tracking-wider">Email Address</label>
                  <div className="relative flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                    <Mail className="absolute left-4 w-4 h-4 text-white/30" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-white outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-sm hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20"
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </button>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-obsidian-950" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-white/40 text-sm mb-8">
                We've sent a password reset link to <span className="text-white">{email}</span>
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
              >
                Didn't receive the email? Click to retry
              </button>
            </div>
          )}

          <Link
            href="/login"
            className="inline-flex items-center gap-2 mt-8 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
