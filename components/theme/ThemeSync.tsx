"use client";

import { useEffect } from "react";
import { THEME_STORAGE_KEY, ThemeName, useThemeStore } from "@/lib/themeStore";

export function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "bb" || current === "pb") {
      setTheme(current as ThemeName);
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return null;
}
