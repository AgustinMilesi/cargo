"use client";

import React from "react";
import { usePreferences, ACCENT_THEMES } from "./PreferencesProvider";
import { LOCALES } from "@/lib/i18n";

export function PreferencesBlock({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, accent, setAccent, locale, setLocale, t } = usePreferences();

  const activeAccent = ACCENT_THEMES.find((a) => a.id === accent) || ACCENT_THEMES[4];

  return (
    <div
      className={`glass-card rounded-[4px] ${
        compact ? "p-5" : "p-6 sm:p-8"
      } space-y-6 bg-[var(--bg-card)] border border-[var(--border-card)] shadow-none`}
    >
      {/* Header */}
      <div className="border-b border-[#252525] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-accent">
            {t.appearanceMode} &amp; i18n
          </span>
          <h2 className="text-lg sm:text-xl font-serif font-light text-white">
            {t.preferencesTitle}
          </h2>
          <p className="text-xs text-[#7a7a7a] font-sans mt-0.5">
            {t.preferencesSubtitle}
          </p>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-2.5 py-1 rounded-[2px] bg-[#000000] border border-[#252525] text-xs font-mono text-[#e5e5e5]">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: activeAccent.hex }}
          />
          <span>{locale.toUpperCase()} · {mode.toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Mode Switcher (Claro / Oscuro) */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#7a7a7a]">
            {t.appearanceMode}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-[4px] bg-[#161616] border border-[#252525]">
            <button
              type="button"
              onClick={() => setMode("light")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.04em] transition-all cursor-pointer ${
                mode === "light"
                  ? "bg-accent text-[#000000] shadow-[0_0_8px_rgba(197,255,74,0.35)]"
                  : "text-[#7a7a7a] hover:text-white"
              }`}
            >
              <span className="text-sm">☀️</span>
              <span>{t.lightMode}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("dark")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.04em] transition-all cursor-pointer ${
                mode === "dark"
                  ? "bg-accent text-[#000000] shadow-[0_0_8px_rgba(197,255,74,0.35)]"
                  : "text-[#7a7a7a] hover:text-white"
              }`}
            >
              <span className="text-sm">🌙</span>
              <span>{t.darkMode}</span>
            </button>
          </div>
        </div>

        {/* 2. Color Accent Palettes */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#7a7a7a]">
            {t.accentColor}
          </label>
          <div className="flex items-center justify-between gap-2 p-2 rounded-[4px] bg-[#161616] border border-[#252525] h-[52px]">
            {ACCENT_THEMES.map((themeItem) => (
              <button
                key={themeItem.id}
                type="button"
                onClick={() => setAccent(themeItem.id)}
                title={themeItem.name}
                style={{ backgroundColor: themeItem.hex }}
                className={`w-6 h-6 rounded-[2px] transition-all cursor-pointer ${
                  accent === themeItem.id
                    ? "ring-2 ring-[var(--primary-accent)] scale-110 shadow-none"
                    : "opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. 4-Language Switcher (ES, EN, PT, ZH) */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#7a7a7a]">
            {t.languageTitle}
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-[4px] bg-[#161616] border border-[#252525]">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLocale(l.code)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-[2px] text-xs transition-all cursor-pointer font-sans ${
                  locale === l.code
                    ? "bg-accent text-[#000000] font-medium shadow-[0_0_8px_rgba(197,255,74,0.35)]"
                    : "text-[#7a7a7a] hover:text-white hover:bg-[#252525]"
                }`}
              >
                <span>{l.label}</span>
                <span className="text-sm">{l.flag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-[#7a7a7a] flex items-center justify-between border-t border-[#252525]">
        <span>{t.frostedGlassNote}</span>
        <span className="font-mono text-[10px]">VOUT Cargo v3.0 · Enterprise Logistics Suite</span>
      </div>
    </div>
  );
}
