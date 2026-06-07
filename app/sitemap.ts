function safeBaseUrl() {
  const url = process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? "https://www.successcasting.com";
  return url.replace(/\/+$/, "");
}

export default async function sitemap() {
  const baseUrl = safeBaseUrl();
  const now = new Date().toISOString();

  // All real, public customer-facing routes. Exclude /designs prototype gallery,
  // legacy products/[slug] & blog/[slug] (permanent redirects), and /admin /api /dashboard.
  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/products", priority: 0.95, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" },
    { path: "/rfq", priority: 0.85, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/promotions", priority: 0.6, changeFrequency: "weekly" },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    priority,
    changeFrequency,
  }));

  return staticRoutes;
}
