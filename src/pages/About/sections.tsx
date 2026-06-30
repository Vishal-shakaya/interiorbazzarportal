import { Link } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui";
import { PAGES } from "@/lib/constants";
import type { ABOUT_CONTENT } from "@/content/about.content";

type Content = typeof ABOUT_CONTENT;

/* ── HERO ── */
export function Hero({ hero }: { hero: Content["hero"] }) {
  return (
    <section className="relative text-center">
      <span className="eyebrow mb-4 inline-flex items-center gap-1.5 rounded-full bg-green-light px-3.5 py-1.5 text-[12px] text-forest">
        <Icon name="rosette" size={14} /> {hero.eyebrow}
      </span>
      <h1 className="font-editorial text-[clamp(34px,6vw,52px)] font-normal leading-[1.05] tracking-tight text-ink">
        {hero.title} <em className="text-forest italic">{hero.titleEm}</em>
      </h1>
      <p className="mx-auto mt-4 max-w-[56ch] text-[18px] leading-relaxed text-muted">{hero.lead}</p>

      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        {hero.trust.map((t) => (
          <span
            key={t.text}
            className="inline-flex items-center gap-1.5 rounded-full border border-green-mint bg-green-light px-3.5 py-1.5 text-[12.5px] font-semibold text-forest"
          >
            <Icon name={t.icon} size={14} /> {t.text}
          </span>
        ))}
      </div>

      <div
        className="relative mx-auto mt-9 flex h-[320px] w-full max-w-[680px] items-center justify-center overflow-hidden rounded-[20px] text-white"
        style={{ background: "linear-gradient(135deg,#085041 0%,#0a6a55 50%,#1d9e75 100%)" }}
      >
        <div className="relative z-[1] text-center">
          <div className="mb-1.5 font-editorial text-[clamp(40px,9vw,64px)] italic leading-none">
            {hero.graphicBig}
          </div>
          <div className="text-[14px] font-semibold uppercase tracking-[0.14em] opacity-90">
            {hero.graphicSmall}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── STATS STRIP ── */
export function StatsStrip({ stats }: { stats: Content["stats"] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-bone-card px-5 py-6 text-center">
          <div className="font-editorial text-[36px] leading-none text-forest">{s.value}</div>
          <div className="mt-1 text-[12.5px] font-semibold uppercase tracking-wide text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── SECTION HEADING (label + serif h2 with em) ── */
function SecHead({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="sec-eye">{label}</div>
      <h2 className="font-editorial text-[clamp(28px,5vw,36px)] font-normal leading-[1.1] tracking-tight text-ink">
        {children}
      </h2>
    </>
  );
}

/* ── PROBLEM / SOLUTION ── */
export function Problem({ problem }: { problem: Content["problem"] }) {
  return (
    <section>
      <SecHead label={problem.eyebrow}>
        {problem.title} <em className="text-forest italic">{problem.titleEm}</em>
      </SecHead>
      <p className="mt-3.5 max-w-[62ch] text-[16px] leading-[1.75] text-muted">{problem.lead}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[14px] border-[1.5px] p-[22px]" style={{ background: "#fff5f5", borderColor: "#fce4e4" }}>
          <div className="mb-2.5 text-[24px]">{problem.before.emoji}</div>
          <div className="mb-1.5 text-[15px] font-bold" style={{ color: "#b33" }}>
            {problem.before.title}
          </div>
          <div className="text-[13.5px] leading-relaxed text-muted">{problem.before.body}</div>
        </div>
        <div className="rounded-[14px] border-[1.5px] border-green-mint bg-green-light p-[22px]">
          <div className="mb-2.5 text-[24px]">{problem.after.emoji}</div>
          <div className="mb-1.5 text-[15px] font-bold text-forest">{problem.after.title}</div>
          <div className="text-[13.5px] leading-relaxed text-muted">{problem.after.body}</div>
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ── */
function StepList({ steps }: { steps: Content["how"]["columns"][number]["steps"] }) {
  return (
    <div className="relative flex flex-col">
      <span className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-forest to-green-mint" />
      {steps.map((s, i) => (
        <div key={s.title} className="relative flex items-start gap-5 pb-7 last:pb-0">
          <div className="relative z-[1] flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-forest font-editorial text-[15px] font-bold text-white">
            {i + 1}
          </div>
          <div>
            <strong className="mt-2 block text-[16px] font-bold text-ink">{s.title}</strong>
            <span className="text-[14px] leading-relaxed text-muted">{s.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function How({ how }: { how: Content["how"] }) {
  return (
    <section>
      <SecHead label={how.eyebrow}>
        {how.title}
        <br />
        <em className="text-forest italic">{how.titleEm}</em> {how.titleAfter}
      </SecHead>
      <div className="mt-6 grid gap-12 md:grid-cols-2">
        {how.columns.map((col) => (
          <div key={col.label}>
            <p className="mb-4 text-[13px] font-bold uppercase tracking-wide text-muted">{col.label}</p>
            <StepList steps={col.steps} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── VALUES ── */
export function Values({ values }: { values: Content["values"] }) {
  return (
    <section>
      <SecHead label={values.eyebrow}>
        {values.title} <em className="text-forest italic">{values.titleEm}</em>
      </SecHead>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {values.items.map((v) => (
          <div
            key={v.title}
            className="rounded-[14px] border-[1.5px] border-line bg-bone-card p-[22px] transition hover:-translate-y-0.5 hover:border-green-mint hover:shadow-card"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[12px] bg-green-light text-forest">
              <Icon name={v.icon} size={20} />
            </div>
            <div className="mb-1.5 text-[15px] font-bold text-ink">{v.title}</div>
            <div className="text-[13.5px] leading-relaxed text-muted">{v.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── TEAM ── */
export function Team({ team }: { team: Content["team"] }) {
  return (
    <section>
      <SecHead label={team.eyebrow}>
        {team.title} <em className="text-forest italic">{team.titleEm}</em> {team.titleAfter}
      </SecHead>
      <p className="mt-3.5 max-w-[62ch] text-[16px] leading-[1.75] text-muted">{team.lead}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.members.map((m) => (
          <div
            key={m.name}
            className={`rounded-[14px] border-[1.5px] p-[22px] text-center ${
              m.hiring ? "border-dashed border-line-strong bg-bone" : "border-line bg-bone-card"
            }`}
          >
            <div
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full font-editorial text-[22px] font-bold text-white"
              style={m.hiring ? { background: "#e5e2d9", color: "var(--color-muted)" } : { background: m.gradient }}
            >
              {m.hiring ? <Icon name="plus" size={20} /> : m.initials}
            </div>
            <div className="text-[15px] font-bold text-ink">{m.name}</div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-muted">{m.role}</div>
            <p className="mt-2 text-[13px] leading-snug text-muted">{m.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA ── */
export function Cta({ cta }: { cta: Content["cta"] }) {
  return (
    <section
      className="relative overflow-hidden rounded-[20px] px-6 py-12 text-center text-white md:px-10"
      style={{ background: "linear-gradient(135deg,#085041 0%,#0a6a55 55%,#04342c 100%)" }}
    >
      <h2 className="font-editorial text-[clamp(28px,5vw,38px)] italic leading-[1.1]">{cta.title}</h2>
      <p className="mx-auto mt-3 max-w-[48ch] text-[16px] leading-relaxed text-white/90">{cta.sub}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          to={PAGES.HOME}
          className="inline-flex items-center gap-2 rounded-full bg-white px-[26px] py-3.5 text-[15px] font-bold text-forest transition hover:-translate-y-px hover:bg-green-light"
        >
          <Icon name={cta.primary.icon} size={16} /> {cta.primary.label}
        </Link>
        <Link
          to={PAGES.PLANS}
          className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-[26px] py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:border-white hover:bg-white/10"
        >
          <Icon name={cta.ghost.icon} size={16} /> {cta.ghost.label}
        </Link>
      </div>
      <p className="mt-5 text-[13.5px] text-white/90">
        Contact us:{" "}
        <a href={`mailto:${cta.contactEmail}`} className="font-semibold text-green-mint">
          {cta.contactEmail}
        </a>{" "}
        ·{" "}
        <a href={`tel:${cta.contactPhone.replace(/\s/g, "")}`} className="font-semibold text-green-mint">
          {cta.contactPhone}
        </a>
      </p>
      <div className="mt-7 border-t border-white/20 pt-6">
        <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
          {cta.socialLabel}
        </span>
        <div className="mt-3.5 flex flex-wrap justify-center gap-3">
          {cta.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-forest"
            >
              <Icon name={s.icon as IconName} size={21} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
