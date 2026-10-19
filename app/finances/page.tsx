import Link from "next/link";
import { db } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { InvoiceStatusSelect } from "@/components/InvoiceStatusSelect";

export default async function FinancesPage() {
  const shipments = await db.shipment.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalBuy = shipments.reduce((acc, s) => acc + s.buyRate, 0);
  const totalSell = shipments.reduce((acc, s) => acc + s.sellRate, 0);
  const totalCharges = shipments.reduce((acc, s) => acc + s.localCharges, 0);
  const totalProfit = shipments.reduce((acc, s) => acc + s.profit, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Reporte Financiero & Cuentas Corrientes"
        subtitle="Liquidación de operaciones, cobranzas a clientes, costos de navieras y márgenes netos"
      />

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Costo Navieras (Buy Rate)
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white block font-sans">
            ${totalBuy.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 block">Pagadero a líneas marítimas y aéreas</span>
        </div>

        <div className="glass-card rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Venta Facturada (Sell Rate)
          </span>
          <span className="text-2xl font-extrabold text-accent block font-sans">
            ${totalSell.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 block">Facturación total a importadores</span>
        </div>

        <div className="glass-card rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Gastos Locales & Terminal THC
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white block font-sans">
            ${totalCharges.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 block">Handling, documentación y tasas de puerto</span>
        </div>

        <div className="glass-card border border-emerald-500/30 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Margen Comercial Neto
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block font-sans">
            +${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70 block font-medium">Margen operativo consolidado</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-card rounded-3xl p-6 shadow-sm">
        <div className="pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Libro de Liquidaciones Operativas
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#8c8e9b]">
            Desglose individual de tarifas, márgenes y estado de cobro por carpeta
          </p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">Referencia</th>
                <th className="pb-3 px-4">Cliente / Importador</th>
                <th className="pb-3 px-4">Naviera</th>
                <th className="pb-3 px-4 text-right">Compra (Buy)</th>
                <th className="pb-3 px-4 text-right">Venta (Sell)</th>
                <th className="pb-3 px-4 text-right">Local (THC)</th>
                <th className="pb-3 px-4 text-right">Margen Neto</th>
                <th className="pb-3 pl-4 text-center">Estado Factura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-xs">No hay operaciones financieras registradas todavía</span>
                      <Link
                        href="/shipments/new"
                        className="text-xs font-semibold text-accent hover:underline mt-1"
                      >
                        + Crear despacho para generar liquidación
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white">
                      <Link href={`/shipments/${s.id}`} className="hover:text-accent transition font-mono">
                        {s.reference}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {s.consignee}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {s.carrier.split(" ")[0]}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono">
                      ${s.buyRate.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-800 dark:text-slate-200 font-mono font-medium">
                      ${s.sellRate.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono">
                      +${s.localCharges.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +${s.profit.toFixed(2)}
                    </td>

                    <td className="py-3.5 pl-4 text-center">
                      <InvoiceStatusSelect id={s.id} currentStatus={s.invoiceStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
