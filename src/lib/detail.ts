import type { GallerySlide } from "@/components/shared/Gallery";
import type { ReviewItem } from "@/components/shared/Reviews";
import type { ListingItem } from "@/types/marketplace";
import { GRADIENTS } from "@/content/marketplace.content";
import { formatPrice } from "@/lib/listing";

/** Detail view-model derived from a listing item (prototype: synthesised, no API). */
export interface DetailVM {
  gallery: GallerySlide[];
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  reviews: ReviewItem[];
  ratingBreakdown: { stars: number; pct: number }[];
  related: ListingItem[];
}

const REVIEWERS = ["Asha Mehta", "Rahul Verma", "Saket Rao", "Neha Iyer", "Vikram Shah", "Priya Nair"];
const REVIEW_TEXT = [
  "Exactly as described. Communication was prompt and the quality exceeded expectations.",
  "Professional from start to finish. Would happily recommend to anyone in my city.",
  "Great value and genuinely helpful guidance through the whole process.",
  "Calm, considered service. No pushy sales — just real expertise.",
  "Delivered on time and the finish is beautiful. Very satisfied.",
];

function reviewsFor(item: ListingItem): ReviewItem[] {
  const n = 3 + ((item.reviews ?? 0) % 2);
  return Array.from({ length: n }, (_, i) => ({
    name: REVIEWERS[(i + item.title.length) % REVIEWERS.length],
    rating: Math.min(5, Math.round((item.rating ?? 4.5) + (i % 2 ? 0 : 0.5))),
    date: ["2 weeks ago", "1 month ago", "3 months ago", "5 months ago"][i % 4],
    text: REVIEW_TEXT[(i + item.id.length) % REVIEW_TEXT.length],
  }));
}

function specsFor(item: ListingItem): { label: string; value: string }[] {
  const base = [
    { label: "Category", value: item.category },
    { label: "City", value: item.city },
  ];
  switch (item.type) {
    case "product":
      return [
        ...base,
        { label: "Price", value: item.price ? `${formatPrice(item.price)}${item.unit ? ` / ${item.unit}` : ""}` : "On request" },
        { label: "Min. order", value: "1 unit" },
        { label: "Availability", value: item.open ? "In stock" : "Made to order" },
        { label: "Seller", value: item.by },
      ];
    case "service":
      return [
        ...base,
        { label: "Scope", value: item.scope ?? "Custom" },
        { label: "Response time", value: "Within 4 hours" },
        { label: "Provider", value: item.by },
      ];
    default:
      return [
        ...base,
        { label: "Experience", value: item.experience ? `${item.experience} years` : "—" },
        { label: "Projects", value: item.projects ? `${item.projects}+` : "—" },
        { label: "Verified", value: item.verified ? "IB Verified" : "Listed" },
      ];
  }
}

export function buildDetail(item: ListingItem, all: ListingItem[]): DetailVM {
  const gallery: GallerySlide[] = Array.from({ length: 5 }, (_, i) => ({
    bg: GRADIENTS[(i + item.title.length) % GRADIENTS.length],
    icon: item.icon,
  }));

  const related = all
    .filter((x) => x.type === item.type && x.cat === item.cat && x.id !== item.id)
    .slice(0, 4);
  // top up with same-type items if the category is thin
  if (related.length < 4) {
    for (const x of all) {
      if (related.length >= 4) break;
      if (x.type === item.type && x.id !== item.id && !related.includes(x)) related.push(x);
    }
  }

  return {
    gallery,
    description: `${item.title} from ${item.by} — a ${item.category.toLowerCase()} offering serving ${item.city} and nearby areas. Every listing on Interior Bazzar is reviewed for genuineness, so you connect with confidence. Reach out to discuss your requirement and get a response, typically within a few hours.`,
    highlights: [
      item.verified ? "IB Verified seller" : "Listed seller",
      `${item.rating}★ from ${item.reviews} reviews`,
      item.open ? "Open now" : "Made to order",
      `Serving ${item.city}`,
    ],
    specs: specsFor(item),
    reviews: reviewsFor(item),
    ratingBreakdown: [
      { stars: 5, pct: 72 },
      { stars: 4, pct: 18 },
      { stars: 3, pct: 6 },
      { stars: 2, pct: 3 },
      { stars: 1, pct: 1 },
    ],
    related,
  };
}
