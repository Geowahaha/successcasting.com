import { z } from "zod";

export const SmartSearchExtractionSchema = z.object({
  keywords: z.array(z.string().min(2)).min(3).max(12),
  categoryHints: z.array(z.string().min(2)).min(1).max(4),
  materialHints: z.array(z.string().min(2)).max(6),
  processHints: z.array(z.string().min(2)).max(6),
  limit: z.number().int().min(3).max(12).default(8),
});

export type SmartSearchExtraction = z.infer<
  typeof SmartSearchExtractionSchema
>;

export const QuoteGeneratorSchema = z.object({
  estimatedPriceUsd: z.number().min(0),
  leadTimeDays: z.number().int().min(1).max(365),
  quoteSummary: z.string().min(10).max(800),
  assumptions: z.array(z.string().min(3)).min(1).max(8),
});

export type QuoteGeneratorOutput = z.infer<typeof QuoteGeneratorSchema>;

export const QuoteSpecExtractionSchema = z.object({
  material: z.string().min(2).max(80),
  weightKg: z.number().min(0.1).max(100000),
  complexityScore: z.number().min(0).max(1),
  machiningHours: z.number().min(0).max(3000),
  leadTimeDays: z.number().int().min(1).max(365),
  reasoning: z.string().min(20).max(1500),
  assumptions: z.array(z.string().min(3)).min(1).max(10),
});

export type QuoteSpecExtraction = z.infer<typeof QuoteSpecExtractionSchema>;

export const DefectAnalyzerOutputSchema = z.object({
  defectType: z.string().min(2).max(120),
  probableCauses: z.array(z.string().min(3)).min(1).max(6),
  recommendedActions: z.array(z.string().min(3)).min(1).max(6),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export type DefectAnalyzerOutput = z.infer<typeof DefectAnalyzerOutputSchema>;

export const ProductionAdvisorOutputSchema = z.object({
  materialOptimizations: z.array(z.string().min(3)).min(1).max(6),
  processOptimizations: z.array(z.string().min(3)).min(1).max(6),
  qcOptimizations: z.array(z.string().min(3)).min(1).max(6),
  expectedImpact: z.string().min(10).max(900),
});

export type ProductionAdvisorOutput = z.infer<
  typeof ProductionAdvisorOutputSchema
>;

