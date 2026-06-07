function safeBaseUrl() {
  const url = process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? "https://www.successcasting.com";
  return url.replace(/\/+$/, "");
}

export default async function sitemap() {
  const baseUrl = safeBaseUrl();
  const now = new Date().toISOString();

  // Keep this sitemap aligned with the currently intended public customer site.
  // Contact is a homepage section (#contact), and fragments are not useful in XML sitemaps,
  // so the homepage URL covers that section. Do not add prototype/placeholder routes here.
  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/#contact", priority: 0.9, changeFrequency: "monthly" },
    { path: "/products", priority: 0.95, changeFrequency: "weekly" },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    priority,
    changeFrequency,
  }));

  return staticRoutes;
}
