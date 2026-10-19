import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { DeliveringMap } from "@/components/DeliveringMap";

type ShipmentWithMilestones = Prisma.ShipmentGetPayload<{
  include: { milestones: { orderBy: { order: "asc" } } };
}>;

export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let matchedShipment: ShipmentWithMilestones | null = null;
  if (query && query.length >= 2) {
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

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Telemetría satelital encriptada con actualización automática AIS / GPS.</span>
        </div>
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
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Importador</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm mt-1 block">{matchedShipment.consignee}</span>
                <span className="text-slate-500">Origen: {matchedShipment.pol}</span>
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
          <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
            {query ? (
              <>No se encontró ningún despacho correspondiente a "{query}"</>
            ) : (
              <>Rastreo Satelital y Registro de Eventos</>
            )}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {query ? (
              <>Por favor revisá el identificador ingresado (número de contenedor o B/L) e intentalo nuevamente.</>
            ) : (
              <>Ingresá un número de Contenedor (ej. MSCU7654321), Bill of Lading (B/L) o número de Referencia para ver el mapa de telemetría y tiempos de arribo.</>
            )}
          </p>
          {query && (
            <div className="pt-2">
              <Link
                href="/tracking"
                className="text-xs text-accent hover:underline font-semibold inline-block"
              >
                Limpiar búsqueda y volver
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
