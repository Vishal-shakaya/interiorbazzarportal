import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import { SectionHeader } from "@/components/shared";
import { cn } from "@/lib/cn";
import { HELP_CONTENT } from "@/content/help.content";

type Help = typeof HELP_CONTENT;

/* ───────────────────────── TOP RIBBON ───────────────────────── */
export function TopRibbon({
  ribbon,
  onChat,
  onFeedback,
}: {
  ribbon: Help["ribbon"];
  onChat: () => void;
  onFeedback: () => void;
}) {
  return (
    <div className="mb-1 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col">
        <span className="sec-eye">
          <span className="sec-eye-line" /> {ribbon.eyebrow}
        </span>
        <h1 className="sec-title text-[34px] md:text-[38px]">{emphasise(ribbon.title, ribbon.titleEm)}</h1>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted">{ribbon.subtitle}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onChat}
          className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-2 text-[12.5px] font-semibold text-bone transition hover:bg-forest-deep"
        >
          <Icon name="chat" size={14} /> Start 24/7 chat
        </button>
        <button
          onClick={onFeedback}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bone-card px-3.5 py-2 text-[12.5px] font-semibold text-ink transition hover:border-forest hover:text-forest"
        >
          <Icon name="feedback" size={14} /> Send feedback
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── HERO SEARCH ───────────────────────── */
export function HeroSearch({
  hero,
  query,
  onQuery,
  onTag,
}: {
  hero: Help["hero"];
  query: string;
  onQuery: (v: string) => void;
  onTag: (tag: string) => void;
}) {
  return (
    <div className="relative my-6 overflow-hidden rounded-card bg-gradient-to-br from-forest-deep to-forest px-7 py-8 text-bone shadow-card">
      <div className="pointer-events-none absolute -right-[5%] -top-[40%] h-[200%] w-3/5 rounded-full bg-[radial-gradient(circle,rgba(159,225,203,.18),transparent_60%)]" />
      <div className="relative z-[1] max-w-3xl">
        <span className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-green-mint">
          <Icon name="help" size={13} /> {hero.eyebrow}
        </span>
        <h2 className="mb-4 font-editorial text-[30px] font-normal leading-tight">
          {emphasise(hero.title, hero.titleEm, "text-green-mint italic")}
        </h2>
        <div className="flex max-w-xl items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1.5 pl-4.5 pr-1.5">
          <Icon name="search" size={16} className="text-white/70" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={hero.placeholder}
            className="flex-1 bg-transparent px-1 py-2.5 text-[14px] text-bone outline-none placeholder:text-white/50"
          />
          <button className="inline-flex items-center gap-1.5 rounded-full bg-green-mint px-4 py-2.5 text-[13px] font-bold text-forest-deep">
            Search <Icon name="arrow-right" size={14} />
          </button>
        </div>
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold text-green-mint">Popular:</span>
          {hero.tags.map((t) => (
            <button
              key={t}
              onClick={() => onTag(t)}
              className="hs-pop rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-medium text-bone transition hover:bg-white/20"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── CONTACT CHANNELS ─────────────────────── */
const CHANNEL_TINT: Record<string, string> = {
  chat: "bg-green-light text-forest",
  whatsapp: "bg-green-light text-forest",
  mail: "bg-chip text-amber",
  phone: "bg-chip text-forest",
};

export function ContactChannels({ contact, onAction }: { contact: Help["contact"]; onAction: () => void }) {
  return (
    <>
      <SectionHeader
        eyebrow="get in touch"
        title={
          <>
            Talk to <em>a human</em>
          </>
        }
      />
      <div className="mb-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {contact.map((ch) => (
          <button
            key={ch.title}
            onClick={onAction}
            className="rounded-card border border-line bg-bone-card p-5 text-left transition hover:-translate-y-0.5 hover:border-forest hover:shadow-card"
          >
            <span
              className={cn(
                "mb-3 grid h-10 w-10 place-items-center rounded-xl text-[19px]",
                CHANNEL_TINT[ch.icon] ?? "bg-green-light text-forest",
              )}
            >
              <Icon name={ch.icon} size={19} />
            </span>
            <p className="mb-0.5 font-editorial text-[18px]">{ch.title}</p>
            <p className="mb-2 text-[12.5px] leading-relaxed text-muted">{ch.text}</p>
            <p className="text-[11px] font-semibold text-muted">{ch.action}</p>
          </button>
        ))}
      </div>
    </>
  );
}

/* ──────────────────────── HELP TOPICS ──────────────────────── */
export function HelpTopics({ topics }: { topics: Help["topics"] }) {
  return (
    <>
      <SectionHeader
        eyebrow="by topic"
        title={
          <>
            Browse <em>help topics</em>
          </>
        }
        subtitle="Click a topic to see the full article list and step-by-step guides."
      />
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {topics.map((t) => (
          <button
            key={t.name}
            className="flex flex-col items-start gap-2 rounded-card border border-line bg-bone-card p-4 text-left transition hover:-translate-y-0.5 hover:border-forest hover:shadow-card"
          >
            <span className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-green-light text-[18px] text-forest">
              <Icon name={t.icon} size={18} />
            </span>
            <span className="text-[13.5px] font-bold text-ink">{t.name}</span>
            <span className="text-[11px] font-medium text-muted">{t.count}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ───────────────────────── FAQ + STATUS ───────────────────────── */
export function FaqAndStatus({
  faqs,
  categories,
  cat,
  onCat,
  query,
  status,
  onFeedback,
}: {
  faqs: HelpFaqList;
  categories: string[];
  cat: string;
  onCat: (c: string) => void;
  query: string;
  status: Help["status"];
  onFeedback: () => void;
}) {
  return (
    <div className="mb-8 grid gap-4.5 lg:grid-cols-[1.6fr_1fr]">
      {/* FAQ column */}
      <div>
        <SectionHeader
          eyebrow="top questions"
          title={
            <>
              FAQs <em>everyone asks</em>
            </>
          }
        />
        <div className="mb-3 flex flex-wrap gap-2">
          {["All", ...categories].map((k) => (
            <button
              key={k}
              onClick={() => onCat(k)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition",
                k === cat
                  ? "border-forest bg-forest text-bone"
                  : "border-line bg-bone-card text-ink hover:border-forest",
              )}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-card border border-line bg-bone-card">
          {faqs.length === 0 && (
            <p className="px-5 py-10 text-center text-[14px] text-muted">No articles match "{query}".</p>
          )}
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3.5 px-5 py-4 text-[14px] font-semibold text-ink transition hover:bg-bone group-open:text-forest">
                <span>{f.q}</span>
                <Icon
                  name="chevron-down"
                  size={16}
                  className="shrink-0 text-muted transition group-open:rotate-180 group-open:text-forest"
                />
              </summary>
              <p className="px-5 pb-4.5 text-[13px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Status column */}
      <div className="flex flex-col gap-3.5">
        <div className="rounded-card border border-line bg-bone-card p-5">
          <span className="mb-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-green-mint">
            <span className="h-2 w-2 rounded-full bg-green-mint shadow-[0_0_0_4px_rgba(16,122,91,.15)]" />
            {status.eyebrow}
          </span>
          <p className="mb-2 font-editorial text-[18px]">{emphasise(status.title, status.titleEm)}</p>
          <div className="flex flex-col gap-1.5">
            {status.items.map((s) => (
              <div key={s} className="flex items-center justify-between text-[12.5px]">
                <span className="text-ink">{s}</span>
                <span className="inline-flex items-center gap-1 font-bold text-forest">
                  <Icon name="check" size={13} /> Operational
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-line bg-green-light p-5">
          <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-bone-card text-amber">
            <Icon name="invoice" size={16} />
          </span>
          <p className="mb-1.5 font-editorial text-[17px]">
            <em className="text-amber">My tickets</em>
          </p>
          <p className="mb-3 text-[12.5px] leading-relaxed text-muted">
            You have <strong className="text-ink">1 open ticket</strong> · last reply 2 hr ago
          </p>
          <button
            onClick={onFeedback}
            className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-bone-card px-3 py-2.5 text-left transition hover:border-forest"
          >
            <span className="text-[11px] font-bold text-muted">#3482</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold text-ink">Can't change billing address</span>
              <span className="block text-[11px] text-muted">Billing · awaiting your reply</span>
            </span>
            <Icon name="arrow-right" size={14} className="text-amber" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── TUTORIALS ───────────────────────── */
export function Tutorials({ tutorials }: { tutorials: Help["tutorials"] }) {
  return (
    <>
      <SectionHeader
        eyebrow={tutorials.eyebrow}
        title={
          <>
            <em>2-minute</em> video tutorials
          </>
        }
      />
      <div className="mb-8 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {tutorials.items.map((t) => (
          <div
            key={t.title}
            className="relative flex aspect-[5/4] cursor-pointer flex-col justify-end overflow-hidden rounded-card bg-gradient-to-br from-ink to-forest-deep text-bone transition hover:-translate-y-0.5"
          >
            <span className="absolute right-2.5 top-2.5 z-[2] rounded-full bg-black/55 px-2 py-0.5 text-[10.5px] font-bold">
              {t.duration}
            </span>
            <span className="absolute left-1/2 top-1/2 z-[2] grid h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink">
              <Icon name="play" size={20} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/75" />
            <div className="relative z-[2] p-4">
              <p className="mb-0.5 text-[13.5px] font-bold leading-tight">{t.title}</p>
              <p className="text-[11px] opacity-85">{t.views}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────── COMMUNITY + FEEDBACK ─────────────────── */
export function CommunityAndFeedback({
  community,
  feedback,
  onFeedback,
}: {
  community: Help["community"];
  feedback: Help["feedback"];
  onFeedback: () => void;
}) {
  return (
    <div className="mb-8 grid gap-4.5 lg:grid-cols-2">
      <div className="rounded-card border border-line bg-bone-card p-6">
        <span className="mb-3 grid h-[38px] w-[38px] place-items-center rounded-xl bg-green-light text-forest">
          <Icon name="business" size={18} />
        </span>
        <p className="mb-1.5 font-editorial text-[20px]">{emphasise(community.title, community.titleEm)}</p>
        <p className="mb-3.5 text-[13px] leading-relaxed text-muted">{community.text}</p>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-2 text-[12.5px] font-semibold text-bone transition hover:bg-forest-deep">
            <Icon name="arrow-right" size={14} /> {community.primary}
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bone-card px-3.5 py-2 text-[12.5px] font-semibold text-ink transition hover:border-forest">
            <Icon name="bookmark" size={14} /> {community.secondary}
          </button>
        </div>
      </div>
      <div className="rounded-card border border-line bg-bone-card p-6">
        <span className="mb-3 grid h-[38px] w-[38px] place-items-center rounded-xl bg-chip text-amber">
          <Icon name="feedback" size={18} />
        </span>
        <p className="mb-1.5 font-editorial text-[20px]">
          <em className="text-amber">{feedback.titleEm}</em> feedback
        </p>
        <p className="mb-3.5 text-[13px] leading-relaxed text-muted">{feedback.text}</p>
        <button
          onClick={onFeedback}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber px-3.5 py-2 text-[12.5px] font-semibold text-bone transition hover:opacity-90"
        >
          {feedback.action} <Icon name="arrow-right" size={14} />
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── helpers ───────────────────────── */
type HelpFaqList = Help["faqs"];

/** Render `title` with the substring `em` wrapped in an emphasised <em>. */
function emphasise(title: string, em: string, cls = "text-forest italic"): ReactNode {
  const i = title.indexOf(em);
  if (i === -1) return title;
  return (
    <>
      {title.slice(0, i)}
      <em className={cls}>{em}</em>
      {title.slice(i + em.length)}
    </>
  );
}
