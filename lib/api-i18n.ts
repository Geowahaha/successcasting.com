import { normalizeLocale, type Locale } from "@/lib/i18n-shared";
import { t } from "@/lib/translations";

export function getApiLocale(request: Request, body?: unknown): Locale {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("lang");

  const fromBody =
    typeof body === "object" && body !== null && "lang" in body
      ? String((body as { lang?: string }).lang ?? "")
      : undefined;

  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  const fromCookie = match?.[1];

  return normalizeLocale(fromQuery ?? fromBody ?? fromCookie);
}

export function apiText(locale: Locale) {
  return t(locale).api;
}

