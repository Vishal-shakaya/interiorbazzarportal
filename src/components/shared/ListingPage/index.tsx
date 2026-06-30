import { useState } from "react";
import { Icon, Select, AsyncBoundary, type AsyncStatus } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useAsync } from "@/hooks/useAsync";
import { MarketService } from "@/api";
import { PublicPage } from "../Seo";
import { CardGrid } from "../CardGrid";
import { FilterChips } from "../FilterChips";
import { Pagination } from "../Pagination";
import { BannerSlot } from "../BannerSlot";
import { FilterSidebar } from "./FilterSidebar";
import { useListingPage, type SortKey } from "./useListingPage";
import type { ListingItem, ListingType } from "@/types/marketplace";

interface ListingPageProps {
  seo: { title: string; description?: string; canonicalUrl?: string };
  title: string;
  subtitle?: string;
  /** Fetch mode: load this entity via MarketService (preferred). */
  type?: ListingType;
  /** Static mode: render a pre-supplied array (back-compat / embedded grids). */
  items?: ListingItem[];
  showBanner?: boolean;
  pageSize?: number;
}

const SORTS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "rating", label: "Top rated" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

export function ListingPage({ seo, title, subtitle, type, items, showBanner, pageSize }: ListingPageProps) {
  const fetched = useAsync(() => MarketService.list(type!), [type], { enabled: !!type });
  const sourceItems = type ? (fetched.data ?? []) : (items ?? []);
  const status: AsyncStatus = type ? fetched.status : "success";

  const s = useListingPage(sourceItems, pageSize);
  const [mobileFilters, setMobileFilters] = useState(false);

  const categoryChips = [{ key: "all", label: "All" }, ...s.categoryOptions.map((c) => ({ key: c.key, label: c.label }))];

  const filterProps = {
    verified: s.verified,
    toggleVerified: s.toggleVerified,
    priceMin: s.priceMin,
    priceMax: s.priceMax,
    setPrice: s.setPrice,
    activeFilterCount: s.activeFilterCount,
    clearAll: s.clearAll,
    showPrice: type === "product",
  };

  return (
    <>
      <PublicPage title={seo.title} description={seo.description} canonicalUrl={seo.canonicalUrl} />

      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <header className="mb-3">
          <h1 className="sec-title text-[26px]">{title}</h1>
          {subtitle && <p className="mt-1 text-[14px] text-muted">{subtitle}</p>}
        </header>

        {/* category chip row */}
        <div className="mb-4">
          <FilterChips chips={categoryChips} value={s.filter} onChange={s.setFilter} />
        </div>

        {showBanner && (
          <div className="mb-5">
            <BannerSlot />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_290px]">
          {/* results column */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-[14px] text-muted">
                <span className="font-semibold text-ink">{status === "loading" ? "…" : s.total}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFilters((o) => !o)}
                  className="flex items-center gap-1.5 rounded-[10px] border border-line px-3 py-2 text-[13px] text-forest lg:hidden"
                >
                  <Icon name="settings" size={16} /> Filters
                  {s.activeFilterCount > 0 && (
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-forest px-1 text-[10px] text-bone">
                      {s.activeFilterCount}
                    </span>
                  )}
                </button>
                <Select
                  value={s.sort}
                  onChange={(e) => s.setSort(e.target.value as SortKey)}
                  aria-label="Sort by"
                  className="w-auto min-w-[150px]"
                >
                  {SORTS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* mobile filter panel */}
            <div className={cn("mb-5 lg:hidden", !mobileFilters && "hidden")}>
              <FilterSidebar {...filterProps} />
            </div>

            <AsyncBoundary
              status={status}
              onRetry={fetched.retry}
              skeleton={<CardGrid variant="fill" items={[]} loading skeletonCount={pageSize ?? 12} />}
            >
              <CardGrid variant="fill" items={s.paged} emptyLabel="No results match your filters." />
              <Pagination currentPage={s.page} totalPages={s.totalPages} onPageChange={s.setPage} />
            </AsyncBoundary>
          </div>

          {/* desktop filter — right */}
          <aside className="hidden lg:block">
            <div className="sticky top-[76px]">
              <FilterSidebar {...filterProps} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
