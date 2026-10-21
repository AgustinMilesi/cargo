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
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
      {/* Title & Subtitle */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Acceso Invitado / Demo
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-500 dark:text-[#8c8e9b] mt-1 font-normal">
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
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
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
            className="w-full pl-9 pr-12 py-2 text-xs md:text-sm rounded-full bg-[#0F1520] border border-[#1E293B] text-white placeholder:text-slate-500 outline-none focus:border-accent transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" aria-hidden="true">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-md">
              ⌘F
            </kbd>
          </div>
        </form>

        {/* Floating Theme & Language Popover (Exact match with user photo) */}
        <PreferencesDropdown />

        {/* Quick New Shipment CTA */}
        <Link
          href="/shipments/new"
          aria-label={t.newShipment ? "Nueva Carga: registrar embarque" : "New Load: register shipment"}
          className="shrink-0 px-3.5 py-2 rounded-xl bg-accent text-[var(--primary-accent-text,#0a0e14)] text-xs font-bold shadow-md shadow-[var(--primary-accent)]/20 transition-all flex items-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-95"
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
