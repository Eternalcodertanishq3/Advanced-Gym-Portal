"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MEMBERSHIP_FEATURES } from "@/lib/constants/features";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formatDuration = (days: number) => {
  if (!days) return "";
  if (days % 30 === 0) {
    const months = days / 30;
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  return `${days} days`;
};

export function PricingPlans({ plans = [] }: { plans?: any[] }) {
  // If no plans exist, show a fallback or message
  if (!plans || plans.length === 0) {
    return (
      <section id="membership" className="bg-obsidian-900 py-32 text-center">
        <p className="font-display font-black uppercase tracking-widest text-white/40">
          Coming Soon...
        </p>
      </section>
    );
  }

  return (
    <section id="membership" className="bg-obsidian-900 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-brand-orange">
              Membership Plans
            </h2>
            <p className="font-display text-4xl font-black tracking-tighter text-white md:text-5xl">
              CHOOSE YOUR PATH TO <br />
              <span className="text-white/40">SUPREMACY.</span>
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          {plans.map((plan, idx) => {
            const isPopular =
              plan.name.toLowerCase().includes("premium") || (plans.length > 1 && idx === 1);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-[32px] border p-10 ${
                  isPopular
                    ? "border-brand-orange bg-brand-orange shadow-2xl shadow-brand-orange/20"
                    : "border-white/5 bg-obsidian-950 transition-colors hover:border-white/10"
                } flex flex-col`}
              >
                {isPopular && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3
                    className={`mb-4 text-xs font-black uppercase tracking-[0.3em] ${isPopular ? "text-white/80" : "text-brand-orange"}`}
                  >
                    {plan.name}
                  </h3>
                  <div className="mb-4 flex items-baseline gap-1">
                    <span
                      className={`font-display text-4xl font-black md:text-5xl ${isPopular ? "text-white" : "text-white"}`}
                    >
                      ₹{Number(plan.price).toLocaleString()}
                    </span>
                    <span
                      className={`text-sm font-bold ${isPopular ? "text-white/60" : "text-white/40"}`}
                    >
                      /{formatDuration(Number(plan.duration))}
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${isPopular ? "text-white/80" : "text-white/50"}`}
                  >
                    {plan.description ||
                      `Unlock your potential with our ${plan.name} tier designed for serious athletes.`}
                  </p>
                </div>

                <ul className="mb-10 flex-grow space-y-4">
                  {plan.features.slice(0, 6).map((fId: string) => {
                    const feature = MEMBERSHIP_FEATURES.find((f) => f.id === fId);
                    return (
                      <li key={fId} className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPopular ? "bg-white/20" : "bg-brand-orange/10"}`}
                        >
                          <Check
                            className={`h-3 w-3 ${isPopular ? "text-white" : "text-brand-orange"}`}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${isPopular ? "text-white" : "text-white/70"}`}
                        >
                          {feature?.label || fId}
                        </span>
                      </li>
                    );
                  })}
                  {plan.ptSessions > 0 && (
                    <li className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPopular ? "bg-white/20" : "bg-brand-orange/10"}`}
                      >
                        <Check
                          className={`h-3 w-3 ${isPopular ? "text-white" : "text-brand-orange"}`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${isPopular ? "text-white" : "text-white/70"}`}
                      >
                        {plan.ptSessions} PT Sessions included
                      </span>
                    </li>
                  )}
                  {plan.features.length > 6 && (
                    <li className="flex items-center gap-3 pl-8">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={`text-xs font-bold italic underline decoration-brand-orange/30 underline-offset-4 transition-all hover:decoration-brand-orange ${isPopular ? "text-white/60" : "text-white/40"}`}
                          >
                            + {plan.features.length - 6} more features included
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 border-white/10 bg-obsidian-900 p-4 shadow-2xl">
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-brand-orange">
                              All Premium Benefits
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {plan.features.map((fId: string) => {
                                const feature = MEMBERSHIP_FEATURES.find((f) => f.id === fId);
                                return (
                                  <div
                                    key={fId}
                                    className="flex items-center gap-2 border-b border-white/5 py-1 last:border-0"
                                  >
                                    <Check className="h-3 w-3 text-brand-orange" />
                                    <span className="text-xs text-white/70">
                                      {feature?.label || fId}
                                    </span>
                                  </div>
                                );
                              })}
                              {plan.ptSessions > 0 && (
                                <div className="mt-1 flex items-center gap-2 border-t border-white/5 py-1 pt-2">
                                  <Check className="h-3 w-3 text-brand-orange" />
                                  <span className="text-xs font-bold text-white">
                                    {plan.ptSessions} PT Sessions included
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </li>
                  )}
                </ul>

                <Link
                  href="/register"
                  className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-[0.1em] transition-all ${
                    isPopular
                      ? "bg-white text-brand-orange hover:bg-white/90"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  Join Now{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
