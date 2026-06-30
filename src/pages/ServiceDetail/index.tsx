import { Link } from "react-router-dom";
import { Icon, Spinner } from "@/components/ui";
import {
  PublicPage,
  Breadcrumb,
  Gallery,
  Tabs,
  Reviews,
  useOverlays,
} from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleSaved, selectSavedIds } from "@/redux/slice/savedSlice";
import { useDetailItem } from "@/hooks/useDetailItem";
import { PAGES, canonical } from "@/lib/constants";
import {
  AFTER_CONNECT,
  TRUST,
  OverviewPane,
  ProcessPane,
  PortfolioPane,
  ProviderPane,
  FaqPane,
  SuggestionSection,
  SuggGrid,
  ScrollRow,
  SIMILAR_SERVICES,
  PROVIDER_SERVICES,
  COMBINED_SERVICES,
  RECENT_SERVICES,
} from "./sections";

/* Static meta echoed from the prototype (sd-tags / sd-chips). */
const SERVICE_TAGS = ["Residential", "Luxury", "Turnkey", "2D + 3D", "Material consultation", "Site supervision"];
const META_CHIPS: { icon: Parameters<typeof Icon>[0]["name"]; label: string }[] = [
  { icon: "city", label: "Delhi NCR" },
  { icon: "clock", label: "45–60 day delivery" },
  { icon: "rosette", label: "IDA Award 2024" },
  { icon: "user", label: "8-person team" },
];

export default function ServiceDetail() {
  const { item, vm, notFound, status } = useDetailItem(["service"]);
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectSavedIds);
  const { openConnect, openReport } = useOverlays();

  if (status === "loading" || status === "idle") {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>
    );
  }

  if (notFound || !item || !vm) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="display-2 mb-2">Service not found</h1>
        <Link to={PAGES.SERVICES} className="font-medium text-forest hover:underline">
          Back to services
        </Link>
      </div>
    );
  }

  const isSaved = saved.includes(item.id);
  const connect = () => openConnect({ intent: "service", sellerName: item.by, itemName: item.title });

  return (
    <>
      <PublicPage title={item.title} description={vm.description} canonicalUrl={canonical(`/services/${item.slug}`)} />

      <div className="mx-auto max-w-shell space-y-8 px-4 py-5 md:px-7">
        <Breadcrumb
          items={[
            { label: "Home", to: PAGES.HOME },
            { label: "Services", to: PAGES.SERVICES },
            { label: item.category, to: `${PAGES.SERVICES}?filter=${item.cat}` },
            { label: item.title },
          ]}
        />

        {/* ══ TOP: gallery + info ══ */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <Gallery
            slides={vm.gallery}
            badges={["Most booked", item.verified ? "IB Verified" : ""].filter(Boolean)}
          />

          <div className="space-y-3">
            {/* tag row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-forest px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-bone">
                {item.category}
              </span>
              {item.verified && (
                <span className="flex items-center gap-1 rounded-full border border-green-mint bg-green-light px-2.5 py-1 text-[11px] font-bold text-forest">
                  <Icon name="verified" size={11} /> IB Verified
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full border border-line-strong bg-chip px-2.5 py-1 text-[11px] font-semibold text-muted">
                <Icon name="city" size={11} /> {item.city}
              </span>
            </div>

            <h1 className="text-[24px] font-bold leading-tight text-ink">{item.title}</h1>

            {/* provider row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-[13.5px] text-muted">
                <Icon name="business" size={14} className="text-forest" /> By{" "}
                <span className="font-semibold text-forest">{item.by}</span>
              </span>
              <span className="flex items-center gap-1 rounded-full bg-green-light px-2.5 py-1 text-[11px] font-semibold text-forest">
                <Icon name="clock" size={11} /> Responds in 4 hrs
              </span>
            </div>

            {/* rating row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon key={n} name="star-filled" size={14} className="text-amber" />
                ))}
              </span>
              <span className="text-[14px] font-bold text-ink">{item.rating}</span>
              <span className="text-[12.5px] text-muted">({item.reviews} reviews)</span>
              <span className="flex items-center gap-1 text-[12.5px] text-muted">
                <Icon name="explore" size={14} className="text-forest" /> 4.2k interested
              </span>
              <span className="flex items-center gap-1 text-[12.5px] text-muted">
                <Icon name="rosette" size={14} className="text-amber" /> 8 yrs trusted
              </span>
            </div>

            <div className="h-px bg-line" />

            {/* price */}
            <div>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="font-editorial text-[38px] leading-none text-forest">₹85</span>
                <span className="text-[14px] text-muted">/sq ft onwards</span>
                <span className="flex items-center gap-1 rounded-full bg-danger-light px-2.5 py-0.5 text-[12px] font-bold text-danger">
                  <Icon name="sparkles" size={11} /> 12% off for IB users
                </span>
              </div>
              <p className="mt-0.5 text-[12.5px] text-muted">Final price depends on scope and customisation</p>
              <p className="text-[12px] text-muted">+ 18% GST applicable · Includes design + execution supervision</p>
            </div>

            {/* tags */}
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_TAGS.map((t) => (
                <span key={t} className="rounded-full border border-line bg-chip px-2.5 py-1 text-[11.5px] text-muted">
                  {t}
                </span>
              ))}
            </div>

            {/* meta chips */}
            <div className="flex flex-wrap gap-1.5">
              {META_CHIPS.map((c) => (
                <span
                  key={c.label}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-chip px-2.5 py-1.5 text-[12.5px] text-ink"
                >
                  <Icon name={c.icon} size={13} className="text-forest" /> {c.label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={connect}
                className="flex flex-1 min-w-[160px] items-center justify-center gap-1.5 rounded-full bg-forest px-5 py-3.5 text-[15px] font-bold text-bone transition hover:-translate-y-px hover:bg-forest-deep"
              >
                <Icon name="chat" size={16} /> Contact provider
              </button>
              <button
                onClick={connect}
                className="flex flex-1 min-w-[140px] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-line-strong bg-chip px-4 py-3 text-[14px] font-semibold text-ink transition hover:border-forest hover:text-forest"
              >
                <Icon name="calendar" size={16} /> Book free consult
              </button>
            </div>

            {/* save / share / report */}
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(toggleSaved(item.id))}
                title="Save"
                aria-label="Save"
                className={
                  "grid h-10 w-10 place-items-center rounded-full border-[1.5px] transition " +
                  (isSaved
                    ? "border-forest bg-green-light text-forest"
                    : "border-line bg-chip text-muted hover:border-forest hover:bg-green-light hover:text-forest")
                }
              >
                <Icon name="bookmark" size={18} className={isSaved ? "fill-current" : ""} />
              </button>
              <button
                title="Share"
                aria-label="Share"
                className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-line bg-chip text-muted transition hover:border-forest hover:bg-green-light hover:text-forest"
              >
                <Icon name="share" size={18} />
              </button>
              <button
                onClick={openReport}
                title="Report this listing"
                aria-label="Report"
                className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-line bg-chip text-muted transition hover:border-forest hover:bg-green-light hover:text-forest"
              >
                <Icon name="flag" size={18} />
              </button>
              <Link
                to={PAGES.SERVICES}
                title="Back to services"
                aria-label="Back to services"
                className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-line bg-chip text-muted transition hover:border-forest hover:bg-green-light hover:text-forest"
              >
                <Icon name="arrow-right" size={18} className="rotate-180" />
              </Link>
            </div>

            {/* what happens after you contact */}
            <div className="rounded-card bg-green-light p-4">
              <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-forest">
                <Icon name="about" size={13} /> What happens after you contact
              </p>
              <ol className="divide-y divide-forest/10">
                {AFTER_CONNECT(item.by).map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 py-1.5 text-[13px] leading-relaxed text-ink">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest text-[10px] font-bold text-bone">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* trust strip */}
            <div className="flex flex-wrap gap-2">
              {TRUST.map((t) => (
                <span
                  key={t.label}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-chip px-2.5 py-1.5 text-[11.5px] text-muted"
                >
                  <Icon name={t.icon} size={13} className="text-forest" /> {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ TABS ══ */}
        <Tabs
          tabs={[
            { key: "overview", label: "Overview", icon: "about", content: <OverviewPane description={vm.description} /> },
            { key: "process", label: "Process", icon: "sparkles", content: <ProcessPane /> },
            { key: "portfolio", label: "Portfolio (9)", icon: "photo", content: <PortfolioPane /> },
            { key: "provider", label: "About provider", icon: "business", content: <ProviderPane provider={item.by} onConnect={connect} /> },
            {
              key: "reviews",
              label: `Reviews (${item.reviews})`,
              icon: "star",
              content: (
                <div className="rounded-card border border-line bg-bone-card p-5 shadow-card md:px-7">
                  <Reviews rating={item.rating ?? 0} count={item.reviews ?? 0} breakdown={vm.ratingBreakdown} reviews={vm.reviews} />
                </div>
              ),
            },
            { key: "faq", label: "FAQ", icon: "help", content: <FaqPane /> },
          ]}
        />

        {/* ══ SUGGESTIONS ══ */}
        <div>
          <SuggestionSection
            title="Similar"
            emphasis="services"
            subtitle="Other interior design services in Delhi NCR"
            moreLabel="View all interior designers"
            moreTo={PAGES.SERVICES}
          >
            <SuggGrid items={SIMILAR_SERVICES} />
          </SuggestionSection>

          <SuggestionSection
            title="More from"
            emphasis={item.by}
            subtitle="Other services by this verified provider"
            moreLabel="View provider profile"
            moreTo={PAGES.SERVICES}
          >
            <SuggGrid items={PROVIDER_SERVICES} />
          </SuggestionSection>

          <SuggestionSection
            title="Frequently"
            emphasis="combined with"
            subtitle="Services buyers typically pair with interior design"
          >
            <ScrollRow items={COMBINED_SERVICES} />
          </SuggestionSection>

          <SuggestionSection
            title="Recently"
            emphasis="viewed"
            subtitle="Pick up where you left off"
            moreLabel="Browse all services"
            moreTo={PAGES.SERVICES}
          >
            <ScrollRow items={RECENT_SERVICES} />
          </SuggestionSection>
        </div>
      </div>
    </>
  );
}
