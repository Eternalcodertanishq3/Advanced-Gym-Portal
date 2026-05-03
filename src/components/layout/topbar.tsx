"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Bell,
  Menu,
  X,
  Command,
  LogOut,
  Settings,
  User,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  TrendingUp,
  CreditCard,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { formatDate, getGreeting } from "@/lib/utils";
import { useAuthStore, useSidebarStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/auth-store";
import { getRoleBadgeClass, getRoleLabel } from "@/lib/rbac";
import type { Role } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Athletic Clarity Topbar
// ═══════════════════════════════════════════════════════════════

interface TopbarProps {
  user: {
    id: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
    role: Role;
    status: string;
    avatar?: string | null;
    phone?: string | null;
  };
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const { collapsed } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const greeting = getGreeting();
  const currentDate = formatDate(new Date(), "EEEE, dd MMM yyyy");

  const handleLogout = async () => {
    logout();
    await signOut({ callbackUrl: "/login" });
  };

  // Quick search suggestions
  const searchSuggestions = [
    { label: "Members", href: "/admin/members", icon: User },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Attendance", href: "/admin/attendance", icon: Calendar },
    { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ].filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 right-0 left-0 z-[100] h-16 bg-surface-card/95 backdrop-blur-md border-b border-surface-border shadow-sm transition-[left] duration-300 ease-in-out",
          mounted && collapsed ? "lg:left-20" : "lg:left-[260px]"
        )}
      >
        <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Greeting & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button 
              aria-label="Toggle Menu"
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-elevated text-txt-secondary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:block">
              <p className="text-sm text-txt-secondary font-medium">
                {greeting}, <span className="text-brand-orange font-bold">{user.firstName || "Admin"}</span>
              </p>
              <p className="text-xs text-txt-tertiary">{currentDate}</p>
            </div>
          </div>

          {/* Center: Global Search */}
          <div className="flex-1 max-w-[380px] hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary group-focus-within:text-brand-orange transition-colors" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="w-full h-10 pl-10 pr-4 bg-surface-sunken border border-surface-border-hover focus:border-brand-orange/50 focus:bg-surface-card focus:ring-2 focus:ring-brand-orange/15 rounded-full text-sm transition-all outline-none text-foreground placeholder:text-txt-tertiary"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono text-txt-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-1.5 py-0.5 rounded bg-surface-elevated border border-surface-border shadow-sm">⌘</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-elevated border border-surface-border shadow-sm">K</span>
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchOpen && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 surface-card rounded-xl overflow-hidden shadow-card-hover"
                  >
                    {searchSuggestions.length > 0 ? (
                      <div className="p-2">
                        <p className="label-text px-3 py-2">Quick Links</p>
                        {searchSuggestions.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-elevated text-txt-secondary hover:text-foreground transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-brand-orange" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-txt-tertiary">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Toggle (Mobile) */}
            <button
              aria-label="Search"
              title="Search"
              className="sm:hidden p-2 rounded-full hover:bg-surface-elevated text-txt-secondary transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="p-2 rounded-full hover:bg-surface-elevated text-txt-secondary hover:text-brand-orange transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="View Notifications"
                className="relative p-2 rounded-full hover:bg-surface-elevated text-txt-secondary hover:text-brand-orange transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-brand-orange border-2 border-surface-card" />
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 surface-card rounded-xl overflow-hidden z-50 shadow-card-hover"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface-elevated/50">
                        <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-brand-orange hover:text-brand-orange-hover"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-txt-tertiary mx-auto mb-3 opacity-50" />
                            <p className="text-sm text-txt-secondary font-medium">You're all caught up!</p>
                            <p className="text-xs text-txt-tertiary mt-1">No new notifications</p>
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={cn(
                                "p-4 border-b border-surface-border cursor-pointer hover:bg-surface-elevated transition-colors",
                                !notif.isRead && "bg-brand-orange-soft/30 dark:bg-brand-orange/5"
                              )}
                            >
                              <div className="flex gap-3">
                                <div className="mt-0.5">
                                  {!notif.isRead && <span className="block w-2 h-2 rounded-full bg-brand-orange" />}
                                </div>
                                <div>
                                  <p className={cn("text-sm text-foreground", !notif.isRead ? "font-semibold" : "font-medium")}>
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-txt-secondary mt-1 line-clamp-2 leading-relaxed">{notif.body}</p>
                                  <p className="text-[10px] text-txt-tertiary mt-2 font-medium">
                                    {formatDate(notif.createdAt, "dd MMM, hh:mm a")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="w-[1px] h-6 bg-surface-border mx-1 hidden sm:block" />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User Menu"
                className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-full hover:bg-surface-elevated transition-colors"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm",
                    getRoleBadgeClass(user.role)
                  )}
                >
                  {(user.firstName?.[0] || user.name?.[0] || "A").toUpperCase()}
                  {(user.lastName?.[0] || user.name?.[1] || "").toUpperCase()}
                </div>
                <ChevronDown className="w-4 h-4 text-txt-tertiary hidden sm:block" />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 surface-card rounded-xl overflow-hidden z-50 shadow-card-hover"
                    >
                      <div className="p-4 border-b border-surface-border bg-surface-elevated/50">
                        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-txt-secondary truncate mt-0.5">{user.email}</p>
                        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-sunken text-txt-secondary border border-surface-border">
                          {getRoleLabel(user.role)}
                        </div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <Link
                          href={`/${user.role.toLowerCase().replace("_", "-")}/profile`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-elevated text-txt-secondary hover:text-foreground transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">My Profile</span>
                        </Link>
                        <Link
                          href={`/${user.role.toLowerCase().replace("_", "-")}/settings`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-elevated text-txt-secondary hover:text-foreground transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">Account Settings</span>
                        </Link>
                        <div className="border-t border-surface-border my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-danger-soft text-txt-secondary hover:text-danger transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Log out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close search */}
      {searchOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setSearchOpen(false)} />
      )}
    </>
  );
}