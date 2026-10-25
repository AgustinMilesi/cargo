"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreferences } from "./PreferencesProvider";
import { PreferencesDropdown } from "./PreferencesDropdown";
import { LOCALES } from "@/lib/i18n";

interface NavItem {
  key: string;
  name: string;
  href: string;
  badge?: number;
  icon: (active: boolean) => React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();
  const { t, locale, setLocale } = usePreferences();

  const navItems: NavItem[] = [
    {
      key: "dashboard",
      name: t.navDashboard || "Dashboard",
      href: "/",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-inherit" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      key: "quotes",
      name: t.navQuotes || "Cotizaciones & Tarifas",
      href: "/quotes",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-inherit" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      key: "shipments",
      name: t.navShipments || "Carpetas de Importación",
      href: "/shipments",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-inherit" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      key: "tracking",
      name: t.navTracking || "Live Tracker & GPS",
      href: "/tracking",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-inherit" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      key: "finances",
      name: t.navFinances || "Finanzas & Cuentas",
      href: "/finances",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-inherit" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      key: "clients",
      name: t.navClients || "Empresas & Clientes",
      href: "/clients",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-inherit" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      key: "portal",
      name: t.navPortal || "Portal del Cliente",
      href: "/portal",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-inherit" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      key: "preferences",
      name: t.navPreferences || "Diseño & Idiomas",
      href: "/preferences",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-inherit" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-full md:w-64 glass-sidebar border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-white/[0.08] p-5 flex flex-col justify-between shrink-0 sticky top-0 z-40 md:h-screen md:self-start md:overflow-y-auto transition-all duration-200">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Icon */}
            <div className="size-10 rounded-2xl bg-[#0A0E14] border border-[#1E293B] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0 p-2">
              <svg viewBox="68 106 416 310" className="w-full h-full" fill="none">
                <rect x="68" y="228" width="60" height="60" rx="6" fill="#E9E7E0" />
                <rect x="132" y="292" width="60" height="60" rx="6" fill="#E9E7E0" />
                <rect x="196" y="356" width="60" height="60" rx="6" fill="#E9E7E0" />
                <rect x="260" y="292" width="60" height="60" rx="6" fill="#E9E7E0" />
                <rect x="324" y="228" width="60" height="60" rx="6" fill="#C6F827" />
                <rect x="390" y="166" width="46" height="46" rx="5" fill="#C6F827" />
                <rect x="452" y="106" width="32" height="32" rx="4" fill="#C6F827" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                VOUT Cargo
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-none">
                Global Logistics OS
              </span>
            </div>
          </Link>

          <div className="md:hidden">
            <PreferencesDropdown />
          </div>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Navegación principal" className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-accent text-[var(--primary-accent-text,#0a0e14)] shadow-sm font-bold"
                    : "text-slate-400 hover:text-white hover:bg-[#182030]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true">{item.icon(isActive)}</span>
                  <span className="whitespace-nowrap">{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    aria-label={`${item.badge} pendientes`}
                    className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white leading-none shadow-sm shadow-rose-500/30"
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="hidden md:flex flex-col gap-3 pt-5 border-t border-slate-200/80 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
        <Link
          href="/login"
          className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-accent py-1.5 px-2 rounded-xl border border-white/5 hover:border-accent/30 transition block"
          title="Ver pantalla de acceso y login"
        >
          🔑 Acceso / Login
        </Link>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Neon Cloud</span>
          </div>

          <PreferencesDropdown />
        </div>
      </div>
    </aside>
  );
}
