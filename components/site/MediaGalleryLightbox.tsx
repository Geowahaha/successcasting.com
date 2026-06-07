"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export type FactoryGalleryImage = {
  id: string;
  title: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  sourcePageUrl: string;
  sourceName: string | null;
};

type Labels = {
  close: string;
  next: string;
  prev: string;
  viewSource: string;
  sourceLabel: string;
};

export function MediaGalleryLightbox({
  images,
  labels,
}: {
  images: FactoryGalleryImage[];
  labels: Labels;
  // locale is intentionally omitted: labels come from server i18n.
  // The component only concerns itself with interactions/UX.
}) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = images[selectedIndex];
  const count = images.length;

  const modalImageSrc = useMemo(() => {
    if (!selected) return "";
    return selected.thumbnailUrl ?? selected.mediaUrl;
  }, [selected]);

  useEffect(() => {
    if (!count) return;
    setSelectedIndex((i) => Math.max(0, Math.min(i, count - 1)));
  }, [count]);

  function openAt(index: number) {
    if (!count) return;
    setSelectedIndex(Math.max(0, Math.min(index, count - 1)));
    setOpen(true);
  }

  function goPrev() {
    if (!count) return;
    setSelectedIndex((i) => (i - 1 + count) % count);
  }

  function goNext() {
    if (!count) return;
    setSelectedIndex((i) => (i + 1) % count);
  }

  return (
    <>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => openAt(idx)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left"
            aria-label={`Open image: ${img.title}`}
          >
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={img.thumbnailUrl ?? img.mediaUrl}
                alt={img.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
              <div className="line-clamp-2 text-xs font-semibold text-white">{img.title}</div>
              <div className="mt-1 text-[11px] text-white/80">{img.sourceName ?? "Unknown"}</div>
            </div>
          </button>
        ))}
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0b0b0f]/95 p-4 shadow-xl"
            aria-label={selected?.title ?? "Media preview"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") goPrev();
              if (e.key === "ArrowRight") goNext();
            }}
          >
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white/95 line-clamp-2">
                      {selected.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-2">
                      {labels.sourceLabel}: {selected.sourceName ?? "Unknown"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog.Close asChild>
                      <Button variant="outline" className="border-white/15 text-white">
                        {labels.close}
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-black/60"
                    aria-label={labels.prev}
                  >
                    {labels.prev}
                  </button>

                  <img
                    src={modalImageSrc}
                    alt={selected.title}
                    className="max-h-[62vh] w-full object-contain rounded-xl border border-white/10 bg-black/20"
                  />

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-black/60"
                    aria-label={labels.next}
                  >
                    {labels.next}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={selected.sourcePageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    {labels.viewSource}
                  </a>

                  <div className="text-xs text-muted-2">
                    {selectedIndex + 1} / {count}
                  </div>
                </div>
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

