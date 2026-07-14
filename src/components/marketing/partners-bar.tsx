"use client";

import React from "react";
import { motion } from "framer-motion";

const partners = ["MATRIX", "ROGUE", "HAMMER STRENGTH", "LIFE FITNESS", "TECHNOGYM", "ELEIKO"];

export function PartnersBar() {
  return (
    <section className="overflow-hidden border-y border-white/5 bg-obsidian-950 py-20">
      <div className="mx-auto mb-10 max-w-7xl px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
          Official Equipment Partners
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <div className="animate-marquee flex items-center gap-20 whitespace-nowrap py-4">
          {[...partners, ...partners].map((partner, i) => (
            <span
              key={i}
              className="cursor-default select-none font-display text-4xl font-black tracking-tighter text-white/10 transition-colors hover:text-brand-orange/40 md:text-6xl"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
