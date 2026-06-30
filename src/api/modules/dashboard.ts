/** Buyer / seller dashboard data (nav, titles, and seeded records). */
import { apiClient } from "../client";
import { AppUrl } from "../endpoints";
import type { ApiResponseType } from "@/types/api";
import type { DashNavGroup } from "@/components/dashboard/DashboardShell";
import type { BuyerView, Connection } from "@/content/dashboard-buyer.content";
import type {
  SellerView,
  Enquiry,
  Quotation,
  SELLER_INVOICES,
} from "@/content/dashboard-seller.content";

type TitleMap<V extends string> = Record<V, { title: string; subtitle: string }>;

export interface BuyerDashboardData {
  nav: DashNavGroup[];
  titles: TitleMap<BuyerView>;
  connections: Connection[];
}

export interface SellerDashboardData {
  nav: DashNavGroup[];
  titles: TitleMap<SellerView>;
  enquiries: Enquiry[];
  quotations: Quotation[];
  invoices: typeof SELLER_INVOICES;
}

export const DashboardService = {
  buyer(): Promise<ApiResponseType<BuyerDashboardData>> {
    return apiClient.get<BuyerDashboardData>(AppUrl.buyerDashboard);
  },
  seller(): Promise<ApiResponseType<SellerDashboardData>> {
    return apiClient.get<SellerDashboardData>(AppUrl.sellerDashboard);
  },
};
