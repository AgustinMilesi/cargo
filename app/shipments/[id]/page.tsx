import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateShipmentStatus } from "@/app/actions";

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shipment = await db.shipment.findUnique({
    where: { id },
    include: { milestones: { orderBy: { order: "asc" } } },
  });

  if (!shipment) notFound();

  async function handleAdvanceStatus(formData: FormData) {
    "use server";
    const nextStatus = formData.get("status") as string;
    const location = formData.get("location") as string;
    await updateShipmentStatus(id, nextStatus, location);
  }

  let statusBg = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (shipment.status === "BOOKED") statusBg = "bg-slate-500/10 text-slate-300 border-slate-500/20";
  if (shipment.status === "CUSTOMS") statusBg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (shipment.status === "DELIVERED") statusBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-mono">
              {shipment.reference}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusBg}`}>
              {shipment.status}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            B/L: <strong className="text-slate-200 font-mono">{shipment.blNumber}</strong> · Contenedor: <strong className="text-cyan-400 font-mono">{shipment.containerNumber || "N/A"}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/tracking?q=${shipment.containerNumber || shipment.blNumber}`}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold transition border border-cyan-500/20"
          >
            Ver en Live Tracking →
          </Link>
          <Link
            href="/shipments"
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            ← Volver a lista
          </Link>
        </div>
      </div>

      {/* Main Grid: Details & Quick Status Update */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Info */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Datos de Transporte & Ruta
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-500 block">Tipo & Modalidad</span>
                <span className="text-white font-semibold">{shipment.type} · {shipment.modality}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Transportista / Buque</span>
                <span className="text-white font-semibold">{shipment.carrier}</span>
                <span className="text-xs text-slate-400 block">{shipment.vessel || "Servicio directo"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Shipper (Exportador)</span>
                <span className="text-slate-200 font-medium">{shipment.shipper}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Consignee (Cliente)</span>
                <span className="text-slate-200 font-medium">{shipment.consignee}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Puerto de Origen (POL)</span>
                <span className="text-slate-200 font-medium">{shipment.pol}</span>
                <span className="text-xs text-slate-500 block font-mono">ETD: {new Date(shipment.etd).toLocaleDateString("es-AR")}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Puerto de Destino (POD)</span>
                <span className="text-slate-200 font-medium">{shipment.pod}</span>
                <span className="text-xs text-slate-500 block font-mono">ETA: {new Date(shipment.eta).toLocaleDateString("es-AR")}</span>
              </div>
            </div>

            {shipment.notes && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-500 block">Notas & Precintos</span>
                <p className="text-xs text-slate-300 mt-1">{shipment.notes}</p>
              </div>
            )}
          </div>

          {/* Milestones Timeline */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Eventos Operativos del Embarque
            </h2>

            <div className="space-y-4 relative pl-4 before:absolute before:left-[23px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {shipment.milestones.map((m) => (
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
                  <div className="flex-1 bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{m.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{m.location}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(m.date).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Finance & Status Advance */}
        <div className="space-y-6">
          {/* Financial Settlement Card */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Liquidación de Flete & Margen
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span>Costo Flete (Buy Rate):</span>
                <span className="font-mono text-slate-200">${shipment.buyRate.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Venta Flete (Sell Rate):</span>
                <span className="font-mono text-slate-200">${shipment.sellRate.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Gastos Locales / THC:</span>
                <span className="font-mono text-slate-200">+${shipment.localCharges.toFixed(2)} USD</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white">Profit Neto:</span>
                <span className="font-mono font-bold text-lg text-emerald-400">
                  +${shipment.profit.toFixed(2)} USD
                </span>
              </div>

              <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Estado de Cobro:</span>
                <span className="font-semibold text-cyan-400 uppercase">{shipment.invoiceStatus}</span>
              </div>
            </div>
          </div>

          {/* Quick Advance Status Form */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Actualizar Estado de la Carga
            </h2>

            <form action={handleAdvanceStatus} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nuevo Estado</label>
                <select
                  name="status"
                  defaultValue={shipment.status}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                >
                  <option value="BOOKED">Reservado (Booking)</option>
                  <option value="IN_TRANSIT">En Tránsito Internacional</option>
                  <option value="AT_PORT">Arribado a Puerto Destino</option>
                  <option value="CUSTOMS">En Inspección Aduanera</option>
                  <option value="DELIVERED">Entregado a Cliente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Ubicación / Novedad</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Ej: En navegación / Terminal TRP..."
                  defaultValue={shipment.currentLocation}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-cyan-500/20"
              >
                Actualizar Estado & Evento
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
