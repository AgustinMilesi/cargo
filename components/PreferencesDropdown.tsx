"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePreferences, ACCENT_THEMES } from "./PreferencesProvider";
import { LOCALES } from "@/lib/i18n";

export function PreferencesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mode, setMode, accent, setAccent, locale, setLocale, t } = usePreferences();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeAccent = ACCENT_THEMES.find((a) => a.id === accent) || ACCENT_THEMES[4];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button: [ 🌙 ☀️ ES ⌃ ] */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-[#1a1b22]/90 hover:bg-slate-200/90 dark:hover:bg-[#252733] border border-slate-300/80 dark:border-white/10 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-sm transition-all cursor-pointer backdrop-blur-md"
      >
        {/* Mode Icon */}
        {mode === "dark" ? (
          <span className="text-sm leading-none" title="Modo Oscuro">🌙</span>
        ) : (
          <span className="text-sm leading-none" title="Modo Claro">☀️</span>
        )}

        {/* Accent Color Dot */}
        <span
          className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30"
          style={{ backgroundColor: activeAccent.hex }}
          title={`Tema: ${activeAccent.name}`}
        />

        {/* Language Code */}
        <span className="font-bold uppercase tracking-wider text-[11px]">
          {locale.toUpperCase()}
        </span>

        {/* Chevron */}
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover Dropdown Panel (Exactly matching user image) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[310px] sm:w-[330px] rounded-3xl bg-[#14151e]/95 dark:bg-[#13141c]/95 text-white p-5 shadow-2xl border border-white/10 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-5">
          {/* SECTION 1: MODO */}
          <div className="space-y-2">
            <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8c8e9b]">
              MODO
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#0d0e14]/80 border border-white/5">
              <button
                type="button"
                onClick={() => setMode("light")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === "light"
                    ? "text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                style={mode === "light" ? { backgroundColor: activeAccent.hex, color: "#ffffff" } : {}}
              >
                <span className="text-sm">☼</span>
                <span>Claro</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("dark")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === "dark"
                    ? "text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                style={mode === "dark" ? { backgroundColor: activeAccent.hex, color: "#ffffff" } : {}}
              >
                <span className="text-sm">🌙</span>
                <span>Oscuro</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: TEMA (6 Color Swatches) */}
          <div className="space-y-2">
            <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8c8e9b]">
              TEMA
            </span>
            <div className="flex items-center justify-between gap-2 pt-1 px-1">
              {ACCENT_THEMES.map((item) => {
                const isSelected = accent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccent(item.id)}
                    title={item.name}
                    className={`w-8 h-8 rounded-full transition-all cursor-pointer relative ${
                      isSelected
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#13141c] scale-110 shadow-lg"
                        : "opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ backgroundColor: item.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* SECTION 3: IDIOMA (2x2 Grid) */}
          <div className="space-y-2">
            <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8c8e9b]">
              IDIOMA
            </span>
            <div className="grid grid-cols-2 gap-2">
              {LOCALES.map((l) => {
                const isSelected = locale === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLocale(l.code)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "text-white font-bold shadow-sm"
                        : "bg-[#0d0e14]/60 hover:bg-[#1a1c26] text-slate-300 border border-white/5"
                    }`}
                    style={isSelected ? { backgroundColor: activeAccent.hex, color: "#ffffff" } : {}}
                  >
                    <span className="font-semibold">{l.label}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">
                      {l.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
