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
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-8">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 dark:opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20 mb-4">
            <Dumbbell className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            JOIN <span className="text-brand-orange">THE ELITE</span>
          </h1>
          <p className="text-xs text-txt-secondary mt-1 font-medium">Start your transformation journey today</p>
        </div>

        {/* Form Card */}
        <motion.div
          className="surface-card p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-1 rounded-full bg-surface-sunken overflow-hidden">
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
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">First Name</label>
                    <div className="relative">
                      <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", focusedField === "firstName" ? "text-brand-orange" : "text-txt-tertiary")} />
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
                    <label htmlFor="lastName" className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">Last Name</label>
                    <div className="relative">
                      <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", focusedField === "lastName" ? "text-brand-orange" : "text-txt-tertiary")} />
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
                  <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">Email Address</label>
                  <div className="relative">
                    <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", focusedField === "email" ? "text-brand-orange" : "text-txt-tertiary")} />
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
                  <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">Phone Number</label>
                  <div className="relative">
                    <Phone className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", focusedField === "phone" ? "text-brand-orange" : "text-txt-tertiary")} />
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
                  className="btn-primary w-full h-11 text-sm font-bold mt-2"
                >
                  Continue to Security
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">Create Password</label>
                  <div className="relative">
                    <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", focusedField === "password" ? "text-brand-orange" : "text-txt-tertiary")} />
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
                  <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-wider text-txt-tertiary">Confirm Password</label>
                  <div className="relative">
                    <ShieldCheck className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", focusedField === "confirmPassword" ? "text-brand-orange" : "text-txt-tertiary")} />
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

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full h-11 text-sm font-bold"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-txt-tertiary hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
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

          <Link
            href="/login"
            className="btn-ghost w-full h-11 text-xs font-bold border-2"
          >
            Sign In to your Account
          </Link>
        </motion.div>

        {/* Footer */}
        <p className="text-center mt-6 text-[10px] text-txt-tertiary leading-relaxed">
          By joining, you agree to our <Link href="/terms" className="text-brand-orange font-bold hover:underline">Terms</Link> and <Link href="/privacy" className="text-brand-orange font-bold hover:underline">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}
