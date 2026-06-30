import { type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { hrefForItem, initialsOf } from "@/lib/listing";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleSaved, selectSavedIds } from "@/redux/slice/savedSlice";
import type { ListingItem } from "@/types/marketplace";

/**
 * Shop-specific card for "Shops near you" (prototype shop cards): open/closed
 * status dot, hours, distance badge, verified, rating, and a primary "Connect"
 * button — distinct from the generic ListingCard. The media + title link to the
 * shop detail; Connect routes there too (the enquiry/Connect flow lives there).
 */
export function ShopCard({ item }: { item: ListingItem }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectSavedIds).includes(item.id);
  const href = hrefForItem(item);

  const onSave = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleSaved(item.id));
  };

  return (
    <div className="group flex flex-col">
      {/* media */}
      <Link
        to={href}
        className="relative block aspect-[16/10] w-full overflow-hidden rounded-[12px]"
        style={{ background: item.bg }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-white/40">
            {item.icon && <Icon name={item.icon} size={52} stroke={1.3} />}
          </div>
        )}

        {/* status badge top-left */}
        <span
          className={cn(
            "absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-bold backdrop-blur",
            item.open ? "bg-white/95 text-forest" : "bg-black/55 text-white",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", item.open ? "bg-success" : "bg-white/70")} />
          {item.open ? "Open" : "Closed"}
        </span>

        {/* distance badge bottom-right */}
        {item.distance && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[12px] font-semibold text-white">
            <Icon name="city" size={12} /> {item.distance}
          </span>
        )}

        {/* save (hover) */}
        <button
          onClick={onSave}
          aria-label={saved ? "Remove from saved" : "Save"}
          aria-pressed={saved}
          className={cn(
            "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-ink backdrop-blur transition hover:scale-110 hover:text-forest",
            saved ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <Icon name="bookmark" size={15} className={cn(saved && "fill-forest text-forest")} />
        </button>
      </Link>

      {/* body */}
      <div className="mt-2.5 flex gap-2.5">
        <span
          className="mt-0.5 grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-[13px] font-bold text-white"
          style={{ background: "linear-gradient(135deg,#085041,#1d9e75)" }}
        >
          {initialsOf(item.by)}
        </span>
        <div className="min-w-0 flex-1">
          <Link to={href} className="block">
            <h3 className="line-clamp-1 text-[17px] font-semibold leading-[1.3] text-ink">{item.title}</h3>
          </Link>
          <p className="mt-1 flex items-center gap-1 text-[13.5px] font-medium text-[#555]">
            <span className="truncate">{item.category}</span>
            {item.verified && <Icon name="verified" size={13} className="shrink-0 text-forest" />}
          </p>
          {/* hours line */}
          <p className={cn("mt-0.5 text-[13px] font-medium", item.open ? "text-forest" : "text-muted")}>
            {item.open ? `Open · ${item.hoursOpen ?? ""}` : `Closed · ${item.reopensAt ?? "Opens 10am"}`}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-[#555]">
            {item.rating != null && (
              <span className="inline-flex items-center gap-1 font-bold text-ink">
                <span className="text-[12px] text-amber">★</span>
                {item.rating}
              </span>
            )}
            {item.reviews != null && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-[2px] w-[2px] rounded-full bg-muted" /> {item.reviews} reviews
              </span>
            )}
            {item.city && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-[2px] w-[2px] rounded-full bg-muted" /> {item.city}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Connect */}
      <button
        onClick={() => navigate(href)}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[14px] font-bold text-white transition hover:bg-forest-deep"
      >
        <Icon name="send" size={15} /> Connect
      </button>
    </div>
  );
}
