import { SkeletonCard } from "@/components/ui";
import { ListingCard } from "../ListingCard";
import { PanelCard } from "../ListingCard/PanelCard";
import { ShopCard } from "../ListingCard/ShopCard";
import type { ListingItem } from "@/types/marketplace";

interface CardGridProps {
  items: ListingItem[];
  loading?: boolean;
  /** Skeleton count while loading. */
  skeletonCount?: number;
  emptyLabel?: string;
  /** "feed" = fixed 4-col (home); "fill" = auto-fill dense grid (listing pages). */
  variant?: "feed" | "fill";
  /** Render shops with the shop-specific card (status/hours/distance/Connect). Only the
   *  "Shops near you" section sets this; mixed feeds keep the generic card. */
  shopCards?: boolean;
}

const GRID = {
  feed: "grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-4",
  fill: "grid gap-x-3 gap-y-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]",
};

export function CardGrid({
  items,
  loading,
  skeletonCount = 8,
  emptyLabel = "Nothing here yet.",
  variant = "feed",
  shopCards = false,
}: CardGridProps) {
  if (loading) {
    return (
      <div className={GRID[variant]}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="grid place-items-center rounded-card border border-dashed border-line py-16 text-muted">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className={GRID[variant]}>
      {items.map((item) => {
        // Shops get the shop-specific card (status/hours/distance/Connect) in the
        // feed; listing pages (`fill`) use the dense PanelCard.
        const Card =
          variant === "fill" ? PanelCard : shopCards && item.type === "shop" ? ShopCard : ListingCard;
        return <Card key={item.id} item={item} />;
      })}
    </div>
  );
}
