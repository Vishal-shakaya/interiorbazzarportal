import { useNavigate } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { PagePath } from "@/lib/constants";
import { useHeroCarousel } from "./useHeroCarousel";

export interface HeroCta {
  label: string;
  to: PagePath;
  variant?: "primary" | "secondary";
}

export interface HeroSlide {
  id: string;
  /** Base theme gradient (shows under the photo / as fallback). */
  theme: string;
  /** Accent colour for eyebrow, sub copy, the emphasised title fragment and stat labels. */
  accent: string;
  /** Themed translucent scrim over the photo so the white text stays readable. */
  scrim: string;
  /** Full-bleed background photo. */
  bgImage: string;
  /** Floating preview card photo. */
  cardImage: string;
  eyebrow: string;
  icon: IconName;
  title: string;
  titleEm?: string;
  titleAfter?: string;
  sub: string;
  ctas: HeroCta[];
  stats?: { value: string; label: string }[];
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const navigate = useNavigate();
  const { index, go, setPaused } = useHeroCarousel(slides.length);
  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden rounded-[16px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div
        key={slide.id}
        className="relative grid min-h-[240px] grid-cols-1 items-center gap-7 px-8 py-6 md:grid-cols-[1.5fr_1fr]"
        style={{ background: slide.theme }}
      >
        {/* photographic background + themed scrim */}
        <img
          src={slide.bgImage}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="absolute inset-0" style={{ background: slide.scrim }} aria-hidden />

        {/* copy */}
        <div className="relative z-[2] text-white">
          <span
            className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: slide.accent }}
          >
            <Icon name={slide.icon} size={13} /> {slide.eyebrow}
          </span>
          <h1 className="font-editorial text-[30px] font-normal leading-[1.12] tracking-[-0.01em] text-white">
            {slide.title}{" "}
            {slide.titleEm && (
              <em className="not-italic" style={{ color: slide.accent }}>
                <span className="italic">{slide.titleEm}</span>
              </em>
            )}
            {slide.titleAfter ? ` ${slide.titleAfter}` : ""}
          </h1>
          <p className="mt-2 max-w-[480px] text-[17px] leading-[1.55]" style={{ color: slide.accent }}>
            {slide.sub}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {slide.ctas.map((cta, i) => (
              <button
                key={cta.label}
                onClick={() => navigate(cta.to)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[15px] font-bold transition",
                  i === 0
                    ? "bg-white text-forest-deep hover:-translate-y-px"
                    : "border border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10",
                )}
              >
                {cta.label}
                {i === 0 && <Icon name="arrow-right" size={16} />}
              </button>
            ))}
          </div>

          {slide.stats && (
            <div className="mt-4 flex flex-wrap gap-6 border-t border-white/15 pt-3">
              {slide.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-editorial text-[20px] leading-none text-white">{s.value}</p>
                  <p className="mt-1 text-[13.5px] font-medium" style={{ color: slide.accent }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* floating preview card */}
        <div className="relative z-[2] hidden h-[172px] md:block">
          <div className="absolute left-1/2 top-2 w-[150px] -translate-x-1/2 -rotate-2 overflow-hidden rounded-[12px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <img src={slide.cardImage} alt="" loading="lazy" className="h-[96px] w-full object-cover" />
            <div className="p-2.5 text-ink">
              <p className="text-[13px] font-semibold leading-tight">
                {(slide.stats && slide.stats[0]?.value) || "Interior bazzar"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">Interior bazzar</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-sel-bg px-2 py-0.5 text-[11px] font-bold text-forest">
                <Icon name="verified" size={11} /> Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* progress bar (restarts each slide) */}
      <div
        key={`p-${slide.id}`}
        className="absolute bottom-0 left-0 z-10 h-[2.5px] bg-white/60"
        style={{ animation: "hero-progress 7s linear forwards" }}
      />

      {/* dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-5.5 bg-white" : "w-2 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
