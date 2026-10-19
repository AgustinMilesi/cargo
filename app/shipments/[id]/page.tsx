import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateShipmentStatus, updateCustomsDetails } from "@/app/actions";
import { TopBar } from "@/components/TopBar";
import { DeliveringMap } from "@/components/DeliveringMap";

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

  let statusBg = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
  if (shipment.status === "BOOKED") statusBg = "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-300 border border-slate-200 dark:border-white/10";
  if (shipment.status === "CUSTOMS") statusBg = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
  if (shipment.status === "DELIVERED") statusBg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title={`Load Manifest ${shipment.reference}`}
        subtitle={`Bill of Lading ${shipment.blNumber} · Container ${shipment.containerNumber || "N/A"}`}
      />

      {/* Main Grid: Details & Status Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Info Card */}
          <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Transit & Cargo Routing
              </h2>
              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusBg}`}>
                {shipment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mode & Equipment</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm mt-1 block">
                  {shipment.type} · {shipment.modality}
                </span>
              </div>

              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Carrier & Vessel</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm mt-1 block">
                  {shipment.carrier}
                </span>
                <span className="text-slate-500">{shipment.vessel || "Direct Service"}</span>
              </div>

              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Shipper (Exporter)</span>
                <span className="text-slate-900 dark:text-white font-semibold mt-1 block">{shipment.shipper}</span>
              </div>

              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Consignee (Client)</span>
                <span className="text-slate-900 dark:text-white font-semibold mt-1 block">{shipment.consignee}</span>
              </div>

              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Port of Loading (POL)</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm mt-1 block">{shipment.pol}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  ETD: {new Date(shipment.etd).toLocaleDateString("en-US")}
                </span>
              </div>

              <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Port of Discharge (POD)</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm mt-1 block">{shipment.pod}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  ETA: {new Date(shipment.eta).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>

            {shipment.notes && (
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Notes & Seal Numbers</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-3 rounded-xl border border-slate-200/60 dark:border-white/[0.06]">
                  {shipment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Delivering Process Map */}
          <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Live Delivering Route & Location
            </h2>
            <DeliveringMap
              origin={shipment.pol}
              destination={shipment.pod}
              currentPosition={shipment.currentLocation}
            />
          </div>

          {/* KipinPLUGINS: Customs Clearance, Demurrage & Import Folder */}
          <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Despacho Aduanero & Control de Sobrestadía (Demurrage)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  KipinPLUGINS: Gestión de canales aduaneros, factura exterior y plazos de devolución de contenedor
                </p>
              </div>

              {/* Customs Channel Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Canal:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    shipment.customsChannel === "GREEN"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : shipment.customsChannel === "ORANGE"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : shipment.customsChannel === "RED"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                  }`}
                >
                  {shipment.customsChannel === "GREEN"
                    ? "Canal Verde (Liberación)"
                    : shipment.customsChannel === "ORANGE"
                    ? "Canal Naranja (Documental)"
                    : shipment.customsChannel === "RED"
                    ? "Canal Rojo (Aforo Físico)"
                    : "Pendiente Asignación"}
                </span>
              </div>
            </div>

            <form
              action={async (formData: FormData) => {
                "use server";
                await updateCustomsDetails(shipment.id, formData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Despacho Aduanero
                  </label>
                  <input
                    type="text"
                    name="customsDeclaration"
                    defaultValue={shipment.customsDeclaration || ""}
                    placeholder="e.g. 26001IC0400192X"
                    className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Canal Aduana Asignado
                  </label>
                  <select
                    name="customsChannel"
                    defaultValue={shipment.customsChannel || "PENDING"}
                    className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition cursor-pointer"
                  >
                    <option value="PENDING">Pendiente de Verificación</option>
                    <option value="GREEN">Canal Verde (Sin inspección)</option>
                    <option value="ORANGE">Canal Naranja (Revisión Documental)</option>
                    <option value="RED">Canal Rojo (Aforo Físico y Documental)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Días Libres Contenedor (Free Days)
                  </label>
                  <input
                    type="number"
                    name="freeDaysCount"
                    defaultValue={shipment.freeDaysCount || 14}
                    className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Factura Comercial Proveedor
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    defaultValue={shipment.invoiceNumber || ""}
                    placeholder="e.g. INV-EXP-84910"
                    className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Valor Mercadería (FOB/CIF USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="invoiceValue"
                    defaultValue={shipment.invoiceValue || 0}
                    placeholder="54200.00"
                    className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bultos / Pallets y Volumen (CBM)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="packagesCount"
                      defaultValue={shipment.packagesCount || 0}
                      placeholder="Bultos"
                      className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
                    />
                    <input
                      type="number"
                      step="0.1"
                      name="volumeCbm"
                      defaultValue={shipment.volumeCbm || 0}
                      placeholder="m³ CBM"
                      className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Digital Docs Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enlace Conocimiento B/L
                  </label>
                  <input
                    type="text"
                    name="docBlUrl"
                    defaultValue={shipment.docBlUrl || ""}
                    placeholder="https://... o doc ref"
                    className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enlace Factura Comercial
                  </label>
                  <input
                    type="text"
                    name="docInvoiceUrl"
                    defaultValue={shipment.docInvoiceUrl || ""}
                    placeholder="https://... o doc ref"
                    className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enlace Packing List
                  </label>
                  <input
                    type="text"
                    name="docPackingListUrl"
                    defaultValue={shipment.docPackingListUrl || ""}
                    placeholder="https://... o doc ref"
                    className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-2xl transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Guardar Datos de Importación & Aduana
                </button>
              </div>
            </form>
          </div>

          {/* Milestones Timeline */}
          <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Delivery Informations & Milestone Events
            </h2>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l before:border-dashed before:border-slate-300 dark:before:border-white/10">
              {shipment.milestones.map((m) => (
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

        {/* Right Col: Finance & Status Update */}
        <div className="space-y-6">
          {/* Financial Settlement Card */}
          <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Freight Settlement & Margins
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Buy Rate (Cost to Carrier):</span>
                <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">${shipment.buyRate.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Sell Rate (Client Invoiced):</span>
                <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">${shipment.sellRate.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Local Charges / THC:</span>
                <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">+${shipment.localCharges.toFixed(2)} USD</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Net Profit:</span>
                <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                  +${shipment.profit.toFixed(2)} USD
                </span>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Invoice Collection:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase">{shipment.invoiceStatus}</span>
              </div>
            </div>
          </div>

          {/* Quick Status Update Form */}
          <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Update Transit Status
            </h2>

            <form action={handleAdvanceStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Next Status
                </label>
                <select
                  name="status"
                  defaultValue={shipment.status}
                  className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition cursor-pointer"
                >
                  <option value="BOOKED">Booked</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="AT_PORT">At Port / Terminal</option>
                  <option value="CUSTOMS">Customs Inspection</option>
                  <option value="DELIVERED">Delivered to Client</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Location / Port
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Lower Austria / Burgenland"
                  defaultValue={shipment.currentLocation}
                  className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Update Status & Record Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
