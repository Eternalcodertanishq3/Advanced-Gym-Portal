"use client";

import React from "react";
import { Hammer, RefreshCw } from "lucide-react";

export default function MaintenancePage() {
  const handleReload = () => {
    window.location.href = "/";
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian-950 px-4 text-center text-white">
      {/* Ambient glassmorphic glowing circle */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/10 blur-[120px]" />

      <div className="z-10 max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-orange/20 bg-brand-orange/5 p-4 text-brand-orange shadow-[0_0_50px_rgba(249,115,22,0.15)]">
            <Hammer className="h-10 w-10 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Under <span className="text-brand-orange">Maintenance</span>
          </h1>
          <p className="text-base leading-relaxed text-obsidian-300">
            Our systems are currently undergoing scheduled upgrades to optimize athletic clarity and
            platform speed. We'll be back shortly!
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={handleReload}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 text-sm font-semibold text-white shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.02] hover:bg-brand-orange/90 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Check Connection
          </button>
        </div>

        <div className="text-[11px] font-medium uppercase tracking-wider text-obsidian-500">
          GymFlow SaaS • Performance Hub
        </div>
      </div>
    </div>
  );
}
