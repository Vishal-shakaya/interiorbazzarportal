import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface TabDef {
  key: string;
  label: string;
  icon?: IconName;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabDef[];
  /** Stick the tab bar under the topbar (business/architect detail). */
  sticky?: boolean;
}

export function Tabs({ tabs, sticky }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      <div
        className={cn(
          "flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          sticky && "sticky top-[60px] z-20 bg-bone/95 backdrop-blur",
        )}
        role="tablist"
      >
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(t.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-[14px] font-medium transition",
                on ? "border-forest text-forest" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.icon && <Icon name={t.icon} size={16} />}
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-5">
        {current?.content}
      </div>
    </div>
  );
}
