import { type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";

/** Card container used across dashboard views. */
export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-card border border-line bg-bone-card p-5 shadow-card", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="font-serif text-[18px] italic text-forest">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ icon, value, label }: { icon: IconName; value: string; label: string }) {
  return (
    <div className="rounded-card border border-line bg-bone-card p-4 shadow-card">
      <span className="grid h-9 w-9 place-items-center rounded-card bg-sel-bg text-forest">
        <Icon name={icon} size={18} />
      </span>
      <p className="mt-3 text-[24px] font-semibold text-forest">{value}</p>
      <p className="text-[13px] text-muted">{label}</p>
    </div>
  );
}

export function ToggleRow({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-line py-3 last:border-0">
      <span>
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        {desc && <span className="block text-[13px] text-muted">{desc}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-forest" : "bg-line")}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition", checked ? "left-[22px]" : "left-0.5")} />
      </button>
    </label>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center gap-2 rounded-card border border-dashed border-line py-14 text-center">
      <Icon name={icon} size={30} className="text-muted" />
      <p className="font-medium text-ink">{title}</p>
      {text && <p className="max-w-sm text-[14px] text-muted">{text}</p>}
      {action}
    </div>
  );
}
