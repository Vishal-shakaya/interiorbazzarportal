/**
 * Marketplace listings + detail. All six listing pages and every detail page go
 * through here. `list` accepts a `ListQuery` for the future server-driven move,
 * but the mock returns the full collection (filtering stays client-side).
 */
import { apiClient } from "../client";
import { AppUrl } from "../endpoints";
import type { ApiResponseType, ListQuery } from "@/types/api";
import type { ListingItem, ListingType } from "@/types/marketplace";

export const MarketService = {
  list(type: ListingType, _query?: ListQuery): Promise<ApiResponseType<ListingItem[]>> {
    return apiClient.get<ListingItem[]>(AppUrl.list(type));
  },
  bySlug(slug: string): Promise<ApiResponseType<ListingItem | null>> {
    return apiClient.get<ListingItem | null>(AppUrl.bySlug(slug));
  },
  /** Same-type pool consumed by `buildDetail` to compute "similar items". */
  related(slug: string): Promise<ApiResponseType<ListingItem[]>> {
    return apiClient.get<ListingItem[]>(AppUrl.related(slug));
  },
};
