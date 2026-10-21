"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ShipmentItem {
  id: string;
  reference: string;
  type: string;
  modality: string;
  blNumber: string;
  containerNumber: string | null;
  carrier: string;
  vessel: string | null;
  shipper: string;
  consignee: string;
  pol: string;
  pod: string;
  status: string;
  profit: number;
  buyRate: number;
  sellRate: number;
  createdAt: Date | string;
}

export function PastDeliveryRecord({
  shipments,
}: {
  shipments: ShipmentItem[];
}) {
  const [filter, setFilter] = useState<"ALL" | "HEAVY" | "MEDIUM">("ALL");

  const filteredShipments = shipments.filter((s) => {
    if (filter === "ALL") return true;
    if (filter === "HEAVY") {
      return s.modality.includes("40") || s.type === "MARITIME";
    }
    if (filter === "MEDIUM") {
      return s.modality.includes("20") || s.type === "AIR" || s.modality.includes("LCL");
    }
    return true;
  });

  return (
    <section aria-label="Registro de entregas anteriores" className="glass-card rounded-3xl p-6 transition-all duration-200 space-y-5">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            Past Delivery Record
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#8c8e9b] mt-0.5">
            Look back at your completed submissions
          </p>
        </div>

        {/* Filter Pills matching VOUT Cargo */}
        <div role="group" aria-label="Filtrar entregas por peso o modalidad" className="flex items-center gap-1.5 p-1 glass-card-sub rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            aria-pressed={filter === "ALL"}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-accent text-[var(--primary-accent-text)] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Weight
          </button>
          <button
            type="button"
            onClick={() => setFilter("HEAVY")}
            aria-pressed={filter === "HEAVY"}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "HEAVY"
                ? "bg-accent text-[var(--primary-accent-text)] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Heavy Weight
          </button>
          <button
            type="button"
            onClick={() => setFilter("MEDIUM")}
            aria-pressed={filter === "MEDIUM"}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "MEDIUM"
                ? "bg-accent text-[var(--primary-accent-text)] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Medium Weight
          </button>
        </div>
      </div>

      {/* Shipment Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table aria-label="Historial de despachos y entregas completadas" className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <th className="pb-3 pr-4">Reference</th>
              <th className="pb-3 px-4">Route</th>
              <th className="pb-3 px-4">Carrier / Vessel</th>
              <th className="pb-3 px-4">Condition / Status</th>
              <th className="pb-3 px-4 text-right">Fee / Margin</th>
              <th className="pb-3 pl-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredShipments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <span className="font-medium text-xs">No hay despachos registrados todavía</span>
                    <Link
                      href="/shipments/new"
                      className="text-xs font-semibold text-accent hover:underline mt-1"
                    >
                      + Crear primer despacho
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filteredShipments.map((s) => {
                let conditionBadge = "bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20";
                let conditionText = "Good Condition";
                if (s.status === "DELIVERED") {
                  conditionBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
                  conditionText = "Delivered";
                } else if (s.status === "CUSTOMS") {
                  conditionBadge = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
                  conditionText = "In Customs";
                }

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Reference & BL */}
                    <td className="py-3.5 pr-4">
                      <Link
                        href={`/shipments/${s.id}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-accent transition"
                      >
                        {s.reference}
                      </Link>
                      <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        {s.containerNumber || s.blNumber}
                      </span>
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        <span>{s.pol}</span>
                        <span className="text-slate-400">→</span>
                        <span>{s.pod}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {s.type === "MARITIME" ? "Ocean Freight" : "Air Express"} · {s.modality}
                      </span>
                    </td>

                    {/* Carrier & Vessel */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 dark:text-slate-200 font-medium block">
                        {s.carrier}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {s.vessel || "Scheduled Transit"}
                      </span>
                    </td>

                    {/* Condition / Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${conditionBadge}`}
                      >
                        {conditionText}
                      </span>
                    </td>

                    {/* Profit / Rates */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +${s.profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pl-4 text-center">
                      <Link
                        href={`/tracking?q=${s.containerNumber || s.blNumber}`}
                        aria-label={`Rastrear despacho ${s.reference}`}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Track</span>
                        <span className="text-accent" aria-hidden="true">→</span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
