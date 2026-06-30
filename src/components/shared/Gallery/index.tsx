import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface GallerySlide {
  bg: string;
  icon?: IconName;
  image?: string;
}

interface GalleryProps {
  slides: GallerySlide[];
  /** Badges shown on the main image (e.g. "Bestseller", "IB Verified"). */
  badges?: string[];
}

/** Main image + thumbnail strip + arrows, with a full-screen lightbox. */
export function Gallery({ slides, badges = [] }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const slide = slides[active];

  const go = (i: number) => setActive(((i % slides.length) + slides.length) % slides.length);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-card" style={{ background: slide.bg }}>
        {slide.image ? (
          <img src={slide.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <button
            onClick={() => setLightbox(true)}
            className="grid h-full w-full place-items-center text-white/85"
            aria-label="Open image"
          >
            {slide.icon && <Icon name={slide.icon} size={84} stroke={1.1} />}
          </button>
        )}

        {badges.length > 0 && (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {badges.map((b) => (
              <span key={b} className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-forest">
                {b}
              </span>
            ))}
          </div>
        )}

        <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-[12px] text-white backdrop-blur">
          {active + 1} / {slides.length}
        </span>

        {slides.length > 1 && (
          <>
            <button
              onClick={() => go(active - 1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-forest hover:bg-white"
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-forest hover:bg-white"
            >
              <Icon name="chevron-right" size={20} />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[10px] border-2 text-white/80",
                i === active ? "border-forest" : "border-transparent opacity-70 hover:opacity-100",
              )}
              style={{ background: s.bg }}
            >
              {s.icon && <Icon name={s.icon} size={22} stroke={1.2} />}
            </button>
          ))}
        </div>
      )}

      {lightbox && <Lightbox slide={slide} onClose={() => setLightbox(false)} />}
    </div>
  );
}

function Lightbox({ slide, onClose }: { slide: GallerySlide; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-6" onClick={onClose}>
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white/80 hover:text-white">
        <Icon name="close" size={28} />
      </button>
      <div className="grid aspect-[4/3] w-full max-w-3xl place-items-center rounded-card text-white/85" style={{ background: slide.bg }}>
        {slide.icon && <Icon name={slide.icon} size={120} stroke={1} />}
      </div>
    </div>,
    document.body,
  );
}
