import { create } from "zustand";
import { persist } from "zustand/middleware";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Sidebar Store
// ═══════════════════════════════════════════════════════════════

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      mobileOpen: false,
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
      toggleMobile: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
    }),
    {
      name: "eagle-gym-sidebar",
      partialize: (state) => ({ collapsed: state.collapsed }),
    },
  ),
);
