import Link from "next/link";
import { getRequestLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";

function withLang(href: string, locale: string) {
  const [path, hash] = href.split("#");
  const q = path.includes("?") ? "&" : "?";
  const withQ = `${path}${q}lang=${locale}`;
  return hash ? `${withQ}#${hash}` : withQ;
}

export async function SiteFooter() {
  const locale = await getRequestLocale();
  const tr = t(locale);
  const hm = tr.homeMaster;
  const year = new Date().getFullYear();

  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.3213722401542!2d100.17816574475148!3d14.350804150392461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e241004452e5a9%3A0xb32b522a55c34948!2sSuphan%20casting%20Co.%2Cltd.!5e0!3m2!1sen!2sus!4v1775020729048!5m2!1sen!2sus";

  return (
    <>
      <footer className="w-full bg-[#0e0e0e] px-8 py-12 pb-28 md:pb-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-sm bg-[#FF4500] px-2 py-1 font-forge-headline text-xl font-black leading-none text-white">
                SC
              </div>
              <span className="font-forge-headline text-xl font-bold uppercase text-[#ff5625]">
                Success Casting
              </span>
            </div>
            <p className="max-w-xs font-forge-headline text-xs leading-relaxed tracking-wider text-[#2e4e4e]">
              {hm.footerBlurb}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h5 className="mb-6 font-forge-headline text-xs font-bold uppercase tracking-wider text-[#ffb5a0]">
                {hm.footerQuick}
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={withLang("/", locale)}
                    className="font-forge-headline text-xs tracking-wider text-[#2e4e4e] transition-opacity hover:text-[#ffb5a0]"
                  >
                    {hm.flHome}
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLang("/services", locale)}
                    className="font-forge-headline text-xs tracking-wider text-[#2e4e4e] transition-opacity hover:text-[#ffb5a0]"
                  >
                    {hm.flServices}
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLang("/about", locale)}
                    className="font-forge-headline text-xs tracking-wider text-[#2e4e4e] transition-opacity hover:text-[#ffb5a0]"
                  >
                    {tr.nav.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLang("/products", locale)}
                    className="font-forge-headline text-xs tracking-wider text-[#2e4e4e] transition-opacity hover:text-[#ffb5a0]"
                  >
                    {hm.flPortfolio}
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLang("/dashboard", locale)}
                    className="font-forge-headline text-xs tracking-wider text-[#2e4e4e] transition-opacity hover:text-[#ffb5a0]"
                  >
                    {hm.flAdmin}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-6 font-forge-headline text-xs font-bold uppercase tracking-wider text-[#ffb5a0]">
                {hm.footerLegal}
              </h5>
              <ul className="space-y-3">
                <li>
                  <span className="cursor-not-allowed font-forge-headline text-xs tracking-wider text-[#2e4e4e] opacity-70">
                    {hm.flPrivacy}
                  </span>
                </li>
                <li>
                  <span className="cursor-not-allowed font-forge-headline text-xs tracking-wider text-[#2e4e4e] opacity-70">
                    {hm.flTerms}
                  </span>
                </li>
                <li>
                  <span className="cursor-not-allowed font-forge-headline text-xs tracking-wider text-[#2e4e4e] opacity-70">
                    {hm.flIso}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-forge-headline text-xs font-bold uppercase tracking-wider text-[#ffb5a0]">
              {hm.footerContact}
            </h5>
            <div className="space-y-4 text-xs font-forge-headline tracking-wider text-[#2e4e4e]">
              <div>{hm.contactName}</div>
              <div>
                <a href="tel:0986362356" className="hover:text-[#ffb5a0]">
                  098 636 2356
                </a>
              </div>
              <div>
                <a href="mailto:SCNWMax@gmail.com" className="hover:text-[#ffb5a0]">
                  SCNWMax@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-forge-headline text-xs font-bold uppercase tracking-wider text-[#ffb5a0]">
              {hm.footerLocation}
            </h5>
            <div className="h-56 w-full overflow-hidden rounded border border-[#5d4038]/30 sm:h-64 md:h-[280px]">
              <iframe
                title="Suphan casting Co., Ltd. on Google Maps"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full min-h-[200px] w-full border-0"
              />
            </div>
            <p className="font-forge-headline text-[10px] leading-tight tracking-wider text-[#2e4e4e]">
              {hm.locationLine}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-[#5d4038]/15 pt-8 text-center">
          <p className="font-forge-headline text-xs tracking-wider text-[#2e4e4e]">
            © {year} Success Casting Industrial. {tr.footer.rights}
          </p>
        </div>
      </footer>

      <nav
        className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t border-[#5d4038]/15 bg-[#0e0e0e]/80 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] backdrop-blur-lg md:hidden"
        aria-label="Mobile"
      >
        <Link
          href={withLang("/", locale)}
          className="flex flex-col items-center justify-center text-[#ff5625]"
        >
          <span className="text-lg" aria-hidden>
            ⌂
          </span>
          <span className="font-forge-headline text-[10px] font-bold uppercase tracking-tighter">
            {hm.mobileHome}
          </span>
        </Link>
        <Link
          href={withLang("/products", locale)}
          className="flex flex-col items-center justify-center text-[#2e4e4e]"
        >
          <span className="text-lg" aria-hidden>
            ⚙
          </span>
          <span className="font-forge-headline text-[10px] font-bold uppercase tracking-tighter">
            {hm.mobileProducts}
          </span>
        </Link>
        <Link
          href={withLang("/rfq#quote-tool", locale)}
          className="flex flex-col items-center justify-center text-[#2e4e4e]"
        >
          <span className="text-lg" aria-hidden>
            ✎
          </span>
          <span className="font-forge-headline text-[10px] font-bold uppercase tracking-tighter">
            {hm.mobileTools}
          </span>
        </Link>
        <Link
          href={withLang("/dashboard", locale)}
          className="flex flex-col items-center justify-center text-[#2e4e4e]"
        >
          <span className="text-lg" aria-hidden>
            ⚙
          </span>
          <span className="font-forge-headline text-[10px] font-bold uppercase tracking-tighter">
            {hm.mobileAdmin}
          </span>
        </Link>
      </nav>
    </>
  );
}

