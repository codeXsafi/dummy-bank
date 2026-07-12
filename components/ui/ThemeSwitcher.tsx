/*
 * ThemeSwitcher — the "PB"/"BB" pill-pair control that switches the active brand theme.
 */
"use client";

import { ThemeName, useThemeStore } from "@/lib/themeStore";

const THEME_OPTIONS: { value: ThemeName; label: string }[] = [
  { value: "pb", label: "PB" },
  { value: "bb", label: "BB" },
];

export function ThemeSwitcher() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1"
    >
      {THEME_OPTIONS.map((option) => {
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setTheme(option.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              isActive
                ? "bg-primary-light text-text-inverse"
                : "text-text-muted hover:text-text"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
