"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePreferences } from "./PreferencesProvider";
import { PreferencesDropdown } from "./PreferencesDropdown";

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export function TopBar({
  title = "Dashboard",
  subtitle = "Track your daily logistics loads and deliveries",
}: TopBarProps) {
  const router = useRouter();
  const { t } = usePreferences();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/tracking?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#262626] mb-6">
      {/* Title & Subtitle */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-white">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[10px] font-mono uppercase tracking-[0.1em] bg-[#000000] text-[#c5ff4a] border border-[#c5ff4a]/30">
            <span className="size-1.5 rounded-full bg-[#c5ff4a] animate-pulse" />
            Live Demo
          </span>
        </div>
        <p className="text-xs md:text-sm text-[#a3a3a3] mt-1 font-sans">
          {subtitle}
        </p>
      </div>

      {/* Right Controls: Search, Theme & Language Dropdown Popup, New Shipment */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search Input (Ergonomic 44px min-height) */}
        <form role="search" onSubmit={handleSearch} className="relative flex-1 md:w-64 min-w-[200px]">
          <label htmlFor="topbar-search" className="sr-only">
            {t.searchPlaceholder || "Buscar contenedor, B/L..."}
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737373]" aria-hidden="true">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="topbar-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder || "Buscar contenedor, B/L..."}
            className="w-full min-h-[44px] pl-10 pr-12 py-2.5 text-xs rounded-[6px] bg-[#000000] border border-[#262626] text-white placeholder:text-[#666666] outline-none focus:border-[#c5ff4a] focus:ring-1 focus:ring-[#c5ff4a] transition-all font-mono"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" aria-hidden="true">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#737373] bg-[#161616] border border-[#262626] rounded-[3px]">
              ⌘F
            </kbd>
          </div>
        </form>

        {/* Floating Theme & Language Popover */}
        <PreferencesDropdown placement="down" />

        {/* Quick New Shipment CTA (min-h-[44px]) */}
        <Link
          href="/shipments/new"
          aria-label={t.newShipment ? "Nueva Carga: registrar embarque" : "New Load: register shipment"}
          className="shrink-0 min-h-[44px] px-4 py-2.5 rounded-[6px] bg-[#c5ff4a] hover:bg-[#b8f73b] active:scale-[0.98] text-black text-xs font-sans font-semibold uppercase tracking-wider shadow-[0_0_12px_rgba(197,255,74,0.3)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="size-4 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{t.newShipment ? "Nueva Carga" : "New Load"}</span>
        </Link>
      </div>
    </header>
  );
}
