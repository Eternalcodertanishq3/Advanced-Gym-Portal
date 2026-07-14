import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Auth Store (Single Responsibility)
// ═══════════════════════════════════════════════════════════════

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: Role;
  status: string;
  avatar?: string | null;
  phone?: string | null;
}

interface AuthState {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearError: () => set({ error: null }),
    }),
    {
      name: "eagle-gym-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// Re-exports for backward compatibility
// Components that import from "@/stores/auth-store" will still work.
// New code should import directly from the individual store files.
// ═══════════════════════════════════════════════════════════════

export { useSidebarStore } from "./sidebar-store";
export { useThemeStore } from "./theme-store";
export { useNotificationStore } from "./notification-store";
export { useCartStore } from "./cart-store";
export { useModalStore } from "./modal-store";