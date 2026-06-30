import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
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

/** Per-type avatar gradient (mirrors prototype ib-card AVATAR_GRAD). */
function avatarGrad(item: ListingItem): string {
  switch (item.type) {
    case "product":
      return "linear-gradient(135deg,#854f0b,#d4823a)";
    case "architect":
      return "linear-gradient(135deg,#185fa5,#5a9bd9)";
    case "catalogue":
      return "linear-gradient(135deg,#854f0b,#d4823a)";
    default:
      return "linear-gradient(135deg,#085041,#1d9e75)";
  }
}

/** Corner badge on the thumb: price (product) bottom-left, experience/scope bottom-right. */
function Corner({ item }: { item: ListingItem }) {
  if (item.type === "product" && item.price != null) {
    return (
      <div className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[13px] font-bold text-forest backdrop-blur">
        {formatPrice(item.price)}
      </div>
    );
  }
  const right =
    item.type === "service"
      ? item.scope
      : (item.type === "business" || item.type === "architect" || item.type === "shop") && item.experience
        ? `${item.experience} yrs`
        : null;
  if (!right) return null;
  return (
    <div className="absolute bottom-2 right-2 rounded-[5px] bg-black/85 px-1.5 py-0.5 text-[13px] font-semibold text-white">
      {right}
    </div>
  );
}

export function ListingCard({ item }: { item: ListingItem }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectSavedIds).includes(item.id);

  const onSave = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleSaved(item.id));
  };

  const facts: string[] = [];
  if (item.reviews != null) facts.push(`${item.reviews} reviews`);
  if (item.city) facts.push(item.city);

  return (
    <Link to={hrefForItem(item)} className="group flex cursor-pointer flex-col">
      {/* media */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px]" style={{ background: item.bg }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-white/40 transition-transform duration-300 group-hover:scale-[1.04]">
            {item.icon && <Icon name={item.icon} size={52} stroke={1.3} />}
          </div>
        )}

        {/* top-left tag(s) */}
        <div className="absolute left-2 top-2 flex gap-1.5">
          {item.sponsored && (
            <span className="rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
              Ad
            </span>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[12px] font-bold uppercase tracking-[0.04em] backdrop-blur",
              item.hot ? "bg-ink text-white" : "bg-white/95 text-forest",
            )}
          >
            {defaultTag(item)}
          </span>
        </div>

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

        <Corner item={item} />
      </div>

      {/* info */}
      <div className="mt-2.5 flex gap-2.5">
        <span
          className="mt-0.5 grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-[13px] font-bold text-white"
          style={{ background: avatarGrad(item) }}
        >
          {initialsOf(item.by)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[17px] font-semibold leading-[1.3] text-ink">{item.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-[13.5px] font-medium text-[#555]">
            <span className="truncate">{item.by}</span>
            {item.verified && <Icon name="verified" size={13} className="shrink-0 text-forest" />}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-[#555]">
            {item.rating != null && (
              <span className="inline-flex items-center gap-1 font-bold text-ink">
                <span className="text-[12px] text-amber">★</span>
                {item.rating}
              </span>
            )}
            {facts.map((f, i) => (
              <span key={f} className="inline-flex items-center gap-1.5">
                {(item.rating != null || i > 0) && <span className="h-[2px] w-[2px] rounded-full bg-muted" />}
                <span>{f}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
