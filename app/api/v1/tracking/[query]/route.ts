import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/tracking/[query]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  try {
    const { query } = await params;
    const cleanQuery = query?.trim();

    if (!cleanQuery || cleanQuery.length < 2) {
      return NextResponse.json(
        { success: false, error: "Identificador de rastreo inválido o demasiado corto" },
        { status: 400 }
      );
    }

    const shipment = await db.shipment.findFirst({
      where: {
        OR: [
          { containerNumber: { contains: cleanQuery, mode: "insensitive" } },
          { blNumber: { contains: cleanQuery, mode: "insensitive" } },
          { reference: { contains: cleanQuery, mode: "insensitive" } },
        ],
      },
      include: { milestones: { orderBy: { order: "asc" } } },
    });

    if (!shipment) {
      return NextResponse.json(
        { success: false, error: "No se encontró ningún embarque para la consulta: " + cleanQuery },
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al rastrear embarque";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
