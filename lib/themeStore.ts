import { create } from "zustand";

export type ThemeName = "bb" | "pb";

export const THEME_STORAGE_KEY = "dummy-bank-theme";

interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "bb",
  setTheme: (theme) => set({ theme }),
}));
