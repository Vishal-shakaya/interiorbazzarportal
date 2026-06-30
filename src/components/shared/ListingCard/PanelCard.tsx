import { type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { hrefForItem, formatPrice, initialsOf } from "@/lib/listing";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleSaved, selectSavedIds } from "@/redux/slice/savedSlice";
import type { ListingItem } from "@/types/marketplace";

/** Per-type default tag shown top-left on the media. */
function defaultTag(item: ListingItem): string {
  if (item.tag) return item.tag;
  switch (item.type) {
    case "business":
      return item.verified ? "Verified" : "Business";
    case "architect":
      return "Architect";
    case "service":
      return "Service";
    case "shop":
      return "Showroom";
    case "catalogue":
      return "Catalogue";
    default:
      return "Product";
  }
}

function avatarGrad(item: ListingItem): string {
  switch (item.type) {
    case "product":
    case "catalogue":
      return "linear-gradient(135deg,#854f0b,#d4823a)";
    case "architect":
      return "linear-gradient(135deg,#185fa5,#5a9bd9)";
    default:
      return "linear-gradient(135deg,#085041,#1d9e75)";
  }
}

const ICON_BY_TYPE = {
  product: "products",
  service: "services",
  business: "business",
  architect: "architects",
  shop: "shops",
  catalogue: "catalogue",
} as const;

/**
 * Bordered listing card used on the six listing pages (CardGrid variant="fill").
 * Mirrors the prototype's per-entity cards: seller line, price/stock, and a
 * type-specific action footer (Contact seller · Request sample / Connect /
 * Get catalogue). The borderless feed card (home) stays in ListingCard.
 */
export function PanelCard({ item }: { item: ListingItem }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectSavedIds).includes(item.id);

  const href = hrefForItem(item);
  const go = () => navigate(href);
  const onSave = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleSaved(item.id));
  };
  const stop = (e: MouseEvent) => e.stopPropagation();

  const tall = item.type === "catalogue";

  return (
    <div
      onClick={go}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-card border border-line bg-bone-card transition hover:-translate-y-0.5 hover:border-green-mint hover:shadow-card"
    >
      {/* media */}
      <div className={cn("relative w-full overflow-hidden", tall ? "aspect-[4/5]" : "aspect-[16/10]")} style={{ background: item.bg }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-white/40">
            <Icon name={ICON_BY_TYPE[item.type]} size={tall ? 42 : 48} stroke={1.3} />
          </div>
        )}

        {/* scrim for legibility over photos */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/15" />

        {/* tag */}
        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-forest backdrop-blur">
          {defaultTag(item)}
        </span>

        {/* shop open/closed status */}
        {item.type === "shop" && item.open != null && (
          <span
            className={cn(
              "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold backdrop-blur",
              item.open ? "bg-success-light/95 text-success" : "bg-danger-light/95 text-danger",
            )}
          >
            {item.open ? "Open" : "Closed"}
          </span>
        )}

        {/* save */}
        <button
          onClick={onSave}
          aria-label={saved ? "Remove from saved" : "Save"}
          aria-pressed={saved}
          className={cn(
            "absolute right-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-ink backdrop-blur transition hover:text-forest",
            item.type === "shop" ? "bottom-2" : "top-2",
          )}
        >
          <Icon name="bookmark" size={15} className={cn(saved && "fill-forest text-forest")} />
        </button>

        {/* shop distance */}
        {item.type === "shop" && item.distance && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11.5px] font-semibold text-white backdrop-blur">
            <Icon name="city" size={12} /> {item.distance}
          </span>
        )}

        {/* catalogue page count */}
        {item.type === "catalogue" && item.pages && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
            <Icon name="catalogue" size={12} /> {item.pages} pages
          </span>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-forest">{item.category}</p>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink">{item.title}</h3>

        <p className="flex items-center gap-1.5 text-[12.5px] text-[#555]">
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white"
            style={{ background: avatarGrad(item) }}
          >
            {initialsOf(item.by)}
          </span>
          {item.type === "product" && <span>Sold by</span>}
          <span className="truncate font-medium">{item.by}</span>
          {item.verified && <Icon name="verified" size={12} className="shrink-0 text-forest" />}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-[#555]">
          {item.rating != null && (
            <span className="inline-flex items-center gap-1 font-bold text-ink">
              <span className="text-[11px] text-amber">★</span>
              {item.rating}
            </span>
          )}
          {item.reviews != null && <span>· {item.reviews} reviews</span>}
          {item.city && <span>· {item.city}</span>}
        </div>

        {/* price (product) */}
        {item.type === "product" && item.price != null && (
          <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
            <span className="font-editorial text-[20px] text-forest">{formatPrice(item.price)}</span>
            {item.unit && <span className="text-[12px] text-muted">/ {item.unit}</span>}
            {item.oldPrice && <span className="text-[12.5px] text-muted line-through">{formatPrice(item.oldPrice)}</span>}
            <span className="ml-auto rounded-full bg-success-light px-2 py-0.5 text-[11px] font-bold text-success">
              {item.inStock === false ? "Made to order" : "In stock"}
            </span>
          </div>
        )}

        {/* action footer */}
        <div className="mt-auto flex gap-2 border-t border-line pt-2.5">
          {item.type === "product" ? (
            <>
              <button
                onClick={(e) => {
                  stop(e);
                  go();
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-forest px-3 py-2 text-[13.5px] font-semibold text-white transition hover:bg-forest-deep"
              >
                <Icon name="chat" size={15} /> Contact seller
              </button>
              <button
                onClick={(e) => {
                  stop(e);
                  go();
                }}
                className="flex items-center justify-center gap-1.5 rounded-[8px] border border-line bg-bone px-3 py-2 text-[13.5px] font-semibold text-ink transition hover:border-forest hover:text-forest"
              >
                <Icon name="products" size={15} /> Sample
              </button>
            </>
          ) : item.type === "catalogue" ? (
            <button
              onClick={(e) => {
                stop(e);
                go();
              }}
              className="flex w-full items-center justify-between gap-1.5 text-[13px] font-bold text-forest transition group-hover:text-forest-deep"
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon name="catalogue" size={15} /> Get catalogue
              </span>
              <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                stop(e);
                go();
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-forest px-3 py-2 text-[13.5px] font-semibold text-white transition hover:bg-forest-deep"
            >
              <Icon name="send" size={15} /> Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
