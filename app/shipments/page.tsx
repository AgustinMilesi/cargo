import Link from "next/link";
import { db } from "@/lib/db";
import { TopBar } from "@/components/TopBar";

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;

  const whereClause: { type?: string; status?: string } = {};
  if (type && type !== "ALL") whereClause.type = type;
  if (status && status !== "ALL") whereClause.status = status;

  const shipments = await db.shipment.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { milestones: true },
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Carpetas de Importación & Despacho"
        subtitle="Control de operaciones aduaneras, Bill of Lading, contenedores y estados de entrega"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        {/* Type Filter */}
        <div className="flex items-center gap-1.5 p-1 glass-card-sub rounded-2xl shadow-sm">
          <Link
            href="/shipments"
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              !type || type === "ALL"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Todos
          </Link>
          <Link
            href="/shipments?type=MARITIME"
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              type === "MARITIME"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Flete Marítimo
          </Link>
          <Link
            href="/shipments?type=AIR"
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              type === "AIR"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Flete Aéreo
          </Link>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 glass-card-sub rounded-2xl shadow-sm">
          <Link
            href="/shipments"
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              !status || status === "ALL"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Todos los Estados
          </Link>
          <Link
            href="/shipments?status=IN_TRANSIT"
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              status === "IN_TRANSIT"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            En Tránsito
          </Link>
          <Link
            href="/shipments?status=CUSTOMS"
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              status === "CUSTOMS"
                ? "bg-amber-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            En Aduana
          </Link>
          <Link
            href="/shipments?status=DELIVERED"
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              status === "DELIVERED"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Entregados
          </Link>
        </div>
      </div>

      {/* Shipments List Table */}
      <div className="glass-card rounded-3xl p-6 shadow-sm">
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">Referencia / B/L</th>
                <th className="pb-3 px-4">Modalidad & Contenedor</th>
                <th className="pb-3 px-4">Cliente / Consignee</th>
                <th className="pb-3 px-4">Ruta (POL ➔ POD)</th>
                <th className="pb-3 px-4">Estado</th>
                <th className="pb-3 px-4 text-right">Margen</th>
                <th className="pb-3 pl-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span className="font-medium text-xs">No hay carpetas de importación registradas todavía</span>
                      <Link
                        href="/shipments/new"
                        className="text-xs font-semibold text-accent hover:underline mt-1"
                      >
                        + Crear primera carpeta de importación
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                shipments.map((s) => {
                  let badgeClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
                  if (s.status === "BOOKED") badgeClass = "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300 border border-slate-200 dark:border-white/10";
                  if (s.status === "CUSTOMS") badgeClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
                  if (s.status === "DELIVERED") badgeClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4 font-mono">
                        <Link
                          href={`/shipments/${s.id}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-accent transition block font-sans text-sm"
                        >
                          {s.reference}
                        </Link>
                        <span className="text-[11px] text-slate-400 block font-mono">B/L: {s.blNumber}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">
                          {s.type === "MARITIME" ? "Ocean" : "Air"} · {s.modality}
                        </span>
                        <span className="text-[11px] text-accent font-mono">
                          {s.containerNumber || "Sin contenedor"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 dark:text-slate-200 font-medium block">
                          {s.consignee}
                        </span>
                        <span className="text-[11px] text-slate-400">{s.carrier}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-700 dark:text-slate-300">
                            <span className="text-slate-400">POL:</span> {s.pol}
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            <span className="text-slate-400">POD:</span> {s.pod}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeClass}`}>
                          {s.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        +${s.profit.toFixed(2)}
                      </td>

                      <td className="py-3.5 pl-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/shipments/${s.id}`}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/tracking?q=${s.containerNumber || s.blNumber}`}
                            className="px-2.5 py-1 rounded-xl bg-accent/10 hover:bg-accent/20 text-xs font-semibold text-accent transition"
                          >
                            Rastrear
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
