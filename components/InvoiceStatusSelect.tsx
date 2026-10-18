"use client";

import { useTransition } from "react";
import { updateInvoiceStatus } from "@/app/actions";

export function InvoiceStatusSelect({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  let badgeColor = "border-amber-500/30 text-amber-400 bg-amber-500/10";
  if (currentStatus === "PAID") badgeColor = "border-emerald-500/30 text-emerald-400 bg-emerald-500/10";
  if (currentStatus === "INVOICED") badgeColor = "border-blue-500/30 text-blue-400 bg-blue-500/10";

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => {
        const val = e.target.value;
        startTransition(async () => {
          await updateInvoiceStatus(id, val);
        });
      }}
      className={`text-[11px] font-semibold border rounded-lg px-2 py-1 bg-slate-900 cursor-pointer outline-none transition disabled:opacity-50 ${badgeColor}`}
    >
      <option value="PENDING">PENDIENTE</option>
      <option value="INVOICED">FACTURADO</option>
      <option value="PAID">COBRADO</option>
    </select>
  );
}
