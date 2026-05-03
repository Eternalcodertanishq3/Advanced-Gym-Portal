"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  QrCode,
  CreditCard,
  MessageSquare,
  Users,
  Calendar,
  Package,
  TrendingUp,
  FileSpreadsheet,
  Bell,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Quick Actions Grid
// ═══════════════════════════════════════════════════════════════

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  color: "gold" | "green" | "cyan" | "purple" | "orange" | "pink";
  description: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Add Member",
    href: "/admin/members/new",
    icon: UserPlus,
    color: "gold",
    description: "Register new member",
  },
  {
    label: "Quick Check-In",
    href: "/receptionist/check-in",
    icon: QrCode,
    color: "green",
    description: "Scan or manual entry",
  },
  {
    label: "Collect Payment",
    href: "/receptionist/payments",
    icon: CreditCard,
    color: "cyan",
    description: "Record new payment",
  },
  {
    label: "Send Message",
    href: "/admin/notifications",
    icon: MessageSquare,
    color: "purple",
    description: "Broadcast or direct",
  },
  {
    label: "View Members",
    href: "/admin/members",
    icon: Users,
    color: "orange",
    description: "Browse all members",
  },
  {
    label: "Class Schedule",
    href: "/admin/classes",
    icon: Calendar,
    color: "pink",
    description: "Manage classes",
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Package,
    color: "gold",
    description: "Stock & POS",
  },
  {
    label: "Reports",
    href: "/admin/analytics",
    icon: TrendingUp,
    color: "green",
    description: "View analytics",
  },
];

const colorMap = {
  gold: {
    bg: "from-gold-500/20 to-gold-500/5",
    icon: "text-gold-400",
    hover: "group-hover:bg-gold-500/10",
    border: "group-hover:border-gold-500/30",
  },
  green: {
    bg: "from-neon-green/20 to-neon-green/5",
    icon: "text-neon-green",
    hover: "group-hover:bg-neon-green/10",
    border: "group-hover:border-neon-green/30",
  },
  cyan: {
    bg: "from-electric-cyan/20 to-electric-cyan/5",
    icon: "text-electric-cyan",
    hover: "group-hover:bg-electric-cyan/10",
    border: "group-hover:border-electric-cyan/30",
  },
  purple: {
    bg: "from-purple-500/20 to-purple-500/5",
    icon: "text-purple-400",
    hover: "group-hover:bg-purple-500/10",
    border: "group-hover:border-purple-500/30",
  },
  orange: {
    bg: "from-orange-500/20 to-orange-500/5",
    icon: "text-orange-400",
    hover: "group-hover:bg-orange-500/10",
    border: "group-hover:border-orange-500/30",
  },
  pink: {
    bg: "from-pink-500/20 to-pink-500/5",
    icon: "text-pink-400",
    hover: "group-hover:bg-pink-500/10",
    border: "group-hover:border-pink-500/30",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

export function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Quick Actions
        </h2>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 flex-1"
      >
        {quickActions.map((action) => {
          const colors = colorMap[action.color as keyof typeof colorMap];
          const Icon = action.icon;

          return (
            <motion.div key={action.label} variants={itemVariants}>
              <Link
                href={action.href}
                className={cn(
                  "group flex flex-col items-center justify-center gap-2.5 p-3.5 rounded-xl h-full",
                  "surface-card border border-border/40",
                  "hover:border-primary/40 hover:shadow-lg transition-all duration-300",
                  "active:scale-95"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                    colors.bg,
                    "group-hover:scale-105"
                  )}
                >
                  <Icon className={cn("w-5 h-5", colors.icon)} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-foreground/90 group-hover:text-primary transition-colors leading-tight">
                    {action.label}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}