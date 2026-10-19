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
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Live Working Tracker"
        subtitle="Real-time tracking of your goods shipment and container milestones"
      />

      {/* Search Input Bar */}
      <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 shadow-sm space-y-4">
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
              placeholder="Search by Container (e.g. MSCU7654321), Bill of Lading, or Reference..."
              className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-2xl bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20 shrink-0"
          >
            Track Cargo
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">Recent Loads:</span>
          {allShipments.slice(0, 5).map((s) => (
            <Link
              key={s.reference}
              href={`/tracking?q=${s.containerNumber || s.blNumber}`}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition border border-slate-200 dark:border-white/5"
            >
              {s.containerNumber || s.blNumber} ({s.carrier.split(" ")[0]})
            </Link>
          ))}
        </div>
      </div>

      {/* Matched Shipment Display */}
      {matchedShipment ? (
        <div className="space-y-6">
          {/* Main Card with Delivering Process Map & Live Status */}
          <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
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
                  Ref: <strong className="text-slate-700 dark:text-slate-200 font-mono">{matchedShipment.reference}</strong> · Carrier: <strong className="text-slate-700 dark:text-slate-200">{matchedShipment.carrier}</strong>
                </p>
              </div>

              <div className="text-left md:text-right space-y-0.5">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Estimated Arrival (ETA)
                </span>
                <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-sans">
                  {new Date(matchedShipment.eta).toLocaleDateString("en-US", {
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
                Delivering Process & GPS Telemetry
              </span>
              <DeliveringMap
                origin={matchedShipment.pol}
                destination={matchedShipment.pod}
                currentPosition={matchedShipment.currentLocation}
              />
            </div>

            {/* Telemetry Inset Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Carrier & Vessel</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm mt-1 block">{matchedShipment.carrier}</span>
                <span className="text-slate-500">{matchedShipment.vessel || "Direct Service"}</span>
              </div>

              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Location</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-1 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
                  <span>{matchedShipment.currentLocation}</span>
                </span>
              </div>

              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Port of Loading (POL)</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm mt-1 block">{matchedShipment.pol}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  ETD: {new Date(matchedShipment.etd).toLocaleDateString("en-US")}
                </span>
              </div>

              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Port of Discharge (POD)</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm mt-1 block">{matchedShipment.pod}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  ETA: {new Date(matchedShipment.eta).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>

            {/* Delivery Informations Timeline */}
            <div className="pt-4 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Delivery Informations & Milestones
              </h3>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l before:border-dashed before:border-slate-300 dark:before:border-white/10">
                {matchedShipment.milestones.map((m) => (
                  <div key={m.id} className="relative flex items-start gap-4">
                    <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    <div className="flex-1 bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
                        {new Date(m.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-12 text-center space-y-3">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No shipment found matching <strong className="text-slate-900 dark:text-white">"{query}"</strong>.
          </p>
          <Link
            href="/tracking"
            className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold inline-block"
          >
            Clear query and show active load
          </Link>
        </div>
      )}
    </div>
  );
}
