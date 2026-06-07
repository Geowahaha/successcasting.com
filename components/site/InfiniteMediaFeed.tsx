"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MediaItem = {
  id: string;
  mediaType: string;
  title: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  sourcePageUrl: string;
  sourceName: string | null;
};

type Props = {
  initialItems: MediaItem[];
  locale: "th" | "en" | "zh";
  sourceLabel: string;
  noMediaLabel: string;
};

export function InfiniteMediaFeed({
  initialItems,
  locale,
  sourceLabel,
  noMediaLabel,
}: Props) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasMore && !loading) {
          setLoading(true);
          void fetch(`/api/media/list?page=${page}&pageSize=9`)
            .then((r) => r.json())
            .then((json: { items?: MediaItem[]; hasMore?: boolean }) => {
              const next = json.items ?? [];
              if (!next.length) {
                setHasMore(false);
                return;
              }
              setItems((prev) => [...prev, ...next]);
              setHasMore(Boolean(json.hasMore));
              setPage((p) => p + 1);
            })
            .catch(() => {
              setHasMore(false);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  const cards = useMemo(() => items, [items]);

  if (!cards.length) {
    return <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-2">{noMediaLabel}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((item) => {
          const isVideo = item.mediaType === "video";
          return (
            <a
              key={item.id}
              href={item.sourcePageUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
            >
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
                {isVideo ? (
                  <img
                    src={item.thumbnailUrl ?? ""}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={item.thumbnailUrl ?? item.mediaUrl}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="mt-3 text-sm font-semibold line-clamp-2">{item.title}</div>
              <div className="mt-1 text-xs text-muted-2">
                {sourceLabel}: {item.sourceName ?? (locale === "th" ? "ไม่ระบุ" : locale === "zh" ? "未注明" : "Unknown")}
              </div>
            </a>
          );
        })}
      </div>
      <div ref={sentinelRef} className="h-8" />
      {loading ? <div className="text-center text-xs text-muted-2">Loading...</div> : null}
    </div>
  );
}

