import Link from "next/link";
import { db } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { DeliveringMap } from "@/components/DeliveringMap";
import { PastDeliveryRecord } from "@/components/PastDeliveryRecord";

export default async function DashboardPage() {
  const [shipments, totalClients] = await Promise.all([
    db.shipment.findMany({
      orderBy: { createdAt: "desc" },
      include: { milestones: { orderBy: { order: "asc" } } },
    }),
    db.client.count(),
  ]);

  // Aggregate active and financial stats
  const activeShipments = shipments.filter((s) => s.status !== "DELIVERED");
  const topActive = activeShipments[0] || shipments[0];

  // Expenses calculations (matching OneCargo metric or dynamic fallback)
  const totalBuyExpenses = shipments.reduce((acc, s) => acc + s.buyRate, 0);
  const totalDisplayExpenses = totalBuyExpenses > 0 ? totalBuyExpenses : 32855.0;

  // Milestone list from top active shipment or default OneCargo demo milestones
  const activeMilestones = topActive?.milestones?.length
    ? topActive.milestones
    : [
        {
          id: "m-1",
          location: "Erdberg, Austria",
          title: "Cargo Dispatched",
          completed: true,
          date: new Date("2025-01-09T08:30:00Z"),
        },
        {
          id: "m-2",
          location: "Schwechat, Austria",
          title: "Customs Inspected",
          completed: true,
          date: new Date("2025-01-09T14:15:00Z"),
        },
      ];

  const routeLabel = topActive
    ? `${topActive.pol} - ${topActive.pod}`
    : "Bratislava - Stuttgart";

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Dashboard"
        subtitle="Track your daily logistics loads and deliveries"
      />

      {/* Main Grid: Left Column (~42%) + Right Column (~58%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* CARD 1: Total Expenses */}
          <div className="bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm transition-colors duration-200 space-y-5">
            {/* Title & Options Icon */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">
                Total Expenses
              </h2>
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                title="Options"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="6" cy="12" r="1.5" />
                  <circle cx="18" cy="12" r="1.5" />
                </svg>
              </button>
            </div>

            {/* Big Stat Value */}
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                ${totalDisplayExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Allocation Label */}
            <div className="space-y-2.5">
              <span className="text-xs font-medium text-slate-500 dark:text-[#8c8e9b]">
                Expenses Allocation
              </span>

              {/* 4-Segment Colored Progress Bar */}
              <div className="flex items-center gap-1.5 h-3 w-full">
                {/* Fuel (Purple) */}
                <div
                  className="h-full rounded-full bg-[#6366f1] transition-all duration-300"
                  style={{ width: "37%" }}
                  title="Fuel: 37%"
                />
                {/* Highway (Blue) */}
                <div
                  className="h-full rounded-full bg-[#3b82f6] transition-all duration-300"
                  style={{ width: "30%" }}
                  title="Highway: 30%"
                />
                {/* Logistics (Green) */}
                <div
                  className="h-full rounded-full bg-[#10b981] transition-all duration-300"
                  style={{ width: "16%" }}
                  title="Logistics: 16%"
                />
                {/* Resting (Yellow/Amber) */}
                <div
                  className="h-full rounded-full bg-[#f59e0b] transition-all duration-300"
                  style={{ width: "17%" }}
                  title="Resting: 17%"
                />
              </div>

              {/* 4 Columns Legend with Dots */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {/* Fuel */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#8c8e9b]">
                    <span className="w-2 h-2 rounded-full bg-[#6366f1] shrink-0" />
                    <span>Fuel</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 font-sans">
                    $12,121
                  </div>
                </div>

                {/* Highway */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#8c8e9b]">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0" />
                    <span>Highway</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 font-sans">
                    $9,931
                  </div>
                </div>

                {/* Logistics */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#8c8e9b]">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
                    <span>Logistics</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 font-sans">
                    $5,388
                  </div>
                </div>

                {/* Resting */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#8c8e9b]">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" />
                    <span>Resting</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 font-sans">
                    $5,415
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Monthly Travel Distance */}
          <div className="bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm transition-colors duration-200 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">
                  Monthly Travel Distance
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8c8e9b] mt-0.5">
                  Track your distance and expected salary
                </p>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                title="Options"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="6" cy="12" r="1.5" />
                  <circle cx="18" cy="12" r="1.5" />
                </svg>
              </button>
            </div>

            {/* Big Stat */}
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                6,792.88 Km
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                10th, January 2025
              </div>
            </div>

            {/* Inner Recessed Box: Delivery Route & Distance */}
            <div className="bg-slate-50 dark:bg-[#121318] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-normal">
                    Delivery Route
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {routeLabel}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-normal">
                  Distance
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  705Km
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* CARD 3: Delivering Process Map */}
          <div className="bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm transition-colors duration-200 space-y-4">
            <div>
              <h2 className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">
                Delivering Process
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8c8e9b] mt-0.5">
                Real-time tracking of your goods shipment
              </p>
            </div>

            {/* Live Map */}
            <DeliveringMap
              origin={topActive?.pol || "Bratislava"}
              destination={topActive?.pod || "Stuttgart"}
              currentPosition={topActive?.currentLocation || "Lower Austria / Burgenland"}
            />
          </div>

          {/* CARD 4: Delivery Informations */}
          <div className="bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm transition-colors duration-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">
                  Delivery Informations
                </h2>
                <button
                  type="button"
                  title="Shipment tracking milestones"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>

              <Link
                href="/shipments/new"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Info</span>
              </Link>
            </div>

            {/* Milestones Timeline */}
            <div className="space-y-4 pt-1">
              {/* Header row */}
              <div className="grid grid-cols-12 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-white/5">
                <div className="col-span-5 pl-7">Locations</div>
                <div className="col-span-4">Conditions</div>
                <div className="col-span-3 text-right">Arrival Date</div>
              </div>

              {/* Milestones list */}
              <div className="relative space-y-5">
                {activeMilestones.map((m, idx) => (
                  <div key={m.id} className="relative grid grid-cols-12 items-center text-xs">
                    {/* Glowing green dot and vertical dashed line */}
                    <div className="absolute left-1 top-2.5 -bottom-6 w-0.5 border-l border-dashed border-slate-300 dark:border-white/10" />

                    <div className="col-span-5 flex items-center gap-3">
                      <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {m.location}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {m.title}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                        Good Condition
                      </span>
                    </div>

                    <div className="col-span-3 text-right text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(m.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM FULL-WIDTH ================= */}
      {/* CARD 5: Past Delivery Record */}
      <PastDeliveryRecord shipments={shipments} />
    </div>
  );
}
