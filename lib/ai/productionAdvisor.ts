import { generateObject } from "ai";
import { z } from "zod";
import { getOpenAIModel } from "./openai";
import {
  ProductionAdvisorOutputSchema,
  type ProductionAdvisorOutput,
} from "./schemas";

export const ProductionAdvisorRouteInputSchema = z.object({
  contextText: z.string().min(10).max(8000),
});

export async function getProductionAdvice(params: {
  contextText: string;
}): Promise<ProductionAdvisorOutput> {
  const model = getOpenAIModel();

  const generated = await generateObject({
    model,
    schema: ProductionAdvisorOutputSchema,
    system:
      "You are an industrial production optimization advisor for steel casting / OEM casting parts. Suggest realistic material, process, and quality-control optimizations that reduce cost and improve yield without compromising spec compliance. Return ONLY valid JSON.",
    prompt: `Production / process notes:\n${params.contextText}\n\nReturn JSON matching the schema.`,
    maxRetries: 2,
  });

  return ProductionAdvisorOutputSchema.parse(generated.object);
}

