"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="relative min-h-screen flex items-center justify-center bg-obsidian-950">
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-gold-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/40 text-sm">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-medium text-white/60 uppercase tracking-wider">New Password</label>
                <div className="relative flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <Lock className="absolute left-4 w-4 h-4 text-white/30" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-white outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-medium text-white/60 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <ShieldCheck className="absolute left-4 w-4 h-4 text-white/30" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-white outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-sm hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20"
            >
              {isLoading ? "Updating..." : "Update Password"}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
