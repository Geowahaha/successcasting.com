import { prisma } from "@/lib/db/prisma";

type MediaCandidate = {
  sourceType: string;
  mediaType: "image" | "video";
  title: string;
  description?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  sourcePageUrl: string;
  sourceName?: string;
  license?: string;
  author?: string;
  tags?: string[];
  publishedAt?: Date;
};

const WIKIMEDIA_CATEGORIES = [
  "Category:Steel_casting",
  "Category:Metal_casting",
  "Category:Casting",
  "Category:Foundry_technology",
  "Category:Foundries",
  "Category:Steelmaking",
  "Category:Iron_casting",
  "Category:Stainless_steel",
  "Category:Induction_melting",
  "Category:Furnaces",
  "Category:Heat_treatment",
  "Category:Metalworking",
];

const CURATED_YOUTUBE = [
  {
    title: "Casting and Pouring Stainless Steel Parts at the Foundry",
    videoUrl: "https://www.youtube.com/watch?v=KEXANt8lqLI",
    videoId: "KEXANt8lqLI",
    sourceName: "YouTube",
  },
  {
    title: "Huge 6300 LB Foundry Pour of Duplex Stainless Steel Alloy",
    videoUrl: "https://www.youtube.com/watch?v=CrGWti6CmLU",
    videoId: "CrGWti6CmLU",
    sourceName: "YouTube",
  },
  {
    title: "Top Six Shocking Stainless Steel Casting and Factory Processes",
    videoUrl: "https://www.youtube.com/watch?v=4rAH9ZV4Zz8",
    videoId: "4rAH9ZV4Zz8",
    sourceName: "YouTube",
  },
];

async function fetchWikimediaImages(): Promise<MediaCandidate[]> {
  const all: MediaCandidate[] = [];
  for (const category of WIKIMEDIA_CATEGORIES) {
    const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=categorymembers&gcmtitle=${encodeURIComponent(
      category,
    )}&gcmtype=file&gcmlimit=8&prop=imageinfo&iiprop=url|extmetadata`;
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) continue;
    const json = (await response.json()) as {
      query?: {
        pages?: Record<
          string,
          {
            title: string;
            imageinfo?: Array<{
              url?: string;
              descriptionurl?: string;
              extmetadata?: Record<string, { value?: string }>;
            }>;
          }
        >;
      };
    };
    const pages = Object.values(json.query?.pages ?? {});
    for (const page of pages) {
      const info = page.imageinfo?.[0];
      if (!info?.url || !info?.descriptionurl) continue;
      all.push({
        sourceType: "wikimedia",
        mediaType: "image",
        title: page.title.replace(/^File:/, ""),
        mediaUrl: info.url,
        thumbnailUrl: info.url,
        sourcePageUrl: info.descriptionurl,
        sourceName: "Wikimedia Commons",
        license: info.extmetadata?.LicenseShortName?.value,
        author: info.extmetadata?.Artist?.value,
        tags: ["steel casting", "foundry", category.replace("Category:", "").toLowerCase()],
      });
    }
  }
  return all;
}

function extractXmlTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match?.[1]?.trim();
}

async function fetchYoutubeFeedItems(): Promise<MediaCandidate[]> {
  // Optional custom channels via env (comma separated channel IDs)
  const channels =
    process.env.MEDIA_YOUTUBE_CHANNEL_IDS?.split(",")
      .map((v) => v.trim())
      .filter(Boolean) ?? [];

  const results: MediaCandidate[] = [];
  for (const channelId of channels) {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
      channelId,
    )}`;
    const response = await fetch(feedUrl, { cache: "no-store" });
    if (!response.ok) continue;
    const xml = await response.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    for (const entry of entries.slice(0, 6)) {
      const videoId = extractXmlTag(entry, "yt:videoId");
      const title = extractXmlTag(entry, "title");
      const published = extractXmlTag(entry, "published");
      if (!videoId || !title) continue;
      results.push({
        sourceType: "youtube-rss",
        mediaType: "video",
        title,
        mediaUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        sourcePageUrl: `https://www.youtube.com/watch?v=${videoId}`,
        sourceName: "YouTube",
        license: "YouTube Standard",
        tags: ["foundry", "steel", "manufacturing"],
        publishedAt: published ? new Date(published) : undefined,
      });
    }
  }

  for (const item of CURATED_YOUTUBE) {
    results.push({
      sourceType: "youtube-curated",
      mediaType: "video",
      title: item.title,
      mediaUrl: item.videoUrl,
      thumbnailUrl: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
      sourcePageUrl: item.videoUrl,
      sourceName: item.sourceName,
      license: "YouTube Standard",
      tags: ["foundry", "steel", "casting"],
    });
  }

  return results;
}

function normalizeTags(input: MediaCandidate) {
  const base = `${input.title} ${input.description ?? ""}`.toLowerCase();
  const tags = new Set<string>((input.tags ?? []).map((t) => t.toLowerCase()));
  const keywords = [
    "steel",
    "stainless",
    "foundry",
    "casting",
    "furnace",
    "melting",
    "pouring",
    "mold",
    "mould",
    "machining",
    "metal",
    "manufacturing",
    "heat treatment",
    "quality",
    "automation",
    "ai",
    "oem",
    "defect",
    "induction",
    "heat",
    "qa",
  ];
  for (const k of keywords) {
    if (base.includes(k)) tags.add(k);
  }
  return Array.from(tags).slice(0, 16);
}

function calculateHotScore(input: MediaCandidate, tags: string[]) {
  const now = Date.now();
  const published = input.publishedAt?.getTime() ?? now;
  const ageDays = Math.max(0, (now - published) / (1000 * 60 * 60 * 24));
  const freshness = Math.max(0, 30 - ageDays) / 30;
  const sourceWeight =
    input.sourceType === "wikimedia" ? 0.8 : input.sourceType === "youtube-rss" ? 0.9 : 0.75;
  const signalKeywords = new Set([
    "steel",
    "stainless",
    "foundry",
    "casting",
    "furnace",
    "melting",
    "pouring",
    "machining",
    "metal",
    "manufacturing",
    "heat treatment",
    "quality",
    "automation",
    "ai",
    "oem",
    "defect",
    "induction",
    "qa",
    "mold",
    "mould",
  ]);
  const tagSignal = tags.filter((t) => signalKeywords.has(t)).length;
  const industrialDensity = Math.min(1, tagSignal / 7);
  const engagementBonus = input.mediaType === "video" ? 0.06 : 0;

  return Number((freshness * 0.4 + sourceWeight * 0.25 + industrialDensity * 0.3 + engagementBonus).toFixed(4));
}

function fallbackMedia(): MediaCandidate[] {
  return [
    {
      sourceType: "wikimedia",
      mediaType: "image",
      title: "Electric induction furnace Sheffield",
      mediaUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Electric_induction_furnace_Sheffield.jpg",
      thumbnailUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Electric_induction_furnace_Sheffield.jpg",
      sourcePageUrl:
        "https://commons.wikimedia.org/wiki/File:Electric_induction_furnace_Sheffield.jpg",
      sourceName: "Wikimedia Commons",
      tags: ["induction furnace", "steel"],
    },
    {
      sourceType: "youtube",
      mediaType: "video",
      title: "Casting and Pouring Stainless Steel Parts at the Foundry",
      mediaUrl: "https://www.youtube.com/watch?v=KEXANt8lqLI",
      thumbnailUrl: "https://i.ytimg.com/vi/KEXANt8lqLI/hqdefault.jpg",
      sourcePageUrl: "https://www.youtube.com/watch?v=KEXANt8lqLI",
      sourceName: "YouTube",
      tags: ["casting", "foundry"],
    },
  ];
}

export async function refreshMediaAssetsFromInternet() {
  let items: MediaCandidate[] = [];
  try {
    const [wiki, yt] = await Promise.all([fetchWikimediaImages(), fetchYoutubeFeedItems()]);
    items = [...wiki, ...yt];
  } catch {
    items = [];
  }
  if (!items.length) items = fallbackMedia();

  let upserted = 0;
  try {
    for (const item of items) {
      await prisma.mediaAssets.upsert({
        where: { sourcePageUrl: item.sourcePageUrl },
        create: {
          sourceType: item.sourceType,
          mediaType: item.mediaType,
          title: item.title.slice(0, 240),
          description: item.description ?? null,
          mediaUrl: item.mediaUrl,
          thumbnailUrl: item.thumbnailUrl ?? null,
          sourcePageUrl: item.sourcePageUrl,
          sourceName: item.sourceName ?? null,
          license: item.license ?? null,
          author: item.author ?? null,
          tags: normalizeTags(item),
          hotScore: calculateHotScore(item, normalizeTags(item)),
          approvalStatus: "PENDING",
          publishedAt: item.publishedAt ?? null,
          isActive: true,
        },
        update: {
          title: item.title.slice(0, 240),
          description: item.description ?? null,
          mediaUrl: item.mediaUrl,
          thumbnailUrl: item.thumbnailUrl ?? null,
          sourceName: item.sourceName ?? null,
          license: item.license ?? null,
          author: item.author ?? null,
          tags: normalizeTags(item),
          hotScore: calculateHotScore(item, normalizeTags(item)),
          publishedAt: item.publishedAt ?? null,
          isActive: true,
          importedAt: new Date(),
        },
      });
      upserted += 1;
    }
  } catch {
    upserted = 0;
  }
  return { upserted };
}

