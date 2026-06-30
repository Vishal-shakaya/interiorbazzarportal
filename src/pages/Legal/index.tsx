import { Link, useLocation } from "react-router-dom";
import { PublicPage, Breadcrumb } from "@/components/shared";
import { Icon, Spinner } from "@/components/ui";
import { useAsync } from "@/hooks/useAsync";
import { ContentService } from "@/api";
import { PAGES, canonical } from "@/lib/constants";

/** Cross-links shown at the foot of every legal document. */
const CROSS = [
  { to: PAGES.TERMS, icon: "invoice", title: "Terms & Conditions", desc: "The agreement that governs use of the platform." },
  { to: PAGES.REFUND, icon: "billing", title: "Return & Refund", desc: "How subscription cancellation and refunds work." },
  { to: PAGES.PRIVACY, icon: "lock", title: "Privacy Policy", desc: "What data we handle, why, and your rights." },
  { to: PAGES.COOKIES, icon: "rosette", title: "Cookies Policy", desc: "Cookies and similar technologies we use." },
  { to: PAGES.DISCLAIMER, icon: "flag", title: "Disclaimer", desc: "Our role, and the limits of what we warrant." },
] as const;

/** Stable anchor id for a section heading. */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const pad = (n: number) => String(n).padStart(2, "0");

/** One template renders all five legal documents, chosen by the current path. */
export default function Legal() {
  const { pathname } = useLocation();
  // Last path segment ("terms", "privacy", …) is the document key.
  const slug = pathname.split("/").pop() || "terms";
  const { data: doc, status } = useAsync(() => ContentService.legal(slug), [slug]);

  if (status === "loading" || status === "idle" || !doc) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>
    );
  }

  const sections = doc.sections.map((s, i) => ({ ...s, id: slugify(s.h), n: pad(i + 1) }));

  return (
    <>
      <PublicPage title={doc.title} description={doc.intro} canonicalUrl={canonical(pathname)} />

      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <Breadcrumb
          items={[
            { label: "Home", to: PAGES.HOME },
            { label: "Legal" },
            { label: doc.title },
          ]}
        />

        {/* hero */}
        <header className="mt-4 border-b border-line pb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Interior Bazzar · Legal
          </p>
          <h1 className="font-editorial mt-3 text-[34px] italic leading-[1.12] text-ink md:text-[40px]">
            {doc.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{doc.intro}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-muted">
            <span>
              Last updated <b className="font-semibold text-ink">{doc.updated}</b>
            </span>
            <span>
              Version <b className="font-semibold text-ink">v1.0</b>
            </span>
            <span>
              Operated by <b className="font-semibold text-ink">Feelsafe Technology India Private Limited</b>
            </span>
            <span>
              CIN <b className="font-semibold text-ink">U62090DL2024PTC434514</b>
            </span>
          </div>
        </header>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[230px_1fr]">
          {/* table of contents */}
          <nav className="lg:sticky lg:top-[88px]" aria-label="On this page">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">On this page</p>
            <ol className="flex flex-col gap-0.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex gap-2 rounded-[7px] px-2 py-1.5 text-[13.5px] leading-snug text-muted transition-colors hover:bg-green-light hover:text-forest"
                  >
                    <span className="min-w-[16px] text-right tabular-nums text-muted/70">{s.n}</span>
                    <span>{s.h}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* article */}
          <article className="max-w-[760px]">
            <div className="mb-9 rounded-card border border-line border-l-[3px] border-l-forest bg-bone-card px-5 py-4 text-[15px] leading-relaxed text-ink">
              {doc.intro}
            </div>

            <div className="space-y-8">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="flex items-baseline gap-3 text-[20px] font-semibold tracking-tight text-ink md:text-[21px]">
                    <span className="shrink-0 font-mono text-[14px] font-semibold text-accent">{s.n}</span>
                    {s.h}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{s.p}</p>
                </section>
              ))}
            </div>

            {/* contact box */}
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-[14.5px]">
              <a href="mailto:help@interiorbazzar.com" className="flex items-center gap-2 text-forest hover:underline">
                <Icon name="mail" size={16} /> help@interiorbazzar.com
              </a>
              <span className="flex items-center gap-2 text-ink">
                <Icon name="phone" size={16} className="text-forest" /> +91-88823-14255
              </span>
              <a href="https://wa.me/918920898168" className="flex items-center gap-2 text-forest hover:underline">
                <Icon name="whatsapp" size={16} /> wa.me/918920898168
              </a>
            </div>

            {/* cross links */}
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {CROSS.map((c) => {
                const current = c.to === pathname;
                return (
                  <Link
                    key={c.to}
                    to={c.to}
                    className={
                      current
                        ? "block rounded-card border border-forest bg-green-light px-4 py-4"
                        : "block rounded-card border border-line bg-bone-card px-4 py-4 transition-colors hover:border-green-mint"
                    }
                  >
                    <div className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
                      <Icon name={c.icon} size={16} className="text-forest" />
                      {c.title}
                    </div>
                    <p className="mt-1 text-[12.5px] text-muted">{c.desc}</p>
                  </Link>
                );
              })}
            </div>

            {/* footer */}
            <footer className="mt-12 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-6">
              <p className="max-w-xl text-[13px] leading-relaxed text-muted">
                <b className="font-semibold text-ink">Feelsafe Technology India Private Limited</b>
                <br />
                Interior Bazzar is a product of Feelsafe Technology India Private Limited. CIN U62090DL2024PTC434514.
                MSME registered. Questions about this document:{" "}
                <a href="mailto:help@interiorbazzar.com" className="text-forest hover:underline">
                  help@interiorbazzar.com
                </a>{" "}
                · +91-88823-14255.
              </p>
              <span className="font-editorial text-[22px] italic text-accent">Little things.</span>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
