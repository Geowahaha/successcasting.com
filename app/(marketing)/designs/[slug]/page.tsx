import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
import { StitchFrame } from "@/components/stitch/StitchFrame";
import { STITCH_PAGES, isStitchSlug } from "@/lib/stitch/manifest";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return STITCH_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = STITCH_PAGES.find((p) => p.slug === slug);
  if (!page) return { title: siteConfig.defaultTitle };
  return {
    title: `${page.title} | ${siteConfig.fullName}`,
    description: `${page.title} — design preview.`,
  };
}

export default async function DesignStitchPage({ params }: Props) {
  const { slug } = await params;
  if (!isStitchSlug(slug)) notFound();
  const page = STITCH_PAGES.find((p) => p.slug === slug)!;
  return <StitchFrame slug={slug} title={page.title} />;
}
