/**
 * Mock data source. Re-exports the existing static content as the seed dataset so
 * there is NO data duplication — the `*.content.ts` files remain the single source
 * of truth. The mock handlers read everything through here.
 */
import {
  PRODUCTS,
  SERVICES,
  BUSINESSES,
  ARCHITECTS,
  SHOPS,
  CATALOGUES,
  ALL_ITEMS,
  findBySlug,
} from "@/content/marketplace.content";
import type { ListingItem, ListingType } from "@/types/marketplace";
import { HOME_CONTENT } from "@/content/home.content";
import { SHORTS } from "@/content/shorts.content";
import { TESTIMONIALS } from "@/content/testimonials.content";
import { BLOG_POSTS, findPost } from "@/content/blog.content";
import { PLAN_FAMILIES, PLANS_FAQ } from "@/content/plans.content";
import { DEMO_PERSONAS } from "@/content/auth.content";
import { ABOUT_CONTENT } from "@/content/about.content";
import { HELP_CONTENT } from "@/content/help.content";
import { LEGAL_DOCS } from "@/content/legal.content";
import { NAV_CONTENT } from "@/content/nav.content";
import { getCms } from "@/cms/store";
import { BUYER_NAV, BUYER_TITLES, BUYER_CONNECTIONS } from "@/content/dashboard-buyer.content";
import {
  SELLER_NAV,
  SELLER_TITLES,
  SELLER_ENQUIRIES,
  SELLER_QUOTATIONS,
  SELLER_INVOICES,
} from "@/content/dashboard-seller.content";

const BY_TYPE: Record<ListingType, ListingItem[]> = {
  product: PRODUCTS,
  service: SERVICES,
  business: BUSINESSES,
  architect: ARCHITECTS,
  shop: SHOPS,
  catalogue: CATALOGUES,
};

/**
 * CMS overrides — each returns the admin-managed content when present, otherwise
 * the built-in seed. An empty CMS slice is always a no-op (falls back to seed),
 * so the portal renders identically until the admin publishes something.
 */
const cms = () => getCms();

function cmsHeroSlides(): typeof HOME_CONTENT.heroSlides {
  const slides = cms().home.heroSlides.filter((s) => s.enabled !== false);
  return slides.length
    ? (slides as unknown as typeof HOME_CONTENT.heroSlides)
    : HOME_CONTENT.heroSlides;
}

function cmsCategories(): typeof HOME_CONTENT.categories {
  const cats = cms().home.categories.filter((c) => c.enabled !== false);
  return cats.length
    ? (cats as unknown as typeof HOME_CONTENT.categories)
    : HOME_CONTENT.categories;
}

function cmsTestimonials(): typeof TESTIMONIALS {
  const items = cms().testimonials.filter((t) => t.enabled !== false);
  return items.length ? (items as unknown as typeof TESTIMONIALS) : TESTIMONIALS;
}

function cmsPlanFamilies(): typeof PLAN_FAMILIES {
  const fams = cms().plans.families;
  return fams.length ? (fams as unknown as typeof PLAN_FAMILIES) : PLAN_FAMILIES;
}

function cmsPlansFaq(): typeof PLANS_FAQ {
  const faq = cms().plans.faq;
  return faq.length ? (faq as unknown as typeof PLANS_FAQ) : PLANS_FAQ;
}

function cmsBlogPosts(): typeof BLOG_POSTS {
  const posts = cms().blog.filter((p) => p.enabled !== false);
  return posts.length ? (posts as unknown as typeof BLOG_POSTS) : BLOG_POSTS;
}

export const db = {
  itemsByType: (type: ListingType): ListingItem[] => BY_TYPE[type] ?? [],
  allItems: (): ListingItem[] => ALL_ITEMS,
  itemBySlug: (slug: string): ListingItem | null => findBySlug(slug) ?? null,
  /** Pool consumed by `buildDetail` to compute "similar items" (same type). */
  relatedPool: (item: ListingItem): ListingItem[] =>
    ALL_ITEMS.filter((x) => x.type === item.type),

  home: () => ({
    content: { ...HOME_CONTENT, heroSlides: cmsHeroSlides(), categories: cmsCategories() },
    products: PRODUCTS,
    services: SERVICES,
    businesses: BUSINESSES,
    shops: SHOPS,
    catalogues: CATALOGUES,
    shorts: SHORTS,
    testimonials: cmsTestimonials(),
  }),
  discovery: () => ({
    items: ALL_ITEMS,
    shorts: SHORTS,
    home: HOME_CONTENT,
  }),

  blogPosts: () => cmsBlogPosts(),
  blogPost: (slug: string) => cmsBlogPosts().find((p) => p.slug === slug) ?? findPost(slug) ?? null,

  planFamilies: () => cmsPlanFamilies(),
  plansFaq: () => cmsPlansFaq(),

  personas: () => DEMO_PERSONAS,

  about: () => ABOUT_CONTENT,
  help: () => HELP_CONTENT,
  legal: (key: string) => Object.values(LEGAL_DOCS).find((d) => d.key === key) ?? null,
  nav: () => NAV_CONTENT,

  buyerDashboard: () => ({
    nav: BUYER_NAV,
    titles: BUYER_TITLES,
    connections: BUYER_CONNECTIONS,
  }),
  sellerDashboard: () => ({
    nav: SELLER_NAV,
    titles: SELLER_TITLES,
    enquiries: SELLER_ENQUIRIES,
    quotations: SELLER_QUOTATIONS,
    invoices: SELLER_INVOICES,
  }),
};
