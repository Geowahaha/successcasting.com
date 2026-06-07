import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import {
  SmartSearchRouteInputSchema,
  smartSearchProducts,
} from "@/lib/ai/smartSearch";
import { createAIRequestLog } from "@/lib/db/aiRequests";
import { apiText, getApiLocale } from "@/lib/api-i18n";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const locale = getApiLocale(request, json ?? undefined);
  const msg = apiText(locale);
  const parsed = SmartSearchRouteInputSchema.safeParse(json);
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

  const results = await smartSearchProducts({
    inputText: parsed.data.inputText,
    limit: parsed.data.limit,
  });

  if (dbUser?.id) {
    await createAIRequestLog({
      type: "SMART_SEARCH",
      userId: dbUser.id,
      inputText: parsed.data.inputText,
      outputJson: { count: results.length, results },
      model: "gpt-4o-mini",
    });
  }

  return NextResponse.json({ results });
}

