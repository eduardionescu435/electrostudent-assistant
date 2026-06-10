import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Admin } from "@/features/auth/types";

interface AuthState {
  user: Admin | null;
  isAuthenticated: boolean;
  setUser: (user: Admin | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
