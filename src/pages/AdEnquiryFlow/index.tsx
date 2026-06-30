import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui";
import { PublicPage } from "@/components/shared";
import { cn } from "@/lib/cn";
import { PAGES, canonical } from "@/lib/constants";

const TIERS = [
  { key: "A", label: "A · Premium", rank: 5, name: "premium", sub: "premium · urgent", urgency: "within 30 days", score: 95, color: "bg-forest" },
  { key: "B", label: "B · High", rank: 4, name: "strong", sub: "strong", urgency: "within 30 days", score: 82, color: "bg-accent" },
  { key: "C", label: "C · Medium", rank: 3, name: "warm", sub: "warm", urgency: "30–90 days", score: 68, color: "bg-amber" },
  { key: "D", label: "D · Low", rank: 2, name: "cool", sub: "cool", urgency: "90+ days", score: 52, color: "bg-amber/70" },
  { key: "E", label: "E · Browsing", rank: 1, name: "browsing", sub: "browsing", urgency: "just browsing", score: 35, color: "bg-muted" },
];
const PLANS = [
  { key: "Dominance", rank: 5, sub: "exclusive" },
  { key: "Scale", rank: 4, sub: "full" },
  { key: "Launch", rank: 3, sub: "premium" },
  { key: "Trusted", rank: 2, sub: "premium" },
  { key: "Verified", rank: 1, sub: "limited" },
];

function priority(tierRank: number, planRank: number) {
  const score = tierRank + planRank;
  if (score >= 9) return { p: "P1", label: "Immediate", lane: "Director / senior closer", color: "bg-forest text-bone", pill: "bg-forest", exclusive: true };
  if (score >= 7) return { p: "P2", label: "Priority lane", lane: "Senior sales", color: "bg-accent text-white", pill: "bg-accent", exclusive: false };
  if (score >= 5) return { p: "P3", label: "Standard", lane: "Sales team", color: "bg-amber/20 text-amber", pill: "bg-amber", exclusive: false };
  if (score >= 3) return { p: "P4", label: "Shared", lane: "Shared pool", color: "bg-bone-tint text-ink", pill: "bg-line-strong", exclusive: false };
  return { p: "P5", label: "Pooled", lane: "General pool", color: "bg-line text-muted", pill: "bg-line", exclusive: false };
}

export default function AdEnquiryFlow() {
  const [tier, setTier] = useState(TIERS[0]);
  const [plan, setPlan] = useState(PLANS[0]);
  const result = priority(tier.rank, plan.rank);

  return (
    <div className="min-h-screen bg-bone pb-20">
      <PublicPage title="How enquiries become priority" canonicalUrl={canonical(PAGES.AD_ENQUIRY_FLOW)} noindex />

      {/* masthead */}
      <header className="relative overflow-hidden bg-gradient-to-br from-forest via-[#0a6a55] to-forest-deep px-4 py-12 text-bone md:px-7 md:py-14">
        <div className="pointer-events-none absolute -right-4 -top-1/3 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(159,225,203,.22),transparent_62%)]" />
        <div className="relative mx-auto max-w-shell">
          <Link
            to={`${PAGES.DASHBOARD_SELLER}?tab=enquiries`}
            className="mb-6 inline-flex items-center gap-2 text-[13.5px] font-semibold text-bone/85 transition hover:gap-2.5 hover:text-bone"
          >
            <Icon name="arrow-right" size={16} className="rotate-180" /> Back to dashboard
          </Link>
          <p className="mb-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.2em] text-green-mint">Attract · Qualify · Convert</p>
          <h1 className="mb-4 max-w-[18ch] font-editorial text-[34px] italic leading-[1.07] tracking-tight md:text-[52px]">
            How an ad enquiry becomes a <span className="not-italic text-green-mint">prioritised</span> enquiry
          </h1>
          <p className="max-w-[60ch] text-[16.5px] leading-relaxed text-bone/85">
            Every enquiry from a Google / Meta ad runs the same qualification engine — contact, genuineness, urgency. Its handling priority is then set by combining how well it qualified with the seller's subscription tier. Pick a scenario below to see the flow.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-shell space-y-10 px-4 py-9 md:px-7">
        {/* CONTROLS */}
        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-card border border-line bg-bone-card p-6 shadow-card">
            <h3 className="mb-1.5 text-[13px] font-extrabold uppercase tracking-wide text-ink">Buyer — qualification outcome</h3>
            <p className="mb-4 text-[13px] text-muted">The tier the engine assigns after the 3 filters.</p>
            <div className="flex flex-wrap gap-2.5">
              {TIERS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTier(t)}
                  className={cn(
                    "rounded-field border-[1.5px] px-4 py-2.5 text-center text-[14px] font-bold transition",
                    t.key === tier.key
                      ? "border-forest bg-forest text-bone shadow-btn"
                      : "border-line-strong bg-bone-card text-ink hover:-translate-y-px hover:border-green-mint",
                  )}
                >
                  {t.key}
                  <span className={cn("block text-[10.5px] font-medium tracking-wide", t.key === tier.key ? "text-bone/70" : "text-muted")}>{t.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-line bg-bone-card p-6 shadow-card">
            <h3 className="mb-1.5 text-[13px] font-extrabold uppercase tracking-wide text-ink">Seller — subscription</h3>
            <p className="mb-4 text-[13px] text-muted">The plan sets the network/priority lane.</p>
            <div className="flex flex-wrap gap-2.5">
              {PLANS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlan(p)}
                  className={cn(
                    "rounded-field border-[1.5px] px-4 py-2.5 text-center text-[14px] font-bold transition",
                    p.key === plan.key
                      ? "border-forest bg-forest text-bone shadow-btn"
                      : "border-line-strong bg-bone-card text-ink hover:-translate-y-px hover:border-green-mint",
                  )}
                >
                  {p.key}
                  <span className={cn("block text-[10.5px] font-medium tracking-wide", p.key === plan.key ? "text-bone/70" : "text-muted")}>{p.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FLOW */}
        <div className="space-y-10">
          {/* Stage 01 */}
          <Stage num="Stage 01" icon="send" title="Ad click → enquiry" connector>
            <p className="max-w-[76ch] text-[15px] leading-relaxed text-muted">
              A buyer clicks a Google Search or Meta ad, lands on the campaign page, and opens the Connect form. No budget is ever asked — by design.
            </p>
          </Stage>

          {/* Stage 02 */}
          <Stage num="Stage 02" icon="verified" title="Qualification engine" connector>
            <p className="text-[15px] leading-relaxed text-muted">Three filters run before the enquiry reaches any seller.</p>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
              <Filter label="Filter 1 — Contact" icon="phone" value="Phone OTP verified" />
              <Filter label="Filter 2 — Genuineness" icon="user" value="Real, coherent request" />
              <Filter label="Filter 3 — Urgency" icon="clock" value={tier.urgency} />
            </div>
            <div className="mt-3.5 flex items-center gap-2.5 rounded-field border border-[#f0dec3] bg-amber-light px-4 py-3 text-[13px] font-medium text-amber">
              <Icon name="minus" size={17} className="shrink-0" />
              Budget is never a filter — it is deliberately excluded so the engine doesn't pre-screen people by spend.
            </div>
          </Stage>

          {/* Stage 03 */}
          <Stage num="Stage 03" icon="insights" title="Score → qualification tier" connector>
            <p className="text-[15px] leading-relaxed text-muted">The filters produce a transparent additive score (0–100), mapped to a tier.</p>
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <div>
                <div className="font-editorial text-[60px] leading-none text-forest">{tier.score}</div>
                <div className="mt-1 text-[12.5px] text-muted">qualification score</div>
              </div>
              <span className={cn("inline-flex items-center gap-1.5 rounded-field px-5 py-2.5 text-[15px] font-bold text-white", tier.color)}>
                Tier {tier.key} — {tier.name}
              </span>
            </div>
          </Stage>

          {/* Stage 04 */}
          <Stage num="Stage 04" icon="rosette" title="Priority lane (tier × subscription)">
            <p className="text-[15px] leading-relaxed text-muted">
              The enquiry's handling priority combines its qualification tier with the seller's plan. A higher plan lifts a given enquiry into a faster lane and can route it exclusively.
            </p>
            <div className="relative mt-4 overflow-hidden rounded-card border-[2.5px] border-forest bg-bone-card px-6 py-9 text-center shadow-card">
              <div className="pointer-events-none absolute -right-[10%] -top-2/5 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(159,225,203,.24),transparent_65%)]" />
              <div className="relative">
                <p className="mb-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.18em] text-amber">Resulting priority</p>
                <div className="mb-1.5 font-editorial text-[80px] leading-none tracking-tight text-forest">{result.p}</div>
                <div className="mb-4 text-[22px] font-bold text-ink">{result.label}</div>
                <div className="inline-flex items-center gap-2 rounded-field border border-line bg-bone-card px-5 py-2.5 text-[14px] font-semibold text-ink">
                  <Icon name="user" size={16} className="text-forest" /> {result.lane}
                </div>
                <p className="mt-4 text-[13px] text-muted">
                  Tier <b>{tier.key}</b> × plan <b>{plan.key}</b> → priority score <b>{tier.rank + plan.rank}</b>
                </p>
                {result.exclusive && (
                  <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-field border border-green-mint bg-green-light px-4 py-2 text-[13px] font-bold text-forest">
                    <Icon name="lock" size={15} /> Routed exclusively — never shared with competitors
                  </div>
                )}
              </div>
            </div>
          </Stage>
        </div>

        {/* MATRIX */}
        <section>
          <h2 className="mb-2 font-editorial text-[26px] tracking-tight text-ink md:text-[32px]">The full priority matrix</h2>
          <p className="mb-5 max-w-[70ch] text-[14.5px] leading-relaxed text-muted">
            How every qualification tier maps to a priority lane across the subscription network tiers. This is the same logic the seller dashboard uses to badge each enquiry.
          </p>
          <div className="overflow-x-auto rounded-card border border-line shadow-card">
            <table className="w-full min-w-[560px] border-collapse text-center text-[13px]">
              <thead>
                <tr>
                  <th className="border border-line bg-forest p-3.5 text-[12.5px] font-bold text-bone">Qual ↓ / Plan →</th>
                  {PLANS.map((p) => (
                    <th key={p.key} className="border border-line bg-forest p-3.5 text-[12.5px] font-bold text-bone">
                      {p.key} ({p.sub})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.key}>
                    <th className="border border-line bg-bone p-3.5 text-left font-extrabold text-ink">Tier {t.key}</th>
                    {PLANS.map((p) => {
                      const r = priority(t.rank, p.rank);
                      const hot = t.key === tier.key && p.key === plan.key;
                      return (
                        <td
                          key={p.key}
                          className={cn("border border-line bg-bone-card p-2", hot && "outline outline-2 -outline-offset-2 outline-forest")}
                        >
                          <span className={cn("inline-block rounded-field px-2.5 py-1 text-[11.5px] font-extrabold text-white", r.pill)}>{r.p}</span>
                          <div className="mt-1 text-[10.5px] text-muted">{r.label}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-7 text-center text-[13px] text-muted">
            Computed live from the single source of truth shared with the seller dashboard.
          </p>
        </section>
      </div>
    </div>
  );
}

type StageProps = {
  num: string;
  icon: "send" | "verified" | "insights" | "rosette";
  title: string;
  connector?: boolean;
  children: React.ReactNode;
};

function Stage({ num, icon, title, connector, children }: StageProps) {
  return (
    <div className="relative">
      <div className="rounded-card border border-line bg-bone-card p-7 shadow-card md:px-8">
        <div className="mb-4 flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-card bg-green-light text-forest">
            <Icon name={icon} size={28} />
          </span>
          <div>
            <p className="mb-0.5 text-[12px] font-extrabold uppercase tracking-[0.15em] text-amber">{num}</p>
            <p className="font-editorial text-[23px] leading-tight text-ink md:text-[28px]">{title}</p>
          </div>
        </div>
        {children}
      </div>
      {connector && (
        <span className="absolute -bottom-[34px] left-1/2 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-forest text-bone shadow-btn">
          <Icon name="chevron-down" size={18} />
        </span>
      )}
    </div>
  );
}

function Filter({ label, icon, value }: { label: string; icon: "phone" | "user" | "clock"; value: string }) {
  return (
    <div className="rounded-field border border-green-mint bg-green-light p-4">
      <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-muted">{label}</div>
      <div className="flex items-center gap-1.5 text-[15px] font-bold text-forest">
        <Icon name={icon} size={18} /> {value}
      </div>
    </div>
  );
}
