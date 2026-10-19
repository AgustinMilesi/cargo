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
        title="Company Division & Accounts"
        subtitle="Shipper organizations, consignees, and cargo partner divisions"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clients List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Registered Companies ({clients.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {clients.map((c) => {
              const operationsCount = shipments.filter(
                (s) => s.consignee.includes(c.name) || s.shipper.includes(c.name)
              ).length;

              return (
                <div
                  key={c.id}
                  className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-5 hover:border-indigo-500/50 transition-all duration-200 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {c.name}
                      </h3>
                      <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                        {c.taxId}
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                      {operationsCount} {operationsCount === 1 ? "load" : "loads"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-white/5">
                    <p>
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Email</span>
                      <span className="text-slate-700 dark:text-slate-200">{c.email}</span>
                    </p>
                    <p>
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Phone</span>
                      <span className="text-slate-700 dark:text-slate-200">{c.phone || "Not set"}</span>
                    </p>
                    <p>
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Country</span>
                      <span className="text-slate-700 dark:text-slate-200">{c.country}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Add Client Form */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Add New Company
          </h2>

          <form
            action={handleAddClient}
            className="bg-white/80 dark:bg-[#181920]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-sm"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Legal Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Acme Logistics Global Ltd."
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tax ID (EIN / CUIT / VAT)
              </label>
              <input
                type="text"
                name="taxId"
                placeholder="e.g. US-84930219"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Business Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="dispatch@acme.com"
                required
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+1 555 019 2831"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Country
              </label>
              <input
                type="text"
                name="country"
                defaultValue="United States"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Save Company
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
