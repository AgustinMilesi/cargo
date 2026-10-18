import Link from "next/link";
import { db } from "@/lib/db";

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
          { containerNumber: { contains: query } },
          { blNumber: { contains: query } },
          { reference: { contains: query } },
        ],
      },
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
    });
  }

  // If no search query, show default first active shipment for live demonstration
  if (!matchedShipment) {
    matchedShipment = await db.shipment.findFirst({
      where: { status: "IN_TRANSIT" },
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
    });
  }

  const allShipments = await db.shipment.findMany({
    select: { containerNumber: true, blNumber: true, reference: true, status: true, carrier: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Live Container Tracking</span>
            <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono font-semibold">
              KipinTRACK
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Seguimiento en tiempo real de embarques marítimos y aéreos para clientes y despachantes.
          </p>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Search Bar */}
      <form method="GET" action="/tracking" className="relative max-w-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Ingresá N° de Contenedor (ej: MSCU7654321), B/L o Referencia..."
            className="w-full bg-[#0f172a] border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-cyan-500/20 shrink-0"
          >
            Rastrear
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
          <span className="text-slate-500">Pruebas rápidas:</span>
          {allShipments.map((s) => (
            <Link
              key={s.reference}
              href={`/tracking?q=${s.containerNumber || s.blNumber}`}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition border border-slate-700"
            >
              {s.containerNumber || s.blNumber} ({s.carrier.split(" ")[0]})
            </Link>
          ))}
        </div>
      </form>

      {/* Matched Shipment Display */}
      {matchedShipment ? (
        <div className="space-y-6">
          {/* Status Header Card */}
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white font-mono">
                    {matchedShipment.containerNumber || matchedShipment.blNumber}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {matchedShipment.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Referencia de Carga: <strong className="text-slate-200 font-mono">{matchedShipment.reference}</strong> · B/L: <strong className="text-slate-200 font-mono">{matchedShipment.blNumber}</strong>
                </p>
              </div>

              <div className="text-left md:text-right space-y-0.5">
                <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">
                  Llegada Estimada (ETA)
                </span>
                <span className="text-lg font-bold text-white font-mono">
                  {new Date(matchedShipment.eta).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Vessel & Location Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Transportista</span>
                <span className="text-white font-semibold mt-1 block">{matchedShipment.carrier}</span>
                <span className="text-xs text-slate-400">{matchedShipment.vessel || "Servicio Regular"}</span>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Ubicación Actual</span>
                <span className="text-cyan-400 font-semibold mt-1 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span>{matchedShipment.currentLocation}</span>
                </span>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Puerto de Origen (POL)</span>
                <span className="text-slate-200 font-medium mt-1 block text-xs">{matchedShipment.pol}</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ETD: {new Date(matchedShipment.etd).toLocaleDateString("es-AR")}
                </span>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Puerto de Destino (POD)</span>
                <span className="text-slate-200 font-medium mt-1 block text-xs">{matchedShipment.pod}</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ETA: {new Date(matchedShipment.eta).toLocaleDateString("es-AR")}
                </span>
              </div>
            </div>

            {/* Visual Milestones Timeline */}
            <div className="pt-4 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                Línea de Tiempo Operativa (Eventos de Carga)
              </h3>

              <div className="space-y-4 relative pl-4 before:absolute before:left-[23px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                {matchedShipment.milestones.map((m, index) => {
                  const isLast = index === matchedShipment.milestones.length - 1;
                  return (
                    <div key={m.id} className="relative flex items-start gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                          m.completed
                            ? "bg-cyan-500 border-cyan-400 text-slate-950"
                            : "bg-slate-900 border-slate-700 text-slate-600"
                        }`}
                      >
                        {m.completed ? (
                          <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        )}
                      </div>

                      <div className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className={`text-sm font-bold ${m.completed ? "text-white" : "text-slate-400"}`}>
                            {m.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">{m.location}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 shrink-0">
                          {new Date(m.date).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <p className="text-slate-400 text-sm">
            No se encontró ningún contenedor o B/L que coincida con <strong className="text-white">"{query}"</strong>.
          </p>
          <Link
            href="/tracking"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-block"
          >
            Limpiar búsqueda y ver contenedor activo
          </Link>
        </div>
      )}
    </div>
  );
}
