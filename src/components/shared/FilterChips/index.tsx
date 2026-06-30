import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface Chip {
  key: string;
  label: string;
  icon?: IconName;
}

interface FilterChipsProps {
  chips: Chip[];
  value: string;
  onChange: (key: string) => void;
}

/** Single-select quick-filter row. Wire `value`/`onChange` to a `?filter=` param. */
export function FilterChips({ chips, value, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chips.map((c) => {
        const active = c.key === value;
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            aria-pressed={active}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-[7px] text-[13.5px] font-medium transition",
              active ? "bg-ink text-white" : "bg-chip text-ink hover:bg-chip-hover",
            )}
          >
            {c.icon && <Icon name={c.icon} size={15} />}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
