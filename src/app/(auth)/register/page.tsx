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
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Registration Page
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-950 py-12">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center transition-transform group-hover:rotate-12">
              <Dumbbell className="w-6 h-6 text-obsidian-950" />
            </div>
            <span className="font-display text-2xl font-bold text-white tracking-tighter">
              EAGLE<span className="text-gold-500">GYM</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Join the Elite</h1>
          <p className="text-white/40">Start your transformation journey today</p>
        </div>

        {/* Form Card */}
        <motion.div
          className="glass-card p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            <div className={cn("h-1 flex-1 rounded-full transition-colors", step >= 1 ? "bg-gold-500" : "bg-white/10")} />
            <div className={cn("h-1 flex-1 rounded-full transition-colors", step >= 2 ? "bg-gold-500" : "bg-white/10")} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-xs font-medium text-white/60 uppercase tracking-wider">First Name</label>
                    <div className={cn("relative flex items-center rounded-xl border bg-white/[0.03] transition-all", focusedField === "firstName" ? "border-gold-500/50 ring-1 ring-gold-500/20" : "border-white/10")}>
                      <User className="absolute left-4 w-4 h-4 text-white/30" />
                      <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white outline-none"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-xs font-medium text-white/60 uppercase tracking-wider">Last Name</label>
                    <div className={cn("relative flex items-center rounded-xl border bg-white/[0.03] transition-all", focusedField === "lastName" ? "border-gold-500/50 ring-1 ring-gold-500/20" : "border-white/10")}>
                      <User className="absolute left-4 w-4 h-4 text-white/30" />
                      <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-medium text-white/60 uppercase tracking-wider">Email Address</label>
                  <div className={cn("relative flex items-center rounded-xl border bg-white/[0.03] transition-all", focusedField === "email" ? "border-gold-500/50 ring-1 ring-gold-500/20" : "border-white/10")}>
                    <Mail className="absolute left-4 w-4 h-4 text-white/30" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-medium text-white/60 uppercase tracking-wider">Phone Number</label>
                  <div className={cn("relative flex items-center rounded-xl border bg-white/[0.03] transition-all", focusedField === "phone" ? "border-gold-500/50 ring-1 ring-gold-500/20" : "border-white/10")}>
                    <Phone className="absolute left-4 w-4 h-4 text-white/30" />
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
                >
                  Continue to Security
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs font-medium text-white/60 uppercase tracking-wider">Create Password</label>
                  <div className={cn("relative flex items-center rounded-xl border bg-white/[0.03] transition-all", focusedField === "password" ? "border-gold-500/50 ring-1 ring-gold-500/20" : "border-white/10")}>
                    <Lock className="absolute left-4 w-4 h-4 text-white/30" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-xs font-medium text-white/60 uppercase tracking-wider">Confirm Password</label>
                  <div className={cn("relative flex items-center rounded-xl border bg-white/[0.03] transition-all", focusedField === "confirmPassword" ? "border-gold-500/50 ring-1 ring-gold-500/20" : "border-white/10")}>
                    <ShieldCheck className="absolute left-4 w-4 h-4 text-white/30" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-sm hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20"
                  >
                    {isLoading ? "Creating Account..." : "Complete Registration"}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-white/40 hover:text-white/60 py-2 transition-colors"
                  >
                    Go back to details
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest text-white/20 bg-obsidian-900/50 px-4">Already a member?</div>
          </div>

          <Link
            href="/login"
            className="w-full flex items-center justify-center py-3.5 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all"
          >
            Sign In to your Account
          </Link>
        </motion.div>

        {/* Footer */}
        <p className="text-center mt-10 text-xs text-white/20">
          By joining, you agree to our <span className="text-white/40">Terms of Service</span> and <span className="text-white/40">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
