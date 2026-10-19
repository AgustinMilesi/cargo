import Link from "next/link";
import { db } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { DeliveringMap } from "@/components/DeliveringMap";

export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let matchedShipment = null;
  if (query) {
    matchedShipment = await db.shipment.findFirst({
      where: {
        OR: [
          { containerNumber: { contains: query, mode: "insensitive" } },
          { blNumber: { contains: query, mode: "insensitive" } },
          { reference: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
    });
  }

  // If no search query, show default first active shipment
  if (!matchedShipment) {
    matchedShipment = await db.shipment.findFirst({
      where: { status: "IN_TRANSIT" },
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
    });
  }

  // Fallback to latest shipment if none in transit
  if (!matchedShipment) {
    matchedShipment = await db.shipment.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
    });
  }

  const allShipments = await db.shipment.findMany({
    select: { containerNumber: true, blNumber: true, reference: true, status: true, carrier: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Live Tracker & Telemetría GPS"
        subtitle="Monitoreo de contenedores en ruta internacional y registro de eventos"
      />

      {/* Search Input Bar */}
      <div className="glass-card rounded-3xl p-6 shadow-sm space-y-4">
        <form method="GET" action="/tracking" className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Buscar por Contenedor (ej. MSCU7654321), Bill of Lading, o Referencia..."
              className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-2xl bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-accent transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-accent hover:opacity-90 text-white font-semibold text-xs transition shadow-md shrink-0 cursor-pointer"
          >
            Rastrear Carga
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        {allShipments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">Cargas Recientes:</span>
            {allShipments.map((s) => (
              <Link
                key={s.reference}
                href={`/tracking?q=${s.containerNumber || s.blNumber}`}
                className="px-2.5 py-1 rounded-xl glass-card-sub text-slate-700 dark:text-slate-300 font-mono text-[11px] hover:border-accent/60 transition"
              >
                {s.containerNumber || s.blNumber} ({s.carrier.split(" ")[0]})
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Matched Shipment Display */}
      {matchedShipment ? (
        <div className="space-y-6">
          {/* Main Card with Delivering Process Map & Live Status */}
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            {/* Header with Title and ETA */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {matchedShipment.containerNumber || matchedShipment.blNumber}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {matchedShipment.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ref: <strong className="text-slate-700 dark:text-slate-200 font-mono">{matchedShipment.reference}</strong> · Naviera: <strong className="text-slate-700 dark:text-slate-200">{matchedShipment.carrier}</strong>
                </p>
              </div>

              <div className="text-left md:text-right space-y-0.5">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Fecha Estimada de Llegada (ETA)
                </span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-sans">
                  {new Date(matchedShipment.eta).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Live Visual Map Graphic */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Ruta & Monitoreo GPS
              </span>
              <DeliveringMap
                origin={matchedShipment.pol}
                destination={matchedShipment.pod}
                currentPosition={matchedShipment.currentLocation}
              />
            </div>

            {/* Telemetry Inset Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="glass-card-sub p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Línea & Buque</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm mt-1 block">{matchedShipment.carrier}</span>
                <span className="text-slate-500">{matchedShipment.vessel || "Servicio Directo"}</span>
              </div>

              <div className="glass-card-sub p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Posición Actual</span>
                <span className="text-accent font-bold text-sm mt-1 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {matchedShipment.currentLocation || "En Tránsito"}
                </span>
                <span className="text-slate-500">Último reporte vía SAT-AIS</span>
              </div>

              <div className="glass-card-sub p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ruta Marítima/Aérea</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm mt-1 block">{matchedShipment.pol} ➔ {matchedShipment.pod}</span>
                <span className="text-slate-500">{matchedShipment.modality}</span>
              </div>

              <div className="glass-card-sub p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Importador (Consignee)</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm mt-1 block">{matchedShipment.consignee}</span>
                <span className="text-slate-500">Shipper: {matchedShipment.shipper}</span>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Registro de Eventos y Puntos de Control
              </h3>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l before:border-dashed before:border-slate-300 dark:before:border-white/10">
                {matchedShipment.milestones.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No hay hitos registrados para este despacho todavía.</p>
                ) : (
                  matchedShipment.milestones.map((m) => (
                    <div key={m.id} className="relative flex items-start gap-4">
                      <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      <div className="flex-1 glass-card-sub rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {m.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                              Good Condition
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            {m.location}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 font-sans">
                          {new Date(m.date).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center space-y-3">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {query ? (
              <>No se encontró ningún despacho correspondiente a <strong className="text-slate-900 dark:text-white">"{query}"</strong>.</>
            ) : (
              <>No hay despachos registrados todavía en el sistema.</>
            )}
          </p>
          <div className="pt-1">
            {query ? (
              <Link
                href="/tracking"
                className="text-xs text-accent hover:underline font-semibold inline-block"
              >
                Limpiar búsqueda y volver al mapa
              </Link>
            ) : (
              <Link
                href="/shipments/new"
                className="text-xs text-accent hover:underline font-semibold inline-block"
              >
                + Crear primer despacho
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
