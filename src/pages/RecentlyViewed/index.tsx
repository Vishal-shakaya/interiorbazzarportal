import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui";
import { PublicPage, CardGrid, SectionHeader } from "@/components/shared";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { PAGES, canonical, toProduct, toService, toBusiness, toArchitect } from "@/lib/constants";
import type { IconName } from "@/components/ui";
import type { ListingItem, ListingType } from "@/types/marketplace";

/** Map a recently-viewed item to its detail route (shops/catalogues fall back to listings). */
function detailHref(item: ListingItem): string {
  switch (item.type) {
    case "product":
      return toProduct(item.slug);
    case "service":
      return toService(item.slug);
    case "business":
      return toBusiness(item.slug);
    case "architect":
      return toArchitect(item.slug);
    case "shop":
      return PAGES.SHOPS;
    default:
      return PAGES.CATALOGUES;
  }
}

/** Filter pills — mirrors the prototype's .cat-bar (All + the five entity types). */
const PILLS: { key: ListingType | "all"; label: string; icon: IconName }[] = [
  { key: "all", label: "All", icon: "sparkles" },
  { key: "business", label: "Businesses", icon: "business" },
  { key: "product", label: "Products", icon: "products" },
  { key: "service", label: "Services", icon: "services" },
  { key: "architect", label: "Architects", icon: "architecture" },
  { key: "shop", label: "Shops", icon: "shops" },
];

/** Section ordering + copy for the grouped entity-type sections. */
const GROUPS: { type: ListingType; eyebrow: string; title: React.ReactNode }[] = [
  { type: "business", eyebrow: "businesses", title: <>Businesses you <em>viewed</em></> },
  { type: "product", eyebrow: "products", title: <>Products you <em>viewed</em></> },
  { type: "service", eyebrow: "services", title: <>Services you <em>viewed</em></> },
  { type: "architect", eyebrow: "architects", title: <>Architects you <em>viewed</em></> },
  { type: "shop", eyebrow: "shops", title: <>Shops you <em>viewed</em></> },
  { type: "catalogue", eyebrow: "catalogues", title: <>Catalogues you <em>viewed</em></> },
];

const KPIS: { type: ListingType; label: string; icon: IconName; tone: string }[] = [
  { type: "business", label: "Businesses", icon: "business", tone: "bg-amber/10 text-amber" },
  { type: "product", label: "Products", icon: "products", tone: "bg-green-light text-forest" },
  { type: "service", label: "Services", icon: "services", tone: "bg-green-light text-forest" },
];

export default function RecentlyViewed() {
  const { items, clear } = useRecentlyViewed();
  const [filter, setFilter] = useState<ListingType | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    items.forEach((i) => (c[i.type] = (c[i.type] ?? 0) + 1));
    return c;
  }, [items]);

  const visible = filter === "all" ? items : items.filter((i) => i.type === filter);
  const latest = items[0];

  return (
    <>
      <PublicPage title="Recently viewed — Interior Bazzar" canonicalUrl={canonical(PAGES.RECENTLY_VIEWED)} noindex />
      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        {/* ── Filter pills (prototype .cat-bar) ── */}
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-3.5 [scrollbar-width:none] md:-mx-7 md:px-7 [&::-webkit-scrollbar]:hidden">
          {PILLS.map((p) => {
            const on = p.key === filter;
            const n = p.key === "all" ? items.length : (counts[p.key] ?? 0);
            return (
              <button
                key={p.key}
                onClick={() => setFilter(p.key)}
                aria-pressed={on}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-[7px] text-[13.5px] font-medium transition ${
                  on ? "bg-ink text-white" : "bg-chip text-ink hover:bg-chip-hover"
                }`}
              >
                <Icon name={p.icon} size={15} /> {p.label}
                <span className="opacity-65">{n}</span>
              </button>
            );
          })}
        </div>

        {/* ── Header (prototype .sec-head) ── */}
        <div className="mb-4 mt-5 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="sec-eye">last 7 days</span>
            <h1 className="sec-title text-[38px]">
              Pick up where you <em>left off</em>
            </h1>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted">
              Everything you've viewed in the last week — businesses, products, services. Search through, save, or clear
              with one click.
            </p>
          </div>
          {items.length > 0 && (
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-[22px] border border-line bg-bone-card px-3.5 py-[9px] text-[12.5px] font-semibold text-ink">
                <Icon name="download" size={14} /> Export
              </button>
              <button
                onClick={clear}
                className="inline-flex items-center gap-1.5 rounded-[22px] border border-line bg-bone-card px-3.5 py-[9px] text-[12.5px] font-semibold text-err"
              >
                <Icon name="trash" size={14} /> Clear history
              </button>
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <>
            {/* ── KPI strip ── */}
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="flex items-center gap-3.5 rounded-card border border-line bg-bone-card px-[18px] py-4">
                <div className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-green-light text-forest">
                  <Icon name="history" size={18} />
                </div>
                <div>
                  <div className="font-editorial text-[22px] leading-none">{items.length}</div>
                  <div className="mt-[3px] text-[11.5px] font-medium text-muted">Items viewed</div>
                </div>
              </div>
              {KPIS.map((k) => (
                <div
                  key={k.type}
                  className="flex items-center gap-3.5 rounded-card border border-line bg-bone-card px-[18px] py-4"
                >
                  <div className={`grid h-[38px] w-[38px] place-items-center rounded-[10px] ${k.tone}`}>
                    <Icon name={k.icon} size={18} />
                  </div>
                  <div>
                    <div className="font-editorial text-[22px] leading-none">{counts[k.type] ?? 0}</div>
                    <div className="mt-[3px] text-[11.5px] font-medium text-muted">{k.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Continue banner (prototype amber strip) ── */}
            {latest && (
              <div className="mb-6 flex items-center gap-[18px] overflow-hidden rounded-card border border-amber/25 bg-green-light/40 px-[26px] py-[22px]">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber text-white">
                  <Icon name="play" size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.09em] text-amber">
                    last opened
                  </div>
                  <div className="mb-[3px] truncate font-editorial text-[18px] tracking-tight">
                    <em className="not-italic text-amber">{latest.by}</em> — {latest.title}
                  </div>
                  <div className="text-[12.5px] leading-snug text-muted">
                    Pick up where you left off — open this profile again or continue the conversation.
                  </div>
                </div>
                <Link
                  to={detailHref(latest)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[24px] bg-ink px-[18px] py-[11px] text-[13.5px] font-bold text-white"
                >
                  Continue <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            )}

            {/* ── Grouped entity-type sections ── */}
            {GROUPS.map((g) => {
              const group = visible.filter((i) => i.type === g.type);
              if (!group.length) return null;
              return (
                <section key={g.type} className="mt-7">
                  <SectionHeader eyebrow={g.eyebrow} title={g.title} />
                  <CardGrid variant="fill" items={group} />
                </section>
              );
            })}
          </>
        ) : (
          /* ── Empty state (prototype "Nothing viewed yet") ── */
          <div className="grid place-items-center gap-2 rounded-card border border-dashed border-line py-[60px] text-center">
            <div className="mb-2 text-5xl">👀</div>
            <p className="font-editorial text-[22px] text-ink">
              <em className="text-forest">Nothing viewed yet</em>
            </p>
            <p className="text-[14px] text-muted">Start exploring to build your history</p>
            <Link
              to={PAGES.HOME}
              className="mt-3 inline-flex items-center gap-1.5 rounded-[24px] bg-forest px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Start exploring <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
