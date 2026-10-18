import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SAP Cargo & Logistics database...");

  // Clean existing
  await prisma.milestone.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.client.deleteMany({});

  // Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "TechImports S.A.",
        taxId: "30-71489201-9",
        email: "logistica@techimports.com.ar",
        phone: "+54 11 4821-9900",
        country: "Argentina",
      },
    }),
    prisma.client.create({
      data: {
        name: "Agroindustrial del Sur",
        taxId: "33-65982143-4",
        email: "comex@agrosur.com",
        phone: "+54 11 5234-1122",
        country: "Argentina",
      },
    }),
    prisma.client.create({
      data: {
        name: "Global Trade Solutions",
        taxId: "21-88991200-1",
        email: "ops@globaltrade.uy",
        phone: "+598 2901-4455",
        country: "Uruguay",
      },
    }),
  ]);

  // Shipment 1: Marítimo FCL en tránsito (MSC)
  const s1 = await prisma.shipment.create({
    data: {
      reference: "SHP-2026-001",
      type: "MARITIME",
      modality: "FCL 40' HC",
      blNumber: "MEDUST981240",
      containerNumber: "MSCU7654321",
      carrier: "MSC (Mediterranean Shipping Co)",
      vessel: "MSC GÜLSÜN / 042E",
      shipper: "Ningbo Jialian Electronics Co., Ltd.",
      consignee: "TechImports S.A.",
      pol: "Puerto de Ningbo-Zhoushan, China",
      pod: "Puerto de Buenos Aires (Terminal 4), Argentina",
      status: "IN_TRANSIT",
      currentLocation: "En navegación - Océano Atlántico Sur",
      etd: new Date(Date.now() - 14 * 86400000), // 14 days ago
      eta: new Date(Date.now() + 6 * 86400000), // in 6 days
      buyRate: 2850.0,
      sellRate: 3600.0,
      localCharges: 420.0,
      profit: 1170.0,
      invoiceStatus: "INVOICED",
      notes: "Carga electrónica de alto valor. Precinto de seguridad MSC-9981.",
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        shipmentId: s1.id,
        title: "Embarque y salida de puerto de origen",
        location: "Puerto de Ningbo, China",
        date: new Date(Date.now() - 14 * 86400000),
        completed: true,
        order: 1,
      },
      {
        shipmentId: s1.id,
        title: "En tránsito marítimo internacional",
        location: "Océano Atlántico (Rumbo al Río de la Plata)",
        date: new Date(Date.now() - 5 * 86400000),
        completed: true,
        order: 2,
      },
      {
        shipmentId: s1.id,
        title: "Arribo estimado a puerto destino",
        location: "Puerto de Buenos Aires, Terminal 4",
        date: new Date(Date.now() + 6 * 86400000),
        completed: false,
        order: 3,
      },
      {
        shipmentId: s1.id,
        title: "Despacho aduanero y liberación",
        location: "Aduana Buenos Aires",
        date: new Date(Date.now() + 8 * 86400000),
        completed: false,
        order: 4,
      },
      {
        shipmentId: s1.id,
        title: "Entrega final en depósito cliente",
        location: "TechImports Logística - Garín, PBA",
        date: new Date(Date.now() + 10 * 86400000),
        completed: false,
        order: 5,
      },
    ],
  });

  // Shipment 2: Marítimo en puerto / aduana (Maersk)
  const s2 = await prisma.shipment.create({
    data: {
      reference: "SHP-2026-002",
      type: "MARITIME",
      modality: "FCL 20' Dry",
      blNumber: "MAEU58912401",
      containerNumber: "MAEU4892104",
      carrier: "Maersk Line",
      vessel: "CAP SAN MARCO / 261W",
      shipper: "Santos Agro Exportadores Ltda",
      consignee: "Agroindustrial del Sur",
      pol: "Puerto de Santos, Brasil",
      pod: "Puerto de Buenos Aires (TRP), Argentina",
      status: "CUSTOMS",
      currentLocation: "Terminal TRP - En inspección aduanera",
      etd: new Date(Date.now() - 9 * 86400000),
      eta: new Date(Date.now() - 1 * 86400000),
      actualArrival: new Date(Date.now() - 1 * 86400000),
      buyRate: 1100.0,
      sellRate: 1550.0,
      localCharges: 280.0,
      profit: 730.0,
      invoiceStatus: "PAID",
      notes: "Insumos industriales y repuestos de maquinaria agrícola.",
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        shipmentId: s2.id,
        title: "Salida de puerto de Santos",
        location: "Puerto de Santos, Brasil",
        date: new Date(Date.now() - 9 * 86400000),
        completed: true,
        order: 1,
      },
      {
        shipmentId: s2.id,
        title: "Arribo a terminal de contenedores",
        location: "Terminal TRP Buenos Aires",
        date: new Date(Date.now() - 1 * 86400000),
        completed: true,
        order: 2,
      },
      {
        shipmentId: s2.id,
        title: "Canal Naranja de Aduana (Revisión documental)",
        location: "Aduana de Buenos Aires",
        date: new Date(),
        completed: true,
        order: 3,
      },
      {
        shipmentId: s2.id,
        title: "Retiro y entrega coordinada",
        location: "Parque Industrial Pilar",
        date: new Date(Date.now() + 2 * 86400000),
        completed: false,
        order: 4,
      },
    ],
  });

  // Shipment 3: Aéreo urgente (LATAM Cargo)
  const s3 = await prisma.shipment.create({
    data: {
      reference: "SHP-2026-003",
      type: "AIR",
      modality: "AIR FREIGHT (420 Kg)",
      blNumber: "045-88219402",
      containerNumber: "AKE-8291-LA",
      carrier: "LATAM Cargo",
      vessel: "Vuelo UC1502 (B767-300F)",
      shipper: "Apex Precision Tools Inc.",
      consignee: "Global Trade Solutions",
      pol: "Miami International Airport (MIA), USA",
      pod: "Aeropuerto Internacional de Ezeiza (EZE), Argentina",
      status: "DELIVERED",
      currentLocation: "Entregado a cliente",
      etd: new Date(Date.now() - 4 * 86400000),
      eta: new Date(Date.now() - 2 * 86400000),
      actualArrival: new Date(Date.now() - 2 * 86400000),
      buyRate: 1950.0,
      sellRate: 2650.0,
      localCharges: 350.0,
      profit: 1050.0,
      invoiceStatus: "PAID",
      notes: "Instrumental de alta precisión. Temperatura controlada.",
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        shipmentId: s3.id,
        title: "Carga y despegue en MIA",
        location: "Miami Airport, USA",
        date: new Date(Date.now() - 4 * 86400000),
        completed: true,
        order: 1,
      },
      {
        shipmentId: s3.id,
        title: "Aterrizaje en Terminal de Cargas TCA Ezeiza",
        location: "Ezeiza, Argentina",
        date: new Date(Date.now() - 2 * 86400000),
        completed: true,
        order: 2,
      },
      {
        shipmentId: s3.id,
        title: "Liberación aduanera express",
        location: "TCA Ezeiza",
        date: new Date(Date.now() - 1 * 86400000),
        completed: true,
        order: 3,
      },
      {
        shipmentId: s3.id,
        title: "Entrega bajo remito conforme",
        location: "Depósito Central Cliente",
        date: new Date(Date.now() - 6 * 3600000),
        completed: true,
        order: 4,
      },
    ],
  });

  // Shipment 4: Marítimo Reservado (CMA CGM)
  await prisma.shipment.create({
    data: {
      reference: "SHP-2026-004",
      type: "MARITIME",
      modality: "FCL 40' NOR",
      blNumber: "CMAU9912048",
      containerNumber: "CMAU3194021",
      carrier: "CMA CGM",
      vessel: "CMA CGM CHOPIN / 112S",
      shipper: "Hamburg Chemical Logistics GmbH",
      consignee: "Agroindustrial del Sur",
      pol: "Puerto de Hamburgo, Alemania",
      pod: "Puerto de Buenos Aires, Argentina",
      status: "BOOKED",
      currentLocation: "Terminal CTA Hamburgo - Esperando carga en buque",
      etd: new Date(Date.now() + 3 * 86400000),
      eta: new Date(Date.now() + 25 * 86400000),
      buyRate: 2400.0,
      sellRate: 3100.0,
      localCharges: 390.0,
      profit: 1090.0,
      invoiceStatus: "PENDING",
      notes: "Booking confirmado con space guarantee. Mercadería IMO Class 9.",
    },
  });

  console.log(`Seeding completed successfully! Created ${clients.length} clients and 4 shipments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
