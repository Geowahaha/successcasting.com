import type { JsonLd } from "@/types/seo";
import { siteConfig } from "./site";

export function buildOrganizationJsonLd(): JsonLd {
  const siteUrl = (process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL)?.replace(/\/+$/, "") ?? "";
  const urlBase = siteUrl || "https://www.successcasting.com";

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ManufacturingBusiness"],
    name: siteConfig.name,
    legalName: "Success Network Co., Ltd.",
    url: urlBase,
    logo: `${urlBase}/successcasting-assets/logo/success-logo-og.webp`,
    image: `${urlBase}/successcasting-assets/gpt-hero/molten-pour-1.webp`,
    telephone: ["+66-98-636-2356", "+66-63-989-1165"],
    email: "scnwmax@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "250/8 ซอยกำนันวิฑูรย์ 1 หมู่ที่ 4 ตำบลบางบ่อ",
      addressLocality: "บางบ่อ",
      addressRegion: "สมุทรปราการ",
      postalCode: "10560",
      addressCountry: "TH",
    },
    sameAs: ["https://www.facebook.com/profile.php?id=61589947250816", "https://line.me/R/ti/p/@SCNW"],
  };
}

export function buildFAQJsonLd(params: {
  mainEntity: Array<{ q: string; a: string }>;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: params.mainEntity.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildProductJsonLd(params: {
  name: string;
  description?: string;
  sku?: string | null;
  brand?: string;
  url: string;
  imageUrl?: string | null;
}): JsonLd {
  const { name, description, sku, brand, url, imageUrl } = params;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: sku ?? undefined,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    url,
    image: imageUrl ?? undefined,
  };
}

