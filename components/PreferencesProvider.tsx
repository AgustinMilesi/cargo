"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Locale, TranslationDict } from "@/lib/i18n";
import { translations, LOCALES } from "@/lib/i18n";

export type Mode = "dark" | "light";
export type AccentTheme = "lime" | "bronze" | "indigo" | "crimson" | "emerald" | "amber" | "cyan";

export interface AccentOption {
  id: AccentTheme;
  name: string;
  hex: string;
}

// VOUT Flagship Cyber-Lime + Palette Accents:
export const ACCENT_THEMES: AccentOption[] = [
  { id: "lime", name: "VOUT Cyber-Lime", hex: "#c6f827" },
  { id: "bronze", name: "Bronze Gold", hex: "#a16207" },
  { id: "indigo", name: "Deep Indigo", hex: "#4f46e5" },
  { id: "crimson", name: "Crimson Berry", hex: "#9f1239" },
  { id: "emerald", name: "Forest Emerald", hex: "#059669" },
  { id: "amber", name: "Vibrant Amber", hex: "#f59e0b" },
  { id: "cyan", name: "Ocean Teal", hex: "#0e7490" },
];

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "245, 158, 11";
}

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
  accent: "lime",
  setAccent: () => {},
  locale: "es",
  setLocale: () => {},
  t: translations.es,
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");
  const [accent, setAccentState] = useState<AccentTheme>("lime");
  const [locale, setLocaleState] = useState<Locale>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load mode
    const savedMode = localStorage.getItem("onecargo-mode") as Mode | null;
    const initialMode = savedMode === "light" || savedMode === "dark" ? savedMode : "dark";
    setModeState(initialMode);
    applyMode(initialMode);

    // Load accent (default to amber as shown in user photo)
    const savedAccent = localStorage.getItem("onecargo-accent") as AccentTheme | null;
    const initialAccent = savedAccent && ACCENT_THEMES.some((a) => a.id === savedAccent) ? savedAccent : "amber";
    setAccentState(initialAccent);
    applyAccent(initialAccent);

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

  const applyAccent = (a: AccentTheme) => {
    const root = document.documentElement;
    root.setAttribute("data-accent", a);
    const found = ACCENT_THEMES.find((item) => item.id === a) || ACCENT_THEMES[4];
    root.style.setProperty("--primary-accent", found.hex);
    root.style.setProperty("--primary-accent-rgb", hexToRgb(found.hex));
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
    applyAccent(newAccent);
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
  const { mode, toggleMode, accent } = usePreferences();
  const currentAccent = ACCENT_THEMES.find((a) => a.id === accent) || ACCENT_THEMES[4];

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
          <span style={{ color: currentAccent.hex }}>☀️</span>
          <span className="hidden sm:inline">Light</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <span style={{ color: currentAccent.hex }}>🌙</span>
          <span className="hidden sm:inline">Dark</span>
        </span>
      )}
    </button>
  );
}
