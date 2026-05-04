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
  Loader2
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
    if (phone.length < 10) setPhone(prev => prev + digit);
  };

  const backspace = () => {
    setPhone(prev => prev.slice(0, -1));
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-screen bg-brand-navy p-10 text-center"
      >
        <div className="w-48 h-48 rounded-full bg-success/20 flex items-center justify-center mb-8 border-4 border-success animate-pulse">
           <CheckCircle2 className="w-24 h-24 text-success" />
        </div>
        <h1 className="text-6xl font-display font-bold text-white mb-4 uppercase tracking-tighter">Access Granted</h1>
        <p className="text-2xl text-white/60 font-medium mb-12">Welcome, {member?.user?.firstName}! Enjoy your session.</p>
        <Button onClick={reset} className="bg-white text-brand-navy hover:bg-white/90 text-xl px-12 py-8 rounded-2xl font-bold">
           Back to Entry
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side: Input & Branding */}
      <div className="p-12 flex flex-col justify-between border-r border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center shadow-brand-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Eagle Gym <span className="text-brand-orange">Entry</span></h2>
            <p className="text-sm text-txt-tertiary font-bold uppercase tracking-widest">Self Check-in Portal</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-sm font-bold text-txt-tertiary uppercase tracking-widest block ml-2">Enter Phone or ID</label>
            <div className="relative">
              <Input
                ref={inputRef}
                readOnly
                placeholder="0000000000"
                value={phone}
                className="text-6xl font-display font-bold h-24 px-8 bg-surface-elevated border-none rounded-3xl text-brand-orange tracking-widest focus-visible:ring-2 focus-visible:ring-brand-orange/50 shadow-inner"
              />
              <Search className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 text-brand-orange/20" />
            </div>
          </div>

          {/* NumPad */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
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
                  "h-20 text-2xl font-bold rounded-2xl border-border/50 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all",
                  (key === "CLR" || key === "DEL") && "text-danger hover:bg-danger hover:border-danger"
                )}
              >
                {key}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-txt-tertiary font-bold text-xs">
          <Clock className="w-4 h-4" />
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          <span className="mx-2 opacity-30">|</span>
          <ShieldCheck className="w-4 h-4" />
          Secure Entry Point
        </div>
      </div>

      {/* Right Side: Member Card Preview */}
      <div className="bg-surface-sunken p-12 flex items-center justify-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 blur-[100px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-navy/20 blur-[100px] rounded-full -ml-48 -mb-48" />

        <AnimatePresence mode="wait">
          {!member ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="w-32 h-32 bg-surface-elevated rounded-full flex items-center justify-center mx-auto border border-border">
                <User className="w-16 h-16 text-txt-tertiary/20" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">Waiting for input...</h3>
              <p className="text-sm text-txt-tertiary max-w-xs mx-auto">Please enter your registered phone number or scan your member ID.</p>
            </motion.div>
          ) : (
            <motion.div
              key="member"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md surface-card p-10 rounded-[3rem] shadow-2xl relative z-10 border border-brand-orange/20"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-orange">
                    {member.user.avatar ? (
                      <img src={member.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface-sunken flex items-center justify-center">
                        <User className="w-12 h-12 text-txt-tertiary" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-success flex items-center justify-center border-4 border-background">
                     <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-display font-bold text-foreground">{member.user.firstName} {member.user.lastName}</h3>
                  <p className="text-brand-orange font-bold text-sm tracking-widest uppercase mt-1">{member.subscription?.plan?.name || "No Active Plan"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 rounded-2xl bg-surface-sunken border border-border/50 text-left">
                    <p className="text-[10px] font-bold text-txt-tertiary uppercase mb-1">Status</p>
                    <p className={cn(
                      "text-sm font-bold",
                      member.status === 'ACTIVE' ? "text-success" : "text-danger"
                    )}>{member.status}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-sunken border border-border/50 text-left">
                    <p className="text-[10px] font-bold text-txt-tertiary uppercase mb-1">Valid Until</p>
                    <p className="text-sm font-bold text-foreground">
                      {member.subscription?.endDate ? new Date(member.subscription.endDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckIn}
                  disabled={checkingIn || member.status !== 'ACTIVE'}
                  className="w-full py-10 rounded-[2rem] bg-brand-orange hover:bg-brand-orange-dark text-white text-2xl font-bold shadow-lg shadow-brand-orange/30 group"
                >
                  {checkingIn ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      Confirm Entry
                      <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </Button>

                {member.status !== 'ACTIVE' && (
                  <p className="text-danger text-sm font-bold flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
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

