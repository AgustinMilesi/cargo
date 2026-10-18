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
