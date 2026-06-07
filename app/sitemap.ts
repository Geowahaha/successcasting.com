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
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    priority,
    changeFrequency,
  }));

  return staticRoutes;
}
