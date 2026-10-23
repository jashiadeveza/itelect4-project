import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthState {
  token: string | null;
  userName: string | null;
  login: (token: string, userName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      login: (token, userName) => set({ token, userName }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "elect4-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    },
  ),
);
