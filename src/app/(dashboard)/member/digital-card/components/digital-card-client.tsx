"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  Download, 
  Share2, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Rotate3d,
  CreditCard,
  Zap,
  Info
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";

interface Props {
  member: any;
}

export function DigitalCardClient({ member }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 3,
    });
    const link = document.createElement("a");
    link.download = `EagleGym_Card_${member.memberId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const isActive = member.status === "ACTIVE";
  const planName = member.subscription?.plan?.name || "No Active Plan";
  const planColor = member.subscription?.plan?.color || "#F26522";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 space-y-12">
      {/* Header Info */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
          Digital <span className="text-brand-orange">Access Pass</span>
        </h1>
        <p className="text-txt-secondary text-sm max-w-xs mx-auto">
          Scan this at the reception desk to record your attendance.
        </p>
      </div>

      {/* Card Container */}
      <div className="relative perspective-1000 w-full max-w-[400px] h-[240px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="w-full h-full relative preserve-3d cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* FRONT SIDE */}
          <div 
            className="absolute inset-0 backface-hidden w-full h-full p-8 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between"
            style={{ 
              background: `linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)`,
            }}
          >
            {/* Holographic Overlays */}
            <div className="absolute inset-0 bg-[url('/mesh-gradient.png')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-orange/20 blur-[80px] rounded-full" />
            
            {/* Top Row: Logo & Status */}
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <img src="/logo-icon.png" alt="Logo" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Eagle Gym</p>
                  <p className="text-xs font-bold text-white">Elite Member</p>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5",
                isActive ? "bg-success-soft text-success shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "bg-danger-soft text-danger"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isActive ? "bg-success" : "bg-danger")} />
                {isActive ? "Active" : "Expired"}
              </div>
            </div>

            {/* Middle: Member Name */}
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-bold text-white tracking-tight uppercase leading-tight">
                {member.user.firstName} <br />
                <span className="text-brand-orange">{member.user.lastName}</span>
              </h3>
            </div>

            {/* Bottom Row: ID & Branch */}
            <div className="flex justify-between items-end relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Member ID</p>
                <p className="text-xs font-mono font-bold text-white/80">{member.memberId}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Branch</p>
                <p className="text-xs font-bold text-white/80">{member.user.branch?.name || "Global"}</p>
              </div>
            </div>

            {/* Card Chip Decoration */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 opacity-10">
               <Zap className="w-full h-full text-white" />
            </div>
          </div>

          {/* BACK SIDE */}
          <div 
            className="absolute inset-0 backface-hidden w-full h-full p-8 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-4"
            style={{ 
              background: `linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)`,
              transform: 'rotateY(180deg)'
            }}
          >
             <div className="absolute inset-0 bg-brand-orange/5 mix-blend-overlay opacity-30" />
             
             <div className="bg-white p-4 rounded-3xl shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-500">
               <QRCodeSVG 
                 value={member.userId} 
                 size={120} 
                 level="H" 
                 includeMargin={false}
                 imageSettings={{
                    src: "/logo-icon.png",
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                 }}
               />
             </div>
             <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] relative z-10">
               Scan to Verify
             </p>
          </div>
        </motion.div>

        {/* Flip Instruction Overlay */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-txt-tertiary animate-bounce">
          <Rotate3d className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Tap to flip</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
        <button 
          onClick={downloadCard}
          className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-elevated border border-border hover:border-brand-orange/30 text-foreground transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
            <Download className="w-5 h-5 group-hover:text-brand-orange" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold">Download</p>
            <p className="text-[10px] text-txt-tertiary">Save to Device</p>
          </div>
        </button>
        <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-elevated border border-border hover:border-brand-orange/30 text-foreground transition-all group">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
            <Share2 className="w-5 h-5 group-hover:text-brand-orange" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold">Share Pass</p>
            <p className="text-[10px] text-txt-tertiary">Send to Wallet</p>
          </div>
        </button>
      </div>

      {/* Membership Info Footer */}
      <div className="w-full max-w-[400px] grid grid-cols-2 gap-4">
         <div className="surface-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-txt-tertiary mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Plan Type</span>
            </div>
            <p className="text-lg font-bold text-foreground">{planName}</p>
            <p className="text-xs text-txt-secondary font-medium">Valid until {member.subscription?.endDate ? new Date(member.subscription.endDate).toLocaleDateString() : "N/A"}</p>
         </div>
         <div className="surface-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-txt-tertiary mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Check-ins</span>
            </div>
            <p className="text-lg font-bold text-foreground">12 / 30</p>
            <p className="text-xs text-txt-secondary font-medium">This month</p>
         </div>
      </div>

      {/* Hidden container for HTML2Canvas to render the high-res version */}
      <div className="sr-only">
        <div ref={cardRef} className="w-[800px] h-[500px] p-16 rounded-[4rem] bg-[#0A0A0A] border-4 border-white/20 flex flex-col justify-between text-white">
             {/* High res rendering of the card for download */}
             <div className="flex justify-between">
                <h1 className="text-5xl font-display font-bold">EAGLE GYM</h1>
                <div className="px-6 py-2 rounded-full border-2 border-success text-success text-2xl font-bold uppercase">Active</div>
             </div>
             <div className="space-y-2">
                <h2 className="text-6xl font-display font-bold uppercase">{member.user.firstName} {member.user.lastName}</h2>
                <p className="text-3xl text-white/50 tracking-[0.2em]">{planName} MEMBER</p>
             </div>
             <div className="flex justify-between items-end">
                <div className="space-y-4">
                   <div>
                      <p className="text-xl text-white/30 uppercase tracking-[0.3em]">Member ID</p>
                      <p className="text-3xl font-mono">{member.memberId}</p>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem]">
                   <QRCodeSVG value={member.userId} size={150} />
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
