import { MATERIAL_SLUGS } from "@/lib/seo/materials";

function safeBaseUrl() {
  const url = process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? "https://www.successcasting.com";
  return url.replace(/\/+$/, "");
}

export default async function sitemap() {
  const baseUrl = safeBaseUrl();
  const now = new Date().toISOString();

  // Only the genuinely real, React-built Success Casting pages. ALL Stitch-iframe
  // routes (/about, /services, /blog, /rfq, /promotions) still render placeholder
  // templates with FAKE brands ("METALCAST THAI", "PRECISION FORGE",
  // "MOLTEN STEEL & FORGE", fake email/phone) and must NOT be indexed until rebuilt.
  // Also excludes /designs prototypes, legacy redirect slugs, /admin /api /dashboard.
  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/products", priority: 0.95, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    // Per-material SEO landing pages (real content, each targets distinct keywords)
    ...MATERIAL_SLUGS.map((slug) => ({
      path: `/products/${slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
    })),
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    priority,
    changeFrequency,
  }));

  return staticRoutes;
}
