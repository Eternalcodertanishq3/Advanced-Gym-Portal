"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Dumbbell, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Dashboard Consistent Login Page
// ═══════════════════════════════════════════════════════════════

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Welcome back to Eagle Gym!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 dark:opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[420px] px-6 py-8">
        {/* Brand Identity */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20 mb-3">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            EAGLE <span className="text-brand-orange">GYM</span>
          </h1>
          <p className="text-xs text-txt-secondary mt-1 font-medium">
            Portal Access • Secure Authentication
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="surface-card p-6 sm:p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">Welcome Back</h2>
            <p className="text-xs text-txt-tertiary mt-0.5">Please enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                Email Address
              </label>
              <div className="relative group">
                <Mail className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200",
                  focusedField === "email" ? "text-brand-orange" : "text-txt-tertiary"
                )} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Email Address"
                  className="surface-input h-11 pl-11 text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-bold text-brand-orange hover:text-brand-orange-hover transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200",
                  focusedField === "password" ? "text-brand-orange" : "text-txt-tertiary"
                )} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="surface-input h-11 pl-11 pr-11 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div
                  className={cn(
                    "w-4.5 h-4.5 rounded border-2 transition-all duration-200 flex items-center justify-center",
                    rememberMe
                      ? "bg-brand-orange border-brand-orange"
                      : "border-surface-border group-hover:border-brand-orange/50"
                  )}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && <ShieldCheck className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs font-semibold text-txt-secondary group-hover:text-foreground transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 text-sm font-bold active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-card px-3 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                New Member?
              </span>
            </div>
          </div>

          {/* Join Link */}
          <div className="text-center">
            <Link
              href="/register"
              className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover transition-colors inline-flex items-center gap-1 group"
            >
              Join Eagle Gym Today
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Social Proof/Trust */}
          <div className="mt-6 pt-4 border-t border-surface-border text-center">
            <p className="text-[10px] text-txt-tertiary font-medium">
              Authorized personnel only. Access monitored.
            </p>
          </div>
        </motion.div>

        {/* Branding Footer */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[10px] text-txt-tertiary uppercase tracking-wider">
            © {new Date().getFullYear()} Eagle Gym • <span className="text-brand-orange font-bold">Athletic Clarity</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;