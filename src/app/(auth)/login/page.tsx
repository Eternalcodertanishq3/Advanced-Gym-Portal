"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Dumbbell,
  ShieldCheck,
  Fingerprint,
  Github,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { check2FARequired, verify2FAOtp } from "@/actions/auth/two-factor-actions";

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
  const [authMethod, setAuthMethod] = useState<"password" | "magic-link">("password");
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (authMethod === "password" && !password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    if (show2FA) {
      if (twoFactorCode.length < 6) {
        toast.error("Please enter the complete 6-digit code");
        return;
      }
      setIsLoading(true);
      try {
        const verifyRes = await verify2FAOtp(email, twoFactorCode);
        if (verifyRes.success) {
          const result = await signIn("credentials", {
            email: email.trim().toLowerCase(),
            password,
            twoFactorVerified: "true",
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
        } else {
          toast.error(verifyRes.error || "Invalid 2FA code");
        }
      } catch {
        toast.error("Verification failed");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);

    try {
      if (authMethod === "password") {
        const checkRes = await check2FARequired(email, password);
        if (!checkRes.success) {
          toast.error(checkRes.error || "Authentication failed");
          setIsLoading(false);
          return;
        }

        if (checkRes.requires2FA) {
          setShow2FA(true);
          toast.success("Verification code sent to your email!");
          setIsLoading(false);
          return;
        }

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
      } else {
        const result = await signIn("resend", {
          email: email.trim().toLowerCase(),
          redirect: false,
          callbackUrl: "/",
        });

        if (result?.error) {
          toast.error(result.error);
          setIsLoading(false);
          return;
        }

        toast.success("Check your email for the sign-in link!");
        setIsLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      toast.error("Social login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePasskeySignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("passkey", {
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Passkey authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="bg-mesh-gradient absolute inset-0 opacity-30 dark:opacity-20" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[420px] px-6 py-8">
        {/* Brand Identity */}
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
            <Dumbbell className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            EAGLE <span className="text-brand-orange">GYM</span>
          </h1>
          <p className="mt-1 text-xs font-medium text-txt-secondary">
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
            <p className="mt-0.5 text-xs text-txt-tertiary">
              {authMethod === "password"
                ? "Please enter your credentials"
                : "Enter email for a magic link"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {show2FA ? (
              <div className="space-y-4 duration-300 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="twoFactorCode"
                    className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                  >
                    MFA Verification Code
                  </label>
                  <div className="group relative">
                    <ShieldCheck
                      className={cn(
                        "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
                        focusedField === "2fa" ? "text-brand-orange" : "text-txt-tertiary",
                      )}
                    />
                    <input
                      id="twoFactorCode"
                      type="text"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      onFocus={() => setFocusedField("2fa")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter 6-Digit Code"
                      className="surface-input h-11 pl-11 text-center text-sm font-bold tracking-[4px]"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed text-txt-tertiary">
                    A secure authentication code has been sent to your registered email address.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                  >
                    Email Address
                  </label>
                  <div className="group relative">
                    <Mail
                      className={cn(
                        "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
                        focusedField === "email" ? "text-brand-orange" : "text-txt-tertiary",
                      )}
                    />
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

                {/* Password Field (Only shown in password mode) */}
                {authMethod === "password" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                      >
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-[11px] font-bold text-brand-orange transition-colors hover:text-brand-orange-hover"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="group relative">
                      <Lock
                        className={cn(
                          "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
                          focusedField === "password" ? "text-brand-orange" : "text-txt-tertiary",
                        )}
                      />
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary transition-colors hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Toggle Sign In Method */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() =>
                      setAuthMethod(authMethod === "password" ? "magic-link" : "password")
                    }
                    className="text-xs font-bold text-brand-orange transition-colors hover:text-brand-orange-hover"
                  >
                    {authMethod === "password" ? "Use Magic Link instead" : "Use Password instead"}
                  </button>
                </div>

                {/* Remember Me (Only in password mode) */}
                {authMethod === "password" && (
                  <div className="flex items-center py-1">
                    <label className="group flex cursor-pointer select-none items-center gap-2">
                      <div
                        className={cn(
                          "flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-all duration-200",
                          rememberMe
                            ? "border-brand-orange bg-brand-orange"
                            : "border-surface-border group-hover:border-brand-orange/50",
                        )}
                        onClick={() => setRememberMe(!rememberMe)}
                      >
                        {rememberMe && <ShieldCheck className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-xs font-semibold text-txt-secondary transition-colors group-hover:text-foreground">
                        Remember me
                      </span>
                    </label>
                  </div>
                )}
              </>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary h-11 w-full text-sm font-bold active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {show2FA
                    ? "Verify & Sign In"
                    : authMethod === "password"
                      ? "Sign In to Dashboard"
                      : "Send Magic Link"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Sign In Providers */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-card px-3 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                  Or Sign In With
                </span>
              </div>
            </div>

            {/* Passkey Button */}
            <button
              type="button"
              onClick={handlePasskeySignIn}
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-base/30 text-sm font-bold text-foreground transition-all hover:bg-surface-base/50 active:scale-[0.98]"
            >
              <Fingerprint className="h-5 w-5 animate-pulse text-brand-orange" />
              Continue with Passkey
            </button>

            {/* OAuth Grid */}
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
                title="Sign in with Google"
                className="flex h-11 items-center justify-center rounded-xl border border-surface-border bg-surface-base/30 transition-all hover:bg-surface-base/50 active:scale-[0.98]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    style={{ fill: "#4285F4" }}
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    style={{ fill: "#34A853" }}
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    style={{ fill: "#FBBC05" }}
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    style={{ fill: "#EA4335" }}
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn("github")}
                disabled={isLoading}
                title="Sign in with GitHub"
                className="flex h-11 items-center justify-center rounded-xl border border-surface-border bg-surface-base/30 transition-all hover:bg-surface-base/50 active:scale-[0.98]"
              >
                <Github className="h-5 w-5 text-foreground" />
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn("microsoft-entra-id")}
                disabled={isLoading}
                title="Sign in with Microsoft"
                className="flex h-11 items-center justify-center rounded-xl border border-surface-border bg-surface-base/30 transition-all hover:bg-surface-base/50 active:scale-[0.98]"
              >
                <svg className="h-5 w-5" viewBox="0 0 23 23">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#7fba00" d="M12 1h10v10H12z" />
                  <path fill="#00a4ef" d="M1 12h10v10H1z" />
                  <path fill="#ffb900" d="M12 12h10v10H12z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn("apple")}
                disabled={isLoading}
                title="Sign in with Apple"
                className="flex h-11 items-center justify-center rounded-xl border border-surface-border bg-surface-base/30 transition-all hover:bg-surface-base/50 active:scale-[0.98]"
              >
                <svg className="h-5 w-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39" />
                </svg>
              </button>
            </div>
          </div>

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
              className="group inline-flex items-center gap-1 text-xs font-bold text-brand-orange transition-colors hover:text-brand-orange-hover"
            >
              Join Eagle Gym Today
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Social Proof/Trust */}
          <div className="mt-6 border-t border-surface-border pt-4 text-center">
            <p className="text-[10px] font-medium text-txt-tertiary">
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
          <p className="text-[10px] uppercase tracking-wider text-txt-tertiary">
            © {new Date().getFullYear()} Eagle Gym •{" "}
            <span className="font-bold text-brand-orange">Athletic Clarity</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
