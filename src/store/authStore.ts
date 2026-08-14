import { create } from "zustand";

export interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set: (state: Partial<AuthState> | ((s: AuthState) => Partial<AuthState>)) => void) => ({
  token: null,
  login: (token: string) => set({ token }),
  logout: () => set({ token: null }),
}));
