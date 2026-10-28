"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePreferences, ACCENT_THEMES } from "./PreferencesProvider";
import { LOCALES } from "@/lib/i18n";

export function PreferencesDropdown({ placement = "down" }: { placement?: "up" | "down" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top?: number; bottom?: number; width: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { mode, setMode, accent, setAccent, locale, setLocale, sound, setSound, t } = usePreferences();

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const padding = 12;
    const panelWidth = Math.min(300, window.innerWidth - padding * 2);

    // Compute left coordinate: default to aligning to trigger's right edge
    let left = rect.right - panelWidth;
    // Prevent clipping on the left edge (especially inside sidebars docked to the left wall):
    if (left < padding) {
      left = padding;
    }
    // Prevent clipping on the right edge:
    if (left + panelWidth > window.innerWidth - padding) {
      left = window.innerWidth - panelWidth - padding;
    }

    if (placement === "up") {
      setCoords({
        left,
        bottom: window.innerHeight - rect.top + 8,
        width: panelWidth,
      });
    } else {
      setCoords({
        left,
        top: rect.bottom + 8,
        width: panelWidth,
      });
    }
  }, [placement]);

  // Close when clicking outside or pressing Escape (WCAG 2.2 SC 2.1.2)
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

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
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  const activeAccent = ACCENT_THEMES.find((a) => a.id === accent) || ACCENT_THEMES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button (min-h-[40px] touch target) */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="preferences-dialog"
        aria-label="Configuración de preferencias: tema, color e idioma"
        className="inline-flex items-center gap-2 min-h-[40px] px-3 py-2 rounded-[6px] bg-[#161616] hover:bg-[#202020] border border-[#262626] hover:border-[#383838] text-[#a3a3a3] hover:text-white text-xs font-semibold shadow-none transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#c5ff4a] focus-visible:outline-none active:scale-[0.98]"
      >
        {/* Mode Icon */}
        {mode === "dark" ? (
          <span className="text-sm leading-none" aria-hidden="true" title="Modo Oscuro">🌙</span>
        ) : (
          <span className="text-sm leading-none" aria-hidden="true" title="Modo Claro">☀️</span>
        )}

        {/* Accent Color Dot */}
        <span
          className="size-2.5 rounded-full ring-1 ring-white/30 shrink-0"
          style={{ backgroundColor: activeAccent.hex }}
          aria-hidden="true"
          title={`Tema: ${activeAccent.name}`}
        />

        {/* Language Code */}
        <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-white">
          {locale.toUpperCase()}
        </span>

        {/* Chevron */}
        <svg
          className={`size-3 text-[#737373] transition-transform duration-200 ${
            isOpen ? (placement === "up" ? "-rotate-180" : "rotate-180") : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && coords && (
        <div
          id="preferences-dialog"
          role="dialog"
          aria-label="Panel de configuración de apariencia e idioma"
          style={{
            left: `${coords.left}px`,
            top: coords.top !== undefined ? `${coords.top}px` : undefined,
            bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
            width: `${coords.width}px`,
          }}
          className="fixed rounded-[6px] bg-[#121212] text-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] border border-[#262626] z-50 space-y-4 animate-smooth-in"
        >
          {/* SECTION 1: MODO */}
          <div className="space-y-2">
            <span id="label-mode-group" className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#737373]">
              MODO
            </span>
            <div role="group" aria-labelledby="label-mode-group" className="grid grid-cols-2 gap-1.5 p-1 rounded-[6px] bg-[#0a0a0a] border border-[#262626]">
              <button
                type="button"
                onClick={() => setMode("light")}
                aria-pressed={mode === "light"}
                aria-label="Activar modo claro"
                className={`flex items-center justify-center gap-2 py-2 px-3 min-h-[38px] rounded-[4px] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  mode === "light"
                    ? "text-black shadow-xs font-bold"
                    : "text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
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
                className={`flex items-center justify-center gap-2 py-2 px-3 min-h-[38px] rounded-[4px] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  mode === "dark"
                    ? "text-black shadow-xs font-bold"
                    : "text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
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
            <span id="label-theme-group" className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#737373]">
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
                    className={`size-7 rounded-[4px] transition-all cursor-pointer relative ${
                      isSelected
                        ? "ring-2 ring-[#c5ff4a] ring-offset-2 ring-offset-[#121212] scale-110 shadow-sm"
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ backgroundColor: item.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* SECTION 3: IDIOMA */}
          <div className="space-y-2">
            <span id="label-locale-group" className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#737373]">
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
                    className={`flex items-center justify-between px-3 py-2 min-h-[38px] rounded-[4px] text-xs font-sans transition-all cursor-pointer ${
                      isSelected
                        ? "text-black font-semibold shadow-xs"
                        : "bg-[#161616] hover:bg-[#202020] text-[#a3a3a3] hover:text-white border border-[#262626]"
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
          <div className="space-y-2 pt-2 border-t border-[#262626]">
            <div className="flex items-center justify-between">
              <span id="label-sound-group" className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#737373]">
                {t.soundLabel || "SONIDO TÁCTIL"}
              </span>
              <span className="text-[11px] font-mono font-semibold" style={{ color: activeAccent.hex }}>
                {sound ? (t.soundOn || "ON") : (t.soundOff || "OFF")}
              </span>
            </div>
            <div role="group" aria-labelledby="label-sound-group" className="grid grid-cols-2 gap-1.5 p-1 rounded-[6px] bg-[#0a0a0a] border border-[#262626]">
              <button
                type="button"
                onClick={() => setSound(true)}
                aria-pressed={sound}
                aria-label="Activar sonido táctil"
                className={`flex items-center justify-center gap-1.5 py-2 px-3 min-h-[38px] rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                  sound
                    ? "text-black shadow-xs font-bold"
                    : "text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
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
                className={`flex items-center justify-center gap-1.5 py-2 px-3 min-h-[38px] rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                  !sound
                    ? "text-black shadow-xs font-bold"
                    : "text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
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
