/**
 * Shared CMS bridge between the admin panel and the portal.
 *
 * The admin WRITES content here; the portal READS it. The two apps are separate
 * Vite builds, so this file is duplicated verbatim in `admin/src/cms/store.ts` —
 * keep the two copies in sync (same KEY, PARAM, VERSION and shapes).
 *
 * Read precedence (portal): URL `?cms=<snapshot>` > localStorage[`ib_cms`] > none.
 *   - URL snapshot  → cross-origin live preview ("Preview in portal" from admin).
 *   - localStorage  → persistent store of record when both apps share an origin.
 *
 * When no override exists the portal falls back to its built-in seed content, so
 * an empty CMS is a no-op.
 */

export const CMS_KEY = "ib_cms";
export const CMS_PARAM = "cms";
export const CMS_VERSION = 1;
const CHANNEL = "ib_cms";

/** A homepage hero ("house") banner. Field-compatible with the portal HeroSlide. */
export interface CmsHeroSlide {
  id: string;
  enabled: boolean;
  theme: string;
  accent: string;
  scrim: string;
  bgImage: string;
  cardImage: string;
  eyebrow: string;
  icon: string;
  title: string;
  titleEm?: string;
  sub: string;
  ctas: { label: string; to: string; variant?: "primary" | "secondary" }[];
  stats?: { value: string; label: string }[];
}

/** A homepage filter-chip / category. `icon` is a portal IconName at runtime. */
export interface CmsCategory {
  key: string;
  label: string;
  icon: string;
  enabled: boolean;
}

/** A homepage testimonial card. Field-compatible with the portal TestimonialItem. */
export interface CmsTestimonial {
  id: string;
  enabled: boolean;
  name: string;
  role: string;
  city: string;
  rating: number;
  quote: string;
  verified?: boolean;
  bg?: string;
}

export interface CmsPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  features: string[];
  highlight?: boolean;
}

export interface CmsPlanFamily {
  key: string;
  label: string;
  blurb: string;
  plans: CmsPlan[];
}

export interface CmsFaq {
  q: string;
  a: string;
}

/** A blog post. `body` blocks are a subheading (`h`) or paragraph (`p`). */
export interface CmsBlogPost {
  slug: string;
  enabled: boolean;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  bg: string;
  featured?: boolean;
  body: { h?: string; p?: string }[];
}

/** Site brand shown in the portal chrome. Empty fields fall back to the seed. */
export interface CmsBrand {
  name: string;
  tagline: string;
  logo: string;
}

/** A sponsored "Banner Ad" placement. Field-compatible with portal BannerData. */
export interface CmsBannerAd {
  id: string;
  enabled: boolean;
  eyebrow: string;
  title: string;
  sub: string;
  ctaLabel: string;
  sellerName: string;
  bg: string;
  icon: string;
}

export interface CmsDoc {
  v: number;
  updatedAt: number;
  home: { heroSlides: CmsHeroSlide[]; categories: CmsCategory[] };
  testimonials: CmsTestimonial[];
  plans: { families: CmsPlanFamily[]; faq: CmsFaq[] };
  blog: CmsBlogPost[];
  brand: CmsBrand;
  bannerAds: CmsBannerAd[];
}

export function emptyCms(): CmsDoc {
  return {
    v: CMS_VERSION,
    updatedAt: 0,
    home: { heroSlides: [], categories: [] },
    testimonials: [],
    plans: { families: [], faq: [] },
    blog: [],
    brand: { name: "", tagline: "", logo: "" },
    bannerAds: [],
  };
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");

const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Tolerant normaliser — guarantees the shape regardless of partial/old payloads. */
function normalize(raw: unknown): CmsDoc {
  const base = emptyCms();
  if (!raw || typeof raw !== "object") return base;
  const doc = raw as Partial<CmsDoc>;
  return {
    v: CMS_VERSION,
    updatedAt: typeof doc.updatedAt === "number" ? doc.updatedAt : 0,
    home: {
      heroSlides: arr<CmsHeroSlide>(doc.home?.heroSlides),
      categories: arr<CmsCategory>(doc.home?.categories),
    },
    testimonials: arr<CmsTestimonial>(doc.testimonials),
    plans: {
      families: arr<CmsPlanFamily>(doc.plans?.families),
      faq: arr<CmsFaq>(doc.plans?.faq),
    },
    blog: arr<CmsBlogPost>(doc.blog),
    brand: {
      name: str(doc.brand?.name),
      tagline: str(doc.brand?.tagline),
      logo: str(doc.brand?.logo),
    },
    bannerAds: arr<CmsBannerAd>(doc.bannerAds),
  };
}

// --- base64 <-> JSON (utf8-safe) -------------------------------------------
export function encodeSnapshot(doc: CmsDoc): string {
  const json = JSON.stringify(doc);
  return btoa(unescape(encodeURIComponent(json)));
}
function decodeSnapshot(str: string): CmsDoc | null {
  try {
    return normalize(JSON.parse(decodeURIComponent(escape(atob(str)))));
  } catch {
    return null;
  }
}

// --- reads ------------------------------------------------------------------
export function readUrlSnapshot(): CmsDoc | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search).get(CMS_PARAM);
  return p ? decodeSnapshot(p) : null;
}

export function loadLocal(): CmsDoc {
  if (typeof window === "undefined") return emptyCms();
  try {
    const raw = window.localStorage.getItem(CMS_KEY);
    return raw ? normalize(JSON.parse(raw)) : emptyCms();
  } catch {
    return emptyCms();
  }
}

/** The effective CMS document the portal should render from. */
export function getCms(): CmsDoc {
  return readUrlSnapshot() ?? loadLocal();
}

// --- writes (admin) ---------------------------------------------------------
export function saveLocal(doc: CmsDoc): CmsDoc {
  const next: CmsDoc = { ...doc, v: CMS_VERSION, updatedAt: Date.now() };
  try {
    window.localStorage.setItem(CMS_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private-mode errors */
  }
  channel()?.postMessage({ type: "change" });
  return next;
}

/** `<portalUrl><path>?cms=<snapshot>` — open the portal pinned to this content. */
export function snapshotUrl(portalUrl: string, doc: CmsDoc, path = "/"): string {
  const base = portalUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  const sep = p.includes("?") ? "&" : "?";
  return `${base}${p}${sep}${CMS_PARAM}=${encodeURIComponent(encodeSnapshot(doc))}`;
}

// --- live sync (same-origin) ------------------------------------------------
let _channel: BroadcastChannel | null | undefined;
function channel(): BroadcastChannel | null {
  if (_channel === undefined) {
    _channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL) : null;
  }
  return _channel;
}

/** Fire `cb` whenever the CMS changes in another tab/window of the same origin. */
export function subscribe(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === CMS_KEY) cb();
  };
  const ch = channel();
  const onMsg = () => cb();
  window.addEventListener("storage", onStorage);
  ch?.addEventListener("message", onMsg);
  return () => {
    window.removeEventListener("storage", onStorage);
    ch?.removeEventListener("message", onMsg);
  };
}
