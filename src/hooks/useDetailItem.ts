import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MarketService } from "@/api";
import { useAsync } from "@/hooks/useAsync";
import { buildDetail } from "@/lib/detail";
import { trackRecentlyViewed } from "@/hooks/useRecentlyViewed";
import type { ListingType } from "@/types/marketplace";
import type { AsyncStatus } from "@/components/ui";

/**
 * Resolve a detail page's item from the :slug param (async via MarketService),
 * build its view-model, and record the visit in recently-viewed. `expect` guards
 * the item type so e.g. a product slug can't render under /services/:slug.
 *
 * Pair with the returned `status`: pages render a skeleton while "loading" and
 * fall back to their not-found block once `notFound` is true.
 */
export function useDetailItem(expect?: ListingType[]) {
  const { slug = "" } = useParams();

  const itemRes = useAsync(() => MarketService.bySlug(slug), [slug]);
  // Same-type pool for "similar items" — fetched in parallel (resolved by slug).
  const relatedRes = useAsync(() => MarketService.related(slug), [slug]);

  const raw = itemRes.data;
  const valid = !!raw && (!expect || expect.includes(raw.type));
  const item = valid ? raw! : null;

  useEffect(() => {
    if (item) trackRecentlyViewed(item);
  }, [item]);

  const vm = useMemo(
    () => (item ? buildDetail(item, relatedRes.data ?? []) : null),
    [item, relatedRes.data],
  );

  // notFound only once the request has settled — never during loading.
  const settled = itemRes.status === "success" || itemRes.status === "error";
  const notFound = settled && !valid;

  return {
    item,
    vm,
    notFound,
    status: itemRes.status as AsyncStatus,
    retry: itemRes.retry,
  };
}
