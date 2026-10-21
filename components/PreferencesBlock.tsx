"use client";

import React from "react";
import { usePreferences, ACCENT_THEMES } from "./PreferencesProvider";
import { LOCALES } from "@/lib/i18n";

export function PreferencesBlock({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, accent, setAccent, locale, setLocale, t } = usePreferences();

  const activeAccent = ACCENT_THEMES.find((a) => a.id === accent) || ACCENT_THEMES[4];

  return (
    <div
      className={`glass-card rounded-3xl ${
        compact ? "p-5" : "p-6 sm:p-8"
      } shadow-lg space-y-6`}
    >
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
            {t.appearanceMode} &amp; i18n
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {t.preferencesTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.preferencesSubtitle}
          </p>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-300">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: activeAccent.hex }}
          />
          <span>{locale.toUpperCase()} · {mode.toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Mode Switcher (Claro / Oscuro) */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.appearanceMode}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-[#121318]/70 border border-slate-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => setMode("light")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === "light"
                  ? "bg-accent text-[var(--primary-accent-text)] shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="text-sm">☀️</span>
              <span>{t.lightMode}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("dark")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === "dark"
                  ? "bg-accent text-[var(--primary-accent-text)] shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="text-sm">🌙</span>
              <span>{t.darkMode}</span>
            </button>
          </div>
        </div>

        {/* 2. Color Accent Palettes */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.accentColor}
          </label>
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-100/80 dark:bg-[#121318]/70 border border-slate-200/80 dark:border-white/10 h-[52px]">
            {ACCENT_THEMES.map((themeItem) => (
              <button
                key={themeItem.id}
                type="button"
                onClick={() => setAccent(themeItem.id)}
                title={themeItem.name}
                style={{ backgroundColor: themeItem.hex }}
                className={`w-7 h-7 rounded-full transition-all cursor-pointer ${
                  accent === themeItem.id
                    ? "ring-2 ring-offset-2 ring-white scale-110 shadow-md"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. 4-Language Switcher (ES, EN, PT, ZH) */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.languageTitle}
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100/80 dark:bg-[#121318]/70 border border-slate-200/80 dark:border-white/10">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLocale(l.code)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-medium ${
                  locale === l.code
                    ? "bg-accent text-[var(--primary-accent-text)] font-bold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                <span>{l.label}</span>
                <span className="text-sm">{l.flag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
        <span>{t.frostedGlassNote}</span>
        <span className="font-mono text-[10px]">VOUT Cargo v3.0 · Enterprise Logistics Suite</span>
      </div>
    </div>
  );
}
