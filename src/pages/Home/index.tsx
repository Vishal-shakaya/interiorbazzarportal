import { Link } from "react-router-dom";
import { Icon, Spinner } from "@/components/ui";
import {
  PublicPage,
  HeroCarousel,
  FilterChips,
  ShortsRow,
  CardGrid,
  Testimonials,
  SectionHeader,
} from "@/components/shared";
import { PAGES } from "@/lib/constants";
import { InspirationGrid, ProofBand, FeatureStrip, WrittenReviews, JournalSection, FinalCtaBand } from "./sections";
import { useHome } from "./useHome";

export default function Home() {
  const { content: c, status, retry, filter, setFilter, cityLabel, sections, shorts, testimonials } = useHome();
  const hasFeed =
    sections.products.length || sections.services.length || sections.businesses.length || sections.shops.length;

  // "For you" = a mixed, round-robin interleave of the section feeds.
  const forYou = (() => {
    const lanes = [sections.products, sections.services, sections.businesses, sections.shops];
    const out: typeof sections.products = [];
    for (let i = 0; i < 4; i++) for (const lane of lanes) if (lane[i]) out.push(lane[i]);
    return out.slice(0, 8);
  })();

  if (status === "loading" || status === "idle" || !c) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="display-2 mb-2">Couldn't load the homepage</h1>
        <button onClick={retry} className="font-medium text-forest hover:underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <PublicPage title={c.seo.title} description={c.seo.description} canonicalUrl={c.seo.canonicalUrl} />

      {/* sticky category pill bar */}
      <div className="sticky top-[60px] z-20 border-b border-line bg-bone/95 backdrop-blur">
        <div className="mx-auto max-w-shell px-4 py-2.5 md:px-6">
          <FilterChips chips={c.categories} value={filter} onChange={setFilter} />
        </div>
      </div>

      <div className="mx-auto max-w-shell space-y-12 px-4 py-6 md:px-6">
        {cityLabel && (
          <div className="flex items-center justify-between rounded-card border border-line bg-bone-card px-4 py-3">
            <p className="flex items-center gap-2 text-[14px] text-ink">
              <Icon name="city" size={18} className="text-forest" /> Showing results in{" "}
              <span className="font-semibold">{cityLabel}</span>
            </p>
            <Link to={PAGES.HOME} className="text-[13px] font-medium text-forest hover:underline">
              Clear
            </Link>
          </div>
        )}

        <HeroCarousel slides={c.heroSlides} />

        <ShortsRow
          eyebrow="Trending now"
          title={
            <>
              <em>Hot</em> this week
            </>
          }
          reels={shorts}
          playAll
        />

        {forYou.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Recommended"
              title={
                <>
                  <em>For</em> you
                </>
              }
              subtitle="Based on your location and recent activity"
              moreTo={PAGES.EXPLORE}
            />
            <CardGrid items={forYou} />
          </section>
        )}

        {sections.products.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Trending products"
              title={
                <>
                  Shop <em>globally,</em> delivered to you
                </>
              }
              subtitle={"International and local products · verified sellers · bulk & retail"}
              moreTo={PAGES.PRODUCTS}
            />
            <CardGrid items={sections.products} />
          </section>
        )}

        {sections.services.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Interior services"
              title={
                <>
                  Hire <em>verified</em> professionals
                </>
              }
              subtitle="Design · execution · 3D visualization · cleaning · installation"
              moreTo={PAGES.SERVICES}
            />
            <CardGrid items={sections.services} />
          </section>
        )}

        {sections.businesses.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Verified businesses"
              title={
                <>
                  Find the <em>right studio</em> for your project
                </>
              }
              subtitle="Designers · architects · contractors · manufacturers — all IB verified"
              moreTo={PAGES.BUSINESSES}
            />
            <CardGrid items={sections.businesses} />
          </section>
        )}

        {sections.shops.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Shops near you"
              title={
                <>
                  Walk in, <em>touch &amp; feel</em> before you decide
                </>
              }
              subtitle="Showrooms, retailers, stockists — open today near New Delhi"
              moreTo={PAGES.SHOPS}
            />
            <CardGrid items={sections.shops} shopCards />
          </section>
        )}

        {sections.catalogues.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Fresh from manufacturers"
              title={
                <>
                  Latest <em>catalogues</em>
                </>
              }
              subtitle={"Free PDFs from verified makers · Connect for quotes & bulk · Updated this month"}
              moreTo={PAGES.CATALOGUES}
            />
            <CardGrid items={sections.catalogues} />
          </section>
        )}

        {!hasFeed && (
          <div className="grid place-items-center rounded-card border border-dashed border-line py-16 text-center text-muted">
            <p>No results for this filter{cityLabel ? ` in ${cityLabel}` : ""}.</p>
            <button onClick={() => setFilter("all")} className="mt-2 font-medium text-forest hover:underline">
              Clear filter
            </button>
          </div>
        )}

        <InspirationGrid />

        <Testimonials
          items={testimonials}
          eyebrow="Video stories"
          title={
            <>
              See it from <em>their own words</em>
            </>
          }
          subtitle="Real business owners — what the system delivered for them"
        />

        <ProofBand />

        <FeatureStrip />

        <WrittenReviews />

        <JournalSection />

        <FinalCtaBand />
      </div>
    </>
  );
}
