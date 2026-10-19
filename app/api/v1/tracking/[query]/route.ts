import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/tracking/[query]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  const { query } = await params;

  const shipment = await db.shipment.findFirst({
    where: {
      OR: [
        { containerNumber: { contains: query, mode: "insensitive" } },
        { blNumber: { contains: query, mode: "insensitive" } },
        { reference: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { milestones: { orderBy: { order: "asc" } } },
  });

  if (!shipment) {
    return NextResponse.json(
      { success: false, error: "No shipment found for query: " + query },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      reference: shipment.reference,
      containerNumber: shipment.containerNumber,
      blNumber: shipment.blNumber,
      carrier: shipment.carrier,
      vessel: shipment.vessel,
      consignee: shipment.consignee,
      pol: shipment.pol,
      pod: shipment.pod,
      currentLocation: shipment.currentLocation,
      status: shipment.status,
      customsChannel: shipment.customsChannel,
      customsDeclaration: shipment.customsDeclaration,
      freeDaysCount: shipment.freeDaysCount,
      etd: shipment.etd,
      eta: shipment.eta,
      milestones: shipment.milestones,
    },
  });
}
