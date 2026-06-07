import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getOpenAIModel } from "./openai";
import {
  SmartSearchExtractionSchema,
  type SmartSearchExtraction,
} from "./schemas";

export type SmartSearchProductHit = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  description?: string | null;
  matchReason: string;
  estimatedLeadTimeDays?: number | null;
};

function scoreHit(input: SmartSearchExtraction, searchText: string) {
  const t = searchText.toLowerCase();
  let score = 0;
  for (const k of input.keywords) {
    if (t.includes(k.toLowerCase())) score += 2;
  }
  for (const m of input.materialHints) {
    if (t.includes(m.toLowerCase())) score += 1;
  }
  for (const p of input.processHints) {
    if (t.includes(p.toLowerCase())) score += 1;
  }
  return score;
}

export async function smartSearchProducts(params: {
  inputText: string;
  limit: number;
}): Promise<SmartSearchProductHit[]> {
  const model = getOpenAIModel();

  const extraction = await generateObject({
    model,
    schema: SmartSearchExtractionSchema,
    system:
      "You are a B2B manufacturing search assistant. Extract concrete product search keywords for steel casting / OEM casting parts. Return ONLY the JSON object that matches the schema.",
    prompt: `User input:\n${params.inputText}\n\nExtract keywords (materials, processes, and key part descriptors) and any category hints. Prefer specific terms like "investment casting", "ductile iron", "carbon steel", "OEM casting parts", "CNC machined casting", etc.`,
    maxRetries: 2,
  });

  const parsed = SmartSearchExtractionSchema.parse(extraction.object);

  const categoryCandidates = await prisma.categories.findMany({
    where: {
      OR: parsed.categoryHints.flatMap((hint) => [
        { slug: { contains: hint, mode: "insensitive" } },
        { name: { contains: hint, mode: "insensitive" } },
      ]),
    },
    select: { id: true, slug: true, name: true },
    take: 12,
  });

  const categoryIds = categoryCandidates.map((c) => c.id);

  const products = await prisma.products.findMany({
    where: {
      ...(categoryIds.length ? { categoryId: { in: categoryIds } } : {}),
      OR: parsed.keywords.map((k) => ({
        searchText: { contains: k, mode: "insensitive" },
      })),
    },
    take: 60,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      searchText: true,
      category: { select: { name: true } },
    },
  });

  const hits = products
    .map((p) => {
      const score = scoreHit(parsed, p.searchText ?? "");
      const matchedKeywords = parsed.keywords
        .filter((k) => p.searchText?.toLowerCase().includes(k.toLowerCase()))
        .slice(0, 5);

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryName: p.category.name,
        description: p.description,
        matchReason:
          matchedKeywords.length > 0
            ? `Matches: ${matchedKeywords.join(", ")}`
            : "Relevant to your requirements",
        estimatedLeadTimeDays: null,
        _score: score,
      };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, params.limit);

  return hits.map(({ _score: _ignored, ...rest }) => rest);
}

// Useful for route-level validation without importing schema consumers all over.
export const SmartSearchRouteInputSchema = z.object({
  inputText: z.string().min(10).max(6000),
  limit: z.number().int().min(3).max(12).default(8),
});

