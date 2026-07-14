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
  gymName = "GymFlow SaaS",
  gymLogo = "/logo-white.png",
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
      className={`fixed left-0 right-0 top-0 z-[500] transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/5 bg-obsidian-950/80 py-4 backdrop-blur-md"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-orange shadow-lg shadow-brand-orange/20 transition-transform group-hover:scale-105">
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

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-white/70 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-bold text-white/70 transition-colors hover:text-white"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 transition-all hover:-translate-y-0.5 hover:shadow-brand-orange/40"
          >
            Join Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="p-2 text-white/70 transition-colors hover:text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 top-full flex flex-col gap-6 border-b border-white/5 bg-obsidian-900 p-6 shadow-2xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-white/70 transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-white/5" />
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="w-full py-3 text-center font-bold text-white/70 transition-colors hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="w-full rounded-xl bg-brand-orange py-4 text-center font-bold text-white shadow-lg shadow-brand-orange/20"
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
