"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Loader2, 
  Dumbbell,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { createInitialSuperAdmin, isSetupRequired } from "@/actions/setup/setup-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SetupPage() {
  const [checking, setChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const required = await isSetupRequired();
      if (!required) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    };
    check();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const res = await createInitialSuperAdmin(data);
    if (res.success) {
      setSuccess(true);
      toast.success("Master Account Created!");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      toast.error(res.error || "Failed to ignite system");
      setIsSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-brand-orange/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-card border border-border rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="h-2 bg-brand-orange" />
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 flex items-center justify-center mb-6 border border-brand-orange/20">
              <ShieldCheck className="w-10 h-10 text-brand-orange" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight text-foreground mb-2">
              SYSTEM <span className="text-brand-orange">IGNITION</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              No administrator found. Please create the master Super Admin account to initialize the Eagle Gym Portal.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center border border-success/30">
                    <CheckCircle2 className="w-12 h-12 text-success" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Genesis Complete</h3>
                  <p className="text-muted-foreground">The master account is now active. Redirecting you to login...</p>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-black text-muted-foreground ml-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                      <input
                        required
                        name="firstName"
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:border-brand-orange/50 transition-colors"
                        placeholder="Master"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-black text-muted-foreground ml-1">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                      <input
                        required
                        name="lastName"
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:border-brand-orange/50 transition-colors"
                        placeholder="Admin"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                    <input
                      required
                      type="email"
                      name="email"
                      className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:border-brand-orange/50 transition-colors"
                      placeholder="admin@eaglegym.in"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-black text-muted-foreground ml-1">Master Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                      <input
                        required
                        type="password"
                        name="password"
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:border-brand-orange/50 transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-black text-muted-foreground ml-1">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                      <input
                        required
                        type="password"
                        name="confirmPassword"
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:border-brand-orange/50 transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-2xl p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-brand-orange shrink-0" />
                  <p className="text-[10px] text-brand-orange font-medium leading-relaxed">
                    CRITICAL: This is the primary master account. It has absolute control over all branches, staff, and financial records. Ensure this password is kept strictly confidential.
                  </p>
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-5 bg-brand-orange text-white font-black rounded-2xl shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>INITIALIZING...</span>
                    </>
                  ) : (
                    <>
                      <span>IGNITE PORTAL</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
