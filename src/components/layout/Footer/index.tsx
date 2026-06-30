import { Link } from "react-router-dom";
import { PAGES } from "@/lib/constants";
import { NAV_CONTENT } from "@/content/nav.content";
import { useCmsBrand } from "@/hooks/useCmsBrand";

export function Footer() {
  const c = NAV_CONTENT;
  const brand = useCmsBrand();
  return (
    <footer className="mt-16 border-t border-line bg-bone-card">
      <div className="mx-auto max-w-shell px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-[22px] italic text-forest">{brand.name}</p>
            <p className="mt-2 text-[14px] text-muted">
              A curated marketplace connecting you with verified interior products, services and
              professionals.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3">
            <FooterCol title="Browse" links={c.browse.links.map((l) => ({ label: l.label, to: l.to }))} />
            <FooterCol
              title="Company"
              links={[
                { label: "About IB", to: PAGES.ABOUT },
                { label: "Blog", to: PAGES.BLOG },
                { label: "Help center", to: PAGES.HELP },
                { label: "Contact", to: PAGES.CONTACT },
              ]}
            />
            <FooterCol title="Legal" links={c.footerLinks} />
          </nav>
        </div>

        <div className="mt-8 border-t border-line pt-5 text-[12px] text-muted">{c.legalLine}</div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-[14px] text-ink/80 hover:text-forest">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
