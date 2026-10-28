"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePreferences, ACCENT_THEMES } from "./PreferencesProvider";
import { LOCALES } from "@/lib/i18n";

export function PreferencesDropdown({ placement = "down" }: { placement?: "up" | "down" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { mode, setMode, accent, setAccent, locale, setLocale, sound, setSound, t } = usePreferences();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const activeAccent = ACCENT_THEMES.find((a) => a.id === accent) || ACCENT_THEMES[0];

  return (
    <div>
      {/* Trigger Button (min-h-[40px] touch target) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="preferences-dialog"
        aria-label="Configuración de preferencias: tema, color e idioma"
        className="inline-flex items-center gap-2 min-h-[40px] px-3 py-2 rounded-[6px] bg-[#161616] hover:bg-[#202020] border border-[#262626] hover:border-[#383838] text-[#a3a3a3] hover:text-white text-xs font-semibold shadow-none transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#c5ff4a] focus-visible:outline-none active:scale-[0.98] shrink-0"
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
        />

        {/* Current Locale Badge */}
        <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
          {locale}
        </span>

        {/* Preferences controls indicator */}
        <svg className="size-3 text-[#737373]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      {/* Accessible Centered Preferences Modal Dialog (Portaled to document.body, floats above everything) */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preferences-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <div
              className="w-full max-w-sm sm:max-w-md bg-[#121212] border border-[#262626] rounded-[8px] p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 animate-smooth-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <div>
                  <h2 id="preferences-modal-title" className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                    {t.navPreferences || "Aspecto & Idiomas"}
                  </h2>
                  <p className="text-xs text-[#737373] mt-0.5 font-sans">
                    {locale === "es" ? "Ajustes de visualización y sistema" : "Display and system settings"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="size-9 rounded-[6px] bg-[#1a1a1a] border border-[#262626] text-[#a3a3a3] hover:text-white hover:border-[#383838] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Cerrar panel de preferencias"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* SECTION 1: MODO */}
              <div className="space-y-2">
                <span className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#737373]">
                  {t.mode || "MODO"}
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-[6px] bg-[#0a0a0a] border border-[#262626]">
                  <button
                    type="button"
                    onClick={() => setMode("light")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 min-h-[40px] rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                      mode === "light"
                        ? "bg-[#c5ff4a] text-black shadow-xs font-bold"
                        : "text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <span>☀️ Claro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("dark")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 min-h-[40px] rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                      mode === "dark"
                        ? "bg-[#c5ff4a] text-black shadow-xs font-bold"
                        : "text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <span>🌙 Oscuro</span>
                  </button>
                </div>
              </div>

              {/* SECTION 2: PALETA DE COLOR */}
              <div className="space-y-2 border-t border-[#262626] pt-4">
                <span className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#737373]">
                  COLOR DE ACENTO
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {ACCENT_THEMES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAccent(item.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 min-h-[40px] rounded-[6px] border text-xs font-medium transition-all cursor-pointer ${
                        accent === item.id
                          ? "border-[#c5ff4a] bg-[#1a1a1a] text-white shadow-xs font-bold"
                          : "border-[#262626] bg-[#0a0a0a] text-[#737373] hover:text-white hover:border-[#383838]"
                      }`}
                    >
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.hex }} />
                      <span className="text-[11px] capitalize">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: IDIOMA */}
              <div className="space-y-2 border-t border-[#262626] pt-4">
                <span className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#737373]">
                  IDIOMA
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLocale(l.code)}
                      className={`flex items-center justify-between px-3 py-2.5 min-h-[42px] rounded-[6px] border text-xs font-medium transition-all cursor-pointer ${
                        locale === l.code
                          ? "bg-[#c5ff4a] text-black border-[#c5ff4a] font-bold shadow-xs"
                          : "bg-[#0a0a0a] text-[#a3a3a3] border-[#262626] hover:text-white hover:border-[#383838]"
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="font-mono text-[10px] uppercase opacity-80">{l.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 4: RESPUESTA TÁCTIL */}
              <div className="space-y-2 border-t border-[#262626] pt-4">
                <span className="block text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#737373]">
                  RESPUESTA TÁCTIL / SONIDO
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-[6px] bg-[#0a0a0a] border border-[#262626]">
                  <button
                    type="button"
                    onClick={() => setSound(true)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 min-h-[40px] rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                      sound
                        ? "bg-[#c5ff4a] text-black shadow-xs font-bold"
                        : "text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <span>🔊 Activado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSound(false)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 min-h-[40px] rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                      !sound
                        ? "bg-[#c5ff4a] text-black shadow-xs font-bold"
                        : "text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <span>🔇 Silenciado</span>
                  </button>
                </div>
              </div>

              {/* Footer button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 min-h-[42px] rounded-[6px] bg-[#1e1e1e] hover:bg-[#282828] border border-[#2e2e2e] text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-[0.99]"
                >
                  {locale === "es" ? "Guardar y Cerrar" : "Save & Close"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
