import type { ListingType } from "@/types/marketplace";

/**
 * Central registry of backend paths. Never hardcode a path string in a service
 * module — reference `AppUrl.*` so routes change in one place. Mock handlers are
 * keyed off these exact strings (dynamic segments use the `:param` form for the
 * static key; the helpers below build the concrete URL the client requests).
 */
export const AppUrl = {
  // marketplace
  list: (type: ListingType) => `/marketplace/${type}s`,
  bySlug: (slug: string) => `/marketplace/items/${slug}`,
  related: (slug: string) => `/marketplace/items/${slug}/related`,

  // discovery
  home: "/home",
  explore: "/explore",
  trending: "/trending",

  // content
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  about: "/content/about",
  help: "/content/help",
  legal: (doc: string) => `/content/legal/${doc}`,
  nav: "/content/nav",

  // commerce & auth
  plans: "/plans",
  plansFaq: "/plans/faq",
  authPersona: "/auth/persona",
  authOtpRequest: "/auth/otp/request",
  authOtpVerify: "/auth/otp/verify",
  authSignup: "/auth/signup",

  // dashboards
  buyerDashboard: "/dashboard/buyer",
  sellerDashboard: "/dashboard/seller",
} as const;
