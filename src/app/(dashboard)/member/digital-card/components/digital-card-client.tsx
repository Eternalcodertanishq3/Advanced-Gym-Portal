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
  Info,
  ArrowLeft,
  Dumbbell,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import Link from "next/link";

interface Props {
  member: any;
}

export function DigitalCardClient({ member }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-12 px-4 py-12">
      {/* Back Button */}
      <div className="flex w-full max-w-[400px] justify-start">
        <Link
          href="/member"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-txt-tertiary transition-colors hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-3 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          Digital <span className="text-brand-orange">Access Pass</span>
        </h1>
        <p className="mx-auto max-w-xs text-sm text-txt-secondary">
          Scan this at the reception desk to record your attendance.
        </p>
      </div>

      {/* Card Container */}
      <div className="perspective-1000 relative h-[240px] w-full max-w-[400px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="preserve-3d relative h-full w-full cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* FRONT SIDE */}
          <div
            className="backface-hidden absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-2xl"
            style={{
              background: `linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)`,
              transform: "translateZ(1px)",
            }}
          >
            {/* Holographic Overlays */}
            <div className="pointer-events-none absolute inset-0 bg-[url('/mesh-gradient.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-brand-orange/20 blur-[80px]" />

            {/* Top Row: Logo & Status */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/20 bg-brand-orange/10">
                  <Dumbbell className="h-6 w-6 text-brand-orange" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Eagle Gym
                  </p>
                  <p className="text-xs font-bold text-white">{planName} Member</p>
                </div>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                  isActive
                    ? "bg-success-soft text-success shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "bg-danger-soft text-danger",
                )}
              >
                <div
                  className={cn(
                    "h-1.5 w-1.5 animate-pulse rounded-full",
                    isActive ? "bg-success" : "bg-danger",
                  )}
                />
                {isActive ? "Active" : "Expired"}
              </div>
            </div>

            {/* Middle: Member Name */}
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-white">
                {member.user.firstName} <br />
                <span className="text-brand-orange">{member.user.lastName}</span>
              </h3>
            </div>

            {/* Bottom Row: ID & Branch */}
            <div className="relative z-10 flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Member ID
                </p>
                <p className="font-mono text-xs font-bold text-white/80">
                  {member.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Branch
                </p>
                <p className="text-xs font-bold text-white/80">
                  {member.user.branch?.name || "Global"}
                </p>
              </div>
            </div>

            {/* Card Chip Decoration */}
            <div className="absolute bottom-8 left-1/2 h-8 w-8 -translate-x-1/2 opacity-10">
              <Zap className="h-full w-full text-white" />
            </div>
          </div>

          {/* BACK SIDE */}
          <div
            className="backface-hidden absolute inset-0 h-full w-full overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-2xl"
            style={{
              background: `linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)`,
              transform: "rotateY(180deg) translateZ(1px)",
            }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <div className="absolute inset-0 bg-brand-orange/5 opacity-30 mix-blend-overlay" />

              <div className="relative z-10 rounded-3xl bg-white p-4 shadow-xl transition-transform duration-500 group-hover:scale-105">
                <QRCodeSVG value={member.userId} size={120} level="H" includeMargin={false} />
              </div>
              <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                Scan to Verify
              </p>
            </div>
          </div>
        </motion.div>

        {/* Flip Instruction Overlay */}
        <div className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 animate-bounce items-center gap-2 text-txt-tertiary">
          <Rotate3d className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Tap to flip</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid w-full max-w-[400px] grid-cols-2 gap-4">
        <button
          onClick={downloadCard}
          className="group flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface-elevated p-4 text-foreground transition-all hover:border-brand-orange/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-brand-orange/10">
            <Download className="h-5 w-5 group-hover:text-brand-orange" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold">Download</p>
            <p className="text-[10px] text-txt-tertiary">Save to Device</p>
          </div>
        </button>
        <button className="group flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface-elevated p-4 text-foreground transition-all hover:border-brand-orange/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-brand-orange/10">
            <Share2 className="h-5 w-5 group-hover:text-brand-orange" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold">Share Pass</p>
            <p className="text-[10px] text-txt-tertiary">Send to Wallet</p>
          </div>
        </button>
      </div>

      {/* Membership Info Footer */}
      <div className="grid w-full max-w-[400px] grid-cols-2 gap-4">
        <div className="surface-card space-y-1 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-2 text-txt-tertiary">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Plan Type</span>
          </div>
          <p className="text-lg font-bold text-foreground">{planName}</p>
          <p className="text-xs font-medium text-txt-secondary">
            Valid until{" "}
            {mounted && member.subscription?.endDate
              ? (() => {
                  const d = new Date(member.subscription.endDate);
                  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
                })()
              : "--/--/----"}
          </p>
        </div>
        <div className="surface-card space-y-1 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-2 text-txt-tertiary">
            <MapPin className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Check-ins</span>
          </div>
          <p className="text-lg font-bold text-foreground">{member._count?.attendance || 0} / 30</p>
          <p className="text-xs font-medium text-txt-secondary">This month</p>
        </div>
      </div>

      {/* Hidden container for HTML2Canvas to render the high-res version */}
      <div className="sr-only">
        <div
          ref={cardRef}
          className="flex h-[500px] w-[800px] flex-col justify-between rounded-[4rem] border-4 border-white/20 bg-[#0A0A0A] p-16 text-white"
        >
          {/* High res rendering of the card for download */}
          <div className="flex justify-between">
            <h1 className="font-display text-5xl font-bold">EAGLE GYM</h1>
            <div className="rounded-full border-2 border-success px-6 py-2 text-2xl font-bold uppercase text-success">
              Active
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-6xl font-bold uppercase">
              {member.user.firstName} {member.user.lastName}
            </h2>
            <p className="text-3xl tracking-[0.2em] text-white/50">{planName} MEMBER</p>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-xl uppercase tracking-[0.3em] text-white/30">Member ID</p>
                <p className="font-mono text-3xl">{member.memberId}</p>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-6">
              <QRCodeSVG value={member.userId} size={150} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
