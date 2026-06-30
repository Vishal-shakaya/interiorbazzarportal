import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import { SectionHeader } from "../SectionHeader";
import { initialsOf } from "@/lib/listing";
import type { TestimonialItem } from "@/types/marketplace";

interface TestimonialsProps {
  items: TestimonialItem[];
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  moreTo?: string;
}

const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** Footer: avatar + name (verified) + business/role + rating. Shared by both card types. */
function Byline({ t }: { t: TestimonialItem }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white"
        style={{ background: t.bg }}
      >
        {initialsOf(t.name)}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1 truncate text-[14px] font-semibold text-ink">
          {t.name}
          {t.verified && <Icon name="verified" size={13} className="text-accent" />}
        </p>
        <p className="truncate text-[12px] text-muted">{t.business ?? `${t.role} · ${t.city}`}</p>
      </div>
      <span className="ml-auto flex items-center gap-1 text-[13px] text-ink">
        <Icon name="star-filled" size={13} className="text-amber" /> {t.rating}
      </span>
    </div>
  );
}

function VideoCard({ t }: { t: TestimonialItem }) {
  return (
    <figure className="flex flex-col gap-3 rounded-[14px] border border-line bg-bone-card p-3 transition hover:-translate-y-0.5 hover:shadow-card">
      <a
        href={t.youtubeId ? ytWatch(t.youtubeId) : undefined}
        target="_blank"
        rel="noreferrer"
        className="group relative block aspect-video overflow-hidden rounded-[10px]"
        style={{ background: t.bg }}
      >
        {t.youtubeId && (
          <img
            src={ytThumb(t.youtubeId)}
            alt={t.videoCaption ?? t.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />
        {/* play button */}
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-forest shadow-md transition group-hover:scale-110">
          <Icon name="play" size={22} />
        </span>
        {/* video tag */}
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
          <Icon name="play" size={11} /> Video
        </span>
        {t.videoCaption && (
          <p className="absolute inset-x-3 bottom-2.5 line-clamp-2 text-[14px] font-semibold leading-tight text-white">
            {t.videoCaption}
          </p>
        )}
      </a>
      <div className="px-1.5 pb-1">
        <Byline t={t} />
      </div>
    </figure>
  );
}

function TextCard({ t }: { t: TestimonialItem }) {
  return (
    <figure className="flex flex-col gap-3 rounded-[14px] border border-line bg-bone-card p-5 transition hover:-translate-y-0.5 hover:shadow-card">
      <Icon name="quote" size={26} className="text-green-mint" />
      <blockquote className="font-editorial text-[15px] italic leading-[1.65] text-ink">{t.quote}</blockquote>
      <div className="mt-auto pt-2">
        <Byline t={t} />
      </div>
    </figure>
  );
}

export function Testimonials({
  items,
  eyebrow = "Video stories",
  title = "Loved by homeowners & sellers",
  subtitle,
  moreTo,
}: TestimonialsProps) {
  return (
    <section>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} moreTo={moreTo} />
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((t) => (t.type === "video" ? <VideoCard key={t.id} t={t} /> : <TextCard key={t.id} t={t} />))}
      </div>
    </section>
  );
}
