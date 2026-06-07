"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Locale, SUPPORTED_LOCALES } from "@/lib/i18n-shared";

type LocaleOption = {
  code: Locale;
  label: string;
  native: string;
  flag: string;
};

const OPTIONS: LocaleOption[] = [
  { code: "th", label: "Thai", native: "ไทย", flag: "🇹🇭" },
  { code: "en", label: "English", native: "English", flag: "🇺🇸" },
  { code: "ja", label: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "ko", label: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "de", label: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "ru", label: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦" },
];

export function LanguageSwitcher({
  current,
  variant = "default",
}: {
  current: Locale;
  variant?: "default" | "forge";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentOption = useMemo(
    () => OPTIONS.find((o) => o.code === current) ?? OPTIONS[0],
    [current],
  );

  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => {
    setActiveIndex(OPTIONS.findIndex((o) => o.code === current));
  }, [current]);

  async function onChange(nextLocale: Locale) {
    if (nextLocale === current) {
      setOpen(false);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLocale);
    const nextUrl = `${pathname}?${params.toString()}`;

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    try {
      await fetch("/api/lang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
    } catch {
      // UI still updates by query string + client cookie fallback.
    }

    setOpen(false);
    router.push(nextUrl);
    router.refresh();
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => listRef.current?.focus());
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((v) => (v + 1) % OPTIONS.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((v) => (v - 1 + OPTIONS.length) % OPTIONS.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selected = OPTIONS[activeIndex];
      void onChange(selected.code);
    }
  }

  const buttonClass =
    variant === "forge"
      ? "h-9 min-w-[160px] rounded-[8px] border border-white/[0.06] bg-[#161616] px-3 text-[#e8e8e8] transition hover:border-white/[0.12] hover:backdrop-blur-sm"
      : "h-9 min-w-[160px] rounded-[8px] border border-white/[0.06] bg-[#161616] px-3 text-[#e8e8e8] transition hover:border-white/[0.12] hover:backdrop-blur-sm";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={buttonClass}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
      >
        <span className="flex items-center justify-between gap-2">
          <span
            className="truncate text-xs"
            style={{ fontFamily: "'Space Mono', ui-monospace, monospace" }}
          >
            {currentOption.flag} {currentOption.native}
          </span>
          <span
            className={`text-[10px] text-[#e8622c] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </span>
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+8px)] z-50 w-64 origin-top-right overflow-hidden rounded-[8px] border border-white/[0.06] bg-[#080808]/95 shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-all duration-200 ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
      >
        <div
          ref={listRef}
          role="listbox"
          tabIndex={open ? 0 : -1}
          aria-label="Language list"
          className="max-h-72 overflow-y-auto p-1 outline-none"
          onKeyDown={onListKeyDown}
        >
          {OPTIONS.filter((opt) => SUPPORTED_LOCALES.includes(opt.code)).map((opt, index) => {
            const selected = opt.code === current;
            const active = index === activeIndex;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={selected}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition ${
                  selected
                    ? "bg-[#e8622c]/20 text-[#e8622c]"
                    : active
                      ? "bg-[#e8622c]/10 text-white"
                      : "text-[#e6e6e6] hover:bg-[#e8622c]/10"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => void onChange(opt.code)}
              >
                <span
                  className="text-sm"
                  style={{ fontFamily: "'Noto Sans Thai', system-ui, sans-serif" }}
                >
                  {opt.flag} {opt.native}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-white/60">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

