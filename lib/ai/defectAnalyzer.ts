import { generateObject } from "ai";
import { z } from "zod";
import { getOpenAIModel } from "./openai";
import {
  DefectAnalyzerOutputSchema,
  type DefectAnalyzerOutput,
} from "./schemas";

export const DefectAnalyzerRouteInputSchema = z.object({
  description: z.string().min(10).max(6000),
  imageUrl: z.string().url().optional(),
  companyId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
});

export async function analyzeDefects(params: {
  description: string;
  imageUrl?: string;
}): Promise<DefectAnalyzerOutput> {
  const model = getOpenAIModel();

  const promptLines: string[] = [];
  if (params.imageUrl) {
    promptLines.push(`Image URL (may not be machine-readable by all models): ${params.imageUrl}`);
  }
  promptLines.push(`Defect description / observations:\n${params.description}`);

  const generated = await generateObject({
    model,
    schema: DefectAnalyzerOutputSchema,
    system:
      "You are an industrial quality engineer assistant. Given the description (and optionally an image URL), identify the most likely defect type in steel casting, probable root causes, and actionable remedies. Return ONLY valid JSON matching the schema.",
    prompt: promptLines.join("\n\n"),
    maxRetries: 2,
  });

  return DefectAnalyzerOutputSchema.parse(generated.object);
}

