function safeBaseUrl() {
  const url = process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? "https://www.successcasting.com";
  return url.replace(/\/+$/, "");
}

export default async function sitemap() {
  const baseUrl = safeBaseUrl();
  const now = new Date().toISOString();

  // Only real, branded Success Casting pages. Excludes /services, /blog, /rfq,
  // /promotions — those still render placeholder Stitch templates with a FAKE brand
  // ("PRECISION FORGE" / "MOLTEN STEEL & FORGE") and must not be indexed until rebuilt.
  // Also excludes /designs prototypes, legacy redirect slugs, /admin /api /dashboard.
  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/products", priority: 0.95, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    priority,
    changeFrequency,
  }));

  return staticRoutes;
}
