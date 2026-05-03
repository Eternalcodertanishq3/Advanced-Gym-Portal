"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Membership", href: "#membership" },
  { name: "Branches", href: "#branches" },
  { name: "About", href: "#about" },
];

export function MarketingNav({ 
  gymName = "EAGLE GYM",
  gymLogo = "/logo-white.png"
}: { 
  gymName?: string;
  gymLogo?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Split gym name into two parts for styling if possible
  const nameParts = gymName.split(" ");
  const firstPart = nameParts[0];
  const restPart = nameParts.slice(1).join(" ");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 ${
        isScrolled
          ? "bg-obsidian-950/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20 group-hover:scale-105 transition-transform">
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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-white/70 hover:text-white transition-colors px-4 py-2"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="bg-brand-orange text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            Join Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-obsidian-900 border-b border-white/5 p-6 md:hidden flex flex-col gap-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-white/5" />
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="w-full py-3 text-center font-bold text-white/70 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="w-full py-4 bg-brand-orange text-white text-center font-bold rounded-xl shadow-lg shadow-brand-orange/20"
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
