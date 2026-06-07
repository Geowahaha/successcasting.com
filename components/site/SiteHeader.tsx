import Link from "next/link";

import { getRequestLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { LanguageSwitcher } from "./LanguageSwitcher";

function withLang(href: string, locale: string) {
  const [path, hash] = href.split("#");
  const q = path.includes("?") ? "&" : "?";
  const withQ = `${path}${q}lang=${locale}`;
  return hash ? `${withQ}#${hash}` : withQ;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill="currentColor"
      />
    </svg>
  );
}

export async function SiteHeader() {
  const locale = await getRequestLocale();
  const tr = t(locale);

  const nav = [
    { href: "/", label: tr.nav.home },
    { href: "/services", label: tr.nav.services },
    { href: "/products", label: tr.nav.portfolio },
    { href: "/about", label: tr.nav.about },
    { href: "/contact", label: tr.nav.contactUs },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#5d4038]/15 bg-[#131313]/85 shadow-lg shadow-black/40 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-screen-2xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href={withLang("/", locale)}
          className="flex shrink-0 items-center gap-2 sm:gap-3"
          aria-label="Success Casting"
        >
          <div className="rounded-sm bg-[#FF4500] px-1.5 py-0.5 font-forge-headline text-lg font-black leading-none text-white shadow-[0_0_10px_rgba(255,69,0,0.45)] sm:px-2 sm:py-1 sm:text-xl">
            SC
          </div>
          <span className="font-forge-headline text-lg font-black uppercase tracking-tight text-white sm:text-2xl sm:tracking-tighter">
            <span className="text-[#ff5625]">Suphan</span> Casting
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex xl:gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={withLang(item.href, locale)}
              className="font-forge-headline text-xs uppercase tracking-widest text-[#c4b5ab] transition-colors hover:text-[#ff5625] xl:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher current={locale} variant="forge" />
          <Link
            href={withLang("/products", locale)}
            className="hidden rounded-md p-2 text-[#c4b5ab] transition-colors hover:bg-white/5 hover:text-[#ff5625] sm:inline-flex"
            aria-label={tr.nav.portfolio}
          >
            <SearchIcon className="h-5 w-5" />
          </Link>
          <Link
            href={withLang("/rfq#quote-tool", locale)}
            className="font-forge-headline shrink-0 rounded bg-[#ff5625] px-3 py-2 text-[10px] font-bold uppercase tracking-tight text-white shadow-md shadow-[#ff5625]/20 transition hover:bg-[#e04d20] sm:px-5 sm:text-xs sm:tracking-tighter"
          >
            {tr.nav.getQuote}
          </Link>
        </div>
      </div>
    </header>
  );
}
