import { permanentRedirect } from "next/navigation";

/**
 * Legacy catalog URLs → products page.
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  permanentRedirect("/products");
}
