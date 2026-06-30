import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type SortKey = "relevance" | "rating" | "price-asc" | "price-desc";

export interface CategoryOption {
  key: string;
  label: string;
  count: number;
}

import type { ListingItem } from "@/types/marketplace";

const PAGE_SIZE = 12;

/**
 * Shared listing-page state: reads ?filter, ?sort, ?verified, ?open, ?q, ?page
 * from the URL (replace: true) and returns the filtered + sorted + paginated slice.
 * Used by all six listing pages via <ListingPage>.
 */
export function useListingPage(allItems: ListingItem[], pageSize = PAGE_SIZE) {
  const [params, setParams] = useSearchParams();

  const filter = params.get("filter") ?? "all";
  const sort = (params.get("sort") as SortKey) ?? "relevance";
  const verified = params.get("verified") === "1";
  const open = params.get("open") === "1";
  const q = params.get("q") ?? "";
  const priceMin = parseInt(params.get("min") ?? "", 10) || 0;
  const priceMax = parseInt(params.get("max") ?? "", 10) || 0;
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  /** Patch params; any change except `page` resets pagination to 1. */
  const patch = useCallback(
    (next: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(next)) {
            if (v === null || v === "" || v === "all" || v === "0") p.delete(k);
            else p.set(k, v);
          }
          if (!("page" in next)) p.delete("page");
          return p;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  // Category options + counts AND `total` derive from the FULL `allItems` set.
  // This works because the API returns the entire collection and filtering is
  // client-side. If the listing API is ever moved to server-side pagination
  // (returning only one page), these counts and totals will silently break —
  // they'd need to come from a server aggregate instead.
  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const map = new Map<string, CategoryOption>();
    for (const it of allItems) {
      const o = map.get(it.cat) ?? { key: it.cat, label: it.category, count: 0 };
      o.count += 1;
      map.set(it.cat, o);
    }
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [allItems]);

  const filtered = useMemo(() => {
    let list = allItems.filter((it) => {
      if (filter !== "all" && it.cat !== filter) return false;
      if (verified && !it.verified) return false;
      if (open && !it.open) return false;
      if (priceMin && (it.price ?? 0) < priceMin) return false;
      if (priceMax && (it.price ?? Infinity) > priceMax) return false;
      if (q) {
        const hay = `${it.title} ${it.by} ${it.category} ${it.city}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });

    list = [...list];
    switch (sort) {
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "price-asc":
        list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
        break;
    }
    return list;
  }, [allItems, filter, verified, open, q, sort, priceMin, priceMax]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const activeFilterCount =
    (filter !== "all" ? 1 : 0) + (verified ? 1 : 0) + (open ? 1 : 0) + (priceMin || priceMax ? 1 : 0);

  return {
    // state
    filter,
    sort,
    verified,
    open,
    q,
    priceMin,
    priceMax,
    page: safePage,
    // derived
    categoryOptions,
    paged,
    total,
    totalPages,
    activeFilterCount,
    // setters
    setFilter: (v: string) => patch({ filter: v }),
    setSort: (v: SortKey) => patch({ sort: v }),
    toggleVerified: () => patch({ verified: verified ? null : "1" }),
    toggleOpen: () => patch({ open: open ? null : "1" }),
    setPrice: (min: number, max: number) =>
      patch({ min: min > 0 ? String(min) : null, max: max > 0 ? String(max) : null }),
    setPage: (p: number) => patch({ page: String(p) }),
    clearAll: () => patch({ filter: null, verified: null, open: null, q: null, min: null, max: null }),
  };
}
