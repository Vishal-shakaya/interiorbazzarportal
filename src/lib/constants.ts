/**
 * Central route registry. Never hardcode a path string in a component —
 * always reference PAGES.X so routes can be renamed in one place.
 *
 * Dynamic routes keep their `:slug` pattern here (used by the router); build a
 * concrete URL with the `to*` helpers below.
 */
export const PAGES = {
  // discovery
  HOME: "/",
  EXPLORE: "/explore",
  TRENDING: "/trending",
  RECENTLY_VIEWED: "/recently-viewed",

  // browse — listing pages
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:slug",
  SERVICES: "/services",
  SERVICE_DETAIL: "/services/:slug",
  CATALOGUES: "/catalogues",
  BUSINESSES: "/businesses",
  BUSINESS_DETAIL: "/businesses/:slug",
  ARCHITECTS: "/architects",
  ARCHITECT_DETAIL: "/architects/:slug",
  SHOPS: "/shops",

  // content
  BLOG: "/blog",
  BLOG_POST: "/blog/:slug",
  ABOUT: "/about",
  HELP: "/help",
  CONTACT: "/contact",

  // commerce & auth
  AUTH: "/auth",
  PLANS: "/plans",

  // dashboards (self-contained chrome)
  DASHBOARD_BUYER: "/dashboard/buyer",
  DASHBOARD_SELLER: "/dashboard/seller",
  NEW_QUOTATION: "/dashboard/seller/new-quotation",
  AD_ENQUIRY_FLOW: "/dashboard/seller/ad-enquiry-flow",

  // legal — one template, five content sets
  TERMS: "/legal/terms",
  PRIVACY: "/legal/privacy",
  REFUND: "/legal/refund",
  DISCLAIMER: "/legal/disclaimer",
  COOKIES: "/legal/cookies",
} as const;

export type PageKey = keyof typeof PAGES;
export type PagePath = (typeof PAGES)[PageKey];

/** Build a concrete URL from a `:slug` pattern, e.g. toProduct("teak-sofa"). */
const fill = (pattern: string, slug: string) => pattern.replace(":slug", slug);

export const toProduct = (slug: string) => fill(PAGES.PRODUCT_DETAIL, slug);
export const toService = (slug: string) => fill(PAGES.SERVICE_DETAIL, slug);
export const toBusiness = (slug: string) => fill(PAGES.BUSINESS_DETAIL, slug);
export const toArchitect = (slug: string) => fill(PAGES.ARCHITECT_DETAIL, slug);
export const toBlogPost = (slug: string) => fill(PAGES.BLOG_POST, slug);

/** Absolute canonical URL for SEO tags. */
export const SITE_ORIGIN = "https://interiorbazzar.com";
export const canonical = (path: string) => `${SITE_ORIGIN}${path}`;
