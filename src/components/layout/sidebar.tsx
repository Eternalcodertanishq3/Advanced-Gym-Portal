"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Crown,
  Shield,
  UserCheck,
  ClipboardList,
  Package,
  Wrench,
  Bell,
  FileText,
  HelpCircle,
  Sparkles,
  Award,
  MessageSquare,
  Utensils,
  TrendingUp,
  Zap,
  Clock,
  QrCode,
  ShoppingCart,
  HeartPulse,
  Camera,
  Target,
  Flame,
  Medal,
  Trophy,
  Gift,
  Share2,
  Droplets,
  Pill,
  BookOpen,
  Stethoscope,
  Briefcase,
  UserCog,
  Building2,
  Database,
  History,
  Lock,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { getRoleDashboard, getRoleBadgeClass, getRoleLabel } from "@/lib/rbac";
import { ROLES } from "@/lib/constants";
import type { Role } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Glassmorphism Sidebar
// ═══════════════════════════════════════════════════════════════

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredRole?: Role[];
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: Record<Role, NavSection[]> = {
  SUPER_ADMIN: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
        { label: "Revenue Analytics", href: "/super-admin/revenue", icon: TrendingUp },
        { label: "Audit Logs", href: "/super-admin/audit-logs", icon: History },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Admins", href: "/super-admin/admins", icon: Shield },
        { label: "System Config", href: "/super-admin/system-config", icon: Settings },
        { label: "Subscription Plans", href: "/super-admin/subscription-plans", icon: Crown },
        { label: "Branches", href: "/super-admin/branches", icon: Building2 },
      ],
    },
    {
      title: "Data",
      items: [
        { label: "Backups", href: "/super-admin/backups", icon: Database },
      ],
    },
  ],

  ADMIN: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { label: "Live Occupancy", href: "/admin/attendance/live", icon: Eye },
      ],
    },
    {
      title: "People",
      items: [
        { label: "Members", href: "/admin/members", icon: Users },
        { label: "Trainers", href: "/admin/trainers", icon: Dumbbell },
        { label: "Receptionists", href: "/admin/receptionists", icon: UserCheck },
        { label: "Staff", href: "/admin/staff", icon: Briefcase },
      ],
    },
    {
      title: "Operations",
      items: [
        { label: "Payments", href: "/admin/payments", icon: CreditCard },
        { label: "Attendance", href: "/admin/attendance", icon: Clock },
        { label: "Classes", href: "/admin/classes", icon: Calendar },
        { label: "Equipment", href: "/admin/equipment", icon: Wrench },
      ],
    },
    {
      title: "Business",
      items: [
        { label: "Inventory", href: "/admin/inventory", icon: Package },
        { label: "Notifications", href: "/admin/notifications", icon: Bell },
        { label: "Documents", href: "/admin/documents", icon: FileText },
      ],
    },
  ],

  RECEPTIONIST: [
    {
      title: "Quick Actions",
      items: [
        { label: "Dashboard", href: "/receptionist", icon: LayoutDashboard },
        { label: "Check-In", href: "/receptionist/check-in", icon: QrCode },
        { label: "Walk-In", href: "/receptionist/walk-in", icon: UserCheck },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Members", href: "/receptionist/members", icon: Users },
        { label: "Payments", href: "/receptionist/payments", icon: CreditCard },
        { label: "Today's Schedule", href: "/receptionist/schedule", icon: Clock },
        { label: "Visitor Pass", href: "/receptionist/visitor-pass", icon: Gift },
      ],
    },
  ],

  TRAINER: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/trainer", icon: LayoutDashboard },
        { label: "My Members", href: "/trainer/my-members", icon: Users },
        { label: "My Schedule", href: "/trainer/schedule", icon: Calendar },
      ],
    },
    {
      title: "Training",
      items: [
        { label: "Workouts", href: "/trainer/workouts", icon: Dumbbell },
        { label: "Diet Plans", href: "/trainer/diet", icon: Utensils },
        { label: "PT Sessions", href: "/trainer/sessions", icon: Clock },
        { label: "Progress", href: "/trainer/progress", icon: TrendingUp },
      ],
    },
  ],

  MEMBER: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/member", icon: LayoutDashboard },
        { label: "Digital Card", href: "/member/digital-card", icon: QrCode },
        { label: "My Subscription", href: "/member/subscription", icon: Crown },
      ],
    },
    {
      title: "Fitness",
      items: [
        { label: "Workout Plan", href: "/member/workout", icon: Dumbbell },
        { label: "Diet Plan", href: "/member/diet", icon: Utensils },
        { label: "Progress", href: "/member/progress", icon: TrendingUp },
        { label: "Progress Photos", href: "/member/progress/photos", icon: Camera },
        { label: "Goals", href: "/member/progress", icon: Target },
      ],
    },
    {
      title: "Activities",
      items: [
        { label: "Book Classes", href: "/member/classes", icon: Calendar },
        { label: "My Bookings", href: "/member/classes/my-bookings", icon: BookOpen },
        { label: "My Trainer", href: "/member/trainer", icon: UserCog },
      ],
    },
    {
      title: "Gamification",
      items: [
        { label: "Achievements", href: "/member/achievements", icon: Award },
        { label: "Leaderboard", href: "/member/leaderboard", icon: Trophy },
        { label: "Challenges", href: "/member/challenges", icon: Flame },
      ],
    },
    {
      title: "Wellness",
      items: [
        { label: "Nutrition Log", href: "/member/nutrition", icon: Droplets },
        { label: "Supplements", href: "/member/nutrition/supplements", icon: Pill },
        { label: "Messages", href: "/member/messages", icon: MessageSquare },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Payments", href: "/member/payments", icon: CreditCard },
        { label: "Refer & Earn", href: "/member/refer", icon: Share2 },
        { label: "Profile", href: "/member/profile", icon: UserCog },
      ],
    },
  ],

  WORKER: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/worker", icon: LayoutDashboard },
        { label: "My Tasks", href: "/worker/tasks", icon: ClipboardList },
      ],
    },
    {
      title: "Operations",
      items: [
        { label: "Equipment", href: "/worker/equipment", icon: Wrench },
        { label: "Cleaning", href: "/worker/cleaning", icon: Sparkles },
      ],
    },
  ],
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user: storeUser, setUser } = useAuthStore();
  const { data: session } = useSession();

  // Sync session with store
  useEffect(() => {
    if (session?.user && !storeUser) {
      setUser(session.user as any);
    }
  }, [session, storeUser, setUser]);

  const user = session?.user || storeUser;
  const role = (user?.role ?? "MEMBER") as Role;
  const sections = navSections[role] ?? navSections.MEMBER;

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        aria-label="Toggle Mobile Menu"
        className="fixed top-4 left-4 z-30 lg:hidden w-10 h-10 rounded-xl glass-card flex items-center justify-center text-gold-400"
      >
        <LayoutDashboard className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          x: mobileOpen ? 0 : 0, // Always 0 on desktop, handled by classes
          opacity: 1, // Always 1 on desktop
        }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen flex flex-col transition-all duration-300",
          "bg-card/80 backdrop-blur-2xl border-r border-border shadow-sm",
          "lg:translate-x-0 lg:opacity-100",
          !mobileOpen && "translate-x-[-100%] lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-[280px]"
        )}
      >
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <span className="text-primary-foreground font-black text-xl italic tracking-tighter">E</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-base font-black tracking-[0.2em] text-foreground uppercase leading-none italic">
                  Eagle Gym
                </h1>
                <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase mt-1 opacity-80">
                  {getRoleLabel(role)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {sections.map((section, sIdx) => (
            <div key={section.title}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 mb-2 text-[10px] font-semibold text-foreground/25 uppercase tracking-widest"
                  >
                    {section.title}
                  </motion.h3>
                )}
              </AnimatePresence>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                        isActive
                          ? "sidebar-item-active"
                          : "text-foreground/50 hover:text-foreground/80 hover:bg-muted"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-colors",
                          isActive ? "text-liquid-gold" : "text-foreground/40 group-hover:text-foreground/60"
                        )}
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className={cn(
                              "text-sm font-medium whitespace-nowrap overflow-hidden",
                              isActive ? "text-gold-400" : ""
                            )}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {item.badge && !collapsed && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-crimson/20 text-crimson">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-border/50">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl",
              "bg-muted/50 border border-border/50"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                getRoleBadgeClass(role)
              )}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-foreground/80 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-foreground/30 truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "text-foreground/40 hover:text-crimson hover:bg-crimson/10",
              "transition-all duration-200 w-full",
              collapsed ? "justify-center" : ""
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-gold-500 text-obsidian-950 items-center justify-center shadow-lg shadow-gold-500/30 hover:scale-110 transition-transform"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </motion.aside>
    </>
  );
}