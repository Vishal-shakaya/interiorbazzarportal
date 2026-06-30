import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAuth, selectRole, logout } from "@/redux/slice/authSlice";
import { PAGES } from "@/lib/constants";

export interface DashNavItem {
  key: string;
  label: string;
  icon: IconName;
  badge?: string;
}
export interface DashNavGroup {
  title?: string;
  items: DashNavItem[];
}

interface DashboardShellProps {
  /** "Buyer" | "Seller" — shown next to the logo. */
  kind: string;
  groups: DashNavGroup[];
  active: string;
  onSelect: (key: string) => void;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** Self-contained dashboard chrome (topbar + sidebar). Shared by buyer & seller. */
export function DashboardShell({ kind, groups, active, onSelect, title, subtitle, actions, children }: DashboardShellProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const role = useAppSelector(selectRole);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => setNavOpen(false), [active]);

  const onLogout = () => {
    dispatch(logout());
    navigate(PAGES.HOME);
  };

  return (
    <div className="min-h-screen bg-bone">
      {/* top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center gap-3 border-b border-line bg-bone-card px-3 md:px-5">
        <button onClick={() => setNavOpen((o) => !o)} aria-label="Toggle menu" className="grid h-10 w-10 place-items-center rounded-[11px] text-forest hover:bg-bone-tint lg:hidden">
          <Icon name="menu" size={22} />
        </button>
        <Link to={PAGES.HOME} className="flex items-baseline gap-2">
          <span className="font-serif text-[20px] italic text-forest">Interior bazzar</span>
          <span className="hidden rounded-full bg-sel-bg px-2 py-0.5 text-[11px] font-semibold text-forest sm:inline">{kind}</span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          <Link to={PAGES.HOME} className="hidden text-[13px] text-muted hover:text-forest md:inline">
            ← Back to site
          </Link>
          <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-[11px] text-forest hover:bg-bone-tint">
            <Icon name="bell" size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber" />
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full border border-line py-1 pl-1 pr-2 hover:border-forest">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-[13px] font-semibold text-bone">{auth.initials || "IB"}</span>
              <Icon name="chevron-down" size={16} className="text-muted" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-card border border-line bg-bone-card shadow-card" onMouseLeave={() => setMenuOpen(false)}>
                <div className="border-b border-line px-4 py-3">
                  <p className="truncate font-semibold text-ink">{auth.name || "Your account"}</p>
                  <p className="truncate text-[13px] text-muted">{auth.email}</p>
                </div>
                <div className="py-1.5">
                  <Link to={PAGES.HOME} className="menu-row">
                    <Icon name="home" size={18} /> Back to site
                  </Link>
                  <button onClick={onLogout} className="menu-row text-err">
                    <Icon name="logout" size={18} /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* sidebar */}
      <div className={cn("fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden", navOpen ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => setNavOpen(false)} />
      <aside className={cn("fixed left-0 top-[60px] z-40 flex h-[calc(100vh-60px)] w-[264px] flex-col overflow-y-auto border-r border-line bg-bone-card transition-transform lg:translate-x-0", navOpen ? "translate-x-0" : "-translate-x-full")}>
        {/* user card */}
        <div className="border-b border-line p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-forest text-[15px] font-semibold text-bone">{auth.initials || "IB"}</span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{auth.name || "Guest"}</p>
              <p className="flex items-center gap-1 text-[12px] capitalize text-muted">
                {auth.verified && <Icon name="verified" size={12} className="text-accent" />} {role}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3">
          {groups.map((g, gi) => (
            <div key={gi} className="mb-2">
              {g.title && <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{g.title}</p>}
              {g.items.map((it) => (
                <button
                  key={it.key}
                  onClick={() => onSelect(it.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] transition",
                    it.key === active ? "bg-sel-bg font-semibold text-forest" : "text-ink/85 hover:bg-bone-tint",
                  )}
                >
                  <Icon name={it.icon} size={19} />
                  <span className="flex-1">{it.label}</span>
                  {it.badge && <span className="rounded-full bg-forest px-1.5 text-[10px] font-semibold text-bone">{it.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* main */}
      <main className="pt-[60px] lg:pl-[264px]">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="display-2 text-[26px]">{title}</h1>
              {subtitle && <p className="text-muted">{subtitle}</p>}
            </div>
            {actions}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
