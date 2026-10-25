import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const shipmentCount = await db.shipment.count();

    if (shipmentCount < 3) {
      // 1. Seed Clients if empty
      const clientCount = await db.client.count();
      if (clientCount === 0) {
        await db.client.createMany({
          data: [
            {
              name: "TechImports S.A.",
              taxId: "30-71489201-9",
              email: "logistica@techimports.com.ar",
              phone: "+54 11 4821-9900",
              country: "Argentina",
            },
            {
              name: "Agroindustrial del Sur",
              taxId: "33-65982143-4",
              email: "comex@agrosur.com",
              phone: "+54 11 5234-1122",
              country: "Argentina",
            },
            {
              name: "Global Trade Solutions",
              taxId: "21-88991200-1",
              email: "ops@globaltrade.uy",
              phone: "+598 2901-4455",
              country: "Uruguay",
            },
          ],
        });
      }

      // 2. Seed Quotes if empty
      const quoteCount = await db.quote.count();
      if (quoteCount === 0) {
        await db.quote.createMany({
          data: [
            {
              reference: "COT-2026-001",
              type: "MARITIME",
              modality: "FCL 40' HC",
              origin: "Shanghai, China",
              destination: "Buenos Aires, Argentina",
              clientName: "TechImports S.A.",
              clientEmail: "logistica@techimports.com.ar",
              carrier: "MSC (Mediterranean Shipping Co)",
              validUntil: new Date(Date.now() + 14 * 86400000),
              buyRate: 2600.0,
              sellRate: 3400.0,
              localCharges: 420.0,
              profit: 1220.0,
              status: "SENT",
              notes: "Tarifa marítima all-in con 14 días libres de contenedor.",
            },
            {
              reference: "COT-2026-002",
              type: "AIR",
              modality: "AIR EXPRESS (350 Kg)",
              origin: "Frankfurt (FRA), Alemania",
              destination: "Buenos Aires (EZE), Argentina",
              clientName: "Global Trade Solutions",
              clientEmail: "ops@globaltrade.uy",
              carrier: "Lufthansa Cargo",
              validUntil: new Date(Date.now() + 7 * 86400000),
              buyRate: 1800.0,
              sellRate: 2450.0,
              localCharges: 250.0,
              profit: 900.0,
              status: "SENT",
              notes: "Carga consolidada farmacéutica con cadena de frío.",
            },
          ],
        });
      }

      // 3. Seed Shipments & Milestones
      const s1 = await db.shipment.create({
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
          etd: new Date(Date.now() - 14 * 86400000),
          eta: new Date(Date.now() + 6 * 86400000),
          buyRate: 2850.0,
          sellRate: 3600.0,
          localCharges: 420.0,
          profit: 1170.0,
          invoiceStatus: "INVOICED",
          notes: "Carga electrónica de alto valor. Precinto de seguridad MSC-9981.",
          milestones: {
            create: [
              {
                title: "Embarque y salida de puerto de origen",
                location: "Puerto de Ningbo, China",
                date: new Date(Date.now() - 14 * 86400000),
                completed: true,
                order: 1,
              },
              {
                title: "En tránsito marítimo internacional",
                location: "Océano Atlántico (Rumbo al Río de la Plata)",
                date: new Date(Date.now() - 5 * 86400000),
                completed: true,
                order: 2,
              },
              {
                title: "Arribo estimado a puerto destino",
                location: "Puerto de Buenos Aires, Terminal 4",
                date: new Date(Date.now() + 6 * 86400000),
                completed: false,
                order: 3,
              },
              {
                title: "Despacho aduanero y liberación",
                location: "Aduana Buenos Aires",
                date: new Date(Date.now() + 8 * 86400000),
                completed: false,
                order: 4,
              },
            ],
          },
        },
      });

      const s2 = await db.shipment.create({
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
          milestones: {
            create: [
              {
                title: "Salida de puerto de Santos",
                location: "Puerto de Santos, Brasil",
                date: new Date(Date.now() - 9 * 86400000),
                completed: true,
                order: 1,
              },
              {
                title: "Arribo a terminal de contenedores",
                location: "Terminal TRP Buenos Aires",
                date: new Date(Date.now() - 1 * 86400000),
                completed: true,
                order: 2,
              },
              {
                title: "Canal Naranja de Aduana (Revisión documental)",
                location: "Aduana de Buenos Aires",
                date: new Date(),
                completed: true,
                order: 3,
              },
            ],
          },
        },
      });

      const s3 = await db.shipment.create({
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
          milestones: {
            create: [
              {
                title: "Carga y despegue en MIA",
                location: "Miami Airport, USA",
                date: new Date(Date.now() - 4 * 86400000),
                completed: true,
                order: 1,
              },
              {
                title: "Aterrizaje en Terminal de Cargas TCA Ezeiza",
                location: "Ezeiza, Argentina",
                date: new Date(Date.now() - 2 * 86400000),
                completed: true,
                order: 2,
              },
              {
                title: "Entrega bajo remito conforme",
                location: "Depósito Central Cliente",
                date: new Date(Date.now() - 6 * 3600000),
                completed: true,
                order: 3,
              },
            ],
          },
        },
      });
    }
  } catch (err) {
    console.error("Demo seeding error in Cargo:", err);
  }

  const url = new URL("/", request.url);
  return NextResponse.redirect(url);
}
