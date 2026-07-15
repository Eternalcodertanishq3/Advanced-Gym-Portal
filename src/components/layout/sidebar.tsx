"use client";

import React, { useEffect } from "react";
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
import { useAuthStore, useSidebarStore } from "@/stores/auth-store";
import { getRoleDashboard, getRoleBadgeClass, getRoleLabel } from "@/lib/rbac";
import { ROLES } from "@/lib/constants";
import type { Role } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Athletic Clarity Sidebar
// ═══════════════════════════════════════════════════════════════

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredRole?: Role[];
  badge?: string;
  requiredFeature?: string;
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
      title: "Global Oversight",
      items: [
        { label: "Global Payments", href: "/super-admin/payments", icon: CreditCard },
        { label: "Global Members", href: "/admin/members", icon: Users },
        { label: "Global Attendance", href: "/admin/attendance", icon: Clock },
        { label: "Global Classes", href: "/admin/classes", icon: Calendar },
        { label: "Global Inventory", href: "/admin/inventory", icon: Package },
        { label: "Global Equipment", href: "/admin/equipment", icon: Wrench },
        { label: "All Staff", href: "/admin/staff", icon: Briefcase },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Admins", href: "/super-admin/admins", icon: Shield },
        { label: "System Config", href: "/super-admin/system-config", icon: Settings },
        { label: "Member Feedback", href: "/super-admin/testimonials", icon: MessageSquare },
        { label: "Subscription Plans", href: "/super-admin/subscription-plans", icon: Crown },
        { label: "Branches", href: "/super-admin/branches", icon: Building2 },
      ],
    },
    {
      title: "Data",
      items: [{ label: "Backups", href: "/super-admin/backups", icon: Database }],
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

  MANAGER: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "People",
      items: [{ label: "Members", href: "/admin/members", icon: Users }],
    },
    {
      title: "Operations",
      items: [
        { label: "Payments", href: "/admin/payments", icon: CreditCard },
        { label: "Attendance", href: "/admin/attendance", icon: Clock },
        { label: "Classes", href: "/admin/classes", icon: Calendar },
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
        {
          label: "Digital Card",
          href: "/member/digital-card",
          icon: QrCode,
          requiredFeature: "gym_access",
        },
        { label: "My Subscription", href: "/member/subscription", icon: Crown },
      ],
    },
    {
      title: "Fitness",
      items: [
        {
          label: "Workout Plan",
          href: "/member/workout",
          icon: Dumbbell,
          requiredFeature: "gym_access",
        },
        { label: "Diet Plan", href: "/member/diet", icon: Utensils, requiredFeature: "diet_plan" },
        {
          label: "Progress",
          href: "/member/progress",
          icon: TrendingUp,
          requiredFeature: "gym_access",
        },
        {
          label: "Progress Photos",
          href: "/member/progress?tab=photos",
          icon: Camera,
          requiredFeature: "mobile_app",
        },
        {
          label: "Goals",
          href: "/member/progress?tab=goals",
          icon: Target,
          requiredFeature: "gym_access",
        },
      ],
    },
    {
      title: "Activities",
      items: [
        {
          label: "Book Classes",
          href: "/member/classes",
          icon: Calendar,
          requiredFeature: "group_classes",
        },
        {
          label: "My Bookings",
          href: "/member/classes/my-bookings",
          icon: BookOpen,
          requiredFeature: "group_classes",
        },
        {
          label: "My Trainer",
          href: "/member/trainer",
          icon: UserCog,
          requiredFeature: "pt_sessions",
        },
      ],
    },
    {
      title: "Gamification",
      items: [
        {
          label: "Achievements",
          href: "/member/achievements",
          icon: Award,
          requiredFeature: "mobile_app",
        },
        {
          label: "Leaderboard",
          href: "/member/leaderboard",
          icon: Trophy,
          requiredFeature: "mobile_app",
        },
        {
          label: "Challenges",
          href: "/member/challenges",
          icon: Flame,
          requiredFeature: "mobile_app",
        },
      ],
    },
    {
      title: "Wellness",
      items: [
        {
          label: "Nutrition Log",
          href: "/member/nutrition",
          icon: Droplets,
          requiredFeature: "diet_plan",
        },
        {
          label: "Supplements",
          href: "/member/nutrition/supplements",
          icon: Pill,
          requiredFeature: "diet_plan",
        },
        {
          label: "Messages",
          href: "/member/messages",
          icon: MessageSquare,
          requiredFeature: "mobile_app",
        },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Attendance", href: "/member/attendance", icon: Clock },
        { label: "Billing & Payments", href: "/member/billing", icon: CreditCard },
        {
          label: "Refer & Earn",
          href: "/member/refer",
          icon: Share2,
          requiredFeature: "mobile_app",
        },
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

interface SidebarProps {
  user: {
    id: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
    role: Role;
    status: string;
    avatar?: string | null;
  };
  allowedFeatures?: string[];
  tenantName?: string;
}

export function Sidebar({ user, allowedFeatures = [], tenantName = "GymFlow SaaS" }: SidebarProps) {
  const { collapsed, mobileOpen, toggleCollapsed, toggleMobile, setMobileOpen } = useSidebarStore();
  const { logout } = useAuthStore();
  const pathname = usePathname();

  const role = (user?.role ?? "MEMBER") as Role;
  const sections = React.useMemo(() => {
    const rawSections = navSections[role] ?? navSections.MEMBER;

    // Filter for members based on features
    if (role === "MEMBER") {
      return rawSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => {
            if (!item.requiredFeature) return true;
            return allowedFeatures.includes(item.requiredFeature);
          }),
        }))
        .filter((section) => section.items.length > 0);
    }

    return rawSections;
  }, [role, allowedFeatures]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        aria-label="Toggle Mobile Menu"
        className="fixed left-4 top-4 z-[120] flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-white shadow-sm lg:hidden"
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 260,
          opacity: 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-[115] flex h-screen flex-col",
          "border-r border-white/10 bg-brand-navy/80 shadow-[4px_0_24px_rgba(0,0,0,0.2)] backdrop-blur-2xl",
          "lg:translate-x-0 lg:opacity-100",
          !mobileOpen && "translate-x-[-100%] lg:translate-x-0",
        )}
      >
        {/* Logo Area */}
        <div className="group flex items-center gap-3 border-b border-white/10 px-4 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange shadow-lg shadow-brand-orange/20 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              {tenantName.charAt(0).toUpperCase()}
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="font-display text-lg font-bold leading-none tracking-tight text-white">
                  {tenantName}
                </h1>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  {getRoleLabel(role)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {sections.map((section, _sIdx) => (
            <div key={section.title}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/30"
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
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                        isActive
                          ? "sidebar-item-active"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          isActive ? "text-white" : "text-white/50 group-hover:text-white",
                        )}
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className={cn(
                              "overflow-hidden whitespace-nowrap text-sm font-medium",
                              isActive ? "font-semibold text-white" : "",
                            )}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {item.badge && !collapsed && (
                        <span className="ml-auto rounded-full bg-brand-orange px-1.5 py-0.5 text-[10px] text-white">
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
        <div className="border-t border-white/10 p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-2",
              "border border-white/5 bg-black/20",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white",
                getRoleBadgeClass(role),
              )}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="truncate text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="truncate text-[10px] text-white/50">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              signOut({ callbackUrl: "/login" });
            }}
            className={cn(
              "mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5",
              "text-white/50 hover:bg-danger/10 hover:text-danger",
              "w-full transition-all duration-200",
              collapsed ? "justify-center" : "",
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/30 transition-transform hover:scale-110 lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="ml-0.5 h-4 w-4" />
          ) : (
            <ChevronLeft className="mr-0.5 h-4 w-4" />
          )}
        </button>
      </motion.aside>
    </>
  );
}
