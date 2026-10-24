import Link from "next/link";
import { db } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { createQuote, convertQuoteToShipment } from "@/app/actions";

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const whereClause: { status?: string } = {};
  if (status && status !== "ALL") whereClause.status = status;

  const quotes = await db.quote.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  const totalBuy = quotes.reduce((acc, q) => acc + q.buyRate, 0);
  const totalSell = quotes.reduce((acc, q) => acc + q.sellRate, 0);
  const totalProfit = quotes.reduce((acc, q) => acc + q.profit, 0);
  const activeCount = quotes.filter((q) => q.status === "SENT" || q.status === "DRAFT").length;
  const convertedCount = quotes.filter((q) => q.status === "CONVERTED").length;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Tarifarios & Cotizador de Importación"
        subtitle="Centralización de fletes internacionales, cálculo de BAF/THC y presupuestos comerciales"
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Cotizaciones Activas
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white block font-sans">
            {activeCount} <span className="text-xs font-normal text-slate-400">en gestión</span>
          </span>
          <span className="text-[11px] text-slate-400 block">Total histórico: {quotes.length} presupuestos</span>
        </div>

        <div className="glass-card rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Volumen Billed Estimado
          </span>
          <span className="text-2xl font-extrabold text-accent block font-sans">
            ${totalSell.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 block">Venta presupuestada a clientes</span>
        </div>

        <div className="glass-card rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Margen Neto Proyectado
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block font-sans">
            +${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 block">Spread comercial venta vs compra</span>
        </div>

        <div className="glass-card border border-emerald-500/30 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Embarques Concretados
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block font-sans">
            {convertedCount} <span className="text-xs font-normal text-emerald-600/70">convertidos</span>
          </span>
          <span className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70 block font-medium">1-Click a Carpeta de Importación</span>
        </div>
      </div>

      {/* New Quote Quick Generator */}
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent">
              Generar Nueva Cotización de Importación
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cotizador con recargos BAF, terminal THC y cálculo automático de ganancia
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Tarifario Multi-Naviera</span>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            await createQuote(formData);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Referencia Cotización
              </label>
              <input
                type="text"
                name="reference"
                defaultValue={`COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`}
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modalidad de Carga
              </label>
              <select
                name="modality"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition cursor-pointer"
              >
                <option value="FCL 40' HC">Ocean FCL 40' High Cube</option>
                <option value="FCL 20' Dry">Ocean FCL 20' Standard Dry</option>
                <option value="LCL Consolidado">Ocean LCL (Por m3 / CBM)</option>
                <option value="Air Freight Express">Air Cargo (Por Kg / Vol)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Puerto Origen (POL)
              </label>
              <input
                type="text"
                name="origin"
                defaultValue="Port of Ningbo, China"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Puerto Destino (POD)
              </label>
              <input
                type="text"
                name="destination"
                defaultValue="Puerto de Buenos Aires, Terminal 4"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cliente / Importador
              </label>
              <input
                type="text"
                name="clientName"
                placeholder="e.g. Acme Imports S.A."
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email de Contacto
              </label>
              <input
                type="email"
                name="clientEmail"
                placeholder="import@acme.com"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Línea / Naviera
              </label>
              <input
                type="text"
                name="carrier"
                defaultValue="MSC (Mediterranean Shipping Co)"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Validez de la Oferta
              </label>
              <input
                type="date"
                name="validUntil"
                defaultValue={new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0]}
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Costo Compra Naviera ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="buyRate"
                placeholder="2450.00"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Precio Venta Cliente ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="sellRate"
                placeholder="3200.00"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gastos Locales / THC ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="localCharges"
                placeholder="350.00"
                defaultValue="350"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-accent hover:opacity-90 text-[var(--primary-accent-text,#0a0e14)] font-bold text-xs rounded-2xl transition shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Emitir Cotización</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Tabs & Quotes Table */}
      <div className="glass-card rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Registro de Tarifas & Cotizaciones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historial de propuestas con acción de conversión directa a carpeta de importación
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 glass-card-sub rounded-2xl text-xs font-semibold">
            <Link
              href="/quotes"
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                !status || status === "ALL"
                  ? "bg-accent text-[var(--primary-accent-text,#0a0e14)] shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Todas
            </Link>
            <Link
              href="/quotes?status=SENT"
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                status === "SENT"
                  ? "bg-accent text-[var(--primary-accent-text,#0a0e14)] shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Enviadas
            </Link>
            <Link
              href="/quotes?status=CONVERTED"
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                status === "CONVERTED"
                  ? "bg-accent text-[var(--primary-accent-text,#0a0e14)] shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Convertidas
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">Referencia</th>
                <th className="pb-3 px-4">Cliente / Importador</th>
                <th className="pb-3 px-4">Ruta & Modalidad</th>
                <th className="pb-3 px-4">Naviera</th>
                <th className="pb-3 px-4 text-right">Compra (Buy)</th>
                <th className="pb-3 px-4 text-right">Venta (Sell)</th>
                <th className="pb-3 px-4 text-right">Margen Neto</th>
                <th className="pb-3 px-4 text-center">Estado</th>
                <th className="pb-3 pl-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {quotes.map((q) => {
                let badgeClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
                if (q.status === "CONVERTED") badgeClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
                if (q.status === "REJECTED") badgeClass = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";

                return (
                  <tr key={q.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                      {q.reference}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {q.clientName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{q.modality}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{q.origin} ➔ {q.destination}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {q.carrier.split(" ")[0]}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono">
                      ${q.buyRate.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                      ${q.sellRate.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +${q.profit.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeClass}`}>
                        {q.status}
                      </span>
                    </td>

                    <td className="py-3.5 pl-4 text-right">
                      {q.status === "CONVERTED" && q.shipmentId ? (
                        <Link
                          href={`/shipments/${q.shipmentId}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition border border-emerald-500/20"
                        >
                          <span>Ver Embarque</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <form
                          action={async () => {
                            "use server";
                            await convertQuoteToShipment(q.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-accent hover:opacity-90 text-[var(--primary-accent-text,#0a0e14)] text-xs font-bold transition shadow-sm cursor-pointer"
                          >
                            <span>Convertir</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}

              {quotes.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No hay cotizaciones registradas aún. Completá el formulario superior para emitir una.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
