"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Locale, TranslationDict } from "@/lib/i18n";
import { translations, LOCALES } from "@/lib/i18n";

export type Mode = "dark" | "light";
export type AccentTheme = "indigo" | "violet" | "emerald" | "amber" | "rose" | "cyan";

export interface AccentOption {
  id: AccentTheme;
  name: string;
  colorClass: string;
  hex: string;
}

export const ACCENT_THEMES: AccentOption[] = [
  { id: "indigo", name: "Electric Indigo", colorClass: "bg-[#6366f1]", hex: "#6366f1" },
  { id: "violet", name: "Deep Violet", colorClass: "bg-[#8b5cf6]", hex: "#8b5cf6" },
  { id: "emerald", name: "Cargo Emerald", colorClass: "bg-[#10b981]", hex: "#10b981" },
  { id: "amber", name: "Warm Amber", colorClass: "bg-[#f59e0b]", hex: "#f59e0b" },
  { id: "rose", name: "Neon Rose", colorClass: "bg-[#f43f5e]", hex: "#f43f5e" },
  { id: "cyan", name: "Ocean Cyan", colorClass: "bg-[#06b6d4]", hex: "#06b6d4" },
];

interface PreferencesContextType {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  accent: AccentTheme;
  setAccent: (a: AccentTheme) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TranslationDict;
}

const PreferencesContext = createContext<PreferencesContextType>({
  mode: "dark",
  setMode: () => {},
  toggleMode: () => {},
  accent: "indigo",
  setAccent: () => {},
  locale: "es",
  setLocale: () => {},
  t: translations.es,
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");
  const [accent, setAccentState] = useState<AccentTheme>("indigo");
  const [locale, setLocaleState] = useState<Locale>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load mode
    const savedMode = localStorage.getItem("onecargo-mode") as Mode | null;
    const initialMode = savedMode === "light" || savedMode === "dark" ? savedMode : "dark";
    setModeState(initialMode);
    applyMode(initialMode);

    // Load accent
    const savedAccent = localStorage.getItem("onecargo-accent") as AccentTheme | null;
    if (savedAccent && ACCENT_THEMES.some((a) => a.id === savedAccent)) {
      setAccentState(savedAccent);
      document.documentElement.setAttribute("data-accent", savedAccent);
    }

    // Load locale
    const savedLocale = localStorage.getItem("onecargo-locale") as Locale | null;
    if (savedLocale && (["es", "en", "pt", "zh"] as const).includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const applyMode = (m: Mode) => {
    const root = document.documentElement;
    root.setAttribute("data-mode", m);
    if (m === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem("onecargo-mode", newMode);
    applyMode(newMode);
  };

  const toggleMode = () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
  };

  const setAccent = (newAccent: AccentTheme) => {
    setAccentState(newAccent);
    localStorage.setItem("onecargo-accent", newAccent);
    document.documentElement.setAttribute("data-accent", newAccent);
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("onecargo-locale", newLocale);
    document.cookie = `onecargo-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const currentTranslations = translations[locale] || translations.es;

  return (
    <PreferencesContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        accent,
        setAccent,
        locale,
        setLocale,
        t: currentTranslations,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}

// Backward compatibility helper
export function useTheme() {
  const { mode, toggleMode, setMode } = usePreferences();
  return {
    theme: mode,
    toggleTheme: toggleMode,
    setTheme: setMode,
  };
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { mode, toggleMode } = usePreferences();

  return (
    <button
      onClick={toggleMode}
      type="button"
      title={mode === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 border cursor-pointer ${
        mode === "dark"
          ? "bg-[#1c1d25]/80 backdrop-blur-md border-white/10 text-amber-400 hover:bg-[#252733] hover:border-white/20"
          : "bg-white/80 backdrop-blur-md border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-sm"
      } ${className}`}
    >
      {mode === "dark" ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="hidden sm:inline">Light</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span className="hidden sm:inline">Dark</span>
        </span>
      )}
    </button>
  );
}
