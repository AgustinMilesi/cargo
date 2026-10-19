import { TopBar } from "@/components/TopBar";
import { PreferencesBlock } from "@/components/PreferencesBlock";

export default function PreferencesPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      <TopBar
        title="Visual Preferences & Localization"
        subtitle="Custom theme modes, accent palettes, and 4-language system (ES, EN, PT, ZH)"
      />

      <PreferencesBlock />

      {/* Architecture & Documentation Card */}
      <div className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          KipinTOCH Solutions Suite Architecture & Documentation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              KipinCARGO & Quoting
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Centralized ocean & air freight pricing, BAF/THC terminal charge calculations, and 1-click conversion from accepted quotes into live import operational folders.
            </p>
          </div>

          <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              KipinPLUGINS & Customs Clearance
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Full import folder management with customs declaration numbers, inspection channels (Green, Orange, Red), and container demurrage free days countdown.
            </p>
          </div>

          <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              KipinTRACK & Client Portal
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Self-service customer portal where importers look up their shipments by Tax ID or container, view live milestones, and download B/L and invoices without exposing internal margins.
            </p>
          </div>

          <div className="bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              KipinAPI & Data Sync
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Open RESTful API endpoints (<code className="text-indigo-500">/api/v1/shipments</code>, <code className="text-indigo-500">/api/v1/tracking</code>, <code className="text-indigo-500">/api/v1/quotes</code>) for automated external integrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
