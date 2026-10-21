import Link from "next/link";
import { TopBar } from "@/components/TopBar";

export const metadata = {
  title: "Marco Legal, Contrato Cloud & Privacidad · VOUT Cargo",
  description: "Contrato de Servicio Administrado Cloud, Política de Privacidad, SLA 99.9% y Cookies de VOUT Cargo.",
};

export default function LegalPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
      <TopBar
        title="Marco Legal & Contratos Cloud"
        subtitle="Términos del Servicio Administrado, SLA de Operaciones Logísticas, Privacidad y Cookies"
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121824] border border-[#1E293B] text-[11px] font-mono font-bold text-accent">
          <span className="size-2 rounded-full bg-accent" />
          <span>Última actualización: Octubre 2026 · Versión 3.0</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          VOUT Cargo opera bajo el modelo de Software Administrado en la Nube (Managed SaaS) para transitarios, despachantes de aduana e importadores. Proveemos la infraestructura de alta disponibilidad, copias de seguridad continuas, monitoreo preventivo y soporte técnico integral.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Contrato de Hosting y Servicio Administrado */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#121824] border border-[#1E293B] space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="size-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-black text-sm">
              01
            </span>
            <h2 className="text-xl font-bold text-white">
              Contrato de Servicio Administrado &amp; Hosting Cloud
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
            <p>
              <strong>1.1. Naturaleza del Servicio:</strong> VOUT comercializa el aprovisionamiento, hosting gestionado de alto rendimiento, mantenimiento técnico preventivo y administración de base de datos para la plataforma logística VOUT Cargo. No se realiza venta ni cesión del código fuente propietario ni de derechos patrimoniales sobre el software.
            </p>
            <p>
              <strong>1.2. Mantenimiento y Parches:</strong> La suscripción mensual o anual incluye el despliegue automático de parches de seguridad, optimizaciones de cálculo de fletes y actualizaciones regulatorias de comercio exterior sin costo de desarrollo adicional.
            </p>
            <p>
              <strong>1.3. Resguardo de Documentación Comercial:</strong> El servicio implementa copias de respaldo continuas de todos los conocimientos de embarque (B/L), facturas comerciales (Invoices), listas de empaque (Packing Lists) y despachos aduaneros.
            </p>
            <p>
              <strong>1.4. Propiedad de la Información:</strong> Toda la información de proveedores en origen, clientes consignatarios, tarifas negociadas y márgenes comerciales es de estricta y exclusiva propiedad del suscriptor.
            </p>
          </div>
        </section>

        {/* 2. SLA 99.9% */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#121824] border border-[#1E293B] space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="size-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-black text-sm">
              02
            </span>
            <h2 className="text-xl font-bold text-white">
              Acuerdo de Nivel de Servicio (SLA 99.9%)
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
            <p>
              <strong>2.1. Disponibilidad Operativa:</strong> Disponibilidad garantizada de <strong>99.9%</strong> anual para el portal de clientes, consulta de cotizaciones y seguimiento de contenedores en tiempo real.
            </p>
            <p>
              <strong>2.2. Monitoreo Proactivo 24/7/365:</strong> Vigilancia continua de servicios y redundancia de bases de datos para evitar demoras en despachos o liquidaciones aduaneras.
            </p>
          </div>
        </section>

        {/* 3. Privacidad */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#121824] border border-[#1E293B] space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="size-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-black text-sm">
              03
            </span>
            <h2 className="text-xl font-bold text-white">
              Privacidad &amp; Secreto Comercial
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
            <p>
              Estricto deber de confidencialidad comercial. Ni VOUT ni su personal acceden a los detalles de cotizaciones ni listas de clientes salvo requerimiento explícito de soporte técnico. Comunicaciones cifradas vía TLS 1.3 y bases de datos encriptadas bajo AES-256.
            </p>
          </div>
        </section>

        {/* 4. Cookies */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#121824] border border-[#1E293B] space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="size-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-black text-sm">
              04
            </span>
            <h2 className="text-xl font-bold text-white">
              Cookies &amp; Almacenamiento Local
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
            <p>
              Uso restringido a cookies de sesión autenticada y almacenamiento de preferencias (idioma entre ES, EN, PT y ZH, paleta de acento y modo visual). No utilizamos cookies publicitarias ni trackers de terceros.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="pt-8 pb-12 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} VOUT Cargo · Managed Freight &amp; Customs Cloud.</p>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-accent transition">
            Volver al Dashboard
          </Link>
          <a href="mailto:soporte@vout.cloud" className="hover:text-accent transition">
            Soporte Logístico ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
