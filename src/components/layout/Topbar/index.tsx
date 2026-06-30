import { Link } from "react-router-dom";
import { Button, Icon } from "@/components/ui";
import { PAGES } from "@/lib/constants";
import { NAV_CONTENT } from "@/content/nav.content";
import { useCmsBrand } from "@/hooks/useCmsBrand";
import { useTopbar } from "./useTopbar";

interface TopbarProps {
  /** Toggle the mobile sidebar drawer. */
  onMenu: () => void;
  /** Hide the menu button when the layout has no sidebar. */
  showMenu?: boolean;
}

export function Topbar({ onMenu, showMenu = true }: TopbarProps) {
  const c = NAV_CONTENT;
  const brand = useCmsBrand();
  const t = useTopbar();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center gap-3 border-b border-line bg-bone-card/95 px-3 backdrop-blur md:px-5">
      {showMenu && (
        <button
          onClick={onMenu}
          aria-label="Toggle menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] text-forest hover:bg-bone-tint lg:hidden"
        >
          <Icon name="menu" size={22} />
        </button>
      )}

      {/* brand */}
      <Link to={PAGES.HOME} className="flex shrink-0 items-center gap-2.5">
        <img src={brand.logo} alt="" className="block h-[34px] w-[34px] shrink-0 rounded-[8px] object-cover" />
        <span className="hidden flex-col leading-none sm:flex">
          <span className="font-serif text-[20px] italic text-forest">{brand.name}</span>
          <span className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-light">{brand.tagline}</span>
        </span>
      </Link>

      {/* search */}
      <form onSubmit={t.onSearch} className="mx-auto flex w-full max-w-xl items-center">
        <div className="flex w-full items-center gap-2 rounded-[11px] border border-line bg-bone px-3 py-2 focus-within:border-forest">
          <Icon name="search" size={18} className="text-muted" />
          <input
            value={t.query}
            onChange={(e) => t.setQuery(e.target.value)}
            placeholder={c.searchPlaceholder}
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted"
            aria-label="Search"
          />
          <button type="button" aria-label="Voice search" className="text-muted hover:text-forest">
            <Icon name="mic" size={18} />
          </button>
        </div>
      </form>

      {/* right cluster */}
      <div className="flex shrink-0 items-center gap-1.5">
        <Button variant="secondary" size="sm" className="hidden md:inline-flex" onClick={t.goPlans}>
          <Icon name="rocket" size={16} /> List your business
        </Button>

        {!t.auth.loggedIn ? (
          <>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={t.goAuth}>
              Sign in
            </Button>
            <Button size="sm" onClick={t.goAuth}>
              <Icon name="user" size={15} /> Get started
            </Button>
          </>
        ) : (
          <>
            <Link
              to={PAGES.RECENTLY_VIEWED}
              aria-label="Saved"
              className="grid h-10 w-10 place-items-center rounded-[11px] text-forest hover:bg-bone-tint"
            >
              <Icon name="bookmark" size={20} />
            </Link>
            <button
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-[11px] text-forest hover:bg-bone-tint"
            >
              <Icon name="bell" size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber" />
            </button>

            {/* profile dropdown */}
            <div className="relative" ref={t.menuRef}>
              <button
                onClick={() => t.setMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full border border-line py-1 pl-1 pr-2 hover:border-forest"
                aria-haspopup="menu"
                aria-expanded={t.menuOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-[13px] font-semibold text-bone">
                  {t.auth.initials || "IB"}
                </span>
                <Icon name="chevron-down" size={16} className="text-muted" />
              </button>

              {t.menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-card border border-line bg-bone-card shadow-card"
                >
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate font-semibold text-ink">{t.auth.name || "Your account"}</p>
                    <p className="truncate text-[13px] text-muted">{t.auth.email}</p>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-sel-bg px-2 py-0.5 text-[11px] font-medium capitalize text-forest">
                      <Icon name="verified" size={12} /> {t.role}
                    </span>
                  </div>
                  <div className="py-1.5">
                    <button onClick={t.goDashboard} className="menu-row" role="menuitem">
                      <Icon name="dashboard" size={18} /> Dashboard
                    </button>
                    <Link to={PAGES.PLANS} onClick={() => t.setMenuOpen(false)} className="menu-row" role="menuitem">
                      <Icon name="rosette" size={18} /> Become a member
                    </Link>
                    <Link to={PAGES.HELP} onClick={() => t.setMenuOpen(false)} className="menu-row" role="menuitem">
                      <Icon name="help" size={18} /> Help &amp; support
                    </Link>
                  </div>
                  <div className="border-t border-line py-1.5">
                    <button onClick={t.onLogout} className="menu-row text-err" role="menuitem">
                      <Icon name="logout" size={18} /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
