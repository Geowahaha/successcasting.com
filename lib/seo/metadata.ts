import type { Metadata, ResolvingMetadata } from "next";
import { siteConfig } from "./site";

export type MetadataInput = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  noIndex?: boolean;
};

function joinTitle(title?: string) {
  if (!title) return siteConfig.defaultTitle;
  if (title.includes(siteConfig.name)) return title;
  return `${title} | ${siteConfig.name}`;
}

export function buildMetadata(input: MetadataInput): Metadata {
  const canonical =
    input.canonicalPath && input.canonicalPath.startsWith("/")
      ? input.canonicalPath
      : input.canonicalPath
        ? `/${input.canonicalPath}`
        : "/";

  const title = joinTitle(input.title);
  const description = input.description ?? siteConfig.defaultDescription;

  const metadataBaseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const urlBase = metadataBaseUrl?.replace(/\/+$/, "") ?? "";

  const canonicalUrl = urlBase ? `${urlBase}${canonical}` : canonical;

  const ogImages = input.images?.length
    ? input.images.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      }))
    : [{ url: `${urlBase}${siteConfig.defaultOgImage}` }];

  return {
    title,
    description,
    metadataBase: urlBase ? new URL(urlBase) : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.fullName,
      images: ogImages,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: input.noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : undefined,
  };
}

// Next can call generateMetadata with a resolver; we export a helper type to keep it consistent.
export type GenerateMetadata = (
  props: MetadataInput,
  parent: ResolvingMetadata,
) => Promise<Metadata> | Metadata;

