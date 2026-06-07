import type { Metadata } from "next";
import Link from "next/link";
import ProductsPageClient from "./ProductsPageClient";
import { MATERIAL_PAGES } from "@/lib/seo/materials";

// Short CDN cache so deploys propagate within ~1 min (avoids 1-year s-maxage / manual purge).
export const revalidate = 60;

const materialList = "FC15-30, FCD45-70, Sc46, S45c, S50c, Mo4140, 4340, SCMn, Cr28, ASTM A532 Class A, Ni-Hard, 1.4777 และ 1.4823";
const canonicalUrl = "https://www.successcasting.com/products";
const siteUrl = "https://www.successcasting.com";
const ogImage = `${siteUrl}/successcasting-assets/gpt-hero/success-fcd-wide.webp`;
const products = [
  ["FC15-30", "SUC Pulley — FC15-30 Gray Cast Iron", "Pulley / drive gear casting สำหรับระบบส่งกำลังโรงสีและเครื่องจักรอุตสาหกรรม วัสดุ FC15-30 ครอบคลุม FC150, FC200, FC250, FC300 เหมาะกับงานหล่อเทา ลดแรงสั่นสะเทือน กลึงต่อได้ดี และคุมต้นทุนได้จริง.", "/successcasting-assets/shopee-products/LINE_NOTE_260502_2.webp"],
  ["FCD45-70", "SUC Pulley — Ductile Iron", "FCD45-70 สำหรับพูลเล่ย์และชิ้นส่วนเครื่องจักรที่ต้องการความเหนียวและรับแรงกระแทกสูงกว่าเหล็กหล่อเทาทั่วไป ครอบคลุม FCD450, FCD500, FCD600 และ FCD700.", "/successcasting-assets/shopee-products/LINE_NOTE_260502_5.webp"],
  ["Sc46", "Cast Steel Machinery Parts", "Sc46 สำหรับงานเหล็กกล้าหล่อ ชิ้นส่วนรับแรง งานโครงสร้าง และงานโรงงานที่ต้องควบคุมกระบวนการผลิตอย่างจริงจัง.", "/successcasting-assets/shopee-products/LINE_NOTE_260502_10.webp"],
  ["S45c/S50c", "Machinery Shafts / Hubs / Carbon Steel Parts", "S45c และ S50c สำหรับชิ้นงานที่ต้องการความแข็งแรง งานกลึงต่อ งาน hub, shaft และอะไหล่เครื่องจักรตามแบบเฉพาะ.", "/successcasting-assets/shopee-products/LINE_NOTE_260502_15.webp"],
  ["Mo4140", "High Strength Heavy-Duty Components", "Mo4140, 4340 และ SCMn สำหรับงานหนัก งานแข็งแรงสูง ชิ้นส่วนเฉพาะทาง และงานซ่อมบำรุงที่ต้องลด downtime.", "/successcasting-assets/shopee-products/LINE_NOTE_260502_20.webp"],
  ["Cr28", "Wear Resistant Castings", "Cr28, ASTM A532 Class A และ Ni-Hard สำหรับชิ้นส่วนที่ต้องรับการเสียดสี งานสึกหรอสูง และสภาพใช้งานหนัก.", "/successcasting-assets/shopee-products/LINE_NOTE_260502_10.webp"],
  ["1.4777/1.4823", "Heat Resistant Castings", "1.4777, 1.4823 และ ASTM สำหรับงานทนความร้อนและชิ้นส่วนที่ใช้งานในสภาพอุณหภูมิสูง.", "/successcasting-assets/shopee-products/LINE_NOTE_260502_1.webp"],
] as const;

export const metadata: Metadata = {
  title: "รับหล่อโลหะ รับหล่อเหล็กตามแบบ | สินค้า Success Casting",
  description: `รับหล่อโลหะ รับหล่อเหล็กตามแบบ รับหล่อเหล็ก 1 ชิ้นขึ้นไป SUC Pulley และชิ้นส่วนเครื่องจักรอุตสาหกรรมจากวัสดุ ${materialList}`,
  alternates: { canonical: canonicalUrl },
  keywords: [
    "รับหล่อโลหะ",
    "รับหล่อเหล็ก",
    "รับหล่อเหล็กตามแบบ",
    "รับหล่อเหล็ก 1 ชิ้น",
    "โรงหล่อเหล็ก บางนา",
    "โรงหล่อเหล็ก บางพลี",
    "รับหล่อเหล็ก สมุทรปราการ",
    "รับหล่อ pulley",
    "หล่อเหล็ก FC FCD",
    "หล่ออะไหล่เครื่องจักร",
    "งานหล่อทราย",
    "OEM casting parts Thailand",
    "metal casting factory Thailand",
  ],
  openGraph: {
    title: "รับหล่อโลหะ รับหล่อเหล็กตามแบบ | Success Casting",
    description: `สินค้าและผลงานจริงของ Success Casting สำหรับงานหล่อเหล็ก พูลเล่ย์ เฟือง และอะไหล่เครื่องจักรจากวัสดุ ${materialList}`,
    url: canonicalUrl,
    type: "website",
    siteName: "Success Casting",
    locale: "th_TH",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Success Casting product portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "รับหล่อโลหะ รับหล่อเหล็กตามแบบ | Success Casting",
    description: "ผลงานสินค้า SUC Pulley งานหล่อเหล็กตามแบบ และอะไหล่เครื่องจักรอุตสาหกรรม",
    images: [ogImage],
  },
};

export default function ProductsPage() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Success Casting",
    legalName: "Success Network Co., Ltd.",
    url: siteUrl,
    logo: `${siteUrl}/successcasting-assets/logo/success-logo-og.webp`,
    image: ogImage,
    telephone: "+66-98-636-2356",
    email: "scnwmax@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "307/288 หมู่ที่ 11 ตำบลบางพลีใหญ่",
      addressLocality: "บางพลี",
      addressRegion: "สมุทรปราการ",
      postalCode: "10540",
      addressCountry: "TH",
    },
    areaServed: ["บางนา", "บางพลี", "สมุทรปราการ", "กรุงเทพมหานคร", "ประเทศไทย"],
    sameAs: ["https://www.facebook.com/profile.php?id=61589947250816", "https://line.me/R/ti/p/@SCNW"],
    knowsAbout: ["รับหล่อโลหะ", "รับหล่อเหล็กตามแบบ", "งานหล่อทราย", "FC15-30", "FCD45-70", "Sc46", "S45c", "S50c", "Mo4140", "Ni-Hard"],
  };
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "สินค้าและผลงาน Success Casting",
    url: canonicalUrl,
    inLanguage: "th-TH",
    description: `สินค้างานหล่อและชิ้นส่วนเครื่องจักร แยกตามวัสดุ ${materialList}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map(([material, title, description, image], index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${canonicalUrl}#products`,
        item: {
          // Custom made-to-order castings have no fixed price, so schema.org/Product
          // (which requires offers/review/aggregateRating) is not valid here. Use Thing
          // to keep the catalog rich-but-valid and avoid Search Console "Product" errors.
          "@type": "Thing",
          name: title,
          description,
          image: `${siteUrl}${image}`,
          url: `${canonicalUrl}#products`,
          additionalProperty: [
            { "@type": "PropertyValue", name: "Material group", value: material },
            { "@type": "PropertyValue", name: "Production type", value: "Custom casting by drawing, sample part, or repair requirement" },
          ],
        },
      })),
    },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Success Casting รับหล่อเหล็กตามแบบหรือไม่",
        acceptedAnswer: { "@type": "Answer", text: "รับหล่อเหล็กและโลหะตามแบบ จาก drawing รูปชิ้นงาน หรืออะไหล่เดิม พร้อมช่วยประเมินวัสดุและกระบวนการผลิตก่อนเสนอราคา" },
      },
      {
        "@type": "Question",
        name: "รับงานจำนวนน้อยหรือ 1 ชิ้นได้ไหม",
        acceptedAnswer: { "@type": "Answer", text: "รับบริการงานหล่อตั้งแต่ 1 ชิ้น เหมาะกับงานซ่อมบำรุง งานตัวอย่าง และอะไหล่เครื่องจักรที่ต้องการผลิตทดแทน" },
      },
      {
        "@type": "Question",
        name: "รองรับวัสดุอะไรบ้าง",
        acceptedAnswer: { "@type": "Answer", text: `รองรับวัสดุ ${materialList}` },
      },
    ],
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "หน้าแรก",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "สินค้าและบริการ",
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <ProductsPageClient />

      {/* Per-material SEO landing pages — gives Google a clear "index" with
          internal links to the 7 dedicated material pages. */}
      <section
        id="materials-index"
        aria-label="วัสดุที่รับหล่อ — รายละเอียดแต่ละชนิด"
        className="bg-[#0e0e0e] px-4 py-16 text-zinc-100 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e8b84b]">
            รายละเอียดวัสดุ
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            วัสดุที่รับหล่อ — เลือกดูตามชนิดเหล็ก
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
            แต่ละหน้ามีรายละเอียดเกรด มาตรฐานอ้างอิง คุณสมบัติทางเทคนิค
            และการใช้งานจริงแยกตามชนิดของเหล็ก
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MATERIAL_PAGES.map((m) => (
              <Link
                key={m.slug}
                href={`/products/${m.slug}`}
                className="group flex flex-col rounded-xl border border-white/10 bg-[#1c1b1b] p-5 transition hover:border-[#e8b84b]/50 hover:bg-[#222]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#e8b84b]">
                  {m.standard}
                </p>
                <h3 className="mt-1.5 text-lg font-bold text-white group-hover:text-[#e8b84b]">
                  {m.family}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {m.grades.slice(0, 4).join(" · ")}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#e8b84b] group-hover:gap-2 transition-all">
                  ดูรายละเอียด →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {[localBusinessJsonLd, collectionJsonLd, faqJsonLd, breadcrumbJsonLd].map((jsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
    </>
  );
}
