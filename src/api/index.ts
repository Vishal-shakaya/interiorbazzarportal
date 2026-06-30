/** Barrel for the API layer. Import services from `@/api`. */
export { apiClient } from "./client";
export { AppUrl } from "./endpoints";

export { MarketService } from "./modules/market";
export { HomeService, type HomeFeed, type DiscoveryFeed } from "./modules/home";
export { BlogService } from "./modules/blog";
export { PlansService } from "./modules/plans";
export { AuthService, type SignupPayload } from "./modules/auth";
export {
  DashboardService,
  type BuyerDashboardData,
  type SellerDashboardData,
} from "./modules/dashboard";
export { ContentService } from "./modules/content";

export type { ApiResponseType, ApiError, ListQuery, Paginated } from "@/types/api";
