import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import {
  MATERIAL_PAGES,
  MATERIAL_SLUGS,
  absoluteMaterialUrl,
  getMaterialPage,
} from "@/lib/seo/materials";
import {
  buildProductJsonLdForSlug,
  buildFAQJsonLdForSlug,
} from "@/lib/seo/structuredData";
import ProductSiteHeader from "@/components/site/ProductSiteHeader";

// Build all 7 material pages at build time → fully static, fast.
export function generateStaticParams() {
  return MATERIAL_SLUGS.map((slug) => ({ slug }));
}

// Short CDN cache so future content updates propagate in ~1 min.
export const revalidate = 60;
// Any slug outside the 7 → redirect, don't try SSR.
export const dynamicParams = true;

const SITE = "https://www.successcasting.com";
const LINE_URL = "https://line.me/R/ti/p/@SCNW";
const PHONE_MAIN = "098-636-2356";
const PHONE_ALT = "06-3989-1165";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMaterialPage(slug);
  if (!m) return { title: "Success Casting" };
  return {
    title: m.th.title,
    description: m.th.lead,
    alternates: { canonical: absoluteMaterialUrl(slug) },
    keywords: m.keywords,
    openGraph: {
      title: m.th.title,
      description: m.th.lead,
      url: absoluteMaterialUrl(slug),
      type: "website",
      images: [{ url: `${SITE}${m.image}`, alt: m.th.h1 }],
    },
  };
}

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getMaterialPage(slug);

  // Legacy or unknown slug → redirect to the products landing (preserves the
  // previous /products/* behaviour for any external links Google may still have).
  if (!m) permanentRedirect("/products");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE },
      { "@type": "ListItem", position: 2, name: "สินค้าและบริการ", item: `${SITE}/products` },
      { "@type": "ListItem", position: 3, name: m.th.h1, item: absoluteMaterialUrl(slug) },
    ],
  };

  const faqJsonLd = buildFAQJsonLdForSlug(slug) ?? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `รับหล่อ ${m.family} ตามแบบหรือไม่`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `รับหล่อ ${m.family} ตามแบบ Drawing รูปชิ้นงาน หรือถอดแบบจากอะไหล่เดิม ครอบคลุมเกรด ${m.grades.join(", ")} ตามมาตรฐาน ${m.standard}`,
        },
      },
    ],
  };

  const productJsonLd = buildProductJsonLdForSlug(slug);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: m.th.h1,
    itemListElement: m.grades.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g,
    })),
  };

  // Cross-links to sibling material pages (internal linking for SEO).
  const siblings = MATERIAL_PAGES.filter((x) => x.slug !== slug);

  return (
    <div className="min-h-dvh bg-[#0e0e0e] text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}

      {/* Header — same design as homepage */}
      <ProductSiteHeader />

      <main className="mx-auto max-w-5xl px-4 pt-28 pb-12 sm:px-6">
        {/* Breadcrumb (visible) */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-500">
          <Link href="/" className="hover:text-white">หน้าแรก</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-white">สินค้าและบริการ</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{m.family}</span>
        </nav>

        {/* Hero */}
        <section className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e8b84b]">
              {m.family} · มาตรฐาน {m.standard}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{m.th.h1}</h1>
            <p className="mt-5 leading-8 text-zinc-300">{m.th.lead}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#06c755] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#05a948]"
              >
                ขอใบเสนอราคา LINE @SCNW
              </a>
              <a
                href={`tel:${PHONE_MAIN.replace(/-/g, "")}`}
                className="rounded-full bg-[#c72127] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a91920]"
              >
                โทร {PHONE_MAIN}
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1c1b1b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.image}
              alt={m.th.h1}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </section>

        {/* Grades */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold">เกรดและมาตรฐานที่รองรับ</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {m.grades.map((g) => (
              <span key={g} className="rounded-full border border-[#e8b84b]/40 bg-[#e8b84b]/10 px-4 py-1.5 text-sm font-semibold text-[#e8b84b]">
                {g}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-zinc-400">มาตรฐานอ้างอิง: {m.standard}</p>
        </section>

        {/* Properties */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">คุณสมบัติทางเทคนิค</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <tbody>
                {m.properties.map((p, i) => (
                  <tr key={p.label} className={i % 2 === 0 ? "bg-[#1c1b1b]" : "bg-[#161616]"}>
                    <td className="w-2/5 px-5 py-3 font-semibold text-zinc-200">{p.label}</td>
                    <td className="px-5 py-3 text-zinc-300">{p.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            * ค่าคุณสมบัติเป็นช่วงตามมาตรฐานอ้างอิง — ค่าจริงของชิ้นงานขึ้นกับเงื่อนไขการหล่อ การชุบ และการกลึงต่อ
          </p>
        </section>

        {/* Applications */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">การใช้งานหลัก</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {m.applications.map((a) => (
              <li key={a} className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#1c1b1b] p-4">
                <span aria-hidden="true" className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-[#e8b84b]" />
                <span className="text-zinc-200">{a}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Detail sections — comprehensive technical content */}
        {m.details && m.details.length > 0 && (
          <section className="mt-14 space-y-10">
            <h2 className="text-2xl font-bold">รายละเอียดทางเทคนิค</h2>
            {m.details.map((section) => (
              <div key={section.heading} className="rounded-xl border border-white/10 bg-[#1c1b1b] p-6">
                <h3 className="text-lg font-bold text-[#e8b84b]">{section.heading}</h3>
                <p className="mt-3 leading-8 text-zinc-300">{section.body}</p>
                {section.list && section.list.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-7 text-zinc-300">
                        <span aria-hidden="true" className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#e8b84b]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Sibling materials */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold">วัสดุอื่น ๆ ที่รับหล่อ</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/products/${s.slug}`}
                className="group rounded-lg border border-white/10 bg-[#1c1b1b] p-4 transition hover:border-[#e8b84b]/50"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#e8b84b]">{s.standard}</p>
                <p className="mt-1.5 font-semibold text-white group-hover:text-[#e8b84b]">{s.family}</p>
                <p className="mt-2 text-xs text-zinc-400">{s.grades.slice(0, 4).join(" · ")}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA — links to homepage contact section */}
        <section id="quote" className="mt-14 rounded-xl border border-white/10 bg-gradient-to-br from-[#1c1b1b] to-[#0e0e0e] p-6 text-center">
          <h2 className="text-xl font-bold">ขอใบเสนอราคา / ปรึกษางานหล่อ {m.family}</h2>
          <p className="mt-2 leading-7 text-zinc-300">
            ส่งรูปชิ้นงาน แบบ Drawing ขนาด วัสดุ จำนวน และรายละเอียดงานกลึง
            ทีมงานประเมินและเสนอราคาภายในเวลาทำการ
          </p>
          <a
            href="/#contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c72127] px-8 py-3 text-base font-bold text-white shadow-lg transition hover:bg-[#a91920]"
          >
            ติดต่อ / ขอใบเสนอราคา →
          </a>
        </section>
      </main>

      <footer className="mt-10 border-t border-white/10 bg-[#1c1b1b] px-4 py-8 text-sm text-zinc-400 sm:px-6">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p>© Success Casting / Success Network Co., Ltd.</p>
          <a
            href="https://www.successcasting.com/#contact"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#c72127]/60 bg-[#c72127]/10 px-5 py-2 text-sm font-semibold text-[#e8b84b] transition hover:bg-[#c72127] hover:text-white"
          >
            ติดต่อเรา / Contact →
          </a>
        </div>
      </footer>
    </div>
  );
}

