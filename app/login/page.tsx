import type { Metadata } from "next";
import Link from "next/link";
import { PreferencesDropdown } from "@/components/PreferencesDropdown";

export const metadata: Metadata = {
  title: "VOUT Cargo • Acceso a la Plataforma",
  description: "Sistema operativo de logística internacional, flete y despacho aduanero.",
};

export default function CargoLoginPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-4 sm:p-8 md:p-12 relative overflow-hidden bg-[#0A0E14] text-slate-100">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between relative z-10 pb-6 border-b border-[#1E293B]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-9 rounded-xl bg-[#121824] border border-[#1E293B] flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <svg viewBox="68 106 416 310" className="w-full h-full" fill="none">
              <rect x="68" y="228" width="60" height="60" rx="6" fill="#E9E7E0" />
              <rect x="132" y="292" width="60" height="60" rx="6" fill="#E9E7E0" />
              <rect x="196" y="356" width="60" height="60" rx="6" fill="#E9E7E0" />
              <rect x="260" y="292" width="60" height="60" rx="6" fill="#E9E7E0" />
              <rect x="324" y="228" width="60" height="60" rx="6" fill="#C6F827" />
              <rect x="390" y="166" width="46" height="46" rx="5" fill="#C6F827" />
              <rect x="452" y="106" width="32" height="32" rx="4" fill="#C6F827" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-black text-lg tracking-[-0.05em] text-white">
                <span className="text-[#E9E7E0]">v</span>
                <span className="text-[#C6F827]">out</span>
              </span>
              <span className="text-[10px] font-mono text-[#C6F827] px-1.5 py-0.5 rounded bg-[#121824] border border-[#1E293B]">
                cargo
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[#94A3B8] font-bold mt-1">
              Global Freight &amp; Customs OS
            </span>
          </div>
        </Link>
        <PreferencesDropdown />
      </header>

      {/* Main Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8 relative z-10 space-y-4">
        <div className="border border-[#1E293B] rounded-3xl bg-[#121824] p-8 sm:p-10 shadow-2xl space-y-7">
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#0A0E14] border border-[#1E293B] flex items-center justify-center text-[#C6F827] shadow-sm">
                <span className="font-black text-xl">⚓</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#C6F827]/15 text-[#C6F827] border border-[#C6F827]/30">
                VOUT CARGO OS
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Acceso a la Terminal de Carga</h1>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Control de operaciones marítimas, aranceles aduaneros, cálculo de demurrage y seguimiento de Bill of Lading.
              </p>
            </div>
          </div>

          <Link
            href="/demo"
            className="w-full py-3 px-4 rounded-xl bg-[#C6F827] hover:bg-[#b0df1f] text-[#0A0E14] font-black text-xs text-center uppercase tracking-wider block transition shadow-md cursor-pointer"
          >
            🚀 Live Demo →
          </Link>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-[#1E293B] w-full" />
            <span className="bg-[#121824] px-3 text-[10px] text-[#64748B] uppercase tracking-widest font-black shrink-0">
              o iniciar sesión con credenciales
            </span>
            <div className="border-t border-[#1E293B] w-full" />
          </div>

          {/* Standard Login Form */}
          <form className="space-y-4" action="/demo">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico Corporativo
              </label>
              <input
                type="email"
                defaultValue="ops@voutcargo.com"
                placeholder="operaciones@naviera.com"
                className="w-full px-3.5 py-2.5 bg-[#0A0E14] border border-[#1E293B] rounded-xl text-xs text-white placeholder-slate-500 focus:border-[#C6F827] outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Contraseña de Operador
                </label>
                <span className="text-[10px] text-[#C6F827] hover:underline cursor-pointer">
                  ¿Olvidaste tu clave?
                </span>
              </div>
              <input
                type="password"
                defaultValue="demo2026"
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0A0E14] border border-[#1E293B] rounded-xl text-xs text-white placeholder-slate-500 focus:border-[#C6F827] outline-none transition"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="rounded border-[#1E293B] text-[#C6F827] focus:ring-0 bg-[#0A0E14]"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Recordar esta terminal de trabajo
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#C6F827] hover:bg-[#b0df1f] text-[#0A0E14] font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              Iniciar Sesión en VOUT Cargo
            </button>
          </form>

          <div className="pt-3 border-t border-[#1E293B] text-center">
            <p className="text-xs text-[#94A3B8]">
              ¿Sos un importador con carga en tránsito?{" "}
              <Link href="/portal" className="text-[#C6F827] hover:underline font-bold transition">
                Acceder al Portal de Clientes
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B] pt-6 relative z-10">
        <p>© {new Date().getFullYear()} VOUT Ecosystem · Cargo Logistics &amp; Freight Operating System.</p>
        <Link href="/" className="hover:text-white transition">
          ← Volver al Dashboard
        </Link>
      </footer>
    </main>
  );
}
