import { db } from "../lib/db";

async function seed() {
  console.log("Seeding sample quotes and updating customs data...");

  // 1. Create sample Quotes
  await db.quote.createMany({
    data: [
      {
        reference: "COT-2026-101",
        type: "MARITIME",
        modality: "FCL 40' HC",
        origin: "Port of Ningbo, China",
        destination: "Puerto de Buenos Aires, Terminal 4",
        clientName: "Importadora Austral S.A.",
        clientEmail: "compras@austral.com.ar",
        carrier: "MSC (Mediterranean Shipping Co)",
        validUntil: new Date(Date.now() + 14 * 86400000),
        buyRate: 2450.00,
        sellRate: 3100.00,
        localCharges: 350.00,
        profit: 1000.00,
        status: "SENT",
        notes: "Tarifa all-in sujeta a recargo BAF del mes. Incluye 14 días libres de contenedor.",
      },
      {
        reference: "COT-2026-102",
        type: "MARITIME",
        modality: "FCL 20' Dry",
        origin: "Port of Shanghai, China",
        destination: "Puerto de Buenos Aires, Exolgan",
        clientName: "ElectroGlobal Tech S.R.L.",
        clientEmail: "dispatch@electroglobal.com",
        carrier: "Maersk Line",
        validUntil: new Date(Date.now() + 10 * 86400000),
        buyRate: 1850.00,
        sellRate: 2400.00,
        localCharges: 320.00,
        profit: 870.00,
        status: "SENT",
        notes: "Carga de componentes electrónicos. Tránsito directo estimado en 32 días.",
      },
      {
        reference: "COT-2026-103",
        type: "AIR",
        modality: "Air Freight Express",
        origin: "Miami Intl Airport (MIA), USA",
        destination: "Ezeiza Intl Airport (EZE), Argentina",
        clientName: "PharmaLab Distribuciones S.A.",
        clientEmail: "operaciones@pharmalab.com",
        carrier: "LATAM Cargo",
        validUntil: new Date(Date.now() + 7 * 86400000),
        buyRate: 1200.00,
        sellRate: 1680.00,
        localCharges: 180.00,
        profit: 660.00,
        status: "SENT",
        notes: "Carga seca prioritaria. 4 pallets con control de temperatura ambiente.",
      },
      {
        reference: "COT-2026-104",
        type: "MARITIME",
        modality: "LCL Consolidado",
        origin: "Port of Hamburg, Germany",
        destination: "Puerto de Buenos Aires, Terminal 4",
        clientName: "Maquinarias del Plata S.A.",
        clientEmail: "comercial@delplata.com",
        carrier: "Hapag-Lloyd",
        validUntil: new Date(Date.now() + 20 * 86400000),
        buyRate: 850.00,
        sellRate: 1250.00,
        localCharges: 210.00,
        profit: 610.00,
        status: "DRAFT",
        notes: "Repuestos industriales. 6.5 CBM / 1,400 Kg.",
      },
    ],
    skipDuplicates: true,
  });

  // 2. Update existing shipments with realistic customs & import details
  const shipments = await db.shipment.findMany();
  for (let i = 0; i < shipments.length; i++) {
    const s = shipments[i];
    const channel = i === 0 ? "GREEN" : i === 1 ? "ORANGE" : "RED";
    await db.shipment.update({
      where: { id: s.id },
      data: {
        customsDeclaration: `26001IC0400${1920 + i}X`,
        customsChannel: channel,
        freeDaysCount: 14,
        demurrageDeadline: new Date(Date.now() + (12 + i * 4) * 86400000),
        invoiceNumber: `EXP-INV-${84920 + i}`,
        invoiceValue: 45000 + i * 18500,
        packagesCount: 18 + i * 6,
        grossWeightKg: 12400 + i * 3200,
        volumeCbm: 58.5,
        docBlUrl: "https://documents.onecargo.internal/bl/" + s.reference,
        docInvoiceUrl: "https://documents.onecargo.internal/inv/" + s.reference,
        docPackingListUrl: "https://documents.onecargo.internal/pkg/" + s.reference,
      },
    });
  }

  console.log("Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
