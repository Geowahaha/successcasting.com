import { cookies } from "next/headers";
import { normalizeLocale, type Locale } from "@/lib/i18n-shared";
import { t } from "@/lib/translations";

export async function getServerActionLocale(formData: FormData): Promise<Locale> {
  const lang = formData.get("lang");
  if (typeof lang === "string" && lang.length > 0) {
    return normalizeLocale(lang);
  }
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get("NEXT_LOCALE")?.value);
}

export function actionText(locale: Locale) {
  return t(locale).serverActions;
}

