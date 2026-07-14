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
  AlertTriangle,
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
      <div className="flex min-h-screen items-center justify-center bg-brand-navy">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-20%] top-[-20%] h-[60%] w-[60%] animate-pulse rounded-full bg-brand-orange/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] h-[60%] w-[60%] rounded-full bg-brand-orange/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl"
      >
        <div className="h-2 bg-brand-orange" />

        <div className="p-8 md:p-12">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-orange/20 bg-brand-orange/10">
              <ShieldCheck className="h-10 w-10 text-brand-orange" />
            </div>
            <h1 className="mb-2 font-display text-3xl font-black tracking-tight text-foreground">
              SYSTEM <span className="text-brand-orange">IGNITION</span>
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              No administrator found. Please create the master Super Admin account to initialize the
              Eagle Gym Portal.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-10 text-center"
              >
                <div className="flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-success/30 bg-success/20">
                    <CheckCircle2 className="h-12 w-12 text-success" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Genesis Complete</h3>
                  <p className="text-muted-foreground">
                    The master account is now active. Redirecting you to login...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30" />
                      <input
                        required
                        name="firstName"
                        className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-4 text-foreground transition-colors focus:border-brand-orange/50 focus:outline-none"
                        placeholder="Master"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30" />
                      <input
                        required
                        name="lastName"
                        className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-4 text-foreground transition-colors focus:border-brand-orange/50 focus:outline-none"
                        placeholder="Admin"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30" />
                    <input
                      required
                      type="email"
                      name="email"
                      className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-4 text-foreground transition-colors focus:border-brand-orange/50 focus:outline-none"
                      placeholder="admin@eaglegym.in"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Master Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30" />
                      <input
                        required
                        type="password"
                        name="password"
                        className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-4 text-foreground transition-colors focus:border-brand-orange/50 focus:outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30" />
                      <input
                        required
                        type="password"
                        name="confirmPassword"
                        className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-4 text-foreground transition-colors focus:border-brand-orange/50 focus:outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-brand-orange/10 bg-brand-orange/5 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-brand-orange" />
                  <p className="text-[10px] font-medium leading-relaxed text-brand-orange">
                    CRITICAL: This is the primary master account. It has absolute control over all
                    branches, staff, and financial records. Ensure this password is kept strictly
                    confidential.
                  </p>
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-orange py-5 font-black text-white shadow-xl shadow-brand-orange/20 transition-all hover:-translate-y-1 hover:shadow-brand-orange/40 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>INITIALIZING...</span>
                    </>
                  ) : (
                    <>
                      <span>IGNITE PORTAL</span>
                      <ArrowRight className="h-5 w-5" />
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
