"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
            <Lock className="h-4 w-4" /> GymFlow SaaS
          </div>
        </div>

        {/* Header Title */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10 shadow-brand-glow">
            <ShieldCheck className="h-6 w-6 text-brand-orange" />
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            Privacy <span className="text-brand-orange">Policy</span>
          </h1>
          <p className="mt-4 text-sm uppercase tracking-widest text-white/55">
            Last Updated: July 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="space-y-10 rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-sm leading-relaxed text-white/80 shadow-2xl backdrop-blur-md md:p-12">
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">01.</span> Information We Collect
            </h2>
            <p>
              GymFlow SaaS (Eagle Gym Portal) collects information to provide exceptional
              operational services to gym owners and members.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-white/70">
              <li>
                <strong>Profile Details</strong>: Name, email address, phone number, date of birth,
                emergency contacts.
              </li>
              <li>
                <strong>Billing Credentials</strong>: Transaction IDs, amounts, and dates from
                payment logs. Credit card or card numbers are processed directly by our gateway
                (Razorpay) and never stored locally.
              </li>
              <li>
                <strong>Biometrics & Activity</strong>: Timestamp logs of check-ins at kiosk
                scanners.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">02.</span> Multi-Tenant Data Isolation
            </h2>
            <p>
              To ensure compliance and data privacy, GymFlow SaaS enforces strict multi-tenant
              isolation.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-white/70">
              <li>Each gym workspace is isolated dynamically via tenant identification keys.</li>
              <li>
                Members can only access data, classes, or trainers related to their designated
                workspace tenant.
              </li>
              <li>No tenant metadata or credentials leak across branch or client scopes.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">03.</span> Cookies & Local Storage
            </h2>
            <p>
              We use secure cookies and local storage tokens to preserve active sessions (via
              NextAuth.js), keep page theme modes consistent, and persist search filters. These
              cookies contain no plaintext user identifiers and expire automatically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">04.</span> User Rights (Data Export & Deletion)
            </h2>
            <p>
              In compliance with international data regulations (such as GDPR), members have full
              self-service access to:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-white/70">
              <li>
                <strong>Request Data Export</strong>: Instantly download profile fields, check-ins,
                and transaction histories in standard CSV format.
              </li>
              <li>
                <strong>Request Account Deletion</strong>: Submit a formal request to soft-delete
                profile credentials. To prevent relational invoice breaks, records are archived and
                anonymized from active dashboards while maintaining accounting audit standards.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 border-b border-white/5 pb-2 text-lg font-black uppercase tracking-wider text-white">
              <span className="text-brand-orange">05.</span> Security Infrastructure
            </h2>
            <p>We enforce multi-tiered security controls:</p>
            <ul className="list-disc space-y-2 pl-5 text-white/70">
              <li>Encryption of sensitive tables using modern hashing algorithms (bcryptjs).</li>
              <li>Sliding window rate limit checks applied to public API endpoints.</li>
              <li>
                Strict Content Security Policy (CSP) and frame restriction headers active on every
                route page.
              </li>
            </ul>
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
