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
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="preferences-dialog"
        aria-label="Configuración de preferencias: tema, color e idioma"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#1f1f1f] hover:bg-[#252525] border border-[#252525] text-slate-100 text-xs font-semibold shadow-none transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary-accent)] focus-visible:outline-none"
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

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          id="preferences-dialog"
          role="dialog"
          aria-label="Panel de configuración de apariencia e idioma"
          className="absolute right-0 mt-2 w-[310px] sm:w-[330px] rounded-[4px] bg-[#1f1f1f] text-white p-5 shadow-none border border-[#252525] z-50 space-y-5"
        >
          {/* SECTION 1: MODO */}
          <div className="space-y-2">
            <span id="label-mode-group" className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#7a7a7a]">
              MODO
            </span>
            <div role="group" aria-labelledby="label-mode-group" className="grid grid-cols-2 gap-1.5 p-1 rounded-[4px] bg-[#161616] border border-[#252525]">
              <button
                type="button"
                onClick={() => setMode("light")}
                aria-pressed={mode === "light"}
                aria-label="Activar modo claro"
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.04em] transition-all cursor-pointer ${
                  mode === "light"
                    ? "text-[#000000] shadow-none"
                    : "text-[#7a7a7a] hover:text-white"
                }`}
                style={mode === "light" ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#000000" : "#ffffff" } : {}}
              >
                <span className="text-sm" aria-hidden="true">☼</span>
                <span>Claro</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("dark")}
                aria-pressed={mode === "dark"}
                aria-label="Activar modo oscuro"
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.04em] transition-all cursor-pointer ${
                  mode === "dark"
                    ? "text-[#000000] shadow-none"
                    : "text-[#7a7a7a] hover:text-white"
                }`}
                style={mode === "dark" ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#000000" : "#ffffff" } : {}}
              >
                <span className="text-sm" aria-hidden="true">🌙</span>
                <span>Oscuro</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: TEMA */}
          <div className="space-y-2">
            <span id="label-theme-group" className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#7a7a7a]">
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
                    className={`w-7 h-7 rounded-[2px] transition-all cursor-pointer relative ${
                      isSelected
                        ? "ring-2 ring-[var(--primary-accent)] scale-110 shadow-none"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: item.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* SECTION 3: IDIOMA */}
          <div className="space-y-2">
            <span id="label-locale-group" className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#7a7a7a]">
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
                    className={`flex items-center justify-between px-3 py-2 rounded-[2px] text-xs font-sans transition-all cursor-pointer ${
                      isSelected
                        ? "text-[#000000] font-medium shadow-none"
                        : "bg-[#161616] hover:bg-[#252525] text-[#e5e5e5] border border-[#252525]"
                    }`}
                    style={isSelected ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#000000" : "#ffffff" } : {}}
                  >
                    <span className="font-sans">{l.label}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-80" aria-hidden="true">
                      {l.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: SONIDO TACTIL FX */}
          <div className="space-y-2 pt-2 border-t border-[#252525]">
            <div className="flex items-center justify-between">
              <span id="label-sound-group" className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#7a7a7a]">
                {t.soundLabel || "SONIDO TÁCTIL"}
              </span>
              <span className="text-[10px] font-mono font-medium" style={{ color: activeAccent.hex }}>
                {sound ? (t.soundOn || "ON") : (t.soundOff || "OFF")}
              </span>
            </div>
            <div role="group" aria-labelledby="label-sound-group" className="grid grid-cols-2 gap-1.5 p-1 rounded-[4px] bg-[#161616] border border-[#252525]">
              <button
                type="button"
                onClick={() => setSound(true)}
                aria-pressed={sound}
                aria-label="Activar sonido táctil"
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-[2px] text-xs font-sans font-medium transition-all cursor-pointer ${
                  sound
                    ? "text-[#000000] shadow-none"
                    : "text-[#7a7a7a] hover:text-white"
                }`}
                style={sound ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#000000" : "#ffffff" } : {}}
              >
                <span>🔊</span>
                <span>{t.soundOn || "Activado"}</span>
              </button>

              <button
                type="button"
                onClick={() => setSound(false)}
                aria-pressed={!sound}
                aria-label="Silenciar sonido táctil"
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-[2px] text-xs font-sans font-medium transition-all cursor-pointer ${
                  !sound
                    ? "text-[#000000] shadow-none"
                    : "text-[#7a7a7a] hover:text-white"
                }`}
                style={!sound ? { backgroundColor: activeAccent.hex, color: activeAccent.isLight ? "#000000" : "#ffffff" } : {}}
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

