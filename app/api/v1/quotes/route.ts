import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/quotes
export async function GET() {
  const quotes = await db.quote.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    count: quotes.length,
    data: quotes,
  });
}

// POST /api/v1/quotes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = body.reference || `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const buyRate = parseFloat(body.buyRate) || 0;
    const sellRate = parseFloat(body.sellRate) || 0;
    const localCharges = parseFloat(body.localCharges) || 0;
    const profit = sellRate + localCharges - buyRate;

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
        validUntil: body.validUntil ? new Date(body.validUntil) : new Date(Date.now() + 15 * 86400000),
        buyRate,
        sellRate,
        localCharges,
        profit,
        notes: body.notes || null,
        status: body.status || "SENT",
      },
    });

    return NextResponse.json({ success: true, data: quote }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
