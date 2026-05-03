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
      title: 'Join Eagle Gym',
      text: `Join me at Eagle Gym and get 2000 bonus XP using my code: ${referralCode}`,
      url: window.location.origin + '/register?ref=' + referralCode
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(shareData.url);
      toast.success("Invite link copied! Share it with your friends.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Referral Card */}
      <div className="surface-card p-8 bg-brand-navy border-none relative overflow-hidden flex flex-col justify-center min-h-[400px] rounded-[2.5rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-transparent pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-8 text-center">
          <div className="w-20 h-20 rounded-3xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Gift className="w-10 h-10 text-brand-orange" />
          </div>
          
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-3">Invite Friends, Get <span className="text-brand-orange">XP</span></h2>
            <p className="text-white/60 text-sm max-w-[300px] mx-auto leading-relaxed">
              For every friend that joins Eagle Gym using your code, you both earn <span className="text-brand-orange font-black">2000 XP</span> and exclusive badges.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Your Unique Referral Code</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:border-brand-orange/30 transition-all">
              <span className="text-xl font-display font-bold text-white tracking-widest">{referralCode}</span>
              <button 
                onClick={copyToClipboard}
                aria-label="Copy referral code"
                className="p-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white transition-all shadow-lg shadow-brand-orange/20"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleShare}
              aria-label="Share invite link"
              className="w-full py-7 rounded-2xl bg-white text-brand-navy hover:bg-white/90 font-black uppercase tracking-widest text-sm shadow-xl"
            >
              <Share2 className="w-4 h-4 mr-2" /> Share Invite Link
            </Button>
          </div>
        </div>
      </div>

      {/* Info & Stats */}
      <div className="space-y-8">
        <div className="surface-card p-8 space-y-6 rounded-[2.5rem]">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <Star className="w-6 h-6 text-brand-orange" />
            How it Works
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center shrink-0 font-bold text-brand-orange border border-border/50">1</div>
              <div>
                <h4 className="font-bold text-foreground">Share your code</h4>
                <p className="text-xs text-txt-secondary leading-relaxed">Send your unique referral code or link to your friends via WhatsApp, Email, or Social Media.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center shrink-0 font-bold text-brand-orange border border-border/50">2</div>
              <div>
                <h4 className="font-bold text-foreground">Friend signs up</h4>
                <p className="text-xs text-txt-secondary leading-relaxed">Your friend uses your code during registration to unlock a special joining bonus.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center shrink-0 font-bold text-brand-orange border border-border/50">3</div>
              <div>
                <h4 className="font-bold text-foreground">Get rewarded</h4>
                <p className="text-xs text-txt-secondary leading-relaxed">Once their membership is active, your bonus XP is credited to your account automatically.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="surface-card p-6 text-center rounded-[2rem]">
            <p className="text-2xl font-display font-bold text-foreground">{referralCount}</p>
            <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest mt-1">Friends Referred</p>
          </div>
          <div className="surface-card p-6 text-center rounded-[2rem]">
            <p className="text-2xl font-display font-bold text-brand-orange">{totalReferralXP.toLocaleString()}</p>
            <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-widest mt-1">XP Earned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
