"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PricingPlans({ plans = [] }: { plans?: any[] }) {
  // If no plans exist, show a fallback or message
  if (!plans || plans.length === 0) {
    return (
      <section id="membership" className="py-32 bg-obsidian-900 text-center">
        <p className="text-white/40 font-display font-black tracking-widest uppercase">Coming Soon...</p>
      </section>
    );
  }

  return (
    <section id="membership" className="py-32 bg-obsidian-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.3em]">Membership Plans</h2>
            <p className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">
              CHOOSE YOUR PATH TO <br />
              <span className="text-white/40">SUPREMACY.</span>
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isPopular = plan.name.toLowerCase().includes("premium") || (plans.length > 1 && idx === 1);
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-10 rounded-[32px] border ${
                  isPopular 
                    ? "bg-brand-orange border-brand-orange shadow-2xl shadow-brand-orange/20" 
                    : "bg-obsidian-950 border-white/5 hover:border-white/10 transition-colors"
                } flex flex-col`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-4 ${isPopular ? "text-white/80" : "text-brand-orange"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={`text-4xl md:text-5xl font-display font-black ${isPopular ? "text-white" : "text-white"}`}>₹{Number(plan.price).toLocaleString()}</span>
                    <span className={`text-sm font-bold ${isPopular ? "text-white/60" : "text-white/40"}`}>
                      /{plan.duration} {plan.duration === 1 ? 'mo' : 'mos'}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isPopular ? "text-white/80" : "text-white/50"}`}>
                    {plan.description || `Unlock your potential with our ${plan.name} tier designed for serious athletes.`}
                  </p>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPopular ? "bg-white/20" : "bg-brand-orange/10"}`}>
                        <Check className={`w-3 h-3 ${isPopular ? "text-white" : "text-brand-orange"}`} />
                      </div>
                      <span className={`text-sm font-medium ${isPopular ? "text-white" : "text-white/70"}`}>{feature}</span>
                    </li>
                  ))}
                  {plan.ptSessions > 0 && (
                    <li className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPopular ? "bg-white/20" : "bg-brand-orange/10"}`}>
                        <Check className={`w-3 h-3 ${isPopular ? "text-white" : "text-brand-orange"}`} />
                      </div>
                      <span className={`text-sm font-medium ${isPopular ? "text-white" : "text-white/70"}`}>{plan.ptSessions} PT Sessions included</span>
                    </li>
                  )}
                </ul>

                <Link
                  href="/register"
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 group ${
                    isPopular 
                      ? "bg-white text-brand-orange hover:bg-white/90" 
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Join Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
