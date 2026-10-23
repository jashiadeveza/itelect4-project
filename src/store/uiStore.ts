import { create } from "zustand";

interface UiState {
  darkMode: boolean;
  searchTerm: string;
  selectedApplicantId: string | null;
  toggleDarkMode: () => void;
  setSearchTerm: (value: string) => void;
  setSelectedApplicantId: (value: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  darkMode: false,
  searchTerm: "",
  selectedApplicantId: null,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSearchTerm: (value: string) => set({ searchTerm: value }),
  setSelectedApplicantId: (value: string | null) => set({ selectedApplicantId: value }),
}));
