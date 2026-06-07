import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = (process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? "https://www.successcasting.com").replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/dashboard"],
    },
    sitemap: `${site}/sitemap.xml`,
  };
}

