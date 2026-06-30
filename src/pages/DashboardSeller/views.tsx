import { Link } from "react-router-dom";
import { Button, Input, Icon, AsyncBoundary, type IconName } from "@/components/ui";
import { useOverlays, Reviews } from "@/components/shared";
import { Panel, StatCard, EmptyState } from "@/components/dashboard/parts";
import { cn } from "@/lib/cn";
import { useAsync } from "@/hooks/useAsync";
import { DashboardService } from "@/api";
import { useAppSelector } from "@/redux/hooks";
import { selectAuth } from "@/redux/slice/authSlice";
import { useAlert } from "@/providers";
import { formatPrice } from "@/lib/listing";
import { PAGES } from "@/lib/constants";
import { resolveEntitlement, fmtLimit } from "@/content/entitlements.content";
import { PIPELINE_STAGES } from "@/content/dashboard-seller.content";

const tierStyle: Record<string, string> = {
  A: "bg-forest text-bone",
  B: "bg-sel-bg text-forest",
  C: "bg-amber/15 text-amber",
  D: "bg-line text-muted",
};

// Pipeline stage visual metadata — mirrors the prototype's 6-stage board.
const stageStyle: Record<string, { dot: string; ball: string }> = {
  new: { dot: "bg-[#0c447c]", ball: "bg-[#e8f0fa] text-[#0c447c]" },
  contacted: { dot: "bg-[#185fa5]", ball: "bg-[#e1ecf7] text-[#185fa5]" },
  quoted: { dot: "bg-[#8a4f12]", ball: "bg-[#fef4e8] text-[#8a4f12]" },
  meeting: { dot: "bg-[#4f2d7a]", ball: "bg-[#f3edfa] text-[#4f2d7a]" },
  won: { dot: "bg-forest", ball: "bg-sel-bg text-forest" },
  lost: { dot: "bg-muted", ball: "bg-line text-muted" },
};

function Meter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit === Infinity ? Math.min(100, (used / 120) * 100) : Math.min(100, (used / limit) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-[13px]">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-ink">{used} / {fmtLimit(limit)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <span className="block h-full rounded-full bg-forest" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PipeRow({ stageKey, label, count }: { stageKey: string; label: string; count: number }) {
  return (
    <Link to={`${PAGES.DASHBOARD_SELLER}?tab=pipeline`} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0 hover:bg-bone-tint/60">
      <span className={cn("h-2.5 w-2.5 rounded-full", stageStyle[stageKey]?.dot ?? "bg-muted")} />
      <span className="flex-1 text-[14px] text-ink">{label}</span>
      <span className="text-[14px] font-semibold text-forest tabular-nums">{count}</span>
    </Link>
  );
}

export function OverviewView() {
  const { data, status, retry } = useAsync(() => DashboardService.seller(), []);
  const enquiries = data?.enquiries ?? [];
  const pending = enquiries.filter((e) => e.priority === "P1" || e.priority === "P2");
  const stageCounts = Object.fromEntries(PIPELINE_STAGES.map((s) => [s.key, s.deals.length]));
  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="mail-opened" value="3" label="New enquiries" />
        <StatCard icon="chat" value="5" label="Active conversations" />
        <StatCard icon="rosette" value="2" label="Deals won this month" />
        <StatCard icon="trending" value="4.2×" label="Return on plan" />
      </div>

      {/* Cost of inaction banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-amber/40 bg-amber-light px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-card bg-amber/20 text-amber"><Icon name="clock" size={18} /></span>
          <div>
            <p className="text-[15px] font-semibold text-ink">₹8L <span className="font-normal text-muted">on the table</span></p>
            <p className="text-[13px] text-muted">{pending.length} qualified {pending.length === 1 ? "enquiry is" : "enquiries are"} waiting on your reply. Exclusive enquiries expire if unanswered.</p>
          </div>
        </div>
        <Link to={`${PAGES.DASHBOARD_SELLER}?tab=enquiries`}><Button size="sm">Reply now <Icon name="arrow-right" size={15} /></Button></Link>
      </div>

      {/* Two-column: needs attention + pipeline snapshot */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Needs your attention" action={<span className="text-[12px] text-muted">{pending.length} pending</span>}>
          <AsyncBoundary status={status} onRetry={retry} isEmpty={!pending.length} empty={<EmptyState icon="check" title="Inbox zero" text="No pending enquiries right now." />}>
            <ul className="divide-y divide-line">
              {pending.slice(0, 5).map((e) => (
                <li key={e.id}>
                  <Link to={`${PAGES.DASHBOARD_SELLER}?tab=enquiries`} className="flex items-center gap-3 py-3 hover:bg-bone-tint/60">
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold", tierStyle[e.tier])}>{e.tier}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-ink">{e.name}</p>
                      <p className="truncate text-[12px] text-muted">{e.need}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-amber"><Icon name="clock" size={12} /> {e.when}</p>
                    </div>
                    <Icon name="arrow-right" size={16} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </AsyncBoundary>
        </Panel>

        <Panel title="Pipeline snapshot" action={<Link to={`${PAGES.DASHBOARD_SELLER}?tab=pipeline`} className="text-[13px] font-medium text-forest hover:underline">Open</Link>}>
          <div>
            {PIPELINE_STAGES.map((s) => (
              <PipeRow key={s.key} stageKey={s.key} label={s.label} count={stageCounts[s.key]} />
            ))}
          </div>
        </Panel>
      </div>

      {/* ROI banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card p-6 text-white" style={{ background: "linear-gradient(120deg,#053b30,#1d9e75)" }}>
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80"><Icon name="trending" size={14} /> Plan ROI this period</p>
          <p className="text-[18px] font-bold">You closed ₹17L in deals on a ₹40k plan.</p>
          <p className="text-[14px] text-white/85">That's 4.2× return on your subscription.</p>
        </div>
        <Link to={`${PAGES.DASHBOARD_SELLER}?tab=billing`}><Button className="bg-white text-forest hover:bg-white/90" size="sm">View billing <Icon name="arrow-right" size={15} /></Button></Link>
      </div>
    </div>
  );
}

export function EnquiriesView() {
  const { openConnect } = useOverlays();
  const { data, status, retry } = useAsync(() => DashboardService.seller(), []);
  const enquiries = data?.enquiries ?? [];
  return (
    <Panel title="Qualified enquiries">
      <AsyncBoundary status={status} onRetry={retry} isEmpty={!enquiries.length} empty={<EmptyState icon="mail-opened" title="No enquiries yet" text="Qualified enquiries will appear here." />}>
        <ul className="divide-y divide-line">
          {enquiries.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className={cn("grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold", tierStyle[e.tier])}>{e.tier}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-ink">{e.need}</p>
                <p className="text-[12px] text-muted">{e.name} · {e.when}</p>
              </div>
              <span className="rounded-full bg-bone-tint px-2 py-0.5 text-[11px] font-semibold text-forest">Priority {e.priority}</span>
              <Button size="sm" onClick={() => openConnect({ intent: "project", sellerName: e.name })}>Respond</Button>
            </li>
          ))}
        </ul>
      </AsyncBoundary>
    </Panel>
  );
}

export function PipelineView() {
  const total = PIPELINE_STAGES.reduce((n, s) => n + s.deals.length, 0);
  const active = PIPELINE_STAGES.filter((s) => s.key !== "won" && s.key !== "lost").reduce((n, s) => n + s.deals.length, 0);
  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-6 rounded-card border border-line bg-bone-card px-5 py-4 shadow-card">
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted">Total</p>
          <p className="text-[22px] font-semibold text-forest tabular-nums">{total}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted">Active</p>
          <p className="text-[22px] font-semibold text-forest tabular-nums">{active}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-forest">Won value</p>
          <p className="text-[22px] font-semibold text-forest tabular-nums">₹17L</p>
        </div>
      </div>

      {/* Kanban board — 6 stages */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PIPELINE_STAGES.map((s) => {
          const st = stageStyle[s.key] ?? stageStyle.new;
          return (
            <div key={s.key} className="flex flex-col rounded-card border border-line bg-bone-tint/40">
              <div className="border-b border-line px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className={cn("grid h-6 w-6 place-items-center rounded-full text-[11px]", st.ball)}>{s.deals.length}</span>
                  <span className="flex-1 text-[14px] font-semibold text-ink">{s.label}</span>
                </div>
                <p className="mt-1 pl-8 text-[12px] text-muted">{s.desc}</p>
              </div>
              <div className="flex-1 space-y-2 p-3">
                {s.deals.length === 0 ? (
                  <p className="rounded-[10px] border border-dashed border-line py-5 text-center text-[12px] text-muted">No deals</p>
                ) : (
                  s.deals.map((d) => {
                    const [name, need] = d.split(" — ");
                    return (
                      <div key={d} className="rounded-[10px] border border-line bg-bone-card p-3 shadow-card">
                        <p className="text-[13px] font-semibold text-ink">{name}</p>
                        {need && <p className="text-[12px] text-muted">{need}</p>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AutogrowthView() {
  return (
    <Panel>
      <div className="flex flex-col items-start gap-3 rounded-card p-6 text-white" style={{ background: "linear-gradient(120deg,#053b30,#1d9e75)" }}>
        <Icon name="sparkles" size={28} />
        <h2 className="text-[22px] font-bold">Autogrowth is working for you</h2>
        <p className="max-w-md text-white/85">Your campaigns are live across Google & Meta. New qualified enquiries are routed straight to your inbox.</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <StatCard icon="insights" value="1.2K" label="Ad impressions" />
        <StatCard icon="send" value="48" label="Clicks" />
        <StatCard icon="mail-opened" value="9" label="Qualified leads" />
      </div>
    </Panel>
  );
}

const quoteStatus: Record<string, string> = { Sent: "bg-sel-bg text-forest", Accepted: "bg-forest text-bone", Draft: "bg-line text-muted" };

function QsKpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-card border border-line bg-bone-card p-4 shadow-card">
      <p className="text-[12px] text-muted">{label}</p>
      <p className="mt-1 text-[22px] font-semibold text-forest tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

const QS_FUNNEL: { label: string; count: number; pct: number }[] = [
  { label: "Sent", count: 3, pct: 100 },
  { label: "Viewed", count: 2, pct: 67 },
  { label: "Accepted", count: 1, pct: 33 },
];

export function QuotationsView() {
  const { data, status, retry } = useAsync(() => DashboardService.seller(), []);
  const quotations = data?.quotations ?? [];
  return (
    <div className="space-y-6">
      {/* Analytics KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <QsKpi label="Total sent" value="3" sub="vs prev 30d" />
        <QsKpi label="Acceptance rate" value="33%" sub="1 of 3 decided" />
        <QsKpi label="Total value" value="₹9.45L" sub="₹2.85L still open" />
        <QsKpi label="Avg accepted deal" value="₹5.40L" />
      </div>

      {/* Conversion funnel */}
      <Panel title="Conversion funnel">
        <div className="space-y-3">
          {QS_FUNNEL.map((s) => (
            <div key={s.label} className="grid grid-cols-[90px_1fr_72px] items-center gap-3">
              <span className="text-[13px] text-muted">{s.label}</span>
              <div className="h-5 overflow-hidden rounded-[7px] bg-bone-tint">
                <span className="block h-full rounded-[7px] bg-forest" style={{ width: `${s.pct}%` }} />
              </div>
              <span className="text-right text-[13px] font-semibold text-ink tabular-nums">{s.count} <span className="font-normal text-muted">({s.pct}%)</span></span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Your quotations"
        action={<Link to={PAGES.NEW_QUOTATION}><Button size="sm"><Icon name="plus" size={15} /> New quotation</Button></Link>}
      >
        <AsyncBoundary status={status} onRetry={retry} isEmpty={!quotations.length} empty={<EmptyState icon="invoice" title="No quotations yet" text="Quotations you create will appear here." />}>
          <ul className="divide-y divide-line">
            {quotations.map((q) => (
              <li key={q.id} className="flex items-center gap-3 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-card bg-sel-bg text-forest"><Icon name="invoice" size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-ink">{q.number}</p>
                  <p className="text-[12px] text-muted">{q.client} · {q.date}</p>
                </div>
                <span className="text-[14px] font-semibold text-forest">{formatPrice(q.amount)}</span>
                <span className={cn("rounded-full px-2.5 py-1 text-[12px] font-medium", quoteStatus[q.status])}>{q.status}</span>
              </li>
            ))}
          </ul>
        </AsyncBoundary>
      </Panel>
    </div>
  );
}

export function SellerReviewsView() {
  return (
    <Reviews
      rating={4.8}
      count={142}
      breakdown={[
        { stars: 5, pct: 78 },
        { stars: 4, pct: 15 },
        { stars: 3, pct: 4 },
        { stars: 2, pct: 2 },
        { stars: 1, pct: 1 },
      ]}
      reviews={[
        { name: "Asha Mehta", rating: 5, date: "2 weeks ago", text: "Beautiful work and clear communication throughout. Highly recommend." },
        { name: "Rohit P.", rating: 5, date: "1 month ago", text: "Delivered on time and on budget. The finish is excellent." },
        { name: "Sana M.", rating: 4, date: "2 months ago", text: "Great experience overall, a couple of minor delays but resolved well." },
      ]}
    />
  );
}

const FUNNEL: { label: string; n: number; icon: IconName }[] = [
  { label: "Enquiries received", n: 24, icon: "mail-opened" },
  { label: "Responded", n: 21, icon: "chat" },
  { label: "Quoted", n: 12, icon: "invoice" },
  { label: "Meeting", n: 6, icon: "calendar" },
  { label: "Won", n: 4, icon: "rosette" },
];

export function InsightsView() {
  const auth = useAppSelector(selectAuth);
  const ent = resolveEntitlement(auth.sellerPlan);
  const max = Math.max(...FUNNEL.map((f) => f.n));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="mail-opened" value="24" label="Verified enquiries" />
        <StatCard icon="insights" value="3,420" label="Listing views" />
        <StatCard icon="chat" value="88%" label="Response rate" />
        <StatCard icon="rosette" value="67%" label="Win rate" />
      </div>

      <Panel title="Enquiry conversion">
        <div className="space-y-3">
          {FUNNEL.map((f) => {
            const pct = Math.round((f.n / max) * 100);
            return (
              <div key={f.label} className="grid grid-cols-[150px_1fr_48px] items-center gap-3">
                <div className="flex items-center gap-2 text-[13px] text-muted">
                  <Icon name={f.icon} size={15} className="text-forest" /> {f.label}
                </div>
                <div className="h-6 overflow-hidden rounded-[7px] bg-bone-tint">
                  <span className="block h-full rounded-[7px]" style={{ width: `${Math.max(4, pct)}%`, background: "linear-gradient(90deg,#053b30,#1d9e75)" }} />
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-ink tabular-nums">{f.n}</p>
                  <p className="text-[11px] text-muted">{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title={`Plan usage · ${ent.tier}`}>
        <div className="space-y-4">
          <Meter label="Qualified leads / month" used={9} limit={ent.leadsPerMonth} />
          <Meter label="Active listings" used={12} limit={ent.listings} />
          <Meter label="Banner ads" used={1} limit={ent.banners} />
        </div>
      </Panel>
    </div>
  );
}

function ProfileForm({ title, fields, cta }: { title: string; fields: { label: string; value: string; placeholder?: string }[]; cta: string }) {
  const { success } = useAlert();
  return (
    <Panel title={title}>
      <form className="grid max-w-lg gap-3" onSubmit={(e) => { e.preventDefault(); success("Saved."); }}>
        {fields.map((f) => (
          <Input key={f.label} label={f.label} defaultValue={f.value} placeholder={f.placeholder} />
        ))}
        <div><Button type="submit">{cta}</Button></div>
      </form>
    </Panel>
  );
}

export function BusinessProfileView() {
  const auth = useAppSelector(selectAuth);
  return (
    <ProfileForm
      title="Business profile"
      cta="Save business profile"
      fields={[
        { label: "Business name", value: auth.name || "" },
        { label: "GSTIN", value: "", placeholder: "22AAAAA0000A1Z5" },
        { label: "Category", value: "Interior design" },
        { label: "City", value: auth.city || "" },
        { label: "About", value: "", placeholder: "Tell buyers about your business" },
      ]}
    />
  );
}

export function ShopProfileView() {
  return (
    <ProfileForm
      title="Shop / showroom"
      cta="Save shop"
      fields={[
        { label: "Shop name", value: "" , placeholder: "Showroom name" },
        { label: "Address", value: "", placeholder: "Street, area, city" },
        { label: "Opening hours", value: "Mon–Sat, 10am–7pm" },
        { label: "Contact number", value: "", placeholder: "10-digit mobile" },
      ]}
    />
  );
}

export function ArchitectureProfileView() {
  return (
    <ProfileForm
      title="Architecture profile"
      cta="Save portfolio"
      fields={[
        { label: "Studio / name", value: "" },
        { label: "Specialisations", value: "", placeholder: "Residential, sustainable…" },
        { label: "Years of experience", value: "", placeholder: "e.g. 8" },
        { label: "Portfolio link", value: "", placeholder: "https://" },
      ]}
    />
  );
}

export function BannerAdsView() {
  const auth = useAppSelector(selectAuth);
  const ent = resolveEntitlement(auth.sellerPlan);
  return (
    <div className="space-y-4">
      <Panel title="Banner ads">
        <p className="text-[14px] text-muted">Your plan includes <span className="font-medium text-ink">{fmtLimit(ent.banners)}</span> banner placement{ent.banners === 1 ? "" : "s"}.</p>
        <Button className="mt-3" size="sm"><Icon name="plus" size={15} /> Create banner</Button>
      </Panel>
      <EmptyState icon="photo" title="No active banners" text="Create a banner to promote your business across listing pages." />
    </div>
  );
}

export function PlansView() {
  const auth = useAppSelector(selectAuth);
  const ent = resolveEntitlement(auth.sellerPlan);
  return (
    <Panel>
      <div className="flex flex-col items-start gap-3 rounded-card p-6 text-white" style={{ background: "linear-gradient(120deg,#053b30,#0c5a49)" }}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80">Current plan</p>
        <h2 className="text-[24px] font-bold">{auth.sellerPlan ?? "No active plan"}</h2>
        <p className="text-white/85">Tier: {ent.tier}</p>
        <Link to={PAGES.PLANS}><Button className="bg-white text-forest hover:bg-white/90">Change plan</Button></Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["Qualified leads / month", fmtLimit(ent.leadsPerMonth)],
          ["Active listings", fmtLimit(ent.listings)],
          ["Banner ads", fmtLimit(ent.banners)],
          ["Quotations", fmtLimit(ent.quotations)],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between rounded-card border border-line bg-bone-card px-4 py-3 text-[14px]">
            <span className="text-muted">{k}</span>
            <span className="font-semibold text-forest">{v}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const invStatus: Record<string, string> = { Paid: "bg-sel-bg text-forest" };

export function BillingView() {
  const { data, status, retry } = useAsync(() => DashboardService.seller(), []);
  const invoices = data?.invoices ?? [];
  return (
    <Panel title="Invoices">
      <AsyncBoundary status={status} onRetry={retry} isEmpty={!invoices.length} empty={<EmptyState icon="billing" title="No invoices yet" text="Your invoices will appear here." />}>
        <ul className="divide-y divide-line">
          {invoices.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 place-items-center rounded-card bg-sel-bg text-forest"><Icon name="billing" size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-ink">{i.number}</p>
                <p className="text-[12px] text-muted">{i.plan} · {i.date}</p>
              </div>
              <span className="text-[14px] font-semibold text-forest">{formatPrice(i.amount)}</span>
              <span className={cn("rounded-full px-2.5 py-1 text-[12px] font-medium", invStatus[i.status])}>{i.status}</span>
              <button className="text-muted hover:text-forest" aria-label="Download"><Icon name="download" size={18} /></button>
            </li>
          ))}
        </ul>
      </AsyncBoundary>
    </Panel>
  );
}
