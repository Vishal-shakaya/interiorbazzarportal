/** Blog list + single post. */
import { apiClient } from "../client";
import { AppUrl } from "../endpoints";
import type { ApiResponseType } from "@/types/api";
import type { BlogPost } from "@/content/blog.content";

export const BlogService = {
  list(): Promise<ApiResponseType<BlogPost[]>> {
    return apiClient.get<BlogPost[]>(AppUrl.blog);
  },
  bySlug(slug: string): Promise<ApiResponseType<BlogPost | null>> {
    return apiClient.get<BlogPost | null>(AppUrl.blogPost(slug));
  },
};
