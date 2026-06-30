import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { youtubeId, instagramShortcode } from "@/lib/embed";
import type { ReelItem } from "@/types/marketplace";

interface ShortsModalProps {
  reels: ReelItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

function Embed({ reel }: { reel: ReelItem }) {
  const yt = reel.platform === "youtube" ? youtubeId(reel.url) : null;
  const ig = reel.platform === "instagram" ? instagramShortcode(reel.url) : null;

  if (yt) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
        title={reel.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (ig) {
    return <iframe className="h-full w-full" src={`https://www.instagram.com/reel/${ig}/embed`} title={reel.title} />;
  }
  if (reel.platform === "video" && reel.url) {
    return <video className="h-full w-full" src={reel.url} controls autoPlay />;
  }
  // placeholder
  return (
    <div className="grid h-full w-full place-items-center text-white/80" style={{ background: reel.bg }}>
      <Icon name={reel.icon} size={72} stroke={1.2} />
    </div>
  );
}

export function ShortsModal({ reels, index, onClose, onIndex }: ShortsModalProps) {
  const reel = reels[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % reels.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + reels.length) % reels.length);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, reels.length, onClose, onIndex]);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" onMouseDown={onClose}>
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white/80 hover:text-white">
        <Icon name="close" size={28} />
      </button>

      <button
        onClick={() => onIndex((index - 1 + reels.length) % reels.length)}
        aria-label="Previous"
        className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 md:left-8"
      >
        <Icon name="chevron-left" size={24} />
      </button>

      <div
        className="flex w-full max-w-4xl overflow-hidden rounded-card bg-bone-card shadow-card"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* portrait media */}
        <div className="aspect-[9/16] w-full max-w-[300px] shrink-0 bg-black">
          <Embed reel={reel} />
        </div>
        {/* meta */}
        <div className="hidden flex-1 flex-col gap-3 p-6 md:flex">
          <p className="eyebrow">{reel.studio}</p>
          <h3 className="display-2">{reel.title}</h3>
          <p className="flex items-center gap-2 text-[14px] text-muted">
            <Icon name="star-filled" size={15} className="text-amber" /> {reel.rating}
            {reel.city ? ` · ${reel.city}` : reel.views ? ` · ${reel.views} views` : ""}
          </p>
          <p className="text-[14px] text-muted">
            A quick look at recent work from {reel.studio}. Like what you see? Reach out to start a project.
          </p>
        </div>
      </div>

      <button
        onClick={() => onIndex((index + 1) % reels.length)}
        aria-label="Next"
        className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 md:right-8"
      >
        <Icon name="chevron-right" size={24} />
      </button>
    </div>,
    document.body,
  );
}
