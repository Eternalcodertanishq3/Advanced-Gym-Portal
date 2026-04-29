"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Dumbbell, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Login Page with Sunrise Animation
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Sunrise Gradient */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.08) 40%, transparent 70%)",
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Horizon Glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), rgba(255, 165, 0, 0.3), transparent)",
          }}
        />

        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo & Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Animated Eagle Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-liquid-gold via-liquid-amber to-liquid-orange mb-6 shadow-2xl shadow-gold-500/20"
            animate={{
              boxShadow: [
                "0 0 30px rgba(255, 215, 0, 0.2)",
                "0 0 60px rgba(255, 215, 0, 0.3)",
                "0 0 30px rgba(255, 215, 0, 0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Dumbbell className="w-10 h-10 text-obsidian-950" />
          </motion.div>

          <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">
            EAGLE GYM
          </h1>
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Rise Above. Transform Beyond.
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-1">Welcome Back</h2>
            <p className="text-sm text-white/40">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Email Address
              </label>
              <div
                className={cn(
                  "relative flex items-center rounded-xl border bg-white/[0.03] transition-all duration-300",
                  focusedField === "email"
                    ? "border-gold-500/50 ring-1 ring-gold-500/20"
                    : "border-white/10"
                )}
              >
                <Mail className="absolute left-4 w-4 h-4 text-white/30" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Password
              </label>
              <div
                className={cn(
                  "relative flex items-center rounded-xl border bg-white/[0.03] transition-all duration-300",
                  focusedField === "password"
                    ? "border-gold-500/50 ring-1 ring-gold-500/20"
                    : "border-white/10"
                )}
              >
                <Lock className="absolute left-4 w-4 h-4 text-white/30" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-white/20 outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={cn(
                    "w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center",
                    rememberMe
                      ? "bg-gold-500 border-gold-500"
                      : "border-white/20 group-hover:border-white/40"
                  )}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && <Sparkles className="w-3 h-3 text-obsidian-950" />}
                </div>
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl",
                "bg-gradient-to-r from-liquid-gold via-liquid-amber to-liquid-orange",
                "text-obsidian-950 font-semibold text-sm",
                "shadow-lg shadow-gold-500/20",
                "hover:shadow-xl hover:shadow-gold-500/30 hover:brightness-110",
                "active:scale-[0.98]",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-obsidian-900 px-4 text-xs text-white/30">or</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
            >
              Join Eagle Gym
            </Link>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center mt-8 text-xs text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Sunrise Complex, Vrindavan Chowkdi, Vadodara
        </motion.p>
      </div>
    </div>
  );
};

export default LoginPage;