import Link from "next/link";
import { db } from "@/lib/db";
import { createShipment } from "@/app/actions";

export default async function DashboardPage() {
  const [shipments, totalClients] = await Promise.all([
    db.shipment.findMany({
      orderBy: { createdAt: "desc" },
      include: { milestones: { orderBy: { order: "asc" } } },
    }),
    db.client.count(),
  ]);

  const activeShipments = shipments.filter((s) => s.status !== "DELIVERED");
  const inTransitCount = shipments.filter((s) => s.status === "IN_TRANSIT").length;
  const customsCount = shipments.filter((s) => s.status === "CUSTOMS").length;
  const totalProfit = shipments.reduce((acc, s) => acc + s.profit, 0);
  const totalRevenue = shipments.reduce((acc, s) => acc + s.sellRate + s.localCharges, 0);
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0";

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Panel de Control</span>
            <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono font-normal">
              KipinCARGO Engine
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión de operaciones de carga internacional, tracking de contenedores y liquidaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tracking"
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white text-sm font-semibold transition border border-slate-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Buscar Contenedor</span>
          </Link>

          <Link
            href="/shipments/new"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Embarque</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1 */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Operaciones Activas
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{activeShipments.length}</span>
            <span className="text-xs text-slate-400">embarques en curso</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {shipments.filter(s => s.type === "MARITIME").length} marítimos · {shipments.filter(s => s.type === "AIR").length} aéreos
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              En Tránsito
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400">{inTransitCount}</span>
            <span className="text-xs text-slate-400">en navegación / vuelo</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Actualización de posición GPS en tiempo real
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Aduana & Terminal
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{customsCount}</span>
            <span className="text-xs text-slate-400">en verificación</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Canal aduanero y liberación de terminal
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Profit / Margen Total
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">
              ${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Margen promedio sobre flete: <strong className="text-slate-300 font-semibold">{avgMargin}%</strong>
          </p>
        </div>
      </div>

      {/* Quick Search & Tracking Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-[#111a33] border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />
        <div className="relative max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>KipinTRACK · Consulta Rápida de Embarques</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Rastreá un contenedor o Bill of Lading en vivo
          </h2>
          <form action="/tracking" method="GET" className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                placeholder="Ingresá N° de Contenedor (ej: MSCU7654321) o B/L..."
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-cyan-500/20 shrink-0"
            >
              Consultar Tracking
            </button>
          </form>
        </div>
      </div>

      {/* Recent Shipments Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Últimas Operaciones de Carga</h2>
          <Link href="/shipments" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition">
            Ver todos los embarques ({shipments.length}) →
          </Link>
        </div>

        <div className="border border-slate-800/80 rounded-2xl bg-[#0f172a]/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Referencia</th>
                  <th className="py-3.5 px-4">Tipo / Contenedor</th>
                  <th className="py-3.5 px-4">Transportista / Buque</th>
                  <th className="py-3.5 px-4">Ruta (Origen → Destino)</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Profit (USD)</th>
                  <th className="py-3.5 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {shipments.map((s) => {
                  let statusBg = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                  let statusLabel = "En Tránsito";
                  if (s.status === "BOOKED") {
                    statusBg = "bg-slate-500/10 text-slate-300 border-slate-500/20";
                    statusLabel = "Reservado";
                  } else if (s.status === "CUSTOMS") {
                    statusBg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    statusLabel = "Aduana";
                  } else if (s.status === "DELIVERED") {
                    statusBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                    statusLabel = "Entregado";
                  }

                  return (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4">
                        <Link href={`/shipments/${s.id}`} className="font-bold text-white hover:text-cyan-400 transition font-mono">
                          {s.reference}
                        </Link>
                        <span className="block text-xs text-slate-500 font-mono">B/L: {s.blNumber}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-200 font-medium block">
                          {s.type === "MARITIME" ? "🚢 Marítimo" : "✈️ Aéreo"} · {s.modality}
                        </span>
                        <span className="text-xs text-cyan-400 font-mono">
                          {s.containerNumber || "Sin contenedor asignado"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-200 block font-medium">{s.carrier}</span>
                        <span className="text-xs text-slate-400">{s.vessel || "Direct Flight"}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-300">
                            <span className="text-slate-500">POL:</span> {s.pol}
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-500">POD:</span> {s.pod}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBg}`}>
                          {statusLabel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        +${s.profit.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/tracking?q=${s.containerNumber || s.blNumber}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold transition border border-slate-700 inline-flex items-center gap-1.5"
                        >
                          <span>Track</span>
                          <span className="text-cyan-400">→</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
