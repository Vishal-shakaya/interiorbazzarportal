import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchParam } from "@/hooks/useSearchParam";
import { useAsync } from "@/hooks/useAsync";
import { useCmsVersion } from "@/hooks/useCmsVersion";
import { HomeService } from "@/api";
import { filterItems } from "@/lib/listing";
import type { ListingItem } from "@/types/marketplace";

const EMPTY_SECTIONS = {
  products: [] as ListingItem[],
  services: [] as ListingItem[],
  businesses: [] as ListingItem[],
  shops: [] as ListingItem[],
  catalogues: [] as ListingItem[],
};

/** All Home logic: fetches the feed, then derives the filtered sections (?filter + ?city). */
export function useHome() {
  const [filter, setFilter] = useSearchParam("filter", "all");
  const [params] = useSearchParams();
  const city = params.get("city") ?? "";

  // Refetch when the admin saves CMS edits (same-origin live sync).
  const cmsVersion = useCmsVersion();
  const { data, status, retry } = useAsync(() => HomeService.feed(), [cmsVersion], {
    keepPreviousData: true,
  });

  const sections = useMemo(() => {
    if (!data) return EMPTY_SECTIONS;
    const f = (arr: ListingItem[]) => filterItems(arr, filter, city).slice(0, 8);
    return {
      products: f(data.products),
      services: f(data.services),
      businesses: f(data.businesses),
      shops: f(data.shops),
      catalogues: f(data.catalogues),
    };
  }, [data, filter, city]);

  const cityLabel = city ? city.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "";

  return {
    content: data?.content ?? null,
    status,
    retry,
    filter,
    setFilter,
    city,
    cityLabel,
    sections,
    shorts: data?.shorts ?? [],
    testimonials: data?.testimonials ?? [],
  };
}
