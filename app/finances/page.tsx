import Link from "next/link";
import { db } from "@/lib/db";
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
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Liquidaciones & Facturación de Fletes</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-semibold">
              USD Currency
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Control de tarifas de compra a navieras/aerolíneas, cobros a clientes y margen neto comercial.
          </p>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Costo Total de Fletes (Buy Rate)
          </span>
          <span className="text-2xl font-black text-slate-200 mt-2 block font-mono">
            ${totalBuy.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">A pagar a navieras y aerolíneas</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Ventas de Flete (Sell Rate)
          </span>
          <span className="text-2xl font-black text-cyan-400 mt-2 block font-mono">
            ${totalSell.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Facturado a exportadores / importadores</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Gastos Locales & THC
          </span>
          <span className="text-2xl font-black text-slate-200 mt-2 block font-mono">
            ${totalCharges.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Handling, documentación y terminales</span>
        </div>

        <div className="bg-[#0f172a] border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-5 shadow-lg shadow-emerald-500/5">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            Profit Comercial Neto
          </span>
          <span className="text-2xl font-black text-emerald-400 mt-2 block font-mono">
            +${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">Margen neto operativo en USD</span>
        </div>
      </div>

      {/* Settlement Table */}
      <div className="border border-slate-800/80 rounded-2xl bg-[#0f172a]/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Operación</th>
                <th className="py-4 px-4">Cliente / Consignee</th>
                <th className="py-4 px-4">Línea / Carrier</th>
                <th className="py-4 px-4 text-right">Costo (Buy)</th>
                <th className="py-4 px-4 text-right">Venta (Sell)</th>
                <th className="py-4 px-4 text-right">Locales (THC)</th>
                <th className="py-4 px-4 text-right">Profit Neto</th>
                <th className="py-4 px-4 text-center">Estado Facturación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {shipments.map((s) => {
                let badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                if (s.invoiceStatus === "PAID") badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                if (s.invoiceStatus === "INVOICED") badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-bold text-white">
                      <Link href={`/shipments/${s.id}`} className="hover:text-cyan-400 transition">
                        {s.reference}
                      </Link>
                    </td>

                    <td className="py-4 px-4 font-sans text-slate-200">
                      {s.consignee}
                    </td>

                    <td className="py-4 px-4 font-sans text-slate-400">
                      {s.carrier.split(" ")[0]}
                    </td>

                    <td className="py-4 px-4 text-right text-slate-400">
                      ${s.buyRate.toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-right text-slate-200">
                      ${s.sellRate.toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-right text-slate-400">
                      +${s.localCharges.toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-emerald-400">
                      +${s.profit.toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-center font-sans">
                      <InvoiceStatusSelect id={s.id} currentStatus={s.invoiceStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
