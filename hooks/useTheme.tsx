"use strict";

import { useState, useEffect } from "react";

export type Theme = "dark" | "light" | "system";

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

/**
 * Custom hook for managing dark/light theme with system preference detection.
 * Provides consistent TypeScript interface for theme management.
 *
 * @param key - Local storage key for persisting theme preference (default: "theme")
 * @param defaultTheme - Default theme if no stored preference (default: "system")
 * @returns Object containing current theme, setter, and resolved theme
 *
 * Example:
 * ```tsx
 * const { theme, setTheme, resolvedTheme } = useTheme("my-app-theme", "light");
 * return (
 *   <button onClick={() => setTheme("dark")}>
 *     Switch to {resolvedTheme} mode
 *   </button>
 * );
 * ```
 */
export default function useTheme(
  key: string = "theme",
  defaultTheme: Theme = "system"
): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(key);
    return (stored as Theme) || defaultTheme;
  });

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(key, newTheme);
    setThemeState(newTheme);
  };

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setResolvedTheme(prefersDark ? "dark" : "light");
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateResolvedTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return { theme, setTheme, resolvedTheme };
}