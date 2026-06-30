/**
 * Home feed + discovery (Explore / Trending). Returns the full section arrays so
 * the page hooks keep filtering client-side (by ?filter / ?city) exactly as before.
 */
import { apiClient } from "../client";
import { AppUrl } from "../endpoints";
import type { ApiResponseType } from "@/types/api";
import type { ListingItem, ReelItem, TestimonialItem } from "@/types/marketplace";
import type { HomeContent } from "@/content/home.content";

export interface HomeFeed {
  content: HomeContent;
  products: ListingItem[];
  services: ListingItem[];
  businesses: ListingItem[];
  shops: ListingItem[];
  catalogues: ListingItem[];
  shorts: ReelItem[];
  testimonials: TestimonialItem[];
}

export interface DiscoveryFeed {
  items: ListingItem[];
  shorts: ReelItem[];
  home: HomeContent;
}

export const HomeService = {
  feed(): Promise<ApiResponseType<HomeFeed>> {
    return apiClient.get<HomeFeed>(AppUrl.home);
  },
  explore(): Promise<ApiResponseType<DiscoveryFeed>> {
    return apiClient.get<DiscoveryFeed>(AppUrl.explore);
  },
  trending(): Promise<ApiResponseType<DiscoveryFeed>> {
    return apiClient.get<DiscoveryFeed>(AppUrl.trending);
  },
};
