"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePreferences, ACCENT_THEMES } from "./PreferencesProvider";
import { LOCALES } from "@/lib/i18n";

export function PreferencesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { mode, setMode, accent, setAccent, locale, setLocale, sound, setSound, t } = usePreferences();

  // Close when clicking outside or pressing Escape (WCAG 2.2 SC 2.1.2)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const activeAccent = ACCENT_THEMES.find((a) => a.id === accent) || ACCENT_THEMES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button: [ 🌙 ☀️ ES ⌃ ] */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="preferences-dialog"
        aria-label="Configuración de preferencias: tema, color e idioma"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121824] hover:bg-[#182030] border border-[#1E293B] text-slate-100 text-xs font-semibold shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary-accent)] focus-visible:outline-none"
      >
        {/* Mode Icon */}
        {mode === "dark" ? (
          <span className="text-sm leading-none" aria-hidden="true" title="Modo Oscuro">🌙</span>
        ) : (
          <span className="text-sm leading-none" aria-hidden="true" title="Modo Claro">☀️</span>
        )}

        {/* Accent Color Dot */}
        <span
          className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30"
          style={{ backgroundColor: activeAccent.hex }}
          aria-hidden="true"
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
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover Dropdown Panel (Exactly matching user image) */}
      {isOpen && (
        <div
          id="preferences-dialog"
          role="dialog"
          aria-label="Panel de configuración de apariencia e idioma"
          className="absolute right-0 mt-2 w-[310px] sm:w-[330px] rounded-3xl bg-[#14151e]/95 dark:bg-[#13141c]/95 text-white p-5 shadow-2xl border border-white/10 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-5"
        >
          {/* SECTION 1: MODO */}
          <div className="space-y-2">
            <span id="label-mode-group" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8c8e9b]">
              MODO
            </span>
            <div role="group" aria-labelledby="label-mode-group" className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#0d0e14]/80 border border-white/5">
              <button
                type="button"
                onClick={() => setMode("light")}
                aria-pressed={mode === "light"}
                aria-label="Activar modo claro"
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === "light"
                    ? "text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                style={mode === "light" ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#0a0e14" : "#ffffff" } : {}}
              >
                <span className="text-sm" aria-hidden="true">☼</span>
                <span>Claro</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("dark")}
                aria-pressed={mode === "dark"}
                aria-label="Activar modo oscuro"
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === "dark"
                    ? "text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                style={mode === "dark" ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#0a0e14" : "#ffffff" } : {}}
              >
                <span className="text-sm" aria-hidden="true">🌙</span>
                <span>Oscuro</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: TEMA (6 Color Swatches) */}
          <div className="space-y-2">
            <span id="label-theme-group" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8c8e9b]">
              TEMA
            </span>
            <div role="group" aria-labelledby="label-theme-group" className="flex items-center justify-between gap-2 pt-1 px-1">
              {ACCENT_THEMES.map((item) => {
                const isSelected = accent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccent(item.id)}
                    title={item.name}
                    aria-label={`Seleccionar tema de color ${item.name}`}
                    aria-pressed={isSelected}
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
            <span id="label-locale-group" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8c8e9b]">
              {t.languageTitle || "IDIOMA"}
            </span>
            <div role="group" aria-labelledby="label-locale-group" className="grid grid-cols-2 gap-2">
              {LOCALES.map((l) => {
                const isSelected = locale === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLocale(l.code)}
                    aria-pressed={isSelected}
                    aria-label={`Cambiar idioma a ${l.label}`}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "text-white font-bold shadow-sm"
                        : "bg-[#0d0e14]/60 hover:bg-[#1a1c26] text-slate-300 border border-white/5"
                    }`}
                    style={isSelected ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#0a0e14" : "#ffffff" } : {}}
                  >
                    <span className="font-semibold">{l.label}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-80" aria-hidden="true">
                      {l.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: SONIDO TACTIL FX */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span id="label-sound-group" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8c8e9b]">
                {t.soundLabel || "SONIDO TÁCTIL"}
              </span>
              <span className="text-[10px] font-mono font-bold" style={{ color: activeAccent.hex }}>
                {sound ? (t.soundOn || "ON") : (t.soundOff || "OFF")}
              </span>
            </div>
            <div role="group" aria-labelledby="label-sound-group" className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#0d0e14]/80 border border-white/5">
              <button
                type="button"
                onClick={() => setSound(true)}
                aria-pressed={sound}
                aria-label="Activar sonido táctil"
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sound
                    ? "text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                style={sound ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#0a0e14" : "#ffffff" } : {}}
              >
                <span>🔊</span>
                <span>{t.soundOn || "Activado"}</span>
              </button>

              <button
                type="button"
                onClick={() => setSound(false)}
                aria-pressed={!sound}
                aria-label="Silenciar sonido táctil"
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !sound
                    ? "text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                style={!sound ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#0a0e14" : "#ffffff" } : {}}
              >
                <span>🔇</span>
                <span>{t.soundOff || "Silenciado"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

