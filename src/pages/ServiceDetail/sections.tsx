import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui";
import { PAGES } from "@/lib/constants";

/* ════════════════════════════════════════════════════════════
   Static content ported from the prototype service-detail.html.
   Dynamic fields (title, provider, rating…) come from the hook's
   item in index.tsx; this file holds the long-form editorial copy.
════════════════════════════════════════════════════════════ */

/* ── "What happens after you contact" steps (sd-process) ── */
export const AFTER_CONNECT = (provider: string): string[] => [
  "IB qualifies your interest and project intent automatically",
  `Your project brief is sent to ${provider}`,
  "Provider responds in your IB dashboard within 4 hours",
  "Your contact stays private until you choose to share it",
];

/* ── Trust strip (sd-trust) ── */
export const TRUST: { icon: IconName; label: string }[] = [
  { icon: "verified", label: "Secure connection" },
  { icon: "rosette", label: "IDA Certified" },
  { icon: "star-filled", label: "4.8 rating" },
  { icon: "clock", label: "On-time delivery" },
];

/* ── Overview description tags (desc-tags) ── */
export const DESC_TAGS = [
  "End-to-end design",
  "3D visualisation",
  "Material consultation",
  "Vendor coordination",
  "Site supervision",
  "Luxury residential",
  "Delhi NCR",
  "IDA Certified",
];

/* ── Full process steps (process-step-full) ── */
export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
  pills: { icon: IconName; label: string; warranty?: boolean }[];
}
export const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Discovery & briefing call",
    desc: "A 30-minute structured conversation to understand your lifestyle, taste, family dynamics, budget, and design priorities. We share a project brief document at the end. No commitment required.",
    pills: [
      { icon: "clock", label: "30 minutes · Day 1" },
      { icon: "check", label: "Free", warranty: true },
    ],
  },
  {
    num: "02",
    title: "Concept design & mood board",
    desc: "Full design concept document with reference imagery, colour palette direction, material samples, and style narrative. Up to 2 rounds of revisions included to finalise direction.",
    pills: [
      { icon: "clock", label: "4–7 days" },
      { icon: "history", label: "2 revision rounds" },
    ],
  },
  {
    num: "03",
    title: "3D visualisation & space plan",
    desc: "Photorealistic 3D renders of every room, complete furniture layout, lighting plan, and material specification. You see exactly what your home will look like before any work begins.",
    pills: [
      { icon: "clock", label: "10–14 days" },
      { icon: "check", label: "2 revisions included", warranty: true },
    ],
  },
  {
    num: "04",
    title: "Material & vendor finalisation",
    desc: "Showroom visits and material approval sessions. We coordinate with 40+ vetted vendors for furniture, lighting, soft furnishings, and finishes. All within your approved budget.",
    pills: [
      { icon: "clock", label: "7–10 days" },
      { icon: "user", label: "40+ vendor network" },
    ],
  },
  {
    num: "05",
    title: "Execution & site supervision",
    desc: "Daily site supervision throughout execution. Weekly client review calls. Photo updates on a dedicated WhatsApp group. All civil, carpentry, electrical, and finishing work managed end-to-end.",
    pills: [
      { icon: "clock", label: "30–40 days" },
      { icon: "explore", label: "Daily supervision" },
    ],
  },
  {
    num: "06",
    title: "Handover & styling",
    desc: "Final styling with soft furnishings, art placement, and curated decor. Professional photography of completed project. 1-year warranty on all execution work.",
    pills: [
      { icon: "photo", label: "Pro photography" },
      { icon: "verified", label: "1-year warranty", warranty: true },
    ],
  },
];

/* ── Portfolio grid (portfolio-grid) ── */
export interface PortfolioItem {
  bg: string;
  title: string;
  meta: string;
}
export const PORTFOLIO: PortfolioItem[] = [
  { bg: "linear-gradient(135deg,#085041,#1d9e75)", title: "Mehta Residence — 4BHK Luxury", meta: "Gurugram · 2,400 sqft" },
  { bg: "linear-gradient(135deg,#854f0b,#d4823a)", title: "Anand Villa — Contemporary", meta: "Noida · 3,200 sqft" },
  { bg: "linear-gradient(135deg,#3c3489,#7a6dd5)", title: "Sharma Apartment — Minimalist", meta: "Vasant Kunj · 1,400 sqft" },
  { bg: "linear-gradient(135deg,#0b3560,#3a8fd4)", title: "Kapoor House — Modern Classic", meta: "Greater Kailash · 2,800 sqft" },
  { bg: "linear-gradient(135deg,#27500a,#5a9e1c)", title: "Patel Penthouse — Bohemian", meta: "DLF Phase 5 · 3,800 sqft" },
  { bg: "linear-gradient(135deg,#72243e,#b84d73)", title: "Singh Master Suite", meta: "Defence Colony · 900 sqft" },
  { bg: "linear-gradient(135deg,#04342c,#1d9e75)", title: "Reddy Modular Kitchen", meta: "Hauz Khas · 220 sqft" },
  { bg: "linear-gradient(135deg,#5c3008,#d4823a)", title: "Bansal Family Lounge", meta: "Saket · 480 sqft" },
  { bg: "linear-gradient(135deg,#185fa5,#5a9bd9)", title: "Joshi Master Bathroom", meta: "Panchsheel Park · 180 sqft" },
];

/* ── About provider ── */
export const PROVIDER_STATS = [
  { num: "180+", label: "Projects done" },
  { num: "8", label: "Years active" },
  { num: "4.8★", label: "Average rating" },
  { num: "3", label: "Cities served" },
];
export const PROVIDER_BADGES: { label: string; icon?: IconName; grey?: boolean }[] = [
  { label: "IB Verified", icon: "verified" },
  { label: "IDA Member", icon: "rosette" },
  { label: "IDA Award 2024", icon: "rosette" },
  { label: "GST Registered", grey: true },
];
export const PROVIDER_DESC =
  "Founded in 2018 by Anita Verma (NID Ahmedabad, 2010) and Rohit Verma (Architecture, SPA Delhi, 2008), Verma Design Studio combines design rigour with construction expertise. The studio has grown to a team of 8 — 4 designers, 2 project managers, 1 visualiser, and 1 procurement specialist. Featured in Architectural Digest India, ELLE Decor, Better Homes, and Vogue India. The studio takes on a maximum of 6 projects per quarter to ensure quality and personal involvement on every project.";
export const PROVIDER_TEAM = [
  { bg: "linear-gradient(135deg,#085041,#1d9e75)", initials: "AV", name: "Anita Verma", role: "Co-founder, Lead Designer" },
  { bg: "linear-gradient(135deg,#3c3489,#7a6dd5)", initials: "RV", name: "Rohit Verma", role: "Co-founder, Architect" },
  { bg: "linear-gradient(135deg,#854f0b,#d4823a)", initials: "PM", name: "Priya Malhotra", role: "Senior Designer" },
];
export const PROVIDER_CONTACT: { icon: IconName; node: ReactNode }[] = [
  { icon: "city", node: "A-12, Lajpat Nagar Part II, New Delhi — 110024" },
  { icon: "clock", node: <>Mon–Sat: 10:00 AM – 7:00 PM<br />Sunday: By appointment</> },
  { icon: "explore", node: "www.vermadesignstudio.in" },
  { icon: "user", node: "@verma_design_studio · 48k" },
  { icon: "invoice", node: "GST: 07AAKCV5612N1ZH" },
];

/* ── FAQ (faq-list) ── */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What's included in the ₹85/sq ft price?",
    a: "The base price includes complete design service — discovery, concept design, 3D visualisation, material consultation, vendor coordination, and site supervision through to handover. It does not include the cost of materials, furniture, or labour, which are billed separately based on your approved selections. We provide a detailed BOQ before any execution begins.",
  },
  {
    q: "How long does a typical project take?",
    a: "For standard scope (full apartment, 1000–2500 sqft), expect 45–60 days from project kick-off to handover. The first 14 days are design and approvals, the next 30–40 are execution, and the final 7 are styling and finishing. Custom or larger projects can extend up to 90 days.",
  },
  {
    q: "Do you work outside Delhi NCR?",
    a: "Yes — we take on projects in Mumbai and Bengaluru subject to availability. Outstation projects include travel charges (₹15,000 per month per visit) and a slightly extended timeline. For very small projects (under 800 sqft), we may decline outstation work due to logistics.",
  },
  {
    q: "What's the payment schedule?",
    a: "25% on design contract signing (kicks off discovery + concept). 25% on 3D approval. 30% on execution start. 20% on handover. All payments are tracked on a shared portal. We do not require any upfront before the discovery call.",
  },
  {
    q: "What if I don't like the design?",
    a: "We include 2 rounds of revisions at each stage — concept, 3D, and material selection. If after 2 rounds you're still not satisfied, you can exit the engagement and the unspent portion of your design fee is refunded. We've had this happen exactly twice in 8 years — usually because of mismatch of taste, not quality.",
  },
  {
    q: "Is there a warranty on the execution work?",
    a: "1-year warranty on all execution work (civil, carpentry, electrical, plumbing). 2-year warranty on modular kitchen and wardrobe units. Soft furnishings, lighting, and decor follow respective vendor warranties. We provide a written warranty document at handover.",
  },
  {
    q: "Can I bring my own contractor?",
    a: "We typically don't recommend it — execution quality is the single biggest risk factor in interior projects and we have spent years building reliable vendor partnerships. However, if you have a trusted contractor, we can work in \"design-only\" mode where we provide drawings and supervision but don't manage execution. Price for design-only is 60% of the standard rate.",
  },
];

/* ════════════════════════════════════════════════════════════
   Tab panes
════════════════════════════════════════════════════════════ */

const PANEL = "rounded-card border border-line bg-bone-card p-5 shadow-card md:px-7";

export function OverviewPane({ description: _description }: { description: string }) {
  return (
    <div className={PANEL}>
      <p className="mb-3.5 font-editorial text-[17px] italic leading-relaxed text-forest-deep">
        "Beautiful spaces don't happen by accident — they happen through process, taste, and an
        obsessive attention to how people actually live."
      </p>
      <div className="space-y-3 text-[14px] leading-[1.85] text-ink">
        <p>
          End-to-end residential interior design that takes you from blank room to fully finished,
          photographed space. Verma Design Studio specialises in luxury Delhi NCR homes — combining
          contemporary aesthetics with traditional Indian sensibilities. Every project includes
          spatial planning, mood boarding, 3D visualisation, material consultation, vendor
          coordination, and on-site supervision through to handover.
        </p>
        <p>
          The studio works exclusively on residential projects — apartments from 800 sqft to villas
          above 5000 sqft. Each project gets a dedicated 3-person team (lead designer + junior
          designer + project manager) and a fixed timeline of 45–60 days from brief to handover for
          standard scope.
        </p>
        <p>
          Featured in Architectural Digest India, ELLE Decor, and Better Homes — Verma Design Studio
          has completed 180+ residential projects across Delhi NCR, Mumbai, and Bengaluru. Recipient
          of the Indian Design Award 2024 for "Best Residential Interior under ₹50 Lakhs".
        </p>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {DESC_TAGS.map((t) => (
          <span key={t} className="rounded-full border border-line bg-chip px-2.5 py-1 text-[12px] text-muted">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProcessPane() {
  return (
    <div className={PANEL}>
      <div className="divide-y divide-line">
        {PROCESS_STEPS.map((s) => (
          <div key={s.num} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-forest font-editorial text-[18px] font-bold text-bone">
              {s.num}
            </span>
            <div className="flex-1">
              <p className="mb-1 text-[16px] font-bold text-ink">{s.title}</p>
              <p className="mb-2 text-[13.5px] leading-[1.7] text-ink">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.pills.map((p) => (
                  <span
                    key={p.label}
                    className={
                      "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11.5px] " +
                      (p.warranty
                        ? "border-green-mint bg-green-light text-forest"
                        : "border-line bg-chip text-muted")
                    }
                  >
                    <Icon name={p.icon} size={12} className={p.warranty ? "text-forest" : "text-forest"} />
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioPane() {
  return (
    <div className={PANEL}>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
        {PORTFOLIO.map((p) => (
          <div
            key={p.title}
            className="group relative aspect-square overflow-hidden rounded-card"
            style={{ background: p.bg }}
          >
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-forest-deep/85 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
              <p className="text-[14px] font-bold leading-tight text-white">{p.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-white/70">
                <Icon name="city" size={12} /> {p.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProviderPane({ provider, onConnect }: { provider: string; onConnect: () => void }) {
  return (
    <div className={PANEL}>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-5 flex items-start gap-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[14px] border-2 border-green-mint bg-green-light text-[28px] font-bold text-forest">
              VD
            </span>
            <div>
              <p className="mb-1 text-[22px] font-bold text-ink">{provider}</p>
              <p className="mb-2 flex items-center gap-1.5 text-[13px] text-muted">
                <Icon name="business" size={14} className="text-forest" /> Residential Interior Design Studio · Lajpat Nagar, Delhi
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PROVIDER_BADGES.map((b) => (
                  <span
                    key={b.label}
                    className={
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold " +
                      (b.grey ? "border border-line bg-chip text-muted" : "bg-green-light text-forest")
                    }
                  >
                    {b.icon && <Icon name={b.icon} size={11} />}
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {PROVIDER_STATS.map((s) => (
              <div key={s.label} className="rounded-[12px] bg-chip p-3.5 text-center">
                <p className="font-editorial text-[24px] leading-none text-forest">{s.num}</p>
                <p className="mt-1 text-[11px] text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="mb-4.5 text-[13.5px] leading-[1.75] text-ink">{PROVIDER_DESC}</p>

          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-forest">
            <Icon name="user" size={13} /> Meet the team
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PROVIDER_TEAM.map((m) => (
              <div key={m.name} className="rounded-[12px] bg-chip p-3.5 text-center">
                <span
                  className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full text-[14px] font-bold text-white"
                  style={{ background: m.bg }}
                >
                  {m.initials}
                </span>
                <p className="text-[13px] font-bold text-ink">{m.name}</p>
                <p className="text-[11.5px] text-muted">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-card bg-chip p-4.5">
          <p className="mb-3 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.09em] text-ink">
            <Icon name="business" size={14} className="text-forest" /> Contact information
          </p>
          <ul className="divide-y divide-line">
            {PROVIDER_CONTACT.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 py-2.5 text-[13px] leading-relaxed text-ink">
                <Icon name={c.icon} size={16} className="mt-0.5 shrink-0 text-forest" />
                <span>{c.node}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={onConnect}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-forest px-4 py-3 text-[13.5px] font-bold text-bone transition hover:bg-forest-deep"
          >
            <Icon name="chat" size={15} /> Contact this provider
          </button>
        </aside>
      </div>
    </div>
  );
}

export function FaqPane() {
  return (
    <div className={PANEL}>
      <div className="space-y-2.5">
        {FAQ.map((f) => (
          <details
            key={f.q}
            className="group rounded-[12px] border border-line bg-chip px-4.5 py-3.5 open:border-green-mint open:bg-green-light"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <Icon name="chevron-down" size={18} className="shrink-0 text-forest transition group-open:rotate-180" />
            </summary>
            <p className="mt-2.5 border-t border-forest/15 pt-2.5 text-[13px] leading-[1.7] text-ink">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Suggestion rows (similar / provider / combined / recent)
════════════════════════════════════════════════════════════ */

interface SuggCard {
  cat: string;
  name: string;
  provider: string;
  price: string;
  unit: string;
  rat: number;
  bg: string;
}
export const SIMILAR_SERVICES: SuggCard[] = [
  { name: "Luxury Apartment Interior Design", cat: "Interior Design", price: "₹110", unit: "/sq ft", rat: 4.7, provider: "ArchKraft Studio", bg: "linear-gradient(135deg,#085041,#1d9e75)" },
  { name: "Boutique Residential Interiors", cat: "Interior Design", price: "₹95", unit: "/sq ft", rat: 4.9, provider: "Studio Bhargav", bg: "linear-gradient(135deg,#3c3489,#7a6dd5)" },
  { name: "Modern Minimalist Design", cat: "Interior Design", price: "₹75", unit: "/sq ft", rat: 4.5, provider: "Mehta Interiors", bg: "linear-gradient(135deg,#854f0b,#d4823a)" },
  { name: "Premium Villa Interior", cat: "Interior Design", price: "₹150", unit: "/sq ft", rat: 4.8, provider: "Anand Atelier", bg: "linear-gradient(135deg,#0b3560,#3a8fd4)" },
];
export const PROVIDER_SERVICES: SuggCard[] = [
  { name: "Modular Kitchen Design", cat: "Modular Kitchen", price: "₹1,950", unit: "/sq ft", rat: 4.7, provider: "Verma Design Studio", bg: "linear-gradient(135deg,#854f0b,#d4823a)" },
  { name: "Bedroom & Wardrobe Design", cat: "Interior Design", price: "₹65", unit: "/sq ft", rat: 4.8, provider: "Verma Design Studio", bg: "linear-gradient(135deg,#5c3008,#d4823a)" },
  { name: "3D Visualisation Only", cat: "3D Visualisation", price: "₹4,200", unit: "/room", rat: 4.9, provider: "Verma Design Studio", bg: "linear-gradient(135deg,#185fa5,#5a9bd9)" },
  { name: "Design Consultation", cat: "Consultation", price: "₹2,500", unit: "/hour", rat: 4.7, provider: "Verma Design Studio", bg: "linear-gradient(135deg,#085041,#1d9e75)" },
];

interface ScrollCard {
  name: string;
  price: string;
  bg: string;
}
export const COMBINED_SERVICES: ScrollCard[] = [
  { name: "Architectural Planning", price: "₹40/sq ft", bg: "linear-gradient(135deg,#3c3489,#7a6dd5)" },
  { name: "Modular Kitchen Install", price: "₹1,800/sq ft", bg: "linear-gradient(135deg,#854f0b,#d4823a)" },
  { name: "Premium Painting", price: "₹14/sq ft", bg: "linear-gradient(135deg,#5c3008,#d4823a)" },
  { name: "Lighting Design", price: "₹3,200/area", bg: "linear-gradient(135deg,#27500a,#5a9e1c)" },
  { name: "Soft Furnishings", price: "₹15,000+", bg: "linear-gradient(135deg,#04342c,#1d9e75)" },
  { name: "Post-construction Cleaning", price: "₹3/sq ft", bg: "linear-gradient(135deg,#27500a,#5a9e1c)" },
];
export const RECENT_SERVICES: ScrollCard[] = [
  { name: "3D Visualisation Service", price: "₹3,500/room", bg: "linear-gradient(135deg,#185fa5,#5a9bd9)" },
  { name: "Modular Kitchen Hub", price: "₹1,800/sq ft", bg: "linear-gradient(135deg,#854f0b,#d4823a)" },
  { name: "Turnkey Execution", price: "₹1,200/sq ft", bg: "linear-gradient(135deg,#0b3560,#3a8fd4)" },
  { name: "Vastu Consultation", price: "₹5,000", bg: "linear-gradient(135deg,#72243e,#b84d73)" },
];

export function SuggestionSection({
  title,
  emphasis,
  subtitle,
  moreLabel,
  moreTo,
  children,
}: {
  title: ReactNode;
  emphasis?: string;
  subtitle: string;
  moreLabel?: string;
  moreTo?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-11">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-editorial text-[25px] leading-none text-ink">
            {title} {emphasis && <em className="italic text-forest">{emphasis}</em>}
          </h2>
          <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
        </div>
        {moreLabel && moreTo && (
          <Link
            to={moreTo}
            className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-forest hover:underline"
          >
            {moreLabel} <Icon name="arrow-right" size={13} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function SuggGrid({ items }: { items: SuggCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((s) => (
        <Link
          key={s.name}
          to={PAGES.SERVICES}
          className="overflow-hidden rounded-card border border-line bg-bone-card transition hover:-translate-y-0.5 hover:border-green-mint hover:shadow-card"
        >
          <div className="relative flex h-[130px] items-center justify-center" style={{ background: s.bg }}>
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-forest/85 px-2 py-0.5 text-[9.5px] font-bold text-white backdrop-blur">
              <Icon name="verified" size={10} /> IB
            </span>
          </div>
          <div className="p-3">
            <p className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.08em] text-forest">{s.cat}</p>
            <p className="mb-1.5 line-clamp-2 text-[13.5px] font-semibold leading-tight text-ink">{s.name}</p>
            <p className="mb-2 flex items-center gap-1 text-[11.5px] text-muted">
              <Icon name="verified" size={11} className="text-forest" /> {s.provider}
            </p>
            <div className="flex items-center justify-between">
              <span>
                <span className="font-editorial text-[17px] text-forest">{s.price}</span>
                <span className="text-[11px] text-muted">{s.unit}</span>
              </span>
              <span className="flex items-center gap-1 text-[11.5px] text-muted">
                <Icon name="star-filled" size={11} className="text-amber" /> {s.rat}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ScrollRow({ items }: { items: ScrollCard[] }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((s) => (
        <Link
          key={s.name}
          to={PAGES.SERVICES}
          className="w-[220px] shrink-0 overflow-hidden rounded-[12px] border border-line bg-bone-card transition hover:-translate-y-0.5 hover:border-green-mint hover:shadow-card"
        >
          <div className="h-[120px]" style={{ background: s.bg }} />
          <div className="p-3">
            <p className="mb-1 line-clamp-2 text-[12.5px] font-semibold leading-snug text-ink">{s.name}</p>
            <p className="text-[13px] font-bold text-forest">{s.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
