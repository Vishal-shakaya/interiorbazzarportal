/** Static content pages: About, Help, Legal. (Nav chrome stays synchronous.) */
import { apiClient } from "../client";
import { AppUrl } from "../endpoints";
import type { ApiResponseType } from "@/types/api";
import type { ABOUT_CONTENT } from "@/content/about.content";
import type { HELP_CONTENT } from "@/content/help.content";
import type { LegalDoc } from "@/content/legal.content";

export const ContentService = {
  about(): Promise<ApiResponseType<typeof ABOUT_CONTENT>> {
    return apiClient.get<typeof ABOUT_CONTENT>(AppUrl.about);
  },
  help(): Promise<ApiResponseType<typeof HELP_CONTENT>> {
    return apiClient.get<typeof HELP_CONTENT>(AppUrl.help);
  },
  legal(doc: string): Promise<ApiResponseType<LegalDoc | null>> {
    return apiClient.get<LegalDoc | null>(AppUrl.legal(doc));
  },
};
