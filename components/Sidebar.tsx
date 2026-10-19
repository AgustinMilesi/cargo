"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeProvider";

interface NavItem {
  name: string;
  href: string;
  badge?: number;
  icon: (active: boolean) => React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-white" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
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
      name: "Monthly Report",
      href: "/finances",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-white" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
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
      name: "Working Tracker",
      href: "/tracking",
      badge: 12,
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-white" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: "Company Division",
      href: "/clients",
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-white" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
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
      name: "Approval Letter",
      href: "/shipments",
      badge: 12,
      icon: (active) => (
        <svg
          className={`w-5 h-5 transition-colors ${
            active ? "text-white" : "text-slate-400 group-hover:text-slate-200 dark:group-hover:text-white"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-[#131419] border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 p-5 flex flex-col justify-between shrink-0 transition-colors duration-200">
      <div className="space-y-7">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Icon */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 00-7.07 17.07 10 10 0 1014.14-14.14A9.93 9.93 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8zm3.5-9.5A2.5 2.5 0 0013 8h-2a2.5 2.5 0 000 5h2a2.5 2.5 0 010 5h-2a2.5 2.5 0 01-2.5-2.5v-.5h2v.5a.5.5 0 00.5.5h2a.5.5 0 000-1h-2a2.5 2.5 0 010-5h2a2.5 2.5 0 012.5 2.5v.5h-2v-.5a.5.5 0 00-.5-.5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                OneCargo
              </span>
            </div>
          </Link>

          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md dark:bg-white/10 dark:text-white dark:border dark:border-white/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon(isActive)}
                  <span className="whitespace-nowrap">{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="ml-3 px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500 text-white leading-none shadow-sm shadow-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="hidden md:flex flex-col gap-4 pt-6 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Neon Cloud DB</span>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
            v2.0
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px]">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
