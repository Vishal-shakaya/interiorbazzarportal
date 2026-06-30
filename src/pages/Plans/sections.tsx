import { Button, Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { BillingCycle, Plan, PlanFamily } from "@/content/plans.content";

const CYCLES: { key: BillingCycle; label: string; period: string }[] = [
  { key: "mo", label: "Monthly", period: "/mo" },
  { key: "q", label: "Quarterly", period: "/quarter" },
  { key: "yr", label: "Annual", period: "/year" },
];

/** Left sidebar — family selector (prototype cat-tabs-bar). */
export function FamilyTabs({
  families,
  activeKey,
  onSelect,
}: {
  families: PlanFamily[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const presence = families.filter((f) => !f.growth);
  const growth = families.filter((f) => f.growth);

  return (
    <aside className="md:sticky md:top-4 md:h-fit">
      <p className="mb-3 hidden px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted md:block">
        Presence plans
      </p>
      <div className="flex gap-2 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible">
        {presence.map((f) => (
          <FamilyTab key={f.key} family={f} active={f.key === activeKey} onSelect={onSelect} />
        ))}

        {growth.length > 0 && (
          <div className="my-1 hidden items-center gap-2 px-3 text-[9.5px] font-bold uppercase tracking-[0.12em] text-amber md:flex">
            <span className="h-px flex-1 bg-amber-light" />
            Growth engine
            <span className="h-px flex-1 bg-amber-light" />
          </div>
        )}
        {growth.map((f) => (
          <FamilyTab key={f.key} family={f} active={f.key === activeKey} onSelect={onSelect} growth />
        ))}
      </div>

      <div className="mt-4 hidden rounded-card bg-forest-deep p-4 text-bone md:block">
        <p className="font-editorial text-[16px]">Not sure which plan?</p>
        <p className="mt-1.5 text-[12px] text-green-mint">
          Talk to us — we'll match you to the right one for your business.
        </p>
        <a
          href="https://wa.me/918920898168?text=Hi, I need help choosing a plan for Interior bazzar"
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-bone px-3.5 py-2 text-[12px] font-bold text-forest-deep transition hover:bg-green-mint"
        >
          <Icon name="whatsapp" size={14} /> Chat with us
        </a>
      </div>
    </aside>
  );
}

function FamilyTab({
  family,
  active,
  onSelect,
  growth,
}: {
  family: PlanFamily;
  active: boolean;
  onSelect: (key: string) => void;
  growth?: boolean;
}) {
  return (
    <button
      onClick={() => onSelect(family.key)}
      className={cn(
        "flex shrink-0 items-center gap-3 rounded-[10px] border-l-[3px] border-transparent px-3.5 py-3 text-left transition md:w-full",
        active
          ? growth
            ? "border-l-amber bg-amber-light"
            : "border-l-forest bg-green-light text-forest"
          : "text-muted hover:bg-bone-tint hover:text-ink",
        growth && !active && "border border-amber-light bg-amber-light/60",
      )}
    >
      <span
        className={cn(
          "grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[9px]",
          active
            ? growth
              ? "bg-amber text-white"
              : "bg-forest text-white"
            : "bg-bone text-muted",
        )}
      >
        <Icon name={growth ? "sparkles" : "business"} size={17} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={cn("text-[14px] font-semibold leading-tight", active && !growth && "text-forest")}>
          {family.label}
        </span>
        {family.sub && <span className="mt-0.5 text-[11px] font-normal text-muted">{family.sub}</span>}
      </span>
      {growth && (
        <span className="ml-auto hidden items-center gap-1 rounded-full bg-amber px-2 py-0.5 text-[9px] font-bold text-white md:inline-flex">
          <Icon name="trending" size={10} /> Growth
        </span>
      )}
    </button>
  );
}

/** Family hero (prototype .hero). */
export function FamilyHero({ family }: { family: PlanFamily }) {
  return (
    <header className="py-8 text-center md:py-12">
      {family.eyebrow && (
        <span className="eyebrow mb-4 inline-flex items-center gap-1.5">
          <Icon name="sparkles" size={12} /> {family.eyebrow}
        </span>
      )}
      <h1 className="font-editorial text-[34px] leading-[1.05] text-ink md:text-[48px]">
        {family.heading}{" "}
        {family.headingEm && <em className="not-italic text-forest">{family.headingEm}</em>}
      </h1>
      {family.heroSub && (
        <p className="mx-auto mt-3 max-w-xl text-muted md:text-[18px]">{family.heroSub}</p>
      )}
    </header>
  );
}

/** Monthly / Quarterly / Annual toggle (prototype .duration-toggle). */
export function BillingToggle({
  cycle,
  onChange,
  saveBadge,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
  saveBadge?: string;
}) {
  return (
    <div className="mb-9 flex justify-center">
      <div className="inline-flex gap-1 rounded-[14px] border border-line bg-bone-card p-1.5">
        {CYCLES.map((c) => (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-[10px] px-5 py-2.5 text-[14px] font-medium transition",
              cycle === c.key ? "bg-forest text-bone shadow-btn" : "text-muted hover:text-ink",
            )}
          >
            {c.label}
            {c.key === "yr" && saveBadge && (
              <span className="rounded-full bg-green-light px-1.5 py-0.5 text-[10px] font-bold text-accent">
                {saveBadge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Pricing tier card (prototype .plan). */
export function PlanCard({
  plan,
  cycle,
  showCycles,
  onChoose,
}: {
  plan: Plan;
  cycle: BillingCycle;
  showCycles: boolean;
  onChoose: (plan: Plan) => void;
}) {
  const popular = !!plan.highlight;
  const price = plan.prices?.[cycle] ?? `₹${plan.priceMonthly.toLocaleString("en-IN")}`;
  const period = showCycles ? CYCLES.find((c) => c.key === cycle)!.period : "/year";
  const gst = plan.gst?.[cycle];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-card border p-7 transition",
        popular
          ? "border-forest-deep bg-forest-deep text-bone shadow-card md:scale-[1.03]"
          : "border-line bg-bone-card shadow-card hover:-translate-y-1",
      )}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-amber px-3.5 py-1 text-[11px] font-bold text-white">
          <Icon name="star-filled" size={10} /> Most popular
        </span>
      )}

      <p className={cn("font-editorial text-[26px]", popular ? "text-bone" : "text-ink")}>{plan.name}</p>
      {plan.target && (
        <p className={cn("mt-1 flex items-center gap-1.5 text-[13px]", popular ? "text-green-mint" : "text-muted")}>
          <Icon name="flag" size={13} className={popular ? "text-green-mint" : "text-forest"} /> {plan.target}
        </p>
      )}

      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <span className={cn("font-editorial text-[40px] leading-none", popular ? "text-bone" : "text-ink")}>
            {price}
          </span>
          <span className={cn("text-[13px]", popular ? "text-green-mint" : "text-muted")}>{period}</span>
        </div>
        {gst && (
          <p className={cn("mt-1 text-[12px]", popular ? "text-green-mint" : "text-muted")}>{gst}</p>
        )}
      </div>

      {plan.saving && (
        <p className={cn("mt-2 flex items-center gap-1.5 text-[13px] font-semibold", popular ? "text-green-mint" : "text-accent")}>
          <Icon name="rosette" size={13} /> {plan.saving}
        </p>
      )}

      <div className={cn("my-4 h-px", popular ? "bg-white/15" : "bg-line")} />

      {plan.outcome && (
        <div
          className={cn(
            "mb-4 flex items-start gap-2 rounded-[10px] px-3 py-2.5 text-[13px]",
            popular ? "bg-white/10 text-green-mint" : "bg-green-light text-forest",
          )}
        >
          <Icon name="insights" size={15} className="mt-px shrink-0" /> {plan.outcome}
        </div>
      )}

      <ul className="mb-5 flex-1 space-y-0">
        {plan.features.map((f) => (
          <li
            key={f}
            className={cn(
              "flex items-start gap-2 border-b py-[7px] text-[14px] leading-snug last:border-b-0",
              popular ? "border-white/10 text-bone" : "border-line text-ink/90",
            )}
          >
            <Icon
              name="check"
              size={15}
              className={cn("mt-0.5 shrink-0", popular ? "text-green-mint" : "text-forest")}
            />
            {f}
          </li>
        ))}
      </ul>

      <Button
        block
        variant={popular ? "secondary" : "primary"}
        className={cn("rounded-full", popular && "border-transparent bg-bone text-forest-deep hover:bg-green-mint")}
        onClick={() => onChoose(plan)}
      >
        Get {plan.name} <Icon name="arrow-right" size={16} />
      </Button>
      {plan.note && (
        <p className={cn("mt-2.5 text-center text-[12px]", popular ? "text-green-mint" : "text-muted")}>
          {plan.note}
        </p>
      )}
    </div>
  );
}
