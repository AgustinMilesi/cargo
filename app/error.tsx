"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Ocurrió un error inesperado
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Se produjo un problema al procesar la solicitud. Podés intentar reintentar o regresar a la pantalla de inicio.
      </p>
      {error.message && (
        <pre className="text-[11px] font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-2xl text-slate-700 dark:text-slate-300 max-w-full overflow-x-auto text-left">
          {error.message}
        </pre>
      )}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-2xl bg-accent hover:opacity-90 text-white font-semibold text-xs transition shadow-md cursor-pointer"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition"
        >
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
}
