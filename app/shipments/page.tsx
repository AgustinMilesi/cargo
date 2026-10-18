import Link from "next/link";
import { db } from "@/lib/db";

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
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Gestión de Embarques</span>
            <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
              {shipments.length} operaciones
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Administrá todos los bookings, contenedores marítimos y guías aéreas internacionales.
          </p>
        </div>

        <Link
          href="/shipments/new"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Embarque</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        {/* Type Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <Link
            href="/shipments"
            className={`px-3 py-1.5 rounded-lg transition ${
              !type || type === "ALL" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Todos
          </Link>
          <Link
            href="/shipments?type=MARITIME"
            className={`px-3 py-1.5 rounded-lg transition ${
              type === "MARITIME" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            🚢 Marítimos
          </Link>
          <Link
            href="/shipments?type=AIR"
            className={`px-3 py-1.5 rounded-lg transition ${
              type === "AIR" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            ✈️ Aéreos
          </Link>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <Link
            href="/shipments"
            className={`px-3 py-1.5 rounded-lg transition ${
              !status || status === "ALL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Cualquier Estado
          </Link>
          <Link
            href="/shipments?status=IN_TRANSIT"
            className={`px-3 py-1.5 rounded-lg transition ${
              status === "IN_TRANSIT" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            En Tránsito
          </Link>
          <Link
            href="/shipments?status=CUSTOMS"
            className={`px-3 py-1.5 rounded-lg transition ${
              status === "CUSTOMS" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Aduana
          </Link>
          <Link
            href="/shipments?status=DELIVERED"
            className={`px-3 py-1.5 rounded-lg transition ${
              status === "DELIVERED" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Entregados
          </Link>
        </div>
      </div>

      {/* Shipments List */}
      <div className="border border-slate-800/80 rounded-2xl bg-[#0f172a]/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Operación / B/L</th>
                <th className="py-4 px-4">Modo & Contenedor</th>
                <th className="py-4 px-4">Cliente / Shipper</th>
                <th className="py-4 px-4">Ruta (POL ➔ POD)</th>
                <th className="py-4 px-4">Fechas (ETD / ETA)</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Profit</th>
                <th className="py-4 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {shipments.map((s) => {
                let badgeClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                if (s.status === "BOOKED") badgeClass = "bg-slate-500/10 text-slate-300 border-slate-500/20";
                if (s.status === "CUSTOMS") badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                if (s.status === "DELIVERED") badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-mono">
                      <Link href={`/shipments/${s.id}`} className="font-bold text-white hover:text-cyan-400 transition block">
                        {s.reference}
                      </Link>
                      <span className="text-xs text-slate-400 block">B/L: {s.blNumber}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-200 block text-xs">
                        {s.type === "MARITIME" ? "🚢 Marítimo" : "✈️ Aéreo"} · {s.modality}
                      </span>
                      <span className="font-mono text-xs text-cyan-400">
                        {s.containerNumber || "Carga Suelta / LCL"}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-200 block text-xs">{s.consignee}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                        De: {s.shipper}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <div className="space-y-0.5">
                        <p className="text-slate-300 truncate max-w-[200px]">
                          <span className="text-slate-500">Origen:</span> {s.pol}
                        </p>
                        <p className="text-slate-300 truncate max-w-[200px]">
                          <span className="text-slate-500">Destino:</span> {s.pod}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-mono">
                      <div className="space-y-0.5 text-slate-400">
                        <p>ETD: {new Date(s.etd).toLocaleDateString("es-AR")}</p>
                        <p className="text-white font-medium">ETA: {new Date(s.eta).toLocaleDateString("es-AR")}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                        {s.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-emerald-400">
                      ${s.profit.toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/shipments/${s.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition border border-slate-700"
                        >
                          Detalle
                        </Link>
                        <Link
                          href={`/tracking?q=${s.containerNumber || s.blNumber}`}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold transition border border-cyan-500/20"
                        >
                          Track
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
