"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function MarketingFooter({ config = {} }: { config?: Record<string, any> }) {
  const currentYear = new Date().getFullYear();
  const gymName = config.gymName || "GymFlow SaaS";
  const gymLogo = config.gymLogo || "/logo-white.png";
  const address = config.gymAddress || "123 Elite Fitness Ave, Downtown, New York, NY 10001";
  const phone = config.contactPhone || "+1 (555) 000-8888";
  const email = config.supportEmail || "support@gymflowsaas.com";

  const socials = [
    { icon: Instagram, href: config.instagramUrl || "#", title: "Instagram" },
    { icon: Facebook, href: config.facebookUrl || "#", title: "Facebook" },
    { icon: Twitter, href: config.twitterUrl || "#", title: "Twitter" },
    { icon: Youtube, href: config.youtubeUrl || "#", title: "Youtube" },
  ];

  const nameParts = gymName.split(" ");
  const firstPart = nameParts[0];
  const restPart = nameParts.slice(1).join(" ");

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-obsidian-950 pb-10 pt-20">
      {/* Decorative Gradient */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-orange/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-orange">
                <Image
                  src={gymLogo}
                  alt={gymName}
                  width={32}
                  height={32}
                  className="object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <span className="font-display text-xl font-black uppercase tracking-tighter text-white">
                {firstPart} <span className="text-brand-orange">{restPart}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50">
              {config.gymMission ||
                "Rise above your limits. Transform your life with our elite trainers, state-of-the-art equipment, and a community built on grit and ambition."}
            </p>
            <div className="flex items-center gap-4">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  title={social.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/5 p-2 transition-all hover:bg-brand-orange/20 hover:text-brand-orange"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-bold text-white">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-white/50 transition-colors hover:text-brand-orange"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#membership"
                  className="text-sm text-white/50 transition-colors hover:text-brand-orange"
                >
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link
                  href="#branches"
                  className="text-sm text-white/50 transition-colors hover:text-brand-orange"
                >
                  Our Branches
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-sm text-white/50 transition-colors hover:text-brand-orange"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-bold text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/50">
                <MapPin className="h-5 w-5 shrink-0 text-brand-orange" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Phone className="h-5 w-5 shrink-0 text-brand-orange" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Mail className="h-5 w-5 shrink-0 text-brand-orange" />
                <span>{email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-bold text-white">Newsletter</h4>
            <p className="text-sm text-white/50">
              Get fitness tips and gym updates delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors focus:border-brand-orange/50 focus:outline-none"
              />
              <button
                title="Subscribe to newsletter"
                className="rounded-xl bg-brand-orange p-2.5 text-white shadow-lg shadow-brand-orange/20 transition-transform hover:scale-105"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 md:flex-row">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">
            © {currentYear} {gymName.toUpperCase()} PORTAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            <Link
              href="/privacy"
              className="text-xs font-bold uppercase tracking-widest text-white/30 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-bold uppercase tracking-widest text-white/30 transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
