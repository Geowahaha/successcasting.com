import { permanentRedirect } from "next/navigation";

/**
 * Legacy catalog URLs → Stitch portfolio / sample detail.
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  permanentRedirect("/designs/product-portfolio-gallery");
}
