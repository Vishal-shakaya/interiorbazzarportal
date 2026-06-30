import { PAGES, toProduct, toService, toBusiness, toArchitect } from "@/lib/constants";
import type { ListingItem } from "@/types/marketplace";

/** Detail-page URL for any listing item, by type. */
export function hrefForItem(item: ListingItem): string {
  switch (item.type) {
    case "product":
      return toProduct(item.slug);
    case "service":
      return toService(item.slug);
    case "business":
    case "shop":
      return toBusiness(item.slug);
    case "architect":
      return toArchitect(item.slug);
    case "catalogue":
      return `${PAGES.CATALOGUES}?item=${item.slug}`;
    default:
      return PAGES.HOME;
  }
}

/** City slug → comparable label (matches marketplace city strings). */
const citySlug = (city: string) => city.toLowerCase().replace(/\s+/g, "-");

/**
 * Filter listing items by a category/attribute key and optional city slug.
 * `filter`: "all" | "verified" | "open" | "near" | a category key (item.cat).
 */
export function filterItems(items: ListingItem[], filter = "all", city = ""): ListingItem[] {
  return items.filter((it) => {
    if (city && citySlug(it.city) !== city) return false;
    switch (filter) {
      case "all":
      case "near":
        return true;
      case "verified":
        return !!it.verified;
      case "open":
        return !!it.open;
      case "turnkey":
        return (it.scope ?? "").toLowerCase() === "turnkey" || it.cat === "turnkey";
      default:
        return it.cat === filter;
    }
  });
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "₹48,900" */
export const formatPrice = (n: number) => `₹${inr.format(n)}`;

/** Avatar initials from a name, max 2 chars. */
export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
