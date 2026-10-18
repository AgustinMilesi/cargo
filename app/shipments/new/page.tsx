import Link from "next/link";
import { redirect } from "next/navigation";
import { createShipment } from "@/app/actions";

export default function NewShipmentPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const res = await createShipment(formData);
    if (res.success) {
      redirect(`/shipments/${res.id}`);
    }
  }

  const defaultRef = `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Registrar Nuevo Embarque
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ingresá los datos de la operación, transporte internacional y liquidación de flete.
          </p>
        </div>

        <Link
          href="/shipments"
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          ← Cancelar y volver
        </Link>
      </div>

      {/* Form */}
      <form action={handleSubmit} className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl">
        {/* Section 1: General & Routing */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <span>1. Datos de Operación & Transporte</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                N° de Referencia Interna
              </label>
              <input
                type="text"
                name="reference"
                defaultValue={defaultRef}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Transporte
              </label>
              <select
                name="type"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              >
                <option value="MARITIME">🚢 Marítimo</option>
                <option value="AIR">✈️ Aéreo</option>
                <option value="GROUND">🚚 Terrestre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Modalidad
              </label>
              <input
                type="text"
                name="modality"
                defaultValue="FCL 40' HC"
                placeholder="FCL 40', LCL, 500 Kg..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                N° de B/L o AWB (Guía de Carga)
              </label>
              <input
                type="text"
                name="blNumber"
                placeholder="Ej: MEDUST829104"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                N° de Contenedor (opcional)
              </label>
              <input
                type="text"
                name="containerNumber"
                placeholder="Ej: MSCU7654321"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Línea / Transportista
              </label>
              <input
                type="text"
                name="carrier"
                defaultValue="MSC (Mediterranean Shipping Co)"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre de Buque / Viaje o Vuelo
              </label>
              <input
                type="text"
                name="vessel"
                placeholder="Ej: MSC GÜLSÜN / 042E"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Estado Inicial
              </label>
              <select
                name="status"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              >
                <option value="BOOKED">Reservado (Booking)</option>
                <option value="IN_TRANSIT">En Tránsito Internacional</option>
                <option value="AT_PORT">Arribado a Puerto Destino</option>
                <option value="CUSTOMS">En Inspección Aduanera</option>
                <option value="DELIVERED">Entregado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Parties & Routing */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            2. Intervinientes & Ruta de Carga
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Shipper (Exportador en Origen)
              </label>
              <input
                type="text"
                name="shipper"
                placeholder="Ej: Ningbo Electronics Co."
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Consignee (Importador / Cliente Destino)
              </label>
              <input
                type="text"
                name="consignee"
                placeholder="Ej: TechImports S.A."
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Puerto / Aeropuerto de Origen (POL)
              </label>
              <input
                type="text"
                name="pol"
                placeholder="Ej: Puerto de Ningbo, China"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Puerto / Aeropuerto de Destino (POD)
              </label>
              <input
                type="text"
                name="pod"
                placeholder="Ej: Puerto de Buenos Aires, Terminal 4"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fecha Estimada de Salida (ETD)
              </label>
              <input
                type="date"
                name="etd"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fecha Estimada de Llegada (ETA)
              </label>
              <input
                type="date"
                name="eta"
                defaultValue={new Date(Date.now() + 25 * 86400000).toISOString().split("T")[0]}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial Settlement */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            3. Liquidación de Flete & Profit ($ USD)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Buy Rate (Costo de Compra al Carrier)
              </label>
              <input
                type="number"
                step="0.01"
                name="buyRate"
                placeholder="2500.00"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Sell Rate (Venta Flete al Cliente)
              </label>
              <input
                type="number"
                step="0.01"
                name="sellRate"
                placeholder="3200.00"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gastos Locales / THC (Ingreso Neto)
              </label>
              <input
                type="number"
                step="0.01"
                name="localCharges"
                placeholder="350.00"
                defaultValue="0"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Observaciones Operativas / Precintos
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Instrucciones especiales de despacho, número de precinto, etc..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            href="/shipments"
            className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-cyan-500/20"
          >
            Crear y Confirmar Embarque
          </button>
        </div>
      </form>
    </div>
  );
}
