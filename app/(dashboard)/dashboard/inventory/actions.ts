"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { actionText, getServerActionLocale } from "@/lib/server-action-i18n";

const UpsertInventorySchema = z.object({
  productId: z.string().uuid(),
  location: z.string().min(1).max(80),
  quantityOnHand: z.coerce.number().int().min(0).max(1_000_000),
  reservedQuantity: z.coerce.number().int().min(0).max(1_000_000),
});

export type InventoryActionState = {
  ok: boolean;
  message: string;
};

export const inventoryActionInitialState: InventoryActionState = {
  ok: false,
  message: "",
};

export async function upsertInventoryAction(
  _prevState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const locale = await getServerActionLocale(formData);
  const msg = actionText(locale);
  const { userId } = await auth();
  if (!userId) return { ok: false, message: msg.unauthorized };

  const parsed = UpsertInventorySchema.safeParse({
    productId: formData.get("productId"),
    location: formData.get("location"),
    quantityOnHand: formData.get("quantityOnHand"),
    reservedQuantity: formData.get("reservedQuantity"),
  });
  if (!parsed.success) return { ok: false, message: msg.invalidInput };

  const user = await prisma.users.findUnique({
    where: { clerkUserId: userId },
    select: { companyId: true },
  });
  if (!user?.companyId) return { ok: false, message: msg.noCompany };

  const product = await prisma.products.findFirst({
    where: { id: parsed.data.productId, companyId: user.companyId },
    select: { id: true },
  });
  if (!product) return { ok: false, message: msg.notFound };

  const existing = await prisma.inventory.findFirst({
    where: {
      productId: product.id,
      location: parsed.data.location,
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.inventory.update({
      where: { id: existing.id },
      data: {
        quantityOnHand: parsed.data.quantityOnHand,
        reservedQuantity: parsed.data.reservedQuantity,
      },
    });
  } else {
    await prisma.inventory.create({
      data: {
        productId: product.id,
        location: parsed.data.location,
        quantityOnHand: parsed.data.quantityOnHand,
        reservedQuantity: parsed.data.reservedQuantity,
      },
    });
  }

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  return { ok: true, message: msg.inventorySaved };
}

