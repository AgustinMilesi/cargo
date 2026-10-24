import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-5 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-[var(--primary-accent,#C6F827)]/10 text-[var(--primary-accent,#C6F827)] flex items-center justify-center border border-[var(--primary-accent,#C6F827)]/20 shadow-sm">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--primary-accent,#C6F827)] font-semibold">
          Error 404 · Manifiesto no encontrado
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Carga o ruta fuera de radar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          El contenedor, ruta logística o carpeta aduanera que estás buscando no existe en el sistema o fue archivada.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-2xl bg-[var(--primary-accent,#C6F827)] text-[#0A0E14] font-bold text-xs hover:opacity-90 transition shadow-sm hover:shadow-md active:scale-95"
        >
          Volver al Dashboard
        </Link>
        <Link
          href="/tracking"
          className="px-5 py-2.5 rounded-2xl border border-white/10 text-slate-300 font-semibold text-xs hover:bg-white/5 transition"
        >
          Rastrear Contenedor
        </Link>
      </div>
    </div>
  );
}
