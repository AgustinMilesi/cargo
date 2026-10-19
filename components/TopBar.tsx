"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePreferences, ThemeToggle } from "./PreferencesProvider";
import { LOCALES } from "@/lib/i18n";

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export function TopBar({
  title = "Dashboard",
  subtitle = "Track your daily logistics loads and deliveries",
}: TopBarProps) {
  const router = useRouter();
  const { t, locale, setLocale } = usePreferences();
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-[#8c8e9b] mt-1 font-normal">
          {subtitle}
        </p>
      </div>

      {/* Right Controls: Search, Language, Theme, New Shipment */}
      <div className="flex items-center gap-2.5">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder || "Search Anything"}
            className="w-full pl-9 pr-12 py-2 text-xs md:text-sm rounded-full bg-slate-100/80 dark:bg-[#1a1b22]/70 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md">
              ⌘F
            </kbd>
          </div>
        </form>

        {/* 4-Language Dropdown / Switcher Pill */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 dark:bg-[#1a1b22]/70 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-xs">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              title={l.label}
              className={`px-2 py-1 rounded-xl transition-all cursor-pointer text-xs ${
                locale === l.code
                  ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white opacity-60 hover:opacity-100"
              }`}
            >
              <span>{l.flag}</span>
            </button>
          ))}
        </div>

        {/* Theme Toggle Button */}
        <div className="shrink-0 hidden sm:block">
          <ThemeToggle />
        </div>

        {/* Quick New Shipment CTA */}
        <Link
          href="/shipments/new"
          className="shrink-0 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nueva Carga</span>
        </Link>
      </div>
    </header>
  );
}
