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
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
          VOUT Cargo · Enterprise Freight & Logistics Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="glass-card-sub p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Tarifas & Cotizaciones
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Centralización de fletes internacionales marítimos y aéreos, recargos BAF/THC y conversión en 1 clic a carpetas de importación operativas.
            </p>
          </div>

          <div className="glass-card-sub p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Aduana & Sobrestadía (Demurrage)
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Gestión integral de carpetas de importación con canales aduaneros (Verde, Naranja, Rojo), despacho y control de días libres de contenedor.
            </p>
          </div>

          <div className="glass-card-sub p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              Portal de Clientes & Tracking
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Autogestión para importadores con búsqueda por CUIT o contenedor, seguimiento de hitos en tiempo real y descarga de documentos sin exponer márgenes.
            </p>
          </div>

          <div className="glass-card-sub p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6F827]" />
              REST API & Sincronización
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Endpoints RESTful abiertos (<code className="text-accent">/api/v1/shipments</code>, <code className="text-accent">/api/v1/tracking</code>, <code className="text-accent">/api/v1/quotes</code>) para integraciones externas y ERP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
