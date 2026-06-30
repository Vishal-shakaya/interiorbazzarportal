import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { SectionHeader } from "../SectionHeader";
import type { ReelItem } from "@/types/marketplace";
import { ShortsModal } from "./ShortsModal";

interface ShortsRowProps {
  /** Optional section header (rendered when title is provided). */
  eyebrow?: string;
  title?: ReactNode;
  moreTo?: string;
  reels: ReelItem[];
  /** Render a centered "Play all" pill below the row (prototype home behavior). */
  playAll?: boolean;
}

/** Horizontal row of portrait reel tiles; opens a modal player on click. */
export function ShortsRow({ eyebrow, title, moreTo, reels, playAll }: ShortsRowProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section>
      {title && <SectionHeader eyebrow={eyebrow} title={title} moreTo={moreTo} moreLabel="See all reels" />}

      <div className="flex gap-3 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reels.map((reel, i) => {
          const thumb = reel.youtubeId ? `https://i.ytimg.com/vi/${reel.youtubeId}/hqdefault.jpg` : null;
          return (
            <button
              key={reel.id}
              onClick={() => setOpen(i)}
              className="group relative aspect-[9/16] w-[248px] max-h-[440px] shrink-0 overflow-hidden rounded-[16px] text-left shadow-card transition-transform hover:scale-[1.02]"
              style={{ background: reel.bg }}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt={reel.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white/35">
                  <Icon name={reel.icon} size={56} stroke={1.2} />
                </div>
              )}

              {/* full-height legibility scrim */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/70" />

              {/* category pill */}
              {reel.kind && (
                <span className="absolute left-2.5 top-2.5 rounded-[5px] bg-ink/85 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-white backdrop-blur">
                  {reel.kind}
                </span>
              )}

              {/* rank badge */}
              {reel.rank != null && (
                <span className="absolute right-2.5 top-2.5 grid h-6 min-w-6 place-items-center rounded-full bg-black/45 px-1.5 text-[12px] font-bold text-white backdrop-blur">
                  {reel.rank}
                </span>
              )}

              {/* play */}
              <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest transition group-hover:scale-110">
                <Icon name="play" size={20} />
              </span>

              {/* caption */}
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="line-clamp-2 text-[15px] font-semibold leading-snug">{reel.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-white/85">
                  <span className="truncate">{reel.studio}</span>
                  {reel.rating != null && (
                    <>
                      <span className="h-[2px] w-[2px] rounded-full bg-white/60" />
                      <span className="inline-flex items-center gap-0.5">
                        <span className="text-amber">★</span>
                        {reel.rating}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {playAll && reels.length > 0 && (
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => setOpen(0)}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-2.5 text-[14.5px] font-semibold text-forest-deep transition hover:-translate-y-px hover:border-forest hover:text-forest"
          >
            <Icon name="play" size={16} /> Play all
          </button>
        </div>
      )}

      {open !== null && (
        <ShortsModal reels={reels} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}
    </section>
  );
}
