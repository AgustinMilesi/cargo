"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export type ShipmentStatus = "BOOKED" | "IN_TRANSIT" | "AT_PORT" | "CUSTOMS" | "DELIVERED";
export type InvoiceStatus = "PENDING" | "INVOICED" | "PAID";
export type CustomsChannel = "PENDING" | "GREEN" | "ORANGE" | "RED";

const VALID_SHIPMENT_STATUSES: readonly ShipmentStatus[] = [
  "BOOKED",
  "IN_TRANSIT",
  "AT_PORT",
  "CUSTOMS",
  "DELIVERED",
];

const VALID_INVOICE_STATUSES: readonly InvoiceStatus[] = [
  "PENDING",
  "INVOICED",
  "PAID",
];

const VALID_CUSTOMS_CHANNELS: readonly CustomsChannel[] = [
  "PENDING",
  "GREEN",
  "ORANGE",
  "RED",
];

function getFormString(formData: FormData, key: string, fallback = ""): string {
  const val = formData.get(key);
  return typeof val === "string" ? val.trim() : fallback;
}

function getFormOptionalString(formData: FormData, key: string): string | null {
  const val = formData.get(key);
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

function parseSafeFloat(val: unknown, fallback = 0): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function parseSafeInt(val: unknown, fallback = 0): number {
  if (typeof val === "number" && !isNaN(val)) return Math.floor(val);
  if (typeof val === "string") {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function parseSafeDate(val: unknown, fallback: Date | null = null): Date | null {
  if (!val || typeof val !== "string") return fallback;
  const trimmed = val.trim();
  if (trimmed.length === 0) return fallback;
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? fallback : d;
}

export async function createShipment(formData: FormData) {
  const reference =
    getFormString(formData, "reference") ||
    `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const type = getFormString(formData, "type", "MARITIME");
  const modality = getFormString(formData, "modality", "FCL 40'");
  const blNumber =
    getFormString(formData, "blNumber") ||
    `BL-${Date.now().toString().slice(-6)}`;
  const containerNumber = getFormOptionalString(formData, "containerNumber");
  const carrier = getFormString(formData, "carrier", "MSC");
  const vessel = getFormOptionalString(formData, "vessel");
  const shipper = getFormString(formData, "shipper", "Proveedor Internacional");
  const consignee = getFormString(formData, "consignee", "Cliente Local S.A.");
  const pol = getFormString(formData, "pol", "Puerto de Origen");
  const pod = getFormString(formData, "pod", "Puerto de Buenos Aires");

  const rawStatus = getFormString(formData, "status", "BOOKED") as ShipmentStatus;
  const status = VALID_SHIPMENT_STATUSES.includes(rawStatus) ? rawStatus : "BOOKED";
  const currentLocation = getFormString(formData, "currentLocation") || pol;

  const now = new Date();
  const etd = parseSafeDate(formData.get("etd"), now) ?? now;
  const eta = parseSafeDate(formData.get("eta"), new Date(now.getTime() + 20 * 86400000)) ?? new Date(now.getTime() + 20 * 86400000);

  const buyRate = parseSafeFloat(formData.get("buyRate"), 0);
  const sellRate = parseSafeFloat(formData.get("sellRate"), 0);
  const localCharges = parseSafeFloat(formData.get("localCharges"), 0);
  const profit = sellRate + localCharges - buyRate;
  const notes = getFormOptionalString(formData, "notes");

  const shipment = await db.$transaction(async (tx) => {
    const created = await tx.shipment.create({
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

  revalidatePath("/");
  revalidatePath("/shipments");
  revalidatePath("/tracking");
  revalidatePath("/finances");
  return { success: true, id: shipment.id };
}

export async function updateShipmentStatus(
  id: string,
  rawStatus: string,
  location?: string
) {
  const status = (
    VALID_SHIPMENT_STATUSES.includes(rawStatus as ShipmentStatus)
      ? rawStatus
      : "IN_TRANSIT"
  ) as ShipmentStatus;

  await db.$transaction(async (tx) => {
    const current = await tx.shipment.findUnique({ where: { id } });
    if (!current) throw new Error("Shipment not found");

    const newLocation = (location && location.trim()) || current.currentLocation;

    await tx.shipment.update({
      where: { id },
      data: {
        status,
        currentLocation: newLocation,
        actualArrival: status === "DELIVERED" ? new Date() : current.actualArrival,
      },
    });

    // Add milestone atomically
    const count = await tx.milestone.count({ where: { shipmentId: id } });
    let title = `Estado actualizado a ${status}`;
    if (status === "IN_TRANSIT") title = "En tránsito internacional";
    if (status === "AT_PORT") title = "Arribo a terminal portuaria de destino";
    if (status === "CUSTOMS") title = "En proceso de verificación aduanera";
    if (status === "DELIVERED") title = "Carga entregada en destino final";

    await tx.milestone.create({
      data: {
        shipmentId: id,
        title,
        location: newLocation,
        date: new Date(),
        completed: true,
        order: count + 1,
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/shipments");
  revalidatePath("/tracking");
  revalidatePath(`/shipments/${id}`);
  return { success: true };
}

export async function updateInvoiceStatus(id: string, rawInvoiceStatus: string) {
  const invoiceStatus = (
    VALID_INVOICE_STATUSES.includes(rawInvoiceStatus as InvoiceStatus)
      ? rawInvoiceStatus
      : "PENDING"
  ) as InvoiceStatus;

  await db.shipment.update({
    where: { id },
    data: { invoiceStatus },
  });

  revalidatePath("/finances");
  revalidatePath("/shipments");
  return { success: true };
}

export async function createQuote(formData: FormData) {
  const reference =
    getFormString(formData, "reference") ||
    `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const type = getFormString(formData, "type", "MARITIME");
  const modality = getFormString(formData, "modality", "FCL 40' HC");
  const origin = getFormString(formData, "origin", "Shanghai, China");
  const destination = getFormString(formData, "destination", "Buenos Aires, Argentina");
  const clientName = getFormString(formData, "clientName", "Importador S.A.");
  const clientEmail = getFormOptionalString(formData, "clientEmail");
  const carrier = getFormString(formData, "carrier", "MSC (Mediterranean Shipping)");

  const now = new Date();
  const validUntil =
    parseSafeDate(formData.get("validUntil"), new Date(now.getTime() + 15 * 86400000)) ??
    new Date(now.getTime() + 15 * 86400000);

  const buyRate = parseSafeFloat(formData.get("buyRate"), 0);
  const sellRate = parseSafeFloat(formData.get("sellRate"), 0);
  const localCharges = parseSafeFloat(formData.get("localCharges"), 0);
  const profit = sellRate + localCharges - buyRate;
  const notes = getFormOptionalString(formData, "notes");

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
  return await db.$transaction(async (tx) => {
    const quote = await tx.quote.findUnique({ where: { id: quoteId } });
    if (!quote) throw new Error("Quote not found");

    if (quote.status === "CONVERTED") {
      throw new Error("Esta cotización ya fue convertida a un embarque previamente.");
    }

    const newRef = `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const etd = new Date(now.getTime() + 5 * 86400000);
    const eta = new Date(now.getTime() + 30 * 86400000);

    const shipment = await tx.shipment.create({
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
        notes: `Generado automáticamente desde Cotización ${quote.reference}. ${quote.notes || ""}`.trim(),
      },
    });

    await tx.quote.update({
      where: { id: quoteId },
      data: {
        status: "CONVERTED",
        shipmentId: shipment.id,
      },
    });

    await tx.milestone.create({
      data: {
        shipmentId: shipment.id,
        title: `Cotización ${quote.reference} Aprobada. Booking confirmado con ${quote.carrier}`,
        location: quote.origin,
        date: new Date(),
        completed: true,
        order: 1,
      },
    });

    return { success: true, shipmentId: shipment.id };
  });
}

export async function updateCustomsDetails(id: string, formData: FormData) {
  const customsDeclaration = getFormOptionalString(formData, "customsDeclaration");
  const rawChannel = getFormString(formData, "customsChannel", "PENDING") as CustomsChannel;
  const customsChannel = VALID_CUSTOMS_CHANNELS.includes(rawChannel) ? rawChannel : "PENDING";
  const invoiceNumber = getFormOptionalString(formData, "invoiceNumber");
  const invoiceValue = parseSafeFloat(formData.get("invoiceValue"), 0);
  const packagesCount = parseSafeInt(formData.get("packagesCount"), 0);
  const grossWeightKg = parseSafeFloat(formData.get("grossWeightKg"), 0);
  const volumeCbm = parseSafeFloat(formData.get("volumeCbm"), 0);
  const freeDaysCount = parseSafeInt(formData.get("freeDaysCount"), 14);

  const demurrageDeadline = parseSafeDate(formData.get("demurrageDeadline"), null);

  const docBlUrl = getFormOptionalString(formData, "docBlUrl");
  const docInvoiceUrl = getFormOptionalString(formData, "docInvoiceUrl");
  const docPackingListUrl = getFormOptionalString(formData, "docPackingListUrl");

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

export async function deleteShipment(id: string) {
  await db.shipment.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/shipments");
  revalidatePath("/finances");
  revalidatePath("/tracking");
  return { success: true };
}

export async function deleteQuote(id: string) {
  await db.quote.delete({ where: { id } });
  revalidatePath("/quotes");
  revalidatePath("/");
  return { success: true };
}

export async function createClient(formData: FormData) {
  const name = getFormString(formData, "name", "Nuevo Cliente");
  const taxId = getFormString(formData, "taxId", "30-00000000-0");
  const email = getFormString(formData, "email", "contacto@empresa.com");
  const phone = getFormOptionalString(formData, "phone");
  const country = getFormString(formData, "country", "Argentina");

  const client = await db.client.create({
    data: { name, taxId, email, phone, country },
  });
  revalidatePath("/portal");
  revalidatePath("/");
  return { success: true, id: client.id };
}

export async function deleteClient(id: string) {
  await db.client.delete({ where: { id } });
  revalidatePath("/portal");
  revalidatePath("/");
  return { success: true };
}
