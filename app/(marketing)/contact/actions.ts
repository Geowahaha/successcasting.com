"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { findOrCreateCompany } from "@/lib/db/companies";
import { persistQuoteEstimate } from "@/lib/ai/quoteGenerator";

const QuoteBaseSchema = z.object({
  companyName: z.string().min(2).max(160),
  contactName: z.string().min(2).max(160),
  email: z.string().email(),
  specsText: z.string().min(10).max(12000),
});

export type QuoteActionResult = {
  quoteId?: string;
  error?: string;
};

export async function submitRFQAction(formData: FormData) {
  const parsed = QuoteBaseSchema.safeParse({
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    specsText: formData.get("specsText"),
  });

  if (!parsed.success) {
    redirect("/rfq?error=invalid-rfq-input");
  }

  const company = await findOrCreateCompany({
    name: parsed.data.companyName,
    website: null,
    country: null,
    city: null,
  });

  const quote = await prisma.quotes.create({
    data: {
      companyId: company.id,
      status: "SUBMITTED",
      specsInput: parsed.data.specsText,
      quoteSummary: `RFQ submitted by ${parsed.data.contactName}.`,
      aiOutputJson: undefined,
    },
    select: { id: true },
  });

  redirect(`/rfq?quoteId=${encodeURIComponent(quote.id)}&mode=rfq`);
}

const QuoteEstimateSchema = QuoteBaseSchema.extend({
  productId: z.string().uuid().optional().or(z.literal("")).transform((v) =>
    v === "" ? undefined : v,
  ),
  materialId: z.string().uuid().optional().or(z.literal("")).transform((v) =>
    v === "" ? undefined : v,
  ),
});

export async function runAiQuoteGeneratorAction(
  formData: FormData,
) {
  const parsed = QuoteEstimateSchema.safeParse({
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    specsText: formData.get("specsText"),
    productId: formData.get("productId"),
    materialId: formData.get("materialId"),
  });

  if (!parsed.success) {
    redirect("/rfq?error=invalid-ai-quote-input");
  }

  const company = await findOrCreateCompany({
    name: parsed.data.companyName,
    website: null,
    country: null,
    city: null,
  });

  const result = await persistQuoteEstimate({
    companyId: company.id,
    userId: null,
    productId: parsed.data.productId ?? null,
    materialId: parsed.data.materialId ?? null,
    specsInput: parsed.data.specsText,
  });

  redirect(
    `/rfq?quoteId=${encodeURIComponent(result.quoteId)}&mode=ai`,
  );
}

