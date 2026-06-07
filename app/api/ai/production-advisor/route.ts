import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import {
  getProductionAdvice,
  ProductionAdvisorRouteInputSchema,
} from "@/lib/ai/productionAdvisor";
import { createAIRequestLog } from "@/lib/db/aiRequests";
import { apiText, getApiLocale } from "@/lib/api-i18n";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const locale = getApiLocale(request, json ?? undefined);
  const msg = apiText(locale);
  const parsed = ProductionAdvisorRouteInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().formErrors.join("; ") || msg.invalidInput },
      { status: 400 },
    );
  }

  const { userId: clerkUserId } = await auth();
  const dbUser = clerkUserId
    ? await prisma.users.findUnique({
        where: { clerkUserId },
        select: { id: true },
      })
    : null;

  const output = await getProductionAdvice({
    contextText: parsed.data.contextText,
  });

  if (dbUser?.id) {
    await createAIRequestLog({
      type: "PRODUCTION_ADVISOR",
      userId: dbUser.id,
      inputText: parsed.data.contextText,
      outputJson: output,
      model: "gpt-4o-mini",
    });
  }

  return NextResponse.json({ output });
}

