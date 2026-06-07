import { generateObject } from "ai";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { getOpenAIModel } from "./openai";
import {
  QuoteSpecExtractionSchema,
  type QuoteSpecExtraction,
} from "./schemas";
import { calculateDeterministicQuoteCost } from "@/lib/cost/quoteCostEngine";

export const QuoteGeneratorRouteInputSchema = z.object({
  specsText: z.string().min(10).max(12000),
  companyId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  materialId: z.string().uuid().optional(),
  materialName: z.string().min(2).max(80).optional(),
});

export async function extractQuoteSpecsWithAI(params: {
  specsText: string;
}): Promise<QuoteSpecExtraction> {
  const model = getOpenAIModel();

  const generated = await generateObject({
    model,
    schema: QuoteSpecExtractionSchema,
    system:
      "You are a manufacturing specification parser for steel casting quotes. Do not calculate final price. Extract realistic manufacturing inputs from text.",
    prompt: `Specifications / drawing notes:\n${params.specsText}

Return JSON that estimates:
- material (steel/iron/aluminum or closest name)
- weightKg
- complexityScore (0..1)
- machiningHours
- leadTimeDays
- reasoning
- assumptions[]`,
    maxRetries: 2,
  });

  return QuoteSpecExtractionSchema.parse(generated.object);
}

export async function generateQuoteEstimate(params: {
  specsText: string;
  materialId?: string;
  materialName?: string;
}) {
  const extracted = await extractQuoteSpecsWithAI({ specsText: params.specsText });
  const breakdown = await calculateDeterministicQuoteCost({
    materialName: params.materialName ?? extracted.material,
    materialId: params.materialId,
    weightKg: extracted.weightKg,
    complexityScore: extracted.complexityScore,
    machiningHours: extracted.machiningHours,
  });

  const quoteSummary = [
    `Material: ${breakdown.material.name}`,
    `Weight: ${extracted.weightKg.toFixed(2)} kg`,
    `Complexity: ${Math.round(extracted.complexityScore * 100)}%`,
    `Machining: ${extracted.machiningHours.toFixed(1)} h`,
    `Deterministic cost model applied with overhead and margin.`,
  ].join(" | ");

  return {
    estimatedPriceUsd: breakdown.estimatedTotalUsd,
    leadTimeDays: extracted.leadTimeDays,
    quoteSummary,
    assumptions: extracted.assumptions,
    aiExplanation: extracted.reasoning,
    extracted,
    breakdown,
  };
}

export async function persistQuoteEstimate(input: {
  companyId: string;
  userId?: string | null;
  productId?: string | null;
  materialId?: string | null;
  specsInput: string;
}): Promise<{
  quoteId: string;
  estimatedPriceUsd: number | null;
  leadTimeDays: number | null;
}> {
  const estimate = await generateQuoteEstimate({
    specsText: input.specsInput,
    materialId: input.materialId ?? undefined,
  });

  const quote = await prisma.quotes.create({
    data: {
      companyId: input.companyId,
      userId: input.userId ?? null,
      productId: input.productId ?? null,
      materialId: estimate.breakdown.material.id,
      formulaVersionId: estimate.breakdown.formulaVersion.id,
      overheadRate: estimate.breakdown.formulaRates.overheadRate,
      marginRate: estimate.breakdown.formulaRates.marginRate,
      status: "AI_ESTIMATED",
      inputWeightKg: estimate.extracted.weightKg,
      complexityScore: estimate.extracted.complexityScore,
      machiningHours: estimate.extracted.machiningHours,
      leadTimeDays: estimate.leadTimeDays,
      estimatedPriceUsd: estimate.estimatedPriceUsd,
      materialCostUsd: estimate.breakdown.material.costUsd,
      castingCostUsd: estimate.breakdown.castingCostUsd,
      machiningCostUsd: estimate.breakdown.machiningCostUsd,
      laborCostUsd: estimate.breakdown.laborCostUsd,
      overheadCostUsd: estimate.breakdown.overheadCostUsd,
      marginCostUsd: estimate.breakdown.marginCostUsd,
      quoteSummary: estimate.quoteSummary,
      aiExplanation: estimate.aiExplanation,
      specsInput: input.specsInput,
      aiOutputJson: {
        extracted: estimate.extracted,
        breakdown: estimate.breakdown,
        estimatedPriceUsd: estimate.estimatedPriceUsd,
        leadTimeDays: estimate.leadTimeDays,
        quoteSummary: estimate.quoteSummary,
        assumptions: estimate.assumptions,
        aiExplanation: estimate.aiExplanation,
      },
    },
    select: { id: true, estimatedPriceUsd: true, leadTimeDays: true },
  });

  return {
    quoteId: quote.id,
    estimatedPriceUsd: quote.estimatedPriceUsd ?? null,
    leadTimeDays: quote.leadTimeDays ?? null,
  };
}

