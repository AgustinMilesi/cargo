import Link from "next/link";
import { redirect } from "next/navigation";
import { createShipment } from "@/app/actions";
import { TopBar } from "@/components/TopBar";

export default function NewShipmentPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const res = await createShipment(formData);
    if (res.success) {
      redirect(`/shipments/${res.id}`);
    }
  }

  const defaultRef = `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Top Header */}
      <TopBar
        title="Create New Load"
        subtitle="Register cargo booking, Bill of Lading, transit route, and freight financial settlement"
      />

      {/* Form */}
      <form
        action={handleSubmit}
        className="glass-card rounded-3xl p-6 md:p-8 space-y-8 shadow-sm"
      >
        {/* Section 1: General & Routing */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-bold uppercase tracking-wider text-accent">
            1. Operation Details &amp; Cargo Mode
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="field-reference" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Internal Reference <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-reference"
                type="text"
                name="reference"
                defaultValue={defaultRef}
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Transport Mode
              </label>
              <select
                id="field-type"
                name="type"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition cursor-pointer"
              >
                <option value="MARITIME">Ocean Freight (FCL / LCL)</option>
                <option value="AIR">Air Cargo</option>
                <option value="GROUND">Ground Trucking</option>
              </select>
            </div>

            <div>
              <label htmlFor="field-modality" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Equipment / Modality
              </label>
              <input
                id="field-modality"
                type="text"
                name="modality"
                defaultValue="FCL 40' HC"
                placeholder="FCL 40', 20' Dry, LCL..."
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="field-blNumber" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Bill of Lading / AWB <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-blNumber"
                type="text"
                name="blNumber"
                placeholder="e.g. MEDUST829104"
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-containerNumber" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Container Number (Optional)
              </label>
              <input
                id="field-containerNumber"
                type="text"
                name="containerNumber"
                placeholder="e.g. MSCU7654321"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono uppercase focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-carrier" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Carrier Line <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-carrier"
                type="text"
                name="carrier"
                defaultValue="MSC (Mediterranean Shipping Co)"
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="field-vessel" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Vessel / Voyage or Flight ID
              </label>
              <input
                id="field-vessel"
                type="text"
                name="vessel"
                placeholder="e.g. MSC GÜLSÜN / 042E"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-status" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Initial Status
              </label>
              <select
                id="field-status"
                name="status"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition cursor-pointer"
              >
                <option value="BOOKED">Booked (Reservation Confirmed)</option>
                <option value="IN_TRANSIT">In Transit (International)</option>
                <option value="AT_PORT">At Port / Terminal</option>
                <option value="CUSTOMS">In Customs Inspection</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Section 2: Parties & Routing */}
        <fieldset className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
          <legend className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            2. Parties &amp; Delivery Route
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="field-shipper" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Shipper (Origin Exporter) <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-shipper"
                type="text"
                name="shipper"
                placeholder="e.g. Ningbo Global Exports Co."
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-consignee" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Consignee (Destination Client) <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-consignee"
                type="text"
                name="consignee"
                placeholder="e.g. TechCorp Solutions S.A."
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="field-pol" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Port of Loading (POL) <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-pol"
                type="text"
                name="pol"
                placeholder="e.g. Port of Ningbo, China"
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-pod" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Port of Discharge (POD) <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-pod"
                type="text"
                name="pod"
                placeholder="e.g. Port of Buenos Aires, Terminal 4"
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="field-etd" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Estimated Departure (ETD) <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-etd"
                type="date"
                name="etd"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-eta" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Estimated Arrival (ETA) <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-eta"
                type="date"
                name="eta"
                defaultValue={new Date(Date.now() + 25 * 86400000).toISOString().split("T")[0]}
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </fieldset>

        {/* Section 3: Financial Settlement */}
        <fieldset className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
          <legend className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            3. Financial Settlement &amp; Margin ($ USD)
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="field-buyRate" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Buy Rate (Cost to Carrier) <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-buyRate"
                type="number"
                step="0.01"
                name="buyRate"
                placeholder="2500.00"
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-sellRate" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sell Rate (Price Billed to Client) <span aria-hidden="true" className="text-rose-500">*</span>
              </label>
              <input
                id="field-sellRate"
                type="number"
                step="0.01"
                name="sellRate"
                placeholder="3200.00"
                required
                aria-required="true"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="field-localCharges" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Local Charges / Port THC
              </label>
              <input
                id="field-localCharges"
                type="number"
                step="0.01"
                name="localCharges"
                placeholder="350.00"
                defaultValue="0"
                className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:border-emerald-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="field-notes" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Operational Notes &amp; Seals
            </label>
            <textarea
              id="field-notes"
              name="notes"
              rows={2}
              placeholder="Special dispatch instructions, customs seal numbers, etc..."
              className="w-full bg-slate-50/70 dark:bg-[#121318]/65 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition resize-none"
            />
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            href="/shipments"
            className="px-5 py-2.5 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-accent hover:opacity-90 text-white font-semibold text-xs rounded-2xl transition shadow-md cursor-pointer"
          >
            Create &amp; Confirm Load
          </button>
        </div>

      </form>
    </div>
  );
}
