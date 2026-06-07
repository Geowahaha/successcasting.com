import { permanentRedirect } from "next/navigation";

/**
 * Legacy SEO blog slugs → Stitch resources hub.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  permanentRedirect("/blog");
}
