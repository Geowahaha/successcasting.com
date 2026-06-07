/** Stitch exports under public/stitch/<slug>/index.html */
export type StitchPage = { slug: string; title: string };

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const SLUGS = [
  "admin",
  "contact-technical-support",
  "suphancasting-ai-home",
  "home-contact-updated",
  "home-footer-with-contact-map",
  "home-footer-with-social-media-map",
  "home-smart-translator-implementation",
  "language-dropdown-demo",
  "location-facilities",
  "master-prototype-1",
  "master-prototype-2",
  "master-prototype-3",
  "master-prototype-admin",
  "master-prototype-map-clickable",
  "product-detail-catalog-download",
  "product-management-admin",
  "product-portfolio-gallery",
  "products-technical-specs",
  "products-technical-specs-new-design",
  "project-inquiry-updated-standards",
  "prototype-1",
  "prototype-2",
  "prototype-3",
  "prototype-4",
  "pump-housing-product-detail",
  "sand-casting-advantages-thai-primary",
  "sand-casting-detail-thai-primary",
  "sand-casting-primary-service-detail",
  "sand-casting-process-timeline",
  "sand-casting-technical-expertise",
  "section-1",
  "section-2",
  "section-4",
  "section-5",
  "services-contact-updated",
  "suphancasting-home-expertise-focus",
  "suphancasting-home-with-contact-map",
  "suphancasting-original-restored",
  "tools-resources-hub",
  "tools-resources-hub-english",
] as const;

export const STITCH_PAGES: StitchPage[] = SLUGS.map((slug) => ({
  slug,
  title: titleFromSlug(slug),
}));

export const STITCH_SLUG_SET = new Set<string>(SLUGS);

export function isStitchSlug(slug: string): boolean {
  return STITCH_SLUG_SET.has(slug);
}

/** Marketing routes → primary Stitch export slugs */
export const STITCH_ROUTE_SLUGS = {
  home: "suphancasting-ai-home",
  about: "location-facilities",
  services: "sand-casting-primary-service-detail",
  portfolio: "product-portfolio-gallery",
  contact: "services-contact-updated",
  rfq: "project-inquiry-updated-standards",
  blog: "tools-resources-hub",
  promotions: "sand-casting-advantages-thai-primary",
} as const;
