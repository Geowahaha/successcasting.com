import { openai } from "@ai-sdk/openai";

export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini" as const;

export function getOpenAIModel(modelId: string = DEFAULT_OPENAI_MODEL) {
  // The OpenAI SDK loads `OPENAI_API_KEY` from env at runtime.
  return openai(modelId as never);
}

