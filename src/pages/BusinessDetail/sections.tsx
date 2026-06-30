import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";

/* =========================================================================
   BusinessDetail sections — faithful rebuild of the prototype
   (Prototype/ib_prototype_7.2.1/pages/business-detail.html). Presentational
   only; the page passes the item's dynamic fields in via props.
   ========================================================================= */

/* ── small shared bits ─────────────────────────────────────────────── */

export function SecEyebrow({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <div className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.07em] text-forest">
      <Icon name={icon} size={14} /> {children}
    </div>
  );
}

export function SecHead({
  eyebrow,
  eyebrowIcon,
  title,
  link,
}: {
  eyebrow: string;
  eyebrowIcon: IconName;
  title: string;
  link?: { label: string; onClick: () => void };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <SecEyebrow icon={eyebrowIcon}>{eyebrow}</SecEyebrow>
        <h2 className="font-editorial text-[27px] font-normal leading-[1.15] tracking-[-0.01em] text-ink">{title}</h2>
      </div>
      {link && (
        <button
          onClick={link.onClick}
          className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-forest transition-all hover:gap-2 hover:text-forest-deep"
        >
          {link.label} <Icon name="arrow-right" size={15} />
        </button>
      )}
    </div>
  );
}

/* ── ABOUT ─────────────────────────────────────────────────────────── */

export interface SnapRow {
  k: string;
  v: string;
  good?: boolean;
}
export interface SpecItem {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}

export function AboutSection({
  about,
  aboutExtra,
  snap,
  specs,
}: {
  about: ReactNode;
  aboutExtra: ReactNode;
  snap: SnapRow[];
  specs: SpecItem[];
}) {
  return (
    <section className="scroll-mt-28 border-t border-line py-11 first:border-t-0">
      <div className="grid items-start gap-10 md:grid-cols-[1.7fr_1fr]">
        <div>
          <SecEyebrow icon="about">About the studio</SecEyebrow>
          <div className="space-y-4 text-[15.5px] leading-[1.75] text-ink/80 [&_strong]:font-semibold [&_strong]:text-ink">
            {about}
            {aboutExtra}
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { icon: "verified" as IconName, label: <><b className="font-bold">COA</b> registered</> },
              { icon: "invoice" as IconName, label: <><b className="font-bold">GST</b> active</> },
              { icon: "rosette" as IconName, label: "Professional liability insured" },
              { icon: "rocket" as IconName, label: <>Responds in <b className="font-bold">&lt;4h</b></> },
            ].map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-[13px] border border-line bg-bone-tint px-[15px] py-[11px] text-[13px] font-medium text-ink"
              >
                <Icon name={c.icon} size={17} className="text-forest" /> {c.label}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-[18px] border border-line bg-bone-card p-[22px] shadow-card">
          <div className="font-editorial text-[16px] font-semibold text-ink">At a glance</div>
          <div className="mb-4 text-[12.5px] leading-[1.5] text-muted">The essentials, before you reach out.</div>
          <div className="flex flex-col">
            {snap.map((r) => (
              <div
                key={r.k}
                className="flex items-center justify-between border-b border-dashed border-line py-2.5 text-[13px] last:border-b-0"
              >
                <span className="text-muted">{r.k}</span>
                <span className={cn("font-semibold", r.good ? "text-accent" : "text-ink")}>{r.v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-9">
        <SecEyebrow icon="services">What they specialize in</SecEyebrow>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((s) => (
            <div
              key={s.title}
              className="rounded-[16px] border border-line bg-bone-card p-[18px] transition hover:-translate-y-0.5 hover:border-green-mint hover:shadow-card"
            >
              <div
                className="mb-3 grid h-[42px] w-[42px] place-items-center rounded-[12px]"
                style={{ background: s.iconBg, color: s.iconColor }}
              >
                <Icon name={s.icon} size={21} />
              </div>
              <div className="mb-1 text-[14.5px] font-semibold text-ink">{s.title}</div>
              <div className="text-[12.5px] leading-[1.5] text-ink/80">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WORK ──────────────────────────────────────────────────────────── */

export interface ArchFeat {
  initials: string;
  name: string;
  role: string;
  tags: string[];
  quote: string;
}
export interface ProjectItem {
  bg: string;
  image: string;
  icon: IconName;
  tag: string;
  name: string;
  meta: string;
}

export function WorkSection({
  arch,
  projects,
  fullCount,
  onFullPortfolio,
  onProject,
}: {
  arch: ArchFeat;
  projects: ProjectItem[];
  fullCount: string;
  onFullPortfolio: () => void;
  onProject: (name: string) => void;
}) {
  return (
    <section className="scroll-mt-28 border-t border-line py-11">
      <div className="mb-6 grid items-center gap-6 rounded-[20px] border border-line bg-gradient-to-br from-bone-tint to-chip p-[26px] sm:grid-cols-[auto_1fr]">
        <div className="mx-auto grid h-[90px] w-[90px] place-items-center rounded-full bg-gradient-to-br from-forest to-accent font-editorial text-[32px] text-white sm:mx-0">
          {arch.initials}
        </div>
        <div>
          <div className="font-editorial text-[21px] font-semibold text-ink">{arch.name}</div>
          <div className="mb-3 text-[12.5px] text-muted">{arch.role}</div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {arch.tags.map((t) => (
              <span key={t} className="rounded-full bg-forest/10 px-2.5 py-1 text-[11px] font-semibold text-forest">
                {t}
              </span>
            ))}
          </div>
          <div className="font-editorial text-[15px] italic leading-[1.55] text-ink/80">{arch.quote}</div>
        </div>
      </div>

      <SecHead
        eyebrow="Selected work"
        eyebrowIcon="explore"
        title="Projects that show the range"
        link={{ label: `Full portfolio (${fullCount})`, onClick: onFullPortfolio }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <button
            key={p.name}
            onClick={() => onProject(p.name)}
            className="overflow-hidden rounded-[16px] border border-line bg-bone-card text-left transition hover:-translate-y-[3px] hover:shadow-pop"
          >
            <div className="relative flex h-[150px] items-center justify-center" style={{ background: p.bg }}>
              <img
                src={p.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <Icon name={p.icon} size={34} className="relative text-white/30" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-bold tracking-[0.02em] text-ink">
                {p.tag}
              </span>
            </div>
            <div className="px-4 py-3.5">
              <div className="mb-1 text-[14px] font-semibold text-ink">{p.name}</div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-muted">
                <Icon name="city" size={13} /> {p.meta}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ── OFFERINGS ─────────────────────────────────────────────────────── */

export interface ProductCard {
  image: string;
  bg: string;
  icon: IconName;
  iconColor: string;
  name: string;
  price: string;
}
export interface ServiceCard {
  icon: IconName;
  title: string;
  desc: string;
  price: string;
}
export interface CatalogueCard {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  meta: string;
}

export function ProductGrid({ items, onAsk }: { items: ProductCard[]; onAsk: (n: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {items.map((p) => (
        <button
          key={p.name}
          onClick={() => onAsk(p.name)}
          className="overflow-hidden rounded-[15px] border border-line bg-bone-card text-left transition hover:-translate-y-0.5 hover:border-green-mint hover:shadow-card"
        >
          <div className="relative flex h-[110px] items-center justify-center" style={{ background: p.bg }}>
            <img
              src={p.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <Icon name={p.icon} size={30} className="relative" style={{ color: p.iconColor }} />
          </div>
          <div className="px-3 py-3">
            <div className="mb-1 text-[13px] font-semibold leading-[1.3] text-ink">{p.name}</div>
            <div className="text-[13px] font-bold text-forest">{p.price}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function ServiceList({ items, onBook }: { items: ServiceCard[]; onBook: () => void }) {
  return (
    <>
      <div className="grid gap-3.5 md:grid-cols-2">
        {items.map((s) => (
          <div
            key={s.title}
            className="flex items-start gap-3.5 rounded-[15px] border border-line bg-bone-card p-4 transition hover:border-green-mint hover:shadow-card"
          >
            <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[12px] bg-green-light text-forest">
              <Icon name={s.icon} size={20} />
            </div>
            <div>
              <div className="mb-1 text-[14px] font-semibold text-ink">{s.title}</div>
              <div className="mb-1.5 text-[12px] leading-[1.45] text-ink/80">{s.desc}</div>
              <div className="text-[12.5px] font-bold text-forest">{s.price}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={onBook}
          className="inline-flex items-center gap-2 rounded-[10px] bg-forest px-5 py-3 text-[13.5px] font-semibold text-white transition hover:bg-forest-deep"
        >
          <Icon name="calendar" size={16} /> Book a consultation
        </button>
      </div>
    </>
  );
}

export function CatalogueList({ items, onView }: { items: CatalogueCard[]; onView: (n: string) => void }) {
  return (
    <div className="grid gap-3.5 md:grid-cols-2">
      {items.map((c) => (
        <button
          key={c.title}
          onClick={() => onView(c.title)}
          className="flex items-center gap-3.5 rounded-[15px] border border-line bg-bone-card p-[15px] text-left transition hover:border-green-mint hover:shadow-card"
        >
          <div
            className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-[12px]"
            style={{ background: c.iconBg, color: c.iconColor }}
          >
            <Icon name={c.icon} size={21} />
          </div>
          <div>
            <div className="mb-1 text-[13.5px] font-semibold text-ink">{c.title}</div>
            <div className="text-[11.5px] text-muted">{c.meta}</div>
          </div>
          <div className="ml-auto grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-green-light text-forest">
            <Icon name="download" size={18} />
          </div>
        </button>
      ))}
    </div>
  );
}

/* ── VISIT ─────────────────────────────────────────────────────────── */

export interface ContactRow {
  icon: IconName;
  k: string;
  v: string;
}
export interface HoursRow {
  d: string;
  t: ReactNode;
  today?: boolean;
}

export function VisitSection({
  contact,
  hours,
  onDirections,
  onBookVisit,
}: {
  contact: ContactRow[];
  hours: HoursRow[];
  onDirections: () => void;
  onBookVisit: () => void;
}) {
  return (
    <section className="scroll-mt-28 border-t border-line py-11">
      <SecHead
        eyebrow="Showroom & contact"
        eyebrowIcon="city"
        title="Come visit, or reach out"
        link={{ label: "Get directions", onClick: onDirections }}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[18px] border border-line bg-bone-card p-[22px] shadow-card">
          <div className="mb-4 flex items-center gap-2 font-editorial text-[16px] font-semibold text-ink">
            <Icon name="city" size={19} className="text-forest" /> Contact & location
          </div>
          {contact.map((r) => (
            <div key={r.k} className="flex items-center gap-3 border-b border-dashed border-line py-[11px] last:border-b-0">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-green-light text-forest">
                <Icon name={r.icon} size={17} />
              </div>
              <div>
                <div className="text-[11px] text-muted">{r.k}</div>
                <div className="text-[13.5px] font-medium text-ink">{r.v}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[18px] border border-line bg-bone-card p-[22px] shadow-card">
          <div className="mb-4 flex items-center gap-2 font-editorial text-[16px] font-semibold text-ink">
            <Icon name="clock" size={19} className="text-forest" /> Business hours
          </div>
          {hours.map((h, i) => (
            <div
              key={i}
              className={cn(
                "flex justify-between border-b border-dashed border-line py-2.5 text-[13px] last:border-b-0",
                h.today && "font-bold",
              )}
            >
              <span className="text-ink/80">{h.d}</span>
              <span className="font-medium text-ink">{h.t}</span>
            </div>
          ))}
          <div className="mt-4 rounded-[13px] bg-bone-tint p-[15px]">
            <div className="mb-1.5 text-[13.5px] font-semibold text-ink">Book a showroom visit</div>
            <div className="mb-3 text-[12px] leading-[1.5] text-ink/80">
              Walk-ins welcome during business hours. For a dedicated consultation, book a slot.
            </div>
            <button
              onClick={onBookVisit}
              className="inline-flex items-center gap-2 rounded-[10px] bg-forest px-5 py-3 text-[13.5px] font-semibold text-white transition hover:bg-forest-deep"
            >
              <Icon name="calendar" size={16} /> Book a visit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FINAL CTA ─────────────────────────────────────────────────────── */

export function FinalCta({
  sellerName,
  onEnquiry,
  onWhatsapp,
  onCall,
}: {
  sellerName: string;
  onEnquiry: () => void;
  onWhatsapp: () => void;
  onCall: () => void;
}) {
  return (
    <div
      className="relative my-11 overflow-hidden rounded-[24px] p-10"
      style={{ background: "linear-gradient(150deg,#04342c,#085041)" }}
    >
      <div className="relative grid items-center gap-9 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-2.5 font-editorial text-[28px] font-normal leading-[1.2] text-white">
            Like what you see? Start a conversation.
          </h2>
          <div className="mb-5 text-[14px] leading-[1.6] text-green-mint/90">
            Share your project type, budget, and timeline. We forward only serious enquiries — so when {sellerName}{" "}
            replies, you know it's a genuine fit.
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onEnquiry}
              className="inline-flex items-center gap-2 rounded-[14px] bg-white px-5 py-3 text-[13.5px] font-semibold text-forest-deep shadow-pop transition hover:-translate-y-0.5"
            >
              <Icon name="send" size={16} /> Send enquiry
            </button>
            <button
              onClick={onWhatsapp}
              className="inline-flex items-center gap-2 rounded-[14px] border border-white/30 bg-white/10 px-5 py-3 text-[13.5px] font-semibold text-white transition hover:bg-white/20"
            >
              <Icon name="whatsapp" size={16} /> WhatsApp
            </button>
            <button
              onClick={onCall}
              className="inline-flex items-center gap-2 rounded-[14px] border border-white/30 bg-white/10 px-5 py-3 text-[13.5px] font-semibold text-white transition hover:bg-white/20"
            >
              <Icon name="phone" size={16} /> Request a call
            </button>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11.5px] text-green-mint/80">
            <Icon name="lock" size={14} /> Your contact stays private until you choose to share it
          </div>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/[0.06] p-[22px]">
          <div className="mb-3.5 text-[11px] uppercase tracking-[0.06em] text-green-mint/80">What happens after enquiry</div>
          {[
            { icon: "invoice" as IconName, label: "Studio reviews your brief" },
            { icon: "clock" as IconName, label: "They respond within 4 hours" },
            { icon: "user" as IconName, label: "You decide if you want to continue" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 py-2 text-[13px] text-green-mint/90">
              <Icon name={s.icon} size={18} className="shrink-0 text-green-mint" /> {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
