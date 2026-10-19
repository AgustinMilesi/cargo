"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function createShipment(formData: FormData) {
  const reference = (formData.get("reference") as string) || `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const type = (formData.get("type") as string) || "MARITIME";
  const modality = (formData.get("modality") as string) || "FCL 40'";
  const blNumber = (formData.get("blNumber") as string) || `BL-${Date.now().toString().slice(-6)}`;
  const containerNumber = (formData.get("containerNumber") as string) || null;
  const carrier = (formData.get("carrier") as string) || "MSC";
  const vessel = (formData.get("vessel") as string) || null;
  const shipper = (formData.get("shipper") as string) || "Proveedor Internacional";
  const consignee = (formData.get("consignee") as string) || "Cliente Local S.A.";
  const pol = (formData.get("pol") as string) || "Puerto de Origen";
  const pod = (formData.get("pod") as string) || "Puerto de Buenos Aires";
  const status = (formData.get("status") as string) || "BOOKED";
  const currentLocation = (formData.get("currentLocation") as string) || pol;

  const etdStr = formData.get("etd") as string;
  const etaStr = formData.get("eta") as string;
  const etd = etdStr ? new Date(etdStr) : new Date();
  const eta = etaStr ? new Date(etaStr) : new Date(Date.now() + 20 * 86400000);

  const buyRate = parseFloat(formData.get("buyRate") as string) || 0;
  const sellRate = parseFloat(formData.get("sellRate") as string) || 0;
  const localCharges = parseFloat(formData.get("localCharges") as string) || 0;
  const profit = sellRate + localCharges - buyRate;
  const notes = (formData.get("notes") as string) || null;

  const shipment = await db.shipment.create({
    data: {
      reference,
      type,
      modality,
      blNumber,
      containerNumber,
      carrier,
      vessel,
      shipper,
      consignee,
      pol,
      pod,
      status,
      currentLocation,
      etd,
      eta,
      buyRate,
      sellRate,
      localCharges,
      profit,
      notes,
    },
  });

  // Create initial booking milestone
  await db.milestone.create({
    data: {
      shipmentId: shipment.id,
      title: "Booking confirmado con transportista",
      location: pol,
      date: new Date(),
      completed: true,
      order: 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/shipments");
  revalidatePath("/tracking");
  revalidatePath("/finances");
  return { success: true, id: shipment.id };
}

export async function updateShipmentStatus(id: string, status: string, location?: string) {
  const current = await db.shipment.findUnique({ where: { id } });
  if (!current) throw new Error("Shipment not found");

  const newLocation = location || current.currentLocation;

  await db.shipment.update({
    where: { id },
    data: {
      status,
      currentLocation: newLocation,
      actualArrival: status === "DELIVERED" ? new Date() : current.actualArrival,
    },
  });

  // Add auto milestone
  const count = await db.milestone.count({ where: { shipmentId: id } });
  let title = `Estado actualizado a ${status}`;
  if (status === "IN_TRANSIT") title = "En tránsito internacional";
  if (status === "AT_PORT") title = "Arribo a terminal portuaria de destino";
  if (status === "CUSTOMS") title = "En proceso de verificación aduanera";
  if (status === "DELIVERED") title = "Carga entregada en destino final";

  await db.milestone.create({
    data: {
      shipmentId: id,
      title,
      location: newLocation,
      date: new Date(),
      completed: true,
      order: count + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/shipments");
  revalidatePath("/tracking");
  revalidatePath(`/shipments/${id}`);
  return { success: true };
}

export async function updateInvoiceStatus(id: string, invoiceStatus: string) {
  await db.shipment.update({
    where: { id },
    data: { invoiceStatus },
  });

  revalidatePath("/finances");
  revalidatePath("/shipments");
  return { success: true };
}

export async function createQuote(formData: FormData) {
  const reference = (formData.get("reference") as string) || `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const type = (formData.get("type") as string) || "MARITIME";
  const modality = (formData.get("modality") as string) || "FCL 40' HC";
  const origin = (formData.get("origin") as string) || "Shanghai, China";
  const destination = (formData.get("destination") as string) || "Buenos Aires, Argentina";
  const clientName = (formData.get("clientName") as string) || "Importador S.A.";
  const clientEmail = (formData.get("clientEmail") as string) || null;
  const carrier = (formData.get("carrier") as string) || "MSC (Mediterranean Shipping)";

  const validUntilStr = formData.get("validUntil") as string;
  const validUntil = validUntilStr ? new Date(validUntilStr) : new Date(Date.now() + 15 * 86400000);

  const buyRate = parseFloat(formData.get("buyRate") as string) || 0;
  const sellRate = parseFloat(formData.get("sellRate") as string) || 0;
  const localCharges = parseFloat(formData.get("localCharges") as string) || 0;
  const profit = sellRate + localCharges - buyRate;
  const notes = (formData.get("notes") as string) || null;

  const quote = await db.quote.create({
    data: {
      reference,
      type,
      modality,
      origin,
      destination,
      clientName,
      clientEmail,
      carrier,
      validUntil,
      buyRate,
      sellRate,
      localCharges,
      profit,
      notes,
      status: "SENT",
    },
  });

  revalidatePath("/quotes");
  return { success: true, id: quote.id };
}

export async function convertQuoteToShipment(quoteId: string) {
  const quote = await db.quote.findUnique({ where: { id: quoteId } });
  if (!quote) throw new Error("Quote not found");

  const newRef = `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const etd = new Date(Date.now() + 5 * 86400000);
  const eta = new Date(Date.now() + 30 * 86400000);

  const shipment = await db.shipment.create({
    data: {
      reference: newRef,
      type: quote.type,
      modality: quote.modality,
      blNumber: `BL-${Date.now().toString().slice(-7)}`,
      carrier: quote.carrier,
      shipper: `Proveedor Exterior (${quote.origin})`,
      consignee: quote.clientName,
      pol: quote.origin,
      pod: quote.destination,
      status: "BOOKED",
      currentLocation: quote.origin,
      etd,
      eta,
      buyRate: quote.buyRate,
      sellRate: quote.sellRate,
      localCharges: quote.localCharges,
      profit: quote.profit,
      notes: `Generado automáticamente desde Cotización ${quote.reference}. ${quote.notes || ""}`,
    },
  });

  await db.quote.update({
    where: { id: quoteId },
    data: {
      status: "CONVERTED",
      shipmentId: shipment.id,
    },
  });

  await db.milestone.create({
    data: {
      shipmentId: shipment.id,
      title: `Cotización ${quote.reference} Aprobada. Booking confirmado con ${quote.carrier}`,
      location: quote.origin,
      date: new Date(),
      completed: true,
      order: 1,
    },
  });

  revalidatePath("/quotes");
  revalidatePath("/shipments");
  revalidatePath("/");
  revalidatePath("/tracking");
  revalidatePath("/finances");
  return { success: true, shipmentId: shipment.id };
}

export async function updateCustomsDetails(id: string, formData: FormData) {
  const customsDeclaration = (formData.get("customsDeclaration") as string) || null;
  const customsChannel = (formData.get("customsChannel") as string) || "PENDING";
  const invoiceNumber = (formData.get("invoiceNumber") as string) || null;
  const invoiceValue = parseFloat(formData.get("invoiceValue") as string) || 0;
  const packagesCount = parseInt(formData.get("packagesCount") as string) || 0;
  const grossWeightKg = parseFloat(formData.get("grossWeightKg") as string) || 0;
  const volumeCbm = parseFloat(formData.get("volumeCbm") as string) || 0;
  const freeDaysCount = parseInt(formData.get("freeDaysCount") as string) || 14;

  const demurrageStr = formData.get("demurrageDeadline") as string;
  const demurrageDeadline = demurrageStr ? new Date(demurrageStr) : null;

  const docBlUrl = (formData.get("docBlUrl") as string) || null;
  const docInvoiceUrl = (formData.get("docInvoiceUrl") as string) || null;
  const docPackingListUrl = (formData.get("docPackingListUrl") as string) || null;

  await db.shipment.update({
    where: { id },
    data: {
      customsDeclaration,
      customsChannel,
      invoiceNumber,
      invoiceValue,
      packagesCount,
      grossWeightKg,
      volumeCbm,
      freeDaysCount,
      demurrageDeadline,
      docBlUrl,
      docInvoiceUrl,
      docPackingListUrl,
    },
  });

  revalidatePath(`/shipments/${id}`);
  revalidatePath("/shipments");
  revalidatePath("/portal");
  return { success: true };
}

