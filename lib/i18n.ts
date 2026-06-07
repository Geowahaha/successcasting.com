import { cookies } from "next/headers";
import { type Locale, normalizeLocale } from "./i18n-shared";

export async function getRequestLocale(params?: {
  lang?: string | string[] | undefined;
}): Promise<Locale> {
  const fromParams = Array.isArray(params?.lang) ? params?.lang[0] : params?.lang;
  if (fromParams) return normalizeLocale(fromParams);

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("NEXT_LOCALE")?.value;
  return normalizeLocale(fromCookie);
}

