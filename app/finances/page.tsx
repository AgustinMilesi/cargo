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
        title="Monthly Financial Report"
        subtitle="Freight purchasing costs, customer billing settlements, and net revenue margins"
      />

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Carrier Freight Cost (Buy Rate)
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white block font-sans">
            ${totalBuy.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 block">Payable to ocean & air lines</span>
        </div>

        <div className="bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Client Billed Rate (Sell Rate)
          </span>
          <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 block font-sans">
            ${totalSell.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 block">Invoiced to shippers & consignees</span>
        </div>

        <div className="bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8c8e9b] uppercase tracking-wider block">
            Local Charges & Terminal THC
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white block font-sans">
            ${totalCharges.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 block">Handling, documentation & port fees</span>
        </div>

        <div className="bg-white dark:bg-[#181920] border border-emerald-500/30 rounded-3xl p-5 shadow-sm space-y-2 bg-emerald-50/50 dark:bg-emerald-500/5">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Net Commercial Profit
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block font-sans">
            +${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70 block font-medium">Net operative freight margin</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <div className="pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Operations Billing Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#8c8e9b]">
            Itemized breakdown of freight fees, profit margins, and payment collection status
          </p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">Reference</th>
                <th className="pb-3 px-4">Client / Consignee</th>
                <th className="pb-3 px-4">Carrier</th>
                <th className="pb-3 px-4 text-right">Cost (Buy)</th>
                <th className="pb-3 px-4 text-right">Sale (Sell)</th>
                <th className="pb-3 px-4 text-right">Local (THC)</th>
                <th className="pb-3 px-4 text-right">Net Margin</th>
                <th className="pb-3 pl-4 text-center">Invoice Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {shipments.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white">
                    <Link href={`/shipments/${s.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                      {s.reference}
                    </Link>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
