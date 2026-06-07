import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeLocale } from "@/lib/i18n-shared";
import { apiText, getApiLocale } from "@/lib/api-i18n";

const Schema = z.object({
  locale: z.string().min(2).max(5),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const locale = getApiLocale(req, json ?? undefined);
  const msg = apiText(locale);
  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: msg.invalidInput }, { status: 400 });
  }

  const nextLocale = normalizeLocale(parsed.data.locale);
  const response = NextResponse.json({ ok: true, locale: nextLocale });
  response.cookies.set("NEXT_LOCALE", nextLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

