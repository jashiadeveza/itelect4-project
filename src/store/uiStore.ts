import { create } from "zustand";

interface UiState {
  darkMode: boolean;
  searchTerm: string;
  selectedApplicantId: number | null;
  toggleDarkMode: () => void;
  setSearchTerm: (value: string) => void;
  setSelectedApplicantId: (value: number | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  darkMode: false,
  searchTerm: "",
  selectedApplicantId: null,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSearchTerm: (value: string) => set({ searchTerm: value }),
  setSelectedApplicantId: (value: number | null) => set({ selectedApplicantId: value }),
}));
