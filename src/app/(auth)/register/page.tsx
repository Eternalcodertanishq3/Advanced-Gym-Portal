"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Dumbbell,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth/register-actions";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Dashboard Consistent Registration Page
// ═══════════════════════════════════════════════════════════════

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error("Please fill in all basic details");
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (res.success) {
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
      } else {
        toast.error(res.error || "Registration failed. Please try again.");
      }
    } catch (error: unknown) {
      toast.error(
        (error instanceof Error ? error.message : String(error)) ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-8">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="bg-mesh-gradient absolute inset-0 opacity-30 dark:opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20"
          >
            <Dumbbell className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            JOIN <span className="text-brand-orange">THE ELITE</span>
          </h1>
          <p className="mt-1 text-xs font-medium text-txt-secondary">
            Start your transformation journey today
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          className="surface-card p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Progress Bar */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-sunken">
              <motion.div
                className="h-full bg-brand-orange"
                initial={{ width: "50%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.5, ease: "circOut" }}
              />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-txt-tertiary">
              Step {step} of 2
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <div className="space-y-4 duration-300 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="firstName"
                      className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <User
                        className={cn(
                          "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                          focusedField === "firstName" ? "text-brand-orange" : "text-txt-tertiary",
                        )}
                      />
                      <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        className="surface-input h-11 pl-11 text-sm"
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lastName"
                      className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <User
                        className={cn(
                          "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                          focusedField === "lastName" ? "text-brand-orange" : "text-txt-tertiary",
                        )}
                      />
                      <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={() => setFocusedField(null)}
                        className="surface-input h-11 pl-11 text-sm"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className={cn(
                        "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                        focusedField === "email" ? "text-brand-orange" : "text-txt-tertiary",
                      )}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="surface-input h-11 pl-11 text-sm"
                      placeholder="Email Address"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className={cn(
                        "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                        focusedField === "phone" ? "text-brand-orange" : "text-txt-tertiary",
                      )}
                    />
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className="surface-input h-11 pl-11 text-sm"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary mt-2 h-11 w-full text-sm font-bold"
                >
                  Continue to Security
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 duration-300 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                  >
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={cn(
                        "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                        focusedField === "password" ? "text-brand-orange" : "text-txt-tertiary",
                      )}
                    />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="surface-input h-11 pl-11 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      className={cn(
                        "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                        focusedField === "confirmPassword"
                          ? "text-brand-orange"
                          : "text-txt-tertiary",
                      )}
                    />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      className="surface-input h-11 pl-11 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary h-11 w-full text-sm font-bold"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-txt-tertiary transition-colors hover:text-foreground"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Back to Details
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-card px-3 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                Already a member?
              </span>
            </div>
          </div>

          <Link href="/login" className="btn-ghost h-11 w-full border-2 text-xs font-bold">
            Sign In to your Account
          </Link>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-[10px] leading-relaxed text-txt-tertiary">
          By joining, you agree to our{" "}
          <Link href="/terms" className="font-bold text-brand-orange hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-bold text-brand-orange hover:underline">
            Privacy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
