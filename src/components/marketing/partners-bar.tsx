"use client";

import React from "react";
import { motion } from "framer-motion";

const partners = [
  "MATRIX", "ROGUE", "HAMMER STRENGTH", "LIFE FITNESS", "TECHNOGYM", "ELEIKO"
];

export function PartnersBar() {
  return (
    <section className="py-20 border-y border-white/5 bg-obsidian-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Official Equipment Partners</p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-20 items-center py-4">
          {[...partners, ...partners].map((partner, i) => (
            <span 
              key={i} 
              className="text-4xl md:text-6xl font-display font-black text-white/10 hover:text-brand-orange/40 transition-colors cursor-default select-none tracking-tighter"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
