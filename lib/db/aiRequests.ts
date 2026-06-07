import { prisma } from "@/lib/db/prisma";

export async function createAIRequestLog(input: {
  type:
    | "SMART_SEARCH"
    | "QUOTE_GENERATOR"
    | "DEFECT_ANALYZER"
    | "PRODUCTION_ADVISOR"
    | "AI_SEO_BLOG"
    | "AI_SEO_FAQ";
  userId?: string | null;
  quoteId?: string | null;
  orderId?: string | null;
  inputText?: string | null;
  outputText?: string | null;
  outputJson?: unknown;
  model?: string | null;
}) {
  return prisma.aI_Requests.create({
    data: {
      type: input.type,
      userId: input.userId ?? null,
      quoteId: input.quoteId ?? null,
      orderId: input.orderId ?? null,
      inputText: input.inputText ?? null,
      outputText: input.outputText ?? null,
      outputJson:
        input.outputJson === undefined ? undefined : (input.outputJson as object),
      model: input.model ?? null,
    },
    select: { id: true },
  });
}

