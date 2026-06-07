"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { actionText, getServerActionLocale } from "@/lib/server-action-i18n";

const UpdateQuoteStatusSchema = z.object({
  quoteId: z.string().uuid(),
  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "AI_ESTIMATED",
    "CUSTOMER_APPROVED",
    "IN_PRODUCTION",
    "SHIPPED",
    "CANCELLED",
  ]),
});

export type QuoteActionState = {
  ok: boolean;
  message: string;
};

export const quoteActionInitialState: QuoteActionState = {
  ok: false,
  message: "",
};

export async function updateQuoteStatusAction(
  _prevState: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  const locale = await getServerActionLocale(formData);
  const msg = actionText(locale);
  const { userId } = await auth();
  if (!userId) return { ok: false, message: msg.unauthorized };

  const parsed = UpdateQuoteStatusSchema.safeParse({
    quoteId: formData.get("quoteId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, message: msg.invalidInput };

  const dbUser = await prisma.users.findUnique({
    where: { clerkUserId: userId },
    select: { companyId: true },
  });
  if (!dbUser?.companyId) return { ok: false, message: msg.noCompany };

  const updated = await prisma.quotes.updateMany({
    where: {
      id: parsed.data.quoteId,
      companyId: dbUser.companyId,
    },
    data: { status: parsed.data.status },
  });
  if (updated.count === 0) return { ok: false, message: msg.notFound };

  revalidatePath("/dashboard/quotes");
  revalidatePath("/dashboard");
  return { ok: true, message: msg.quoteStatusUpdated };
}

