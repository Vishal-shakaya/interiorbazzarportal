import type { IconName } from "@/components/ui";

/** The five listing entities the universal card can render. */
export type ListingType = "product" | "service" | "business" | "architect" | "shop" | "catalogue";

/**
 * One marketplace item. The universal <ListingCard> renders any of these; only
 * the corner slot + default tag vary by `type` (mirrors the prototype's ib-card).
 * Visuals fall back to `bg` gradient + `icon` when no `image` is supplied.
 */
export interface ListingItem {
  id: string;
  slug: string;
  type: ListingType;
  title: string;
  by: string; // seller / provider / channel name
  city: string;
  category: string; // human label, e.g. "Modular kitchen"
  cat: string; // filter key, e.g. "kitchen"
  image?: string;
  bg?: string; // CSS gradient for the placeholder
  icon?: IconName;
  rating?: number;
  reviews?: number;
  verified?: boolean;
  open?: boolean;
  sponsored?: boolean;
  /** Highlights the media tag in dark "hot" styling (prototype .card-tag.hot). */
  hot?: boolean;
  // product
  price?: number;
  unit?: string;
  oldPrice?: number;
  inStock?: boolean;
  // service
  scope?: string;
  // business / architect
  experience?: number; // years
  projects?: number;
  // shop
  distance?: string;
  hoursOpen?: string; // e.g. "10am – 7pm"
  reopensAt?: string; // e.g. "Opens 10am" (shown when closed)
  // catalogue
  pages?: number;
  // optional tag override (otherwise a per-type default is used)
  tag?: string;
}

/** Reel / short item (home + trending). */
export interface ReelItem {
  id: string;
  title: string;
  studio: string;
  bg: string;
  icon: IconName;
  views?: string;
  rating?: number;
  url?: string;
  platform?: "youtube" | "instagram" | "video";
  /** YouTube id — drives the real thumbnail + embed. */
  youtubeId?: string;
  /** Leaderboard rank badge (1-based). */
  rank?: number;
  /** Category label shown as the corner pill (Service / Product / Business). */
  kind?: string;
  /** City / locality line. */
  city?: string;
}

/** Testimonial card. */
export interface TestimonialItem {
  id: string;
  type: "video" | "text";
  name: string;
  role: string;
  city: string;
  rating: number;
  quote: string;
  verified?: boolean;
  bg?: string;
  // video stories
  youtubeId?: string; // drives the thumbnail + watch link
  videoCaption?: string; // short overlay caption
  business?: string; // shown in the footer instead of role for sellers
}
