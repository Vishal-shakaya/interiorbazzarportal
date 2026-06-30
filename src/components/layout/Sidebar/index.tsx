import { NavLink, Link } from "react-router-dom";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PAGES } from "@/lib/constants";
import { NAV_CONTENT, type NavGroup } from "@/content/nav.content";

interface SidebarProps {
  /** Mobile drawer open state. */
  open: boolean;
  onClose: () => void;
}

const linkBase =
  "flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-[15px] text-ink/85 transition-colors hover:bg-bone-tint";
const linkActive = "bg-sel-bg text-forest font-semibold";

function Group({ group, onNavigate }: { group: NavGroup; onNavigate: () => void }) {
  return (
    <div className="px-3">
      {group.title && (
        <p className="px-3 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {group.title}
        </p>
      )}
      <nav className="space-y-0.5">
        {group.links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === PAGES.HOME}
            onClick={onNavigate}
            className={({ isActive }) => cn(linkBase, isActive && linkActive)}
          >
            <Icon name={l.icon} size={20} />
            <span className="flex-1">{l.label}</span>
            {l.badge && (
              <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber">
                {l.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const c = NAV_CONTENT;

  return (
    <>
      {/* mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed left-0 top-[60px] z-40 h-[calc(100vh-60px)] w-[240px] overflow-y-auto border-r border-line bg-bone-card pb-8 transition-transform lg:translate-x-0",
          "[scrollbar-width:thin]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Primary"
      >
        <Group group={c.primary} onNavigate={onClose} />
        <Group group={c.browse} onNavigate={onClose} />

        {/* promo — "Be where buyers look" → plans */}
        <div className="mx-3 mt-4 overflow-hidden rounded-[14px] bg-forest-deep p-4 text-white">
          <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.08em] text-green-mint">
            {c.promo.eyebrow}
          </div>
          <div className="mb-3 font-editorial text-[18px] leading-tight">{c.promo.title}</div>
          <Link
            to={c.promo.to}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-forest-deep transition hover:bg-green-mint"
          >
            {c.promo.cta} <Icon name="arrow-right" size={12} />
          </Link>
        </div>

        {/* cities */}
        <div className="px-3">
          <p className="px-3 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            {c.cities.title}
          </p>
          <nav className="space-y-0.5">
            {c.cities.items.map((city) => (
              <Link
                key={city.slug}
                to={`${PAGES.HOME}?city=${city.slug}`}
                onClick={onClose}
                className={linkBase}
              >
                <Icon name="city" size={20} />
                <span>{city.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <Group group={c.support} onNavigate={onClose} />

        {/* footer links */}
        <div className="mt-6 border-t border-line px-6 pt-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted">
            {c.footerLinks.map((f) => (
              <Link key={f.to} to={f.to} onClick={onClose} className="hover:text-forest">
                {f.label}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted/80">{c.legalLine}</p>
        </div>
      </aside>
    </>
  );
}
