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
    <footer className="bg-obsidian-950 border-t border-white/5 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-brand-orange flex items-center justify-center">
                <Image
                  src={gymLogo}
                  alt={gymName}
                  width={32}
                  height={32}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <span className="text-xl font-display font-black tracking-tighter text-white uppercase">
                {firstPart} <span className="text-brand-orange">{restPart}</span>
              </span>
            </Link>
            <p className="text-white/50 leading-relaxed text-sm">
              {config.gymMission || "Rise above your limits. Transform your life with our elite trainers, state-of-the-art equipment, and a community built on grit and ambition."}
            </p>
            <div className="flex items-center gap-4">
              {socials.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  title={social.title} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 rounded-lg hover:bg-brand-orange/20 hover:text-brand-orange transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-white/50 hover:text-brand-orange transition-colors text-sm">Features</Link></li>
              <li><Link href="#membership" className="text-white/50 hover:text-brand-orange transition-colors text-sm">Membership Plans</Link></li>
              <li><Link href="#branches" className="text-white/50 hover:text-brand-orange transition-colors text-sm">Our Branches</Link></li>
              <li><Link href="#about" className="text-white/50 hover:text-brand-orange transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white font-bold">Newsletter</h4>
            <p className="text-white/50 text-sm">Get fitness tips and gym updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange/50 transition-colors w-full"
              />
              <button title="Subscribe to newsletter" className="bg-brand-orange p-2.5 rounded-xl text-white shadow-lg shadow-brand-orange/20 hover:scale-105 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs tracking-widest uppercase font-bold">
            © {currentYear} {gymName.toUpperCase()} PORTAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Privacy Policy</Link>
            <Link href="/terms" className="text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);
