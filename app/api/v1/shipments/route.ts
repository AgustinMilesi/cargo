import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function parseSafeDate(val: unknown, fallback: Date): Date {
  if (!val || typeof val !== "string") return fallback;
  const d = new Date(val);
  return isNaN(d.getTime()) ? fallback : d;
}

function parseSafeFloat(val: unknown, fallback = 0): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

// GET /api/v1/shipments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause: { status?: string } = {};
    if (status) whereClause.status = status;

    const shipments = await db.shipment.findMany({
      where: whereClause,
      include: { milestones: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: shipments.length,
      data: shipments,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener embarques";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/v1/shipments
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference =
      body.reference ||
      `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const now = new Date();
    const etd = parseSafeDate(body.etd, now);
    const eta = parseSafeDate(body.eta, new Date(now.getTime() + 25 * 86400000));

    const buyRate = parseSafeFloat(body.buyRate, 0);
    const sellRate = parseSafeFloat(body.sellRate, 0);
    const localCharges = parseSafeFloat(body.localCharges, 0);
    const profit = sellRate + localCharges - buyRate;

    const pol = body.pol || "Shanghai, China";

    const shipment = await db.$transaction(async (tx) => {
      const created = await tx.shipment.create({
        data: {
          reference,
          type: body.type || "MARITIME",
          modality: body.modality || "FCL 40'",
          blNumber: body.blNumber || `BL-${Date.now().toString().slice(-6)}`,
          containerNumber: body.containerNumber || null,
          carrier: body.carrier || "MSC",
          vessel: body.vessel || null,
          shipper: body.shipper || "Proveedor Internacional",
          consignee: body.consignee || "Cliente Importador",
          pol,
          pod: body.pod || "Buenos Aires, Argentina",
          status: body.status || "BOOKED",
          currentLocation: body.currentLocation || pol,
          etd,
          eta,
          buyRate,
          sellRate,
          localCharges,
          profit,
          customsDeclaration: body.customsDeclaration || null,
          customsChannel: body.customsChannel || "PENDING",
        },
      });

      await tx.milestone.create({
        data: {
          shipmentId: created.id,
          title: "Booking confirmado con transportista",
          location: pol,
          date: new Date(),
          completed: true,
          order: 1,
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, data: shipment }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear el embarque";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
