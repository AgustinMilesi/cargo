import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { TopBar } from "@/components/TopBar";

export default async function ClientsPage() {
  const [clients, shipments] = await Promise.all([
    db.client.findMany({ orderBy: { name: "asc" } }),
    db.shipment.findMany({ select: { consignee: true, shipper: true } }),
  ]);

  async function handleAddClient(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const taxId = formData.get("taxId") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const country = (formData.get("country") as string) || "United States";

    if (name && taxId && email) {
      await db.client.create({
        data: { name, taxId, email, phone, country },
      });
      revalidatePath("/clients");
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Empresas & Clientes Importadores"
        subtitle="Registro de razones sociales, CUITs, contactos y carpetas de carga asociadas"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clients List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Empresas Registradas ({clients.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {clients.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  No hay empresas registradas aún.
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Completá el formulario para dar de alta al primer importador o consignee.
                </p>
              </div>
            ) : (
              clients.map((c) => {
                const operationsCount = shipments.filter(
                  (s) => s.consignee.includes(c.name) || s.shipper.includes(c.name)
                ).length;

                return (
                  <div
                    key={c.id}
                    className="glass-card rounded-3xl p-5 hover:border-accent/60 transition-all duration-200 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {c.name}
                        </h3>
                        <span className="text-xs font-mono text-accent">
                          {c.taxId}
                        </span>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                        {operationsCount} {operationsCount === 1 ? "carga" : "cargas"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-white/5">
                      <p>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Email</span>
                        <span className="text-slate-700 dark:text-slate-200">{c.email}</span>
                      </p>
                      <p>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Teléfono</span>
                        <span className="text-slate-700 dark:text-slate-200">{c.phone || "No especificado"}</span>
                      </p>
                      <p>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">País</span>
                        <span className="text-slate-700 dark:text-slate-200">{c.country}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Add Client Form */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Nueva Empresa
          </h2>

          <form
            action={handleAddClient}
            className="glass-card rounded-3xl p-6 space-y-4 shadow-sm"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Razón Social
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Importadora Andina S.A."
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-accent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Identificación Fiscal (CUIT / Tax ID)
              </label>
              <input
                type="text"
                name="taxId"
                placeholder="e.g. 30-71930219-4"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-accent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Correo Comercial
              </label>
              <input
                type="email"
                name="email"
                placeholder="comercioexterior@empresa.com"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-accent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Teléfono
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+54 11 4920 1822"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-accent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                País de Residencia
              </label>
              <input
                type="text"
                name="country"
                defaultValue="Argentina"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-accent outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-accent hover:opacity-90 text-white font-semibold text-xs rounded-2xl transition shadow-md cursor-pointer"
            >
              Guardar Empresa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
