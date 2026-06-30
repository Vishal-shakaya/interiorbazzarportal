import type { IconName } from "@/components/ui";
import { PAGES, type PagePath } from "@/lib/constants";

/**
 * Static content for the portal chrome (topbar + sidebar + footer).
 * Pure data — no components, no network. Swap for an API later if nav becomes
 * server-driven: `const r = await api.nav(); setNav(r.data)`.
 */

export interface NavLink {
  label: string;
  to: string; // PagePath, or a PagePath + query (e.g. dashboard ?tab=)
  icon: IconName;
  badge?: string; // e.g. "HOT"
}

export interface NavGroup {
  title?: string;
  links: NavLink[];
}

export interface CityLink {
  label: string;
  slug: string; // appended as ?city=<slug> to HOME
}

export interface FooterLink {
  label: string;
  to: PagePath;
}

export interface NavContent {
  brand: { name: string; tagline: string };
  primary: NavGroup;
  browse: NavGroup;
  cities: { title: string; items: CityLink[] };
  support: NavGroup;
  promo: { eyebrow: string; title: string; cta: string; to: string };
  footerLinks: FooterLink[];
  legalLine: string;
  searchPlaceholder: string;
  searchScopes: string[];
}

export const NAV_CONTENT: NavContent = {
  brand: { name: "Interior bazzar", tagline: "Little things." },

  primary: {
    links: [
      { label: "Home", to: PAGES.HOME, icon: "home" },
      { label: "Trending", to: PAGES.TRENDING, icon: "trending", badge: "HOT" },
      { label: "Explore", to: PAGES.EXPLORE, icon: "explore" },
      { label: "Saved", to: `${PAGES.DASHBOARD_BUYER}?tab=saved`, icon: "bookmark" },
      { label: "Recently viewed", to: PAGES.RECENTLY_VIEWED, icon: "history" },
    ],
  },

  browse: {
    title: "Browse",
    links: [
      { label: "Products", to: PAGES.PRODUCTS, icon: "products" },
      { label: "Services", to: PAGES.SERVICES, icon: "services" },
      { label: "Business", to: PAGES.BUSINESSES, icon: "business" },
      { label: "Shops", to: PAGES.SHOPS, icon: "shops" },
      { label: "Catalogue", to: PAGES.CATALOGUES, icon: "catalogue" },
      { label: "Architects", to: PAGES.ARCHITECTS, icon: "architects" },
    ],
  },

  cities: {
    title: "Top cities",
    items: [
      { label: "New Delhi", slug: "new-delhi" },
      { label: "Mumbai", slug: "mumbai" },
      { label: "Bangalore", slug: "bangalore" },
      { label: "Hyderabad", slug: "hyderabad" },
      { label: "Chennai", slug: "chennai" },
    ],
  },

  support: {
    title: "Support",
    links: [
      { label: "Help center", to: PAGES.HELP, icon: "help" },
      { label: "24/7 chat", to: PAGES.HELP, icon: "chat" },
      { label: "Feedback", to: PAGES.CONTACT, icon: "feedback" },
      { label: "About IB", to: PAGES.ABOUT, icon: "about" },
      { label: "Blog", to: PAGES.BLOG, icon: "blog" },
    ],
  },

  promo: {
    eyebrow: "⚡ Limited",
    title: "Be where buyers look.",
    cta: "View plans",
    to: PAGES.PLANS,
  },

  footerLinks: [
    { label: "Terms", to: PAGES.TERMS },
    { label: "Privacy", to: PAGES.PRIVACY },
    { label: "Refunds", to: PAGES.REFUND },
    { label: "Cookies", to: PAGES.COOKIES },
    { label: "Disclaimer", to: PAGES.DISCLAIMER },
  ],

  legalLine: "© Feelsafe Technology India Pvt Ltd · CIN U74999DL2021PTC000000",

  searchPlaceholder: "Search businesses, products, services…",
  searchScopes: ["All", "Products", "Services", "Business", "Shops", "Catalogue", "Architects"],
};
