import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/shipments
export async function GET(request: Request) {
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
}

// POST /api/v1/shipments
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = body.reference || `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const shipment = await db.shipment.create({
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
        pol: body.pol || "Shanghai, China",
        pod: body.pod || "Buenos Aires, Argentina",
        status: body.status || "BOOKED",
        currentLocation: body.currentLocation || body.pol || "Shanghai, China",
        etd: body.etd ? new Date(body.etd) : new Date(),
        eta: body.eta ? new Date(body.eta) : new Date(Date.now() + 25 * 86400000),
        buyRate: parseFloat(body.buyRate) || 0,
        sellRate: parseFloat(body.sellRate) || 0,
        localCharges: parseFloat(body.localCharges) || 0,
        profit: (parseFloat(body.sellRate) || 0) + (parseFloat(body.localCharges) || 0) - (parseFloat(body.buyRate) || 0),
        customsDeclaration: body.customsDeclaration || null,
        customsChannel: body.customsChannel || "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: shipment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
