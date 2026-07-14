"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Search,
  Delete,
  CheckCircle2,
  XCircle,
  User,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { searchMemberByPhone, checkInMember } from "@/actions/admin/attendance-actions";

export function KioskClient() {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phone.length >= 4) {
      handleSearch();
    } else {
      setMember(null);
    }
  }, [phone]);

  const handleSearch = async () => {
    setLoading(true);
    const res = await searchMemberByPhone(phone);
    if (res.success) {
      setMember(res.data);
    } else {
      setMember(null);
    }
    setLoading(false);
  };

  const handleCheckIn = async () => {
    if (!member) return;
    setCheckingIn(true);
    const res = await checkInMember(member.id);
    if (res.success) {
      setSuccess(true);
      toast.success("Welcome back! Have a great workout!");
      setTimeout(() => {
        reset();
      }, 3000);
    } else {
      toast.error(res.error);
    }
    setCheckingIn(false);
  };

  const reset = () => {
    setPhone("");
    setMember(null);
    setSuccess(false);
  };

  const addDigit = (digit: string) => {
    if (phone.length < 10) setPhone((prev) => prev + digit);
  };

  const backspace = () => {
    setPhone((prev) => prev.slice(0, -1));
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-screen flex-col items-center justify-center bg-brand-navy p-10 text-center"
      >
        <div className="mb-8 flex h-48 w-48 animate-pulse items-center justify-center rounded-full border-4 border-success bg-success/20">
          <CheckCircle2 className="h-24 w-24 text-success" />
        </div>
        <h1 className="mb-4 font-display text-6xl font-bold uppercase tracking-tighter text-white">
          Access Granted
        </h1>
        <p className="mb-12 text-2xl font-medium text-white/60">
          Welcome, {member?.user?.firstName}! Enjoy your session.
        </p>
        <Button
          onClick={reset}
          className="rounded-2xl bg-white px-12 py-8 text-xl font-bold text-brand-navy hover:bg-white/90"
        >
          Back to Entry
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* Left Side: Input & Branding */}
      <div className="flex flex-col justify-between border-r border-border/50 p-12">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange shadow-brand-glow">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Eagle Gym <span className="text-brand-orange">Entry</span>
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-txt-tertiary">
              Self Check-in Portal
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <label className="ml-2 block text-sm font-bold uppercase tracking-widest text-txt-tertiary">
              Enter Phone or ID
            </label>
            <div className="relative">
              <Input
                ref={inputRef}
                readOnly
                placeholder="0000000000"
                value={phone}
                className="h-24 rounded-3xl border-none bg-surface-elevated px-8 font-display text-6xl font-bold tracking-widest text-brand-orange shadow-inner focus-visible:ring-2 focus-visible:ring-brand-orange/50"
              />
              <Search className="absolute right-8 top-1/2 h-10 w-10 -translate-y-1/2 text-brand-orange/20" />
            </div>
          </div>

          {/* NumPad */}
          <div className="mx-auto grid max-w-sm grid-cols-3 gap-4">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "DEL"].map((key) => (
              <Button
                key={key}
                onClick={() => {
                  if (key === "CLR") setPhone("");
                  else if (key === "DEL") backspace();
                  else addDigit(key);
                }}
                variant="outline"
                className={cn(
                  "h-20 rounded-2xl border-border/50 text-2xl font-bold transition-all hover:border-brand-orange hover:bg-brand-orange hover:text-white",
                  (key === "CLR" || key === "DEL") &&
                    "text-danger hover:border-danger hover:bg-danger",
                )}
              >
                {key}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-txt-tertiary">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          <span className="mx-2 opacity-30">|</span>
          <ShieldCheck className="h-4 w-4" />
          Secure Entry Point
        </div>
      </div>

      {/* Right Side: Member Card Preview */}
      <div className="relative flex items-center justify-center overflow-hidden bg-surface-sunken p-12">
        {/* Background Gradients */}
        <div className="absolute right-0 top-0 -mr-48 -mt-48 h-96 w-96 rounded-full bg-brand-orange/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -mb-48 -ml-48 h-96 w-96 rounded-full bg-brand-navy/20 blur-[100px]" />

        <AnimatePresence mode="wait">
          {!member ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 text-center"
            >
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-border bg-surface-elevated">
                <User className="h-16 w-16 text-txt-tertiary/20" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Waiting for input...
              </h3>
              <p className="mx-auto max-w-xs text-sm text-txt-tertiary">
                Please enter your registered phone number or scan your member ID.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="member"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="surface-card relative z-10 w-full max-w-md rounded-[3rem] border border-brand-orange/20 p-10 shadow-2xl"
            >
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="relative">
                  <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-brand-orange">
                    {member.user.avatar ? (
                      <img
                        src={member.user.avatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface-sunken">
                        <User className="h-12 w-12 text-txt-tertiary" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-success">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-3xl font-bold text-foreground">
                    {member.user.firstName} {member.user.lastName}
                  </h3>
                  <p className="mt-1 text-sm font-bold uppercase tracking-widest text-brand-orange">
                    {member.subscription?.plan?.name || "No Active Plan"}
                  </p>
                </div>

                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/50 bg-surface-sunken p-4 text-left">
                    <p className="mb-1 text-[10px] font-bold uppercase text-txt-tertiary">Status</p>
                    <p
                      className={cn(
                        "text-sm font-bold",
                        member.status === "ACTIVE" ? "text-success" : "text-danger",
                      )}
                    >
                      {member.status}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-surface-sunken p-4 text-left">
                    <p className="mb-1 text-[10px] font-bold uppercase text-txt-tertiary">
                      Valid Until
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {member.subscription?.endDate
                        ? new Date(member.subscription.endDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckIn}
                  disabled={checkingIn || member.status !== "ACTIVE"}
                  className="hover:bg-brand-orange-dark group w-full rounded-[2rem] bg-brand-orange py-10 text-2xl font-bold text-white shadow-lg shadow-brand-orange/30"
                >
                  {checkingIn ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <>
                      Confirm Entry
                      <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
                    </>
                  )}
                </Button>

                {member.status !== "ACTIVE" && (
                  <p className="flex items-center gap-2 text-sm font-bold text-danger">
                    <XCircle className="h-4 w-4" />
                    Subscription Inactive. Please see receptionist.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
