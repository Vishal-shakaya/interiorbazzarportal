import { useRef } from "react";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface CategoryItem {
  key: string;
  label: string;
  icon?: IconName;
}

interface CategoryRowProps {
  items: CategoryItem[];
  value: string;
  onChange: (key: string) => void;
}

/** Horizontal scroll rail of category chips with left/right arrow controls. */
export function CategoryRow({ items, value, onChange }: CategoryRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => scrollBy(-280)}
        aria-label="Scroll left"
        className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-bone-card text-forest hover:border-forest md:grid"
      >
        <Icon name="chevron-left" size={18} />
      </button>

      <div
        ref={ref}
        className="flex flex-1 gap-2 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((c) => {
          const active = c.key === value;
          return (
            <button
              key={c.key}
              onClick={() => onChange(c.key)}
              aria-pressed={active}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition",
                active ? "border-forest bg-sel-bg text-forest" : "border-line bg-bone-card text-ink hover:border-forest",
              )}
            >
              {c.icon && <Icon name={c.icon} size={15} />}
              {c.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scrollBy(280)}
        aria-label="Scroll right"
        className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-bone-card text-forest hover:border-forest md:grid"
      >
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
  );
}
