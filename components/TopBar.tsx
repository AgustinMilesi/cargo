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
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#252525] mb-6">
      {/* Title & Subtitle */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-white">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase tracking-[0.1em] bg-[#000000] text-[var(--primary-accent)] border border-[var(--primary-accent)]/30">
            <span className="size-1.5 rounded-full bg-[var(--primary-accent)] animate-pulse" />
            Live Demo
          </span>
        </div>
        <p className="text-xs md:text-sm text-[#7a7a7a] mt-1 font-sans">
          {subtitle}
        </p>
      </div>

      {/* Right Controls: Search, Theme & Language Dropdown Popup, New Shipment */}
      <div className="flex items-center gap-2.5">
        {/* Search Input */}
        <form role="search" onSubmit={handleSearch} className="relative flex-1 md:w-64">
          <label htmlFor="topbar-search" className="sr-only">
            {t.searchPlaceholder || "Buscar contenedor, B/L..."}
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7a7a7a]" aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="topbar-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder || "Buscar contenedor, B/L..."}
            className="w-full pl-9 pr-12 py-2 text-xs rounded-[4px] bg-[#000000] border border-[#252525] text-white placeholder:text-[#7a7a7a] outline-none focus:border-[var(--primary-accent)] transition-colors shadow-none font-mono"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" aria-hidden="true">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#7a7a7a] bg-[#161616] border border-[#252525] rounded-[2px]">
              ⌘F
            </kbd>
          </div>
        </form>

        {/* Floating Theme & Language Popover */}
        <PreferencesDropdown />

        {/* Quick New Shipment CTA */}
        <Link
          href="/shipments/new"
          aria-label={t.newShipment ? "Nueva Carga: registrar embarque" : "New Load: register shipment"}
          className="shrink-0 px-3.5 py-2 rounded-[4px] bg-accent text-[#000000] text-xs font-sans font-medium uppercase tracking-[0.04em] shadow-[0_0_8px_rgba(197,255,74,0.45)] hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">{t.newShipment ? "Nueva Carga" : "New Load"}</span>
        </Link>
      </div>
    </header>
  );
}
