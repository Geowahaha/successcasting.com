import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { createAIRequestLog } from "@/lib/db/aiRequests";
import {
  QuoteGeneratorRouteInputSchema,
  generateQuoteEstimate,
} from "@/lib/ai/quoteGenerator";
import { apiText, getApiLocale } from "@/lib/api-i18n";

const successCastingBackendOrigin =
  process.env.SUCCESSCASTING_BACKEND_ORIGIN ?? "http://43.128.75.149";

async function askExistingSalesBackend(params: {
  specsText: string;
  materialName?: string;
  request: Request;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);

  try {
    const payload = {
      session_id: `web_${Date.now().toString(36)}`,
      visitor_id: "web-rfq-form",
      current_page: params.request.headers.get("referer") || "https://www.successcasting.com/",
      message: [params.materialName ? `Material: ${params.materialName}` : "", params.specsText]
        .filter(Boolean)
        .join("\n"),
      preferred_contact: "line",
    };
    const backendUrls = [
      new URL("/api/ai-sales/chat", params.request.url).toString(),
      `${successCastingBackendOrigin}/api/ai-sales/chat`,
    ];
    let backendData: any = null;
    let backendOk = false;

    for (const url of backendUrls) {
      const backendResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch(() => null);
      backendData = backendResponse ? await backendResponse.json().catch(() => null) : null;
      backendOk = Boolean(backendResponse?.ok && backendData?.answer);
      if (backendOk) break;
    }

    if (!backendOk || !backendData) return null;

    return {
      estimatedPriceUsd: null,
      leadTimeDays: null,
      quoteSummary: backendData.answer,
      assumptions: backendData.quote_readiness?.missing_labels ?? backendData.quote_readiness?.missing ?? [],
      aiExplanation: backendData.privacy_note,
      existingBackend: {
        status: backendData.status,
        sessionId: backendData.session_id,
        intent: backendData.intent,
        leadScore: backendData.lead_score,
        quoteReadiness: backendData.quote_readiness,
        rfq: backendData.rfq,
        customerContext: backendData.customer_context,
      },
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const locale = getApiLocale(request, json ?? undefined);
  const msg = apiText(locale);

  const parsed = QuoteGeneratorRouteInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().formErrors.join("; ") || msg.invalidInput },
      { status: 400 },
    );
  }

  const existingBackendEstimate = await askExistingSalesBackend({
    specsText: parsed.data.specsText,
    materialName: parsed.data.materialName,
    request,
  });

  if (existingBackendEstimate) {
    return NextResponse.json({ estimate: existingBackendEstimate });
  }

  const estimate = await generateQuoteEstimate({
    specsText: parsed.data.specsText,
    materialId: parsed.data.materialId,
    materialName: parsed.data.materialName,
  });

  const { userId: clerkUserId } = await auth();
  const dbUser = clerkUserId
    ? await prisma.users.findUnique({
        where: { clerkUserId },
        select: { id: true },
      })
    : null;

  if (dbUser?.id) {
    await createAIRequestLog({
      type: "QUOTE_GENERATOR",
      userId: dbUser.id,
      inputText: parsed.data.specsText,
      outputJson: estimate,
      model: "gpt-4o-mini + deterministic-cost-engine",
    });
  }

  return NextResponse.json({ estimate });
}

