import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      login: (token: string) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "elect4-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
    },
  ),
);
