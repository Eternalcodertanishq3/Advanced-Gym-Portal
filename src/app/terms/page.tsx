"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-obsidian-950 font-sans text-white selection:bg-brand-orange selection:text-white">
      {/* Decorative Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/5 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-brand-orange/5 blur-[160px]" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:py-24">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="gap-2 px-3 text-white/60 hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
            <Scale className="h-4 w-4" /> GymFlow SaaS
          </div>
        </div>

        {/* Header Title */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
            <FileText className="h-6 w-6 text-brand-orange" />
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            Terms of <span className="text-brand-orange">Service</span>
          </h1>
          <p className="mt-4 text-sm uppercase tracking-widest text-white/55">
            Last Updated: July 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="space-y-10 rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-sm leading-relaxed text-white/80 shadow-2xl backdrop-blur-md md:p-12">
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">01.</span> Acceptance of Terms
            </h2>
            <p>
              By registering an account, purchasing any subscription plan, or accessing any features
              of the <strong>GymFlow SaaS (Eagle Gym Portal)</strong>, you agree to comply with and
              be bound by these Terms of Service. If you do not agree to these terms, you are
              prohibited from utilizing any services hosted on this workspace.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">02.</span> Subscription & Payments
            </h2>
            <p>
              Subscriptions to our gym facilities are billed on a recurring billing cycle (monthly
              or annually) matching the selected plan.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-white/70">
              <li>All payments are processed securely via our gateway provider (Razorpay).</li>
              <li>
                Auto-renewal is enabled by default. To cancel future renewal charges, users must
                cancel their active membership plan at least 24 hours prior to the next billing
                cycle expiry.
              </li>
              <li>
                Subscriptions that remain unpaid after the expiration window are automatically
                marked as inactive, and facilities access (including biometric barcode kiosk
                check-in) will be blocked.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">03.</span> Refunds & Plan Modifications
            </h2>
            <p>
              GymFlow SaaS enforces a strict non-refundable policy on active subscriptions. However,
              if a user experiences billing discrepancies or failed checkout transactions, disputes
              can be submitted via the contact desk.
            </p>
            <p>
              Upgrades to active plans are processed immediately on a pro-rated billing adjustments
              scale. Downgrades are delayed until the expiration of the current billing cycle to
              ensure continuity of service limits.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">04.</span> Account Integrity & Impersonation
            </h2>
            <p>
              Users are solely responsible for protecting their account login details and
              multi-factor authentication (MFA/2FA) tokens. GymFlow SaaS retains live audit records
              of all administrative actions (impersonation sessions, config modifications) to
              prevent relational leaks and ensure strict multi-tenant isolation protocols.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">05.</span> Terminations & Access Holds
            </h2>
            <p>
              Platform administrators reserve the right to suspend or terminate accounts that
              violate community rules, engage in suspicious API access behaviors, or trigger
              emergency lock locks. Suspended accounts are immediately prohibited from logging into
              all portals.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">06.</span> Compliance & Governing Law
            </h2>
            <p>
              These Terms are governed by local SaaS licensing statutes and regulations. If any
              provision of these terms is deemed invalid by a court of competent jurisdiction, the
              remaining terms shall survive in full force and effect.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs font-bold uppercase tracking-widest text-white/30">
          © {currentYear} GymFlow SaaS Portal. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
