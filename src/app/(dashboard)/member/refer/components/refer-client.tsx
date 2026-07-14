"use client";

import React from "react";
import { Gift, Copy, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  referralCode: string;
  referralCount: number;
  totalReferralXP: number;
}

export function ReferClient({ referralCode, referralCount, totalReferralXP }: Props) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  const handleShare = async () => {
    const shareData = {
      title: "Join Eagle Gym",
      text: `Join me at Eagle Gym and get 2000 bonus XP using my code: ${referralCode}`,
      url: window.location.origin + "/register?ref=" + referralCode,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(shareData.url);
      toast.success("Invite link copied! Share it with your friends.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Referral Card */}
      <div className="surface-card relative flex min-h-[400px] flex-col justify-center overflow-hidden rounded-[2.5rem] border-none bg-brand-navy p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-transparent" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 space-y-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-orange/30 bg-brand-orange/20 shadow-2xl">
            <Gift className="h-10 w-10 text-brand-orange" />
          </div>

          <div>
            <h2 className="mb-3 font-display text-3xl font-bold text-white">
              Invite Friends, Get <span className="text-brand-orange">XP</span>
            </h2>
            <p className="mx-auto max-w-[300px] text-sm leading-relaxed text-white/60">
              For every friend that joins Eagle Gym using your code, you both earn{" "}
              <span className="font-black text-brand-orange">2000 XP</span> and exclusive badges.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Your Unique Referral Code
            </p>
            <div className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-brand-orange/30">
              <span className="font-display text-xl font-bold tracking-widest text-white">
                {referralCode}
              </span>
              <button
                onClick={copyToClipboard}
                aria-label="Copy referral code"
                className="hover:bg-brand-orange-dark rounded-xl bg-brand-orange p-2 text-white shadow-lg shadow-brand-orange/20 transition-all"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleShare}
              aria-label="Share invite link"
              className="w-full rounded-2xl bg-white py-7 text-sm font-black uppercase tracking-widest text-brand-navy shadow-xl hover:bg-white/90"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Invite Link
            </Button>
          </div>
        </div>
      </div>

      {/* Info & Stats */}
      <div className="space-y-8">
        <div className="surface-card space-y-6 rounded-[2.5rem] p-8">
          <h3 className="flex items-center gap-3 text-xl font-bold text-foreground">
            <Star className="h-6 w-6 text-brand-orange" />
            How it Works
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-surface-sunken font-bold text-brand-orange">
                1
              </div>
              <div>
                <h4 className="font-bold text-foreground">Share your code</h4>
                <p className="text-xs leading-relaxed text-txt-secondary">
                  Send your unique referral code or link to your friends via WhatsApp, Email, or
                  Social Media.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-surface-sunken font-bold text-brand-orange">
                2
              </div>
              <div>
                <h4 className="font-bold text-foreground">Friend signs up</h4>
                <p className="text-xs leading-relaxed text-txt-secondary">
                  Your friend uses your code during registration to unlock a special joining bonus.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-surface-sunken font-bold text-brand-orange">
                3
              </div>
              <div>
                <h4 className="font-bold text-foreground">Get rewarded</h4>
                <p className="text-xs leading-relaxed text-txt-secondary">
                  Once their membership is active, your bonus XP is credited to your account
                  automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="surface-card rounded-[2rem] p-6 text-center">
            <p className="font-display text-2xl font-bold text-foreground">{referralCount}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
              Friends Referred
            </p>
          </div>
          <div className="surface-card rounded-[2rem] p-6 text-center">
            <p className="font-display text-2xl font-bold text-brand-orange">
              {totalReferralXP.toLocaleString()}
            </p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-txt-tertiary">
              XP Earned
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
