/** Subscription plans + plans FAQ. */
import { apiClient } from "../client";
import { AppUrl } from "../endpoints";
import type { ApiResponseType } from "@/types/api";
import type { PlanFamily, PLANS_FAQ } from "@/content/plans.content";

type PlansFaq = typeof PLANS_FAQ;

export const PlansService = {
  families(): Promise<ApiResponseType<PlanFamily[]>> {
    return apiClient.get<PlanFamily[]>(AppUrl.plans);
  },
  faq(): Promise<ApiResponseType<PlansFaq>> {
    return apiClient.get<PlansFaq>(AppUrl.plansFaq);
  },
};
