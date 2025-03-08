"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  suppressHydrationWarning?: boolean;
};

const initialState: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
} = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  suppressHydrationWarning = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const systemTheme = prefersDark ? "dark" : "light";

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove previous attribute value
    root.removeAttribute(attribute);

    // Set the theme attribute
    const dataAttr = attribute === "class" ? "class" : `data-${attribute}`;
    const value = theme === "system" ? systemTheme : theme;

    if (dataAttr === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(value);
    } else {
      root.setAttribute(dataAttr, value);
    }

    // Set color-scheme
    if (disableTransitionOnChange) {
      root.style.colorScheme = value;
    }
  }, [theme, systemTheme, attribute, disableTransitionOnChange]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
      // Save to localStorage
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        console.error("Failed to save theme to localStorage", e);
      }
    },
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (e) {
      console.error("Failed to load theme from localStorage", e);
    }
  }, []);

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
