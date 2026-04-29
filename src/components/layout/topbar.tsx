"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/auth-store";
import { getRoleBadgeClass, getRoleLabel } from "@/lib/rbac";
import type { Role } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Glass Topbar
// ═══════════════════════════════════════════════════════════════

interface TopbarProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const greeting = getGreeting();
  const currentDate = formatDate(new Date(), "EEEE, dd MMM yyyy");

  const handleLogout = async () => {
    logout();
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
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
      <header className="fixed top-0 right-0 left-0 lg:left-[280px] z-40 h-16">
        <div className="h-full mx-4 mt-3">
          <div className="h-full glass-card rounded-2xl px-4 flex items-center justify-between gap-4">
            {/* Left: Greeting & Date */}
            <div className="hidden md:block">
              <p className="text-xs text-foreground/40 font-medium">
                {greeting}, <span className="text-gold-400">{user.firstName || "Admin"}</span>
              </p>
              <p className="text-[10px] text-foreground/25">{currentDate}</p>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              aria-label="Toggle Menu"
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-foreground/60"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Center: Global Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full h-10 pl-10 pr-4 bg-muted/30 border border-transparent focus:border-primary/20 focus:bg-card rounded-xl text-sm transition-all outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border bg-muted/50 text-[10px] font-mono text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>⌘</span>
                  <span>K</span>
                </div>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {searchOpen && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden"
                    >
                      {searchSuggestions.length > 0 ? (
                        <div className="p-2">
                          <p className="text-[10px] text-foreground/30 uppercase tracking-wider px-3 py-2">
                            Quick Links
                          </p>
                          {searchSuggestions.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-foreground/60 hover:text-foreground transition-colors"
                            >
                              <item.icon className="w-4 h-4 text-gold-400" />
                              <span className="text-sm">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-foreground/30">
                          No results found
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle Theme"
                className="p-2 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-gold-400 transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="View Notifications"
                  className="relative p-2 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-gold-400 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-crimson text-foreground text-[9px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
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
                        className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl overflow-hidden z-50"
                      >
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-gold-400 hover:text-gold-300"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                              <Bell className="w-8 h-8 text-foreground/10 mx-auto mb-2" />
                              <p className="text-sm text-foreground/30">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.slice(0, 10).map((notif) => (
                              <div
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={cn(
                                  "p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors",
                                  !notif.isRead && "bg-gold-500/5"
                                )}
                              >
                                <p className={cn("text-sm", !notif.isRead ? "text-foreground font-medium" : "text-foreground/60")}>
                                  {notif.title}
                                </p>
                                <p className="text-xs text-foreground/30 mt-0.5 line-clamp-2">{notif.body}</p>
                                <p className="text-[10px] text-foreground/20 mt-1">
                                  {formatDate(notif.createdAt, "dd MMM, hh:mm a")}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User Menu"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      getRoleBadgeClass(user.role)
                    )}
                  >
                    {(user.firstName?.[0] || user.name?.[0] || "A").toUpperCase()}
                    {(user.lastName?.[0] || user.name?.[1] || "").toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-foreground/80">{user.name}</p>
                    <p className="text-[10px] text-foreground/30">{getRoleLabel(user.role)}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-foreground/30" />
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
                        className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-white/5">
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-foreground/30">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/member/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-foreground/60 hover:text-foreground transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span className="text-sm">Profile</span>
                          </Link>
                          <Link
                            href="/member/settings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-foreground/60 hover:text-foreground transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Settings</span>
                          </Link>
                          <div className="border-t border-white/5 my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-crimson/10 text-foreground/60 hover:text-crimson transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
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