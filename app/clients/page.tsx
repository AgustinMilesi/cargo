import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

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
    const country = (formData.get("country") as string) || "Argentina";

    if (name && taxId && email) {
      await db.client.create({
        data: { name, taxId, email, phone, country },
      });
      revalidatePath("/clients");
    }
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Directorio de Clientes & Cuentas</span>
            <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
              {clients.length} empresas
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Importadores, exportadores y agentes de carga asociados a las operaciones.
          </p>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          ← Volver al Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clients List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Empresas Registradas
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {clients.map((c) => {
              const operationsCount = shipments.filter(
                (s) => s.consignee.includes(c.name) || s.shipper.includes(c.name)
              ).length;

              return (
                <div
                  key={c.id}
                  className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{c.name}</h3>
                      <span className="text-xs font-mono text-cyan-400">{c.taxId}</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {operationsCount} {operationsCount === 1 ? "embarque" : "embarques"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <p>
                      <span className="text-slate-500">Email:</span> {c.email}
                    </p>
                    <p>
                      <span className="text-slate-500">Tel:</span> {c.phone || "No informado"}
                    </p>
                    <p>
                      <span className="text-slate-500">País:</span> {c.country}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Add Client Form */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Nuevo Cliente / Agente
          </h2>

          <form action={handleAddClient} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Razón Social / Nombre
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ej: Logística Internacional S.A."
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Identificación Fiscal (CUIT / RUT / RFC)
              </label>
              <input
                type="text"
                name="taxId"
                placeholder="Ej: 30-71994432-8"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="ops@empresa.com"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+54 11 4000-0000"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                País
              </label>
              <input
                type="text"
                name="country"
                defaultValue="Argentina"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-cyan-500/20"
            >
              Guardar Cliente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
