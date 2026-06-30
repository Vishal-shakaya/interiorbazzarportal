import { Link, useNavigate } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui";
import { SectionHeader } from "@/components/shared";
import { PAGES, toBlogPost } from "@/lib/constants";
import { useAsync } from "@/hooks/useAsync";
import { BlogService } from "@/api";

/* =========================================================================
   Home lower-half sections — ported 1:1 from the prototype home.html
   (Design inspiration · Social proof band · Feature strip · Written reviews
   · Final CTA band). Copy and styling match the prototype exactly.
   ========================================================================= */

const U = "https://images.unsplash.com/photo-";
const img = (id: string) => `${U}${id}?w=560&h=380&fit=crop&q=75`;

/* ── Design inspiration (bento grid: 1 large + 4 small) ─────────────────── */
interface Insp {
  title: string;
  image: string;
  bg: string;
  tag?: string;
  meta?: string[];
  metaSm?: string;
  large?: boolean;
}
const INSPIRATION: Insp[] = [
  {
    large: true,
    tag: "Editor's pick",
    title: "A minimalist Delhi villa designed for slow mornings",
    meta: ["4,200 sq ft", "Full home", "Gurgaon"],
    image: img("1583847268964-b28dc8f51f92"),
    bg: "linear-gradient(135deg,#04342c,#1d9e75)",
  },
  { title: "Modular kitchen transformation", metaSm: "★ 4.8 · 120 saves", image: img("1556909212-d5b604d0c90d"), bg: "linear-gradient(135deg,#3c3489,#7a6dd5)" },
  { title: "Boutique hotel in Rishikesh", metaSm: "★ 4.9 · 89 saves", image: img("1449157291145-7efd050a4d0e"), bg: "linear-gradient(135deg,#0b3560,#3a8fd4)" },
  { title: "Bedroom makeover", metaSm: "★ 4.7 · 200 saves", image: img("1631679706909-1844bbd07221"), bg: "linear-gradient(135deg,#5c3008,#d4823a)" },
  { title: "Sustainable office in Bangalore", metaSm: "★ 4.6 · 78 saves", image: img("1581858726788-75bc0f6a952d"), bg: "linear-gradient(135deg,#27500a,#5a9e1c)" },
];

export function InspirationGrid() {
  return (
    <section>
      <SectionHeader
        eyebrow="Get inspired"
        title={
          <>
            Design <em>ideas</em> &amp; projects
          </>
        }
        subtitle="Real homes, real projects — explore what's possible"
        moreTo={PAGES.EXPLORE}
      />
      <div className="grid auto-rows-[160px] grid-cols-2 gap-2.5 md:grid-cols-[1.6fr_1fr_1fr]">
        {INSPIRATION.map((it, i) => (
          <article
            key={it.title}
            className={cnRow(it.large, i)}
            style={{ background: it.bg }}
          >
            <img src={it.image} alt={it.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            {it.tag && (
              <span className="absolute left-3 top-3 rounded-full bg-forest px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.05em] text-white">
                {it.tag}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-3.5 text-white">
              <h3 className={it.large ? "font-editorial text-[22px] font-normal leading-[1.3]" : "text-[17.5px] font-bold leading-[1.3]"}>
                {it.title}
              </h3>
              {it.meta && (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[14px] text-white/80">
                  {it.meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              )}
              {it.metaSm && <p className="mt-1 text-[13px] text-white/75">{it.metaSm}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function cnRow(large?: boolean, i?: number) {
  const base =
    "group relative cursor-pointer overflow-hidden rounded-[12px] transition hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)]";
  // first (large) spans both rows on desktop; on mobile it spans both columns
  if (large) return `${base} col-span-2 row-span-2 md:col-span-1`;
  return base + (i === undefined ? "" : "");
}

/* ── Social proof band (6 stats) ───────────────────────────────────────── */
const PROOF = [
  ["500+", "Verified businesses"],
  ["₹120Cr+", "Projects facilitated"],
  ["4.8 ★", "Average platform rating"],
  ["18 states", "Businesses served across India"],
  ["< 4 hrs", "Average first response time"],
  ["3×", "Higher conversion vs cold calls"],
];

export function ProofBand() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-line bg-bone-card px-7 py-5">
      {PROOF.map(([n, l], i) => (
        <div key={l} className="flex items-center gap-4">
          {i > 0 && <span className="hidden h-10 w-px bg-line md:block" />}
          <div className="min-w-[80px] flex-1 text-center">
            <div className="font-editorial text-[30px] leading-none text-forest">{n}</div>
            <div className="mt-1.5 text-[13px] font-medium leading-snug text-muted">{l}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Feature strip ("The process, not the promise") ────────────────────── */
interface Feature {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  other: string;
}
const FEATURES: Feature[] = [
  { icon: "settings", iconBg: "#e1f5ee", iconColor: "#085041", title: "3-layer matching filter", desc: "We read interest, intent, and urgency — not just budget. Only people with a genuine reason to connect ever reach you.", other: "JustDial — unfiltered volume" },
  { icon: "whatsapp", iconBg: "#eeedfe", iconColor: "#3c3489", title: "WhatsApp-first delivery", desc: "Genuine connections go straight to your WhatsApp. The tool your team already uses — no new software to learn.", other: "Google Ads — only website traffic" },
  { icon: "insights", iconBg: "#faeeda", iconColor: "#854f0b", title: "ROI tracking dashboard", desc: "See where the process is working — who connected, who responded, who converted. Clarity in the places that matter.", other: "Social media — vanity metrics" },
  { icon: "city", iconBg: "#eaf3de", iconColor: "#27500a", title: "Local + global reach", desc: "Neighbourhood showroom traffic and international B2B catalogue orders — one profile handles both.", other: "GMB — local only" },
  { icon: "rosette", iconBg: "#e1f5ee", iconColor: "#085041", title: "Verified identity layer", desc: "GST, COA, MSME cross-verified. Your badge builds instant trust with buyers who've never heard of you before.", other: "Instagram — self-claimed only" },
  { icon: "phone", iconBg: "#b5d4f4", iconColor: "#185fa5", title: "Industry-specific platform", desc: "Built only for interior and sanitary. Every feature, every filter, every buyer — specific to your industry.", other: "Generic platforms — everyone" },
];

export function FeatureStrip() {
  return (
    <div className="relative overflow-hidden rounded-[18px] bg-forest-deep p-8">
      <div className="relative z-[2] mb-6">
        <div className="mb-2 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-green-mint before:h-px before:w-6 before:bg-green-mint before:content-['']">
          What makes IB different from every other platform
        </div>
        <h2 className="font-editorial text-[28px] font-normal leading-[1.15] text-white">
          The process, <em className="italic text-green-mint">not the promise</em>
        </h2>
      </div>
      <div className="relative z-[2] grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-[12px] border border-white/10 bg-white/5 p-4 transition hover:border-white/25 hover:bg-white/[0.09]">
            <div className="mb-3 grid h-[38px] w-[38px] place-items-center rounded-[10px]" style={{ background: f.iconBg, color: f.iconColor }}>
              <Icon name={f.icon} size={20} />
            </div>
            <h3 className="mb-2 text-[17px] font-bold text-white">{f.title}</h3>
            <p className="mb-2.5 text-[14px] leading-[1.65] text-white/70">{f.desc}</p>
            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-2.5">
              <span className="rounded-full bg-green-mint/10 px-2.5 py-0.5 text-[12px] font-bold text-green-mint">IB ✓</span>
              <span className="text-[13px] text-white/40 line-through">{f.other}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Written reviews ("What the numbers don't capture") ─────────────────── */
interface Written {
  initials: string;
  avatar: string;
  name: string;
  biz: string;
  tag: string;
  body: string;
  date: string;
  type: string;
  typeIcon: IconName;
}
const WRITTEN: Written[] = [
  {
    initials: "AP",
    avatar: "linear-gradient(135deg,#72243e,#b84d73)",
    name: "Mr. Anil Parekh",
    biz: "Home Sanitary World · Greater Kailash, Delhi",
    tag: "40% faster close",
    body: "What surprised me most was the quality of intent. When a buyer comes through IB they've already specified a brand — Kohler or Grohe — and they already know what they want. We're not educating the market anymore. We're just converting. In 6 months on our Autogrowth Scale plan our average deal value went up 28% because we stopped spending time on people who were never serious.",
    date: "May 2026",
    type: "Sanitary ware · Retail",
    typeIcon: "products",
  },
  {
    initials: "PS",
    avatar: "linear-gradient(135deg,#1a4206,#5a9e1c)",
    name: "Ar. Priya Sharma",
    biz: "Studio PS Architects · Bangalore",
    tag: "Pan-India projects",
    body: "I run a boutique architecture practice out of Bangalore. Before IB, my entire pipeline came from referrals — which meant I was always dependent on who my clients knew. Within 90 days of listing on IB I had inquiries from Pune, Hyderabad, and even one from Dubai. The platform genuinely extends your geographic reach in a way referrals never can.",
    date: "April 2026",
    type: "Architecture · Residential",
    typeIcon: "architects",
  },
  {
    initials: "VK",
    avatar: "linear-gradient(135deg,#04342c,#1d9e75)",
    name: "Mr. Vijay Kumar",
    biz: "VK Interior Works · Mumbai",
    tag: "3 hrs saved daily",
    body: "My sales team used to spend the first three hours of every day qualifying calls — asking people how serious they are, whether the project is real. IB does all of that before the connection even reaches us. We moved up from Autogrowth Launch to Scale after two months and the volume went up without the quality going down. That's rare.",
    date: "March 2026",
    type: "Turnkey · Commercial",
    typeIcon: "business",
  },
];

export function WrittenReviews() {
  return (
    <section>
      <div className="my-4 flex items-center gap-3.5">
        <span className="h-px flex-1 bg-line" />
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-1 text-[13px] font-bold uppercase tracking-[0.1em] text-muted">
          <Icon name="rosette" size={13} /> Detailed written reviews
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <SectionHeader
        eyebrow="In their words"
        title={
          <>
            What the <em>numbers don't capture</em>
          </>
        }
        subtitle="The detail behind the results — longer stories from business owners"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {WRITTEN.map((w) => (
          <article key={w.name} className="flex flex-col rounded-[14px] border border-line bg-bone-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[14px] font-bold text-white" style={{ background: w.avatar }}>
                {w.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-bold text-ink">{w.name}</div>
                <div className="text-[12.5px] text-muted">{w.biz}</div>
                <div className="text-[13px] tracking-[1px] text-amber">★★★★★</div>
              </div>
              <span className="shrink-0 rounded-full bg-sel-bg px-2.5 py-1 text-[11px] font-bold text-forest">{w.tag}</span>
            </div>
            <p className="mt-3 flex-1 text-[15px] leading-[1.75] text-ink/90">&ldquo;{w.body}&rdquo;</p>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[12.5px] text-muted">
              <span>{w.date}</span>
              <span className="inline-flex items-center gap-1">
                <Icon name={w.typeIcon} size={13} /> {w.type}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Final CTA band ────────────────────────────────────────────────────── */
const STEPS = [
  ["1", "You list your business", "profile, services, portfolio, coverage area"],
  ["2", "A buyer enters their project brief", "type, location, timeline"],
  ["3", "IB qualifies the connection", "interest, intent, and urgency"],
  ["4", "A genuine connection arrives on WhatsApp", "you respond, you convert"],
];

export function FinalCtaBand() {
  const navigate = useNavigate();
  return (
    <div
      className="relative grid grid-cols-1 items-center gap-9 overflow-hidden rounded-[20px] p-9 md:grid-cols-[1.2fr_1fr]"
      style={{ background: "linear-gradient(135deg,#04342c 0%,#085041 60%,#1d9e75 100%)" }}
    >
      <div className="relative z-[2]">
        <span className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-green-mint">
          <Icon name="sparkles" size={11} /> Join 500+ verified businesses
        </span>
        <h2 className="mb-2.5 font-editorial text-[36px] font-normal leading-[1.1] text-white">
          The right people are looking.
          <br />
          <em className="italic text-green-mint">Be where they find you.</em>
        </h2>
        <p className="mb-5 max-w-[440px] text-[18px] leading-[1.65] text-green-mint">
          Interior bazzar runs the process that attracts the right people, qualifies their interest, intent, and urgency
          — and connects the genuine ones to you. Not leads. Not numbers. A real process for a real industry.
        </p>
        <div className="mb-4 flex flex-wrap gap-2.5">
          <button
            onClick={() => navigate(PAGES.PLANS)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3.5 text-[17px] font-bold text-forest-deep transition hover:-translate-y-px hover:bg-green-mint"
          >
            Join the process <Icon name="arrow-right" size={16} />
          </button>
          <button
            onClick={() => navigate(PAGES.PLANS)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-6 py-3.5 text-[17px] font-bold text-white transition hover:border-white/50 hover:bg-white/10"
          >
            <Icon name="insights" size={16} /> View ROI calculator
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ["rosette", "Govt of India registered"],
            ["verified", "MSME certified"],
            ["verified", "GST verified"],
          ].map(([ic, label]) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold text-green-mint">
              <Icon name={ic as IconName} size={11} /> {label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-[2]">
        <div className="rounded-[16px] border border-white/15 bg-white/[0.08] p-5 backdrop-blur">
          <div className="mb-3 text-[15px] font-bold text-white">How matching works</div>
          {STEPS.map(([n, strong, rest]) => (
            <div key={n} className="mb-2.5 flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-mint text-[13px] font-bold text-forest-deep">{n}</span>
              <p className="text-[13.5px] leading-snug text-white/85">
                <strong className="font-semibold text-white">{strong}</strong> — {rest}
              </p>
            </div>
          ))}
          <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[13px] text-green-mint">
            <Icon name="clock" size={13} /> First genuine connection typically within 4 hours
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── From the journal (latest posts; hidden when there are none) ─────────── */
export function JournalSection() {
  const { data } = useAsync(() => BlogService.list(), []);
  const posts = (data ?? []).slice(0, 3);
  if (!posts.length) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="From the journal"
        title={
          <>
            Ideas for <em>your practice</em>
          </>
        }
        subtitle="Short, practical writing on winning and converting better work"
        moreTo={PAGES.BLOG}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={toBlogPost(p.slug)}
            className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-bone-card transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="aspect-[16/9] w-full" style={{ background: p.bg }} />
            <div className="flex flex-1 flex-col p-4">
              <span className="mb-2 inline-flex w-fit rounded-full bg-sel-bg px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-forest">
                {p.category}
              </span>
              <h3 className="line-clamp-2 font-editorial text-[18px] font-normal leading-[1.3] text-ink">{p.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.55] text-muted">{p.excerpt}</p>
              <div className="mt-auto flex items-center gap-2 pt-3 text-[12.5px] text-muted">
                <span>{p.date}</span>
                <span className="h-[2px] w-[2px] rounded-full bg-muted" />
                <span>{p.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
