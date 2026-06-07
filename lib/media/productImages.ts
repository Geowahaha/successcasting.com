import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

type ProductImageManifestItem = {
  id?: string;
  nextjsSrc?: string;
};

type ProductImageManifest = {
  items?: ProductImageManifestItem[];
};

export type ManifestProductImageCard = {
  id: string;
  title: string;
  imageSrc: string;
  href: string;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitTokens(value: string) {
  return normalizeText(value).split("-").filter(Boolean);
}

const readManifestCached = cache(async (): Promise<ProductImageManifestItem[]> => {
  const manifestPath = path.join(
    process.cwd(),
    "public",
    "products",
    "generated",
    "manifest.nextjs.json",
  );

  try {
    const raw = await readFile(manifestPath, "utf-8");
    const parsed = JSON.parse(raw) as ProductImageManifest;
    return parsed.items?.filter((item) => typeof item.nextjsSrc === "string") ?? [];
  } catch {
    return [];
  }
});

function scoreItem(itemKey: string, productSlug: string, productName: string) {
  const key = normalizeText(itemKey);
  const slug = normalizeText(productSlug);
  const name = normalizeText(productName);
  const slugTokens = new Set(splitTokens(slug));
  const nameTokens = new Set(splitTokens(name));
  const keyTokens = splitTokens(key);

  let score = 0;
  if (key.includes(slug)) score += 10;
  if (slug.includes(key)) score += 4;
  if (key.includes(name)) score += 6;

  for (const token of keyTokens) {
    if (slugTokens.has(token)) score += 3;
    if (nameTokens.has(token)) score += 2;
  }
  return score;
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function titleFromId(id: string) {
  const cleaned = id
    .replace(/^original-/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!cleaned) return "Featured Product";
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getProductImageSrc(
  product: { slug: string; name: string },
  fallbackSrc = "/products/generated/default-product.webp",
) {
  const items = await readManifestCached();
  if (!items.length) return fallbackSrc;

  let bestSrc: string | null = null;
  let bestScore = -1;
  for (const item of items) {
    const src = item.nextjsSrc;
    if (!src) continue;
    const key = item.id ?? src;
    const score = scoreItem(key, product.slug, product.name);
    if (score > bestScore) {
      bestScore = score;
      bestSrc = src;
    }
  }

  if (!bestSrc || bestScore <= 0) {
    const pick = items[hashString(product.slug) % items.length];
    return pick?.nextjsSrc ?? fallbackSrc;
  }
  return bestSrc;
}

export async function getManifestProductImageCards(limit = 6): Promise<ManifestProductImageCard[]> {
  const items = await readManifestCached();
  return items
    .filter((item) => typeof item.nextjsSrc === "string")
    .slice(0, limit)
    .map((item, index) => {
      const id = item.id ?? `manifest-item-${index + 1}`;
      return {
        id,
        title: titleFromId(id),
        imageSrc: item.nextjsSrc as string,
        href: "/products",
      };
    });
}

