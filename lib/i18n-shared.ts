export const SUPPORTED_LOCALES = [
  "th",
  "en",
  "ja",
  "zh",
  "ko",
  "de",
  "es",
  "fr",
  "ru",
  "vi",
  "ar",
] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "th";

export function normalizeLocale(value?: string | null): Locale {
  if (!value) return DEFAULT_LOCALE;
  const lower = value.toLowerCase();
  if (lower === "th") return "th";
  if (lower === "en") return "en";
  if (lower === "ja" || lower === "jp") return "ja";
  if (lower === "zh" || lower === "cn" || lower === "ch") return "zh";
  if (lower === "ko" || lower === "kr") return "ko";
  if (lower === "de") return "de";
  if (lower === "es") return "es";
  if (lower === "fr") return "fr";
  if (lower === "ru") return "ru";
  if (lower === "vi" || lower === "vn") return "vi";
  if (lower === "ar" || lower === "sa") return "ar";
  return DEFAULT_LOCALE;
}

