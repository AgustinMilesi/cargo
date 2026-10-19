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

// GET /api/v1/quotes
export async function GET() {
  try {
    const quotes = await db.quote.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener cotizaciones";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/v1/quotes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference =
      body.reference ||
      `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const buyRate = parseSafeFloat(body.buyRate, 0);
    const sellRate = parseSafeFloat(body.sellRate, 0);
    const localCharges = parseSafeFloat(body.localCharges, 0);
    const profit = sellRate + localCharges - buyRate;

    const now = new Date();
    const validUntil = parseSafeDate(
      body.validUntil,
      new Date(now.getTime() + 15 * 86400000)
    );

    const quote = await db.quote.create({
      data: {
        reference,
        type: body.type || "MARITIME",
        modality: body.modality || "FCL 40' HC",
        origin: body.origin || "Shanghai, China",
        destination: body.destination || "Buenos Aires, Argentina",
        clientName: body.clientName || "Importador General",
        clientEmail: body.clientEmail || null,
        carrier: body.carrier || "MSC",
        validUntil,
        buyRate,
        sellRate,
        localCharges,
        profit,
        notes: body.notes || null,
        status: body.status || "SENT",
      },
    });

    return NextResponse.json({ success: true, data: quote }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear cotización";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
