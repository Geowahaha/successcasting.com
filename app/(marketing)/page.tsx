import type { Metadata } from "next";
import { SuccessCastingHome } from "./SuccessCastingHome";

const siteUrl = "https://www.successcasting.com";
const canonicalUrl = `${siteUrl}/`;
const ogImage = `${siteUrl}/successcasting-assets/gpt-hero/molten-pour-1.webp`;
const materialList = "FC15-30, FCD45-70, Sc46, S45c, S50c, Mo4140, 4340, SCMn, Cr28, ASTM A532 Class A, Ni-Hard, 1.4777 และ 1.4823";
const title = "รับหล่อเหล็กอุตสาหกรรมทุกชนิด | โรงหล่อเหล็ก Success Casting";
const description = `Success Casting รับจ้างผลิตงานหล่อโลหะ งานหล่อทราย ชิ้นส่วนเครื่องจักร และอะไหล่ตามแบบ รองรับ ${materialList} รับงานตั้งแต่ 1 ชิ้น โทร 098-636-2356 หรือ 06-3989-1165 LINE @SCNW`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      th: canonicalUrl,
      en: `${canonicalUrl}?lang=en`,
    },
  },
  keywords: [
    "รับหล่อเหล็ก",
    "รับหล่อโลหะ",
    "รับหล่อเหล็กอุตสาหกรรม",
    "โรงหล่อเหล็ก",
    "รับจ้างผลิตงานหล่อโลหะ",
    "รับหล่อเหล็กตามแบบ",
    "งานหล่อทราย",
    "รับหล่อเหล็ก 1 ชิ้น",
    "รับหล่อ pulley",
    "หล่ออะไหล่เครื่องจักร",
    "เหล็กหล่อ FC",
    "เหล็กหล่อเหนียว FCD",
    "เหล็กทนสึก Cr28",
    "เหล็กทนความร้อน 1.4777 1.4823",
    "OEM casting parts Thailand",
    "metal casting factory Thailand",
  ],
  openGraph: {
    title,
    description,
    url: canonicalUrl,
    type: "website",
    siteName: "Success Casting",
    locale: "th_TH",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Success Casting molten metal foundry service" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function HomePage() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ManufacturingBusiness"],
    name: "Success Casting",
    legalName: "Success Network Co., Ltd.",
    url: siteUrl,
    logo: `${siteUrl}/successcasting-assets/logo/success-logo-og.webp`,
    image: ogImage,
    telephone: ["+66-98-636-2356", "+66-63-989-1165"],
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
    knowsAbout: [
      "รับหล่อเหล็ก",
      "รับหล่อโลหะ",
      "งานหล่อทราย",
      "รับหล่อเหล็กตามแบบ",
      "FC15-30",
      "FCD45-70",
      "Sc46",
      "S45c",
      "S50c",
      "Mo4140",
      "Cr28",
      "ASTM A532 Class A",
      "Ni-Hard",
      "1.4777",
      "1.4823",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+66-98-636-2356",
        email: "scnwmax@gmail.com",
        areaServed: "TH",
        availableLanguage: ["th", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+66-63-989-1165",
        email: "scnwmax@gmail.com",
        areaServed: "TH",
        availableLanguage: ["th", "en"],
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "รับหล่อเหล็กอุตสาหกรรมและชิ้นส่วนเครื่องจักรตามแบบ",
    provider: { "@type": "Organization", name: "Success Casting", url: siteUrl },
    areaServed: { "@type": "Country", name: "Thailand" },
    serviceType: "Industrial metal casting, sand casting, cast iron parts and machine component casting",
    description,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "กลุ่มวัสดุที่รับผลิต",
      itemListElement: [
        "FC15-30 เหล็กหล่อเทา",
        "FCD45-70 เหล็กหล่อเหนียว",
        "Sc46 / S45c / S50c / Mo4140 / 4340 / SCMn เหล็กกล้าหล่อ",
        "Cr28, ASTM A532 Class A, Ni-Hard เหล็กทนสึก",
        "1.4777 / 1.4823 เหล็กทนความร้อน",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
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
        acceptedAnswer: { "@type": "Answer", text: "รับหล่อเหล็กและโลหะตามแบบ จาก drawing รูปชิ้นงาน หรืออะไหล่เดิม พร้อมช่วยประเมินวัสดุ กระบวนการผลิต และงานกลึงก่อนเสนอราคา" },
      },
      {
        "@type": "Question",
        name: "รับงานหล่อจำนวนน้อยได้ไหม",
        acceptedAnswer: { "@type": "Answer", text: "รับบริการงานหล่อตั้งแต่ 1 ชิ้น เหมาะกับงานซ่อมบำรุง งานตัวอย่าง และชิ้นส่วนเครื่องจักรที่ต้องผลิตทดแทนจากของจริงหรือแบบ drawing" },
      },
      {
        "@type": "Question",
        name: "วัสดุที่รับผลิตมีอะไรบ้าง",
        acceptedAnswer: { "@type": "Answer", text: `รองรับวัสดุ ${materialList}` },
      },
      {
        "@type": "Question",
        name: "ต้องส่งข้อมูลอะไรเพื่อประเมินราคา",
        acceptedAnswer: { "@type": "Answer", text: "ส่งรูปชิ้นงาน แบบ drawing ขนาด วัสดุ จำนวนที่ต้องการ และรายละเอียดงานกลึงหรือสภาพใช้งาน ผ่าน LINE @SCNW หรือโทรติดต่อทีมงาน" },
      },
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Success Casting",
    url: siteUrl,
    inLanguage: "th-TH",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <SuccessCastingHome />
      {[localBusinessJsonLd, serviceJsonLd, faqJsonLd, websiteJsonLd].map((jsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
    </>
  );
}
