import Link from "next/link";
import { db } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { DeliveringMap } from "@/components/DeliveringMap";

export default async function CustomerPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let matchedShipments: any[] = [];
  if (query) {
    matchedShipments = await db.shipment.findMany({
      where: {
        OR: [
          { consignee: { contains: query, mode: "insensitive" } },
          { containerNumber: { contains: query, mode: "insensitive" } },
          { blNumber: { contains: query, mode: "insensitive" } },
          { reference: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { milestones: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // If no search query, show the 3 most recent active shipments for demonstration
    matchedShipments = await db.shipment.findMany({
      take: 4,
      include: { milestones: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Portal de Autogestión del Cliente (KipinTRACK)"
        subtitle="Acceso exclusivo para importadores: seguimiento de embarques, estado aduanero y documentos"
      />

      {/* Customer Lookup Search Box */}
      <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 shadow-sm space-y-4">
        <form method="GET" action="/portal" className="flex flex-col sm:flex-row gap-3">
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
              placeholder="Ingresá tu Razón Social, CUIT, Contenedor (MSCU...) o Bill of Lading..."
              className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-2xl bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
          >
            Consultar Mis Cargas
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Vista protegida de cliente: oculta márgenes de intermediación y muestra únicamente datos de logística y aduana.</span>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-6">
        {matchedShipments.map((s) => {
          let channelBadge = "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10";
          let channelLabel = "Aduana: En trámite";
          if (s.customsChannel === "GREEN") {
            channelBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
            channelLabel = "Canal Verde (Liberación Directa)";
          } else if (s.customsChannel === "ORANGE") {
            channelBadge = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
            channelLabel = "Canal Naranja (Revisión Documental)";
          } else if (s.customsChannel === "RED") {
            channelBadge = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
            channelLabel = "Canal Rojo (Aforo Físico)";
          }

          return (
            <div
              key={s.id}
              className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                      {s.containerNumber || s.blNumber}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {s.status}
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${channelBadge}`}>
                      {channelLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Importador: <strong className="text-slate-800 dark:text-slate-200">{s.consignee}</strong> · Proveedor: <strong className="text-slate-800 dark:text-slate-200">{s.shipper}</strong>
                  </p>
                </div>

                <div className="text-left md:text-right space-y-0.5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Fecha Estimada de Llegada (ETA)
                  </span>
                  <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-sans">
                    {new Date(s.eta).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Import Specs & Demurrage Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Despacho de Importación</span>
                  <span className="text-slate-900 dark:text-white font-mono font-bold text-sm mt-1 block">
                    {s.customsDeclaration || "En trámite SIM/SEDI"}
                  </span>
                  <span className="text-slate-500 font-sans">Oficialización aduanera</span>
                </div>

                <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Días Libres de Contenedor</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-1 block">
                    {s.freeDaysCount || 14} días libres
                  </span>
                  <span className="text-slate-500">Devolución vacío a naviera</span>
                </div>

                <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ruta & Naviera</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-sm mt-1 block">
                    {s.carrier.split(" ")[0]} · {s.modality}
                  </span>
                  <span className="text-slate-500 text-[11px]">{s.pol} ➔ {s.pod}</span>
                </div>

                <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Factura & Bultos</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-sm mt-1 block">
                    {s.packagesCount ? `${s.packagesCount} bultos / ${s.volumeCbm || 0} m³` : `${s.modality}`}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {s.invoiceNumber ? `Inv: ${s.invoiceNumber}` : `Ref: ${s.reference}`}
                  </span>
                </div>
              </div>

              {/* Map */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Telemetría GPS en Tiempo Real
                </span>
                <DeliveringMap
                  origin={s.pol}
                  destination={s.pod}
                  currentPosition={s.currentLocation}
                />
              </div>

              {/* Documentation Hub (Download links) */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider">
                  Documentación del Embarque para Descarga
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-[#121318]/65 border border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                        BL
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Conocimiento de Embarque</span>
                        <span className="text-slate-400 text-[10px]">Bill of Lading ({s.blNumber})</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Emitido
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-[#121318]/65 border border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
                        INV
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Factura Comercial Exterior</span>
                        <span className="text-slate-400 text-[10px]">Commercial Invoice</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Adjunta
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-[#121318]/65 border border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                        PKG
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Lista de Empaque</span>
                        <span className="text-slate-400 text-[10px]">Packing List oficial</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Verificado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {matchedShipments.length === 0 && (
          <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-12 text-center space-y-3">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No se encontraron cargas activas para <strong className="text-slate-900 dark:text-white">"{query}"</strong>.
            </p>
            <Link
              href="/portal"
              className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold inline-block"
            >
              Restablecer búsqueda y ver cargas recientes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
