import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

interface FilterSidebarProps {
  verified: boolean;
  toggleVerified: () => void;
  priceMin: number;
  priceMax: number;
  setPrice: (min: number, max: number) => void;
  activeFilterCount: number;
  clearAll: () => void;
  /** Hide the price block for non-priced entities (services/shops/etc.). */
  showPrice?: boolean;
}

/** Right-hand filter panel — ported from the prototype products `.filter-panel`. */
export function FilterSidebar(p: FilterSidebarProps) {
  const [min, setMin] = useState(p.priceMin ? String(p.priceMin) : "");
  const [max, setMax] = useState(p.priceMax ? String(p.priceMax) : "");

  // keep inputs in sync when filters are cleared elsewhere
  useEffect(() => {
    setMin(p.priceMin ? String(p.priceMin) : "");
    setMax(p.priceMax ? String(p.priceMax) : "");
  }, [p.priceMin, p.priceMax]);

  const apply = () => p.setPrice(parseInt(min, 10) || 0, parseInt(max, 10) || 0);
  const fillPct = Math.min(100, ((parseInt(max, 10) || 500000) / 500000) * 100);
  const startPct = Math.min(100, ((parseInt(min, 10) || 0) / 500000) * 100);

  return (
    <div className="rounded-[14px] border border-line bg-bone-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[14px] font-bold text-ink">
          <Icon name="settings" size={16} /> Filters
        </span>
        {p.activeFilterCount > 0 && (
          <button onClick={p.clearAll} className="text-[13px] font-medium text-danger hover:underline">
            Clear all
          </button>
        )}
      </div>

      {p.showPrice !== false && (
        <div className="border-t border-line pt-4">
          <div className="mb-2.5 flex items-center gap-1.5 text-[13px] font-bold text-ink">₹ Price range</div>
          <div className="mb-2 flex justify-between text-[12px] text-muted">
            <span>₹0</span>
            <span>₹5,00,000+</span>
          </div>
          {/* decorative track */}
          <div className="relative mb-3 h-1 rounded-full bg-chip">
            <div className="absolute h-1 rounded-full bg-forest" style={{ left: `${startPct}%`, right: `${100 - fillPct}%` }} />
            <span className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-forest bg-white" style={{ left: `${startPct}%` }} />
            <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-full -translate-y-1/2 rounded-full border-2 border-forest bg-white" style={{ left: `${fillPct}%` }} />
          </div>
          <div className="flex items-center gap-2">
            <input
              value={min}
              onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
              onBlur={apply}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              inputMode="numeric"
              placeholder="Min ₹"
              className="w-full rounded-[8px] border border-line-strong bg-white px-3 py-2 text-[13.5px] outline-none focus:border-forest"
            />
            <span className="text-muted">—</span>
            <input
              value={max}
              onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
              onBlur={apply}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              inputMode="numeric"
              placeholder="Max ₹"
              className="w-full rounded-[8px] border border-line-strong bg-white px-3 py-2 text-[13.5px] outline-none focus:border-forest"
            />
          </div>
        </div>
      )}

      <div className="mt-4 space-y-1 border-t border-line pt-4">
        <Check label="IB Verified sellers only" checked={p.verified} onChange={p.toggleVerified} />
        <Check label="In stock only" />
        <Check label="Bulk available" />
        <Check label="Sample available" />
        <Check label="International shipping" />
      </div>
    </div>
  );
}

/** Attribute checkbox row (matches prototype `.sb2-check`). */
function Check({ label, checked, onChange }: { label: string; checked?: boolean; onChange?: () => void }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-[8px] px-2 py-2 text-[14px] transition hover:bg-bone-tint",
        checked && "font-medium text-forest",
      )}
    >
      <input type="checkbox" checked={!!checked} onChange={onChange} className="h-4 w-4 accent-forest" />
      {label}
    </label>
  );
}
