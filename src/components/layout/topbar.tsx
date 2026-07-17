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
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { getTenantDetailsSync } from "@/lib/tenant";
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

  const tenant = getTenantDetailsSync();
  useRealtimeNotifications(user.id, tenant.id);

  const { notifications, unreadCount, markAsRead, markAllAsRead, setNotifications } =
    useNotificationStore();
  const { collapsed } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function loadNotifications() {
      if (!user.id) return;
      try {
        const { getNotifications } = await import("@/actions/shared/notification-actions");
        const res = await getNotifications(user.id);
        if (res.success && res.data) {
          setNotifications(
            res.data.map((notif) => ({
              id: notif.id,
              title: notif.title,
              body: notif.body,
              type: notif.type,
              isRead: notif.isRead,
              createdAt:
                notif.createdAt instanceof Date
                  ? notif.createdAt.toISOString()
                  : String(notif.createdAt),
            })),
          );
        }
      } catch (err) {
        console.error("Failed to load initial notifications:", err);
      }
    }

    loadNotifications();
  }, [user.id, setNotifications]);

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
          "fixed left-0 right-0 top-0 z-[100] h-16 border-b border-white/40 bg-white/70 shadow-sm backdrop-blur-xl transition-[left] duration-300 ease-in-out dark:border-white/[0.08] dark:bg-[#1A1D27]/40",
          mounted && collapsed ? "lg:left-20" : "lg:left-[260px]",
        )}
      >
        <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-8">
          {/* Left: Greeting & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle Menu"
              className="-ml-2 rounded-lg p-2 text-txt-secondary transition-colors hover:bg-surface-elevated lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-txt-secondary">
                {greeting},{" "}
                <span className="font-bold text-brand-orange">{user.firstName || "Admin"}</span>
              </p>
              <p className="text-xs text-txt-tertiary">{currentDate}</p>
            </div>
          </div>

          {/* Center: Global Search */}
          <div className="hidden max-w-[380px] flex-1 sm:block">
            <div className="group relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary transition-colors group-focus-within:text-brand-orange" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="h-10 w-full rounded-full border border-surface-border-hover bg-surface-sunken pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-txt-tertiary focus:border-brand-orange/50 focus:bg-surface-card focus:ring-2 focus:ring-brand-orange/15"
              />
              <div className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1 font-mono text-[10px] text-txt-tertiary opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded border border-surface-border bg-surface-elevated px-1.5 py-0.5 shadow-sm">
                  ⌘
                </span>
                <span className="rounded border border-surface-border bg-surface-elevated px-1.5 py-0.5 shadow-sm">
                  K
                </span>
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchOpen && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="surface-card absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl shadow-card-hover"
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
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-txt-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
                          >
                            <item.icon className="h-4 w-4 text-brand-orange" />
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
              className="rounded-full p-2 text-txt-secondary transition-colors hover:bg-surface-elevated sm:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="rounded-full p-2 text-txt-secondary transition-colors hover:bg-surface-elevated hover:text-brand-orange"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="View Notifications"
                className="relative rounded-full p-2 text-txt-secondary transition-colors hover:bg-surface-elevated hover:text-brand-orange"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface-card bg-brand-orange" />
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
                      className="surface-card absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl shadow-card-hover"
                    >
                      <div className="flex items-center justify-between border-b border-surface-border bg-surface-elevated/50 p-4">
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
                            <Bell className="mx-auto mb-3 h-8 w-8 text-txt-tertiary opacity-50" />
                            <p className="text-sm font-medium text-txt-secondary">
                              You're all caught up!
                            </p>
                            <p className="mt-1 text-xs text-txt-tertiary">No new notifications</p>
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={cn(
                                "cursor-pointer border-b border-surface-border p-4 transition-colors hover:bg-surface-elevated",
                                !notif.isRead && "bg-brand-orange-soft/30 dark:bg-brand-orange/5",
                              )}
                            >
                              <div className="flex gap-3">
                                <div className="mt-0.5">
                                  {!notif.isRead && (
                                    <span className="block h-2 w-2 rounded-full bg-brand-orange" />
                                  )}
                                </div>
                                <div>
                                  <p
                                    className={cn(
                                      "text-sm text-foreground",
                                      !notif.isRead ? "font-semibold" : "font-medium",
                                    )}
                                  >
                                    {notif.title}
                                  </p>
                                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-txt-secondary">
                                    {notif.body}
                                  </p>
                                  <p className="mt-2 text-[10px] font-medium text-txt-tertiary">
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

            <div className="mx-1 hidden h-6 w-[1px] bg-surface-border sm:block" />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User Menu"
                className="flex items-center gap-2 rounded-full py-1.5 pl-2 pr-2 transition-colors hover:bg-surface-elevated"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
                    getRoleBadgeClass(user.role),
                  )}
                >
                  {(user.firstName?.[0] || user.name?.[0] || "A").toUpperCase()}
                  {(user.lastName?.[0] || user.name?.[1] || "").toUpperCase()}
                </div>
                <ChevronDown className="hidden h-4 w-4 text-txt-tertiary sm:block" />
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
                      className="surface-card absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl shadow-card-hover"
                    >
                      <div className="border-b border-surface-border bg-surface-elevated/50 p-4">
                        <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                        <p className="mt-0.5 truncate text-xs text-txt-secondary">{user.email}</p>
                        <div className="mt-2 inline-flex items-center rounded border border-surface-border bg-surface-sunken px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-txt-secondary">
                          {getRoleLabel(user.role)}
                        </div>
                      </div>
                      <div className="space-y-0.5 p-2">
                        <Link
                          href={`/${user.role.toLowerCase().replace("_", "-")}/profile`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-txt-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm font-medium">My Profile</span>
                        </Link>
                        <Link
                          href={`/${user.role.toLowerCase().replace("_", "-")}/settings`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-txt-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
                        >
                          <Settings className="h-4 w-4" />
                          <span className="text-sm font-medium">Account Settings</span>
                        </Link>
                        <div className="my-1 border-t border-surface-border" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-txt-secondary transition-colors hover:bg-danger-soft hover:text-danger"
                        >
                          <LogOut className="h-4 w-4" />
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
      {searchOpen && <div className="fixed inset-0 z-30" onClick={() => setSearchOpen(false)} />}
    </>
  );
}
