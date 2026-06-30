import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Spinner } from "@/components/ui";
import {
  PublicPage,
  Breadcrumb,
  Gallery,
  Tabs,
  Reviews,
  CardGrid,
  SectionHeader,
  useOverlays,
} from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleSaved, selectSavedIds } from "@/redux/slice/savedSlice";
import { useAlert } from "@/providers";
import { useDetailItem } from "@/hooks/useDetailItem";
import { formatPrice } from "@/lib/listing";
import { PAGES, canonical } from "@/lib/constants";
import {
  ProcessBox,
  TrustRow,
  SpecTable,
  PaneHead,
  DescriptionPane,
  CompanyProfile,
  InstallPane,
  detailRows,
  SPEC_ROWS,
} from "./sections";

export default function ProductDetail() {
  const { item, vm, notFound, status } = useDetailItem(["product"]);
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectSavedIds);
  const { openConnect, openReport } = useOverlays();
  const { success } = useAlert();
  const [qty, setQty] = useState(50);

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
        <h1 className="display-2 mb-2">Product not found</h1>
        <Link to={PAGES.PRODUCTS} className="font-medium text-forest hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const isSaved = saved.includes(item.id);
  const rating = item.rating ?? 4.4;
  const unit = item.unit ?? "sq ft";
  const price = item.price ?? 480;
  const oldPrice = item.oldPrice ?? Math.round(price * 1.21);
  const saving = oldPrice - price;
  const inStock = item.inStock ?? item.open ?? true;
  const connect = (intent: Parameters<typeof openConnect>[0]) =>
    openConnect({ intent: "product", sellerName: item.by, itemName: item.title, ...intent });

  return (
    <>
      <PublicPage title={item.title} description={vm.description} canonicalUrl={canonical(`/products/${item.slug}`)} />

      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <Breadcrumb
          items={[
            { label: "Home", to: PAGES.HOME },
            { label: "Products", to: PAGES.PRODUCTS },
            { label: item.category, to: `${PAGES.PRODUCTS}?filter=${item.cat}` },
            { label: item.title },
          ]}
        />

        {/* ══ PRODUCT GRID: Gallery + Info ══ */}
        <div className="mt-5 grid items-start gap-8 lg:grid-cols-2">
          {/* LEFT: gallery */}
          <div className="lg:sticky lg:top-[78px] lg:self-start lg:border-r lg:border-line lg:pr-7">
            <Gallery
              slides={vm.gallery}
              badges={["Bestseller", item.verified ? "IB Verified" : ""].filter(Boolean)}
            />
          </div>

          {/* RIGHT: info */}
          <div className="lg:pl-7">
            {/* tags */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-forest px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white">
                {item.category}
              </span>
              {item.verified && (
                <span className="flex items-center gap-1 rounded-full border border-green-mint bg-green-light px-2.5 py-1 text-[11px] font-bold text-forest">
                  <Icon name="verified" size={12} /> IB Verified
                </span>
              )}
              <span className="rounded-full border border-line-strong bg-chip px-2.5 py-1 text-[11px] font-semibold text-muted">
                Origin: Italy
              </span>
            </div>

            <h1 className="mb-2 text-[22px] font-bold leading-snug text-ink">{item.title}</h1>

            {/* seller row */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-[13px] text-muted">
                <Icon name="business" size={14} className="text-forest" /> Sold by{" "}
                <span className="font-semibold text-forest">{item.by}</span>
              </span>
              <span className="flex items-center gap-1 rounded-full bg-green-light px-2 py-0.5 text-[11px] font-semibold text-forest">
                <Icon name="clock" size={11} /> Responds within 4 hrs
              </span>
            </div>

            {/* rating */}
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex text-amber">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon key={n} name={n <= Math.round(rating) ? "star-filled" : "star"} size={14} />
                ))}
              </span>
              <span className="text-[14px] font-bold text-ink">{rating}</span>
              <span className="text-[12.5px] text-muted">({item.reviews ?? 208} reviews)</span>
              <span className="flex items-center gap-1 text-[12.5px] text-muted">
                <Icon name="trending" size={13} className="text-forest" /> 2.4k interested
              </span>
            </div>

            <div className="my-3 h-px bg-line" />

            {/* price block */}
            <div className="mb-3">
              <div className="mb-1 flex flex-wrap items-baseline gap-2">
                <span className="font-editorial text-[36px] leading-none text-forest">{formatPrice(price)}</span>
                <span className="text-[13px] text-muted">/{unit}</span>
                <span className="text-[15px] text-muted line-through">{formatPrice(oldPrice)}</span>
                {saving > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-danger-light px-2 py-0.5 text-[11.5px] font-bold text-danger">
                    <Icon name="bookmark" size={11} /> Save {formatPrice(saving)}/{unit}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-muted">Minimum order: 50 {unit}</p>
              <p className="text-[11.5px] text-muted">+ 18% GST applicable · Price ex-warehouse Delhi</p>
            </div>

            {/* stock */}
            <div className="my-2.5 flex flex-wrap items-center gap-2">
              <span
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold ${
                  inStock ? "bg-green-light text-forest" : "bg-chip text-muted"
                }`}
              >
                <Icon name={inStock ? "check" : "clock"} size={13} /> {inStock ? "In stock" : "Made to order"}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-muted">
                <Icon name="products" size={13} className="text-forest" /> Min order: 50 {unit} · Sample: ₹250 (refundable)
              </span>
            </div>

            <div className="my-3 h-px bg-line" />

            {/* qty stepper */}
            <div className="mb-3.5 flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-semibold text-ink">Quantity</span>
              <div className="flex items-center overflow-hidden rounded-[9px] border-[1.5px] border-line">
                <button
                  onClick={() => setQty((q) => Math.max(50, q - 10))}
                  aria-label="Decrease quantity"
                  className="grid h-[34px] w-[34px] place-items-center bg-chip text-ink transition hover:bg-green-light hover:text-forest"
                >
                  <Icon name="minus" size={16} />
                </button>
                <span className="grid h-[34px] w-12 place-items-center border-x-[1.5px] border-line bg-bone-card text-[14px] font-bold text-ink">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 10)}
                  aria-label="Increase quantity"
                  className="grid h-[34px] w-[34px] place-items-center bg-chip text-ink transition hover:bg-green-light hover:text-forest"
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <span className="text-[12.5px] text-muted">{unit}</span>
            </div>

            {/* CTAs */}
            <div className="mb-2.5 flex flex-wrap gap-2">
              <button
                onClick={() => connect({})}
                className="flex min-w-[140px] flex-1 items-center justify-center gap-1.5 rounded-full bg-forest px-4 py-3 text-[14px] font-bold text-white transition hover:-translate-y-px hover:bg-forest-deep"
              >
                <Icon name="sparkles" size={16} /> Contact seller
              </button>
              <button
                onClick={() => connect({ itemName: `Sample — ${item.title}` })}
                className="flex min-w-[120px] flex-1 items-center justify-center gap-1.5 rounded-full border-[1.5px] border-line-strong bg-chip px-3.5 py-3 text-[13.5px] font-semibold text-ink transition hover:border-forest hover:text-forest"
              >
                <Icon name="products" size={16} /> Request sample
              </button>
            </div>

            {/* save / share / report */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => dispatch(toggleSaved(item.id))}
                className={`flex h-9 items-center gap-1.5 rounded-full border-[1.5px] px-4 text-[13px] font-semibold transition ${
                  isSaved
                    ? "border-forest bg-green-light text-forest"
                    : "border-line-strong bg-chip text-muted hover:border-forest hover:bg-green-light hover:text-forest"
                }`}
              >
                <Icon name="bookmark" size={15} /> {isSaved ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => success("Link copied to clipboard.")}
                className="flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-line-strong bg-chip px-4 text-[13px] font-semibold text-muted transition hover:border-forest hover:bg-green-light hover:text-forest"
              >
                <Icon name="share" size={15} /> Share
              </button>
              <button
                onClick={openReport}
                className="flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-line-strong bg-chip px-4 text-[13px] font-semibold text-muted transition hover:border-forest hover:bg-green-light hover:text-forest"
              >
                <Icon name="flag" size={15} /> Report
              </button>
            </div>

            {/* what happens after you connect */}
            <div className="my-3 h-px bg-line" />
            <ProcessBox />

            {/* trust */}
            <div className="mt-3">
              <TrustRow rating={rating} />
            </div>
          </div>
        </div>

        {/* ══ TABS ══ */}
        <div className="mt-8">
          <Tabs
            sticky
            tabs={[
              {
                key: "details",
                label: "Product details",
                icon: "products",
                content: (
                  <div>
                    <PaneHead title="Product details" sub="What you're ordering, sizes, and how it ships" />
                    <SpecTable rows={detailRows(item)} />
                  </div>
                ),
              },
              {
                key: "description",
                label: "Description",
                icon: "about",
                content: (
                  <div>
                    <PaneHead title="Description" sub="The story and provenance of this material" />
                    <DescriptionPane />
                  </div>
                ),
              },
              {
                key: "specs",
                label: "Specifications",
                icon: "insights",
                content: (
                  <div>
                    <PaneHead title="Technical specifications" sub="Physical properties, finish, and compliance" />
                    <SpecTable rows={SPEC_ROWS} />
                  </div>
                ),
              },
              {
                key: "install",
                label: "Installation & care",
                icon: "settings",
                content: (
                  <div>
                    <PaneHead title="Installation & care" sub="Fitting steps and long-term maintenance" />
                    <InstallPane />
                  </div>
                ),
              },
              {
                key: "company",
                label: "About the seller",
                icon: "business",
                content: (
                  <div>
                    <PaneHead title="About the seller" sub="Verified business profile and contact" />
                    <CompanyProfile item={item} onConnect={() => connect({})} />
                  </div>
                ),
              },
              {
                key: "reviews",
                label: `Reviews (${item.reviews ?? 208})`,
                icon: "star",
                content: (
                  <Reviews
                    rating={rating}
                    count={item.reviews ?? 208}
                    breakdown={vm.ratingBreakdown}
                    reviews={vm.reviews}
                  />
                ),
              },
            ]}
          />
        </div>

        {/* ══ SIMILAR PRODUCTS ══ */}
        {vm.related.length > 0 && (
          <section className="mt-10">
            <SectionHeader
              title={
                <>
                  Similar <em>products</em>
                </>
              }
              subtitle={`More ${item.category.toLowerCase()} from verified sellers`}
              moreTo={`${PAGES.PRODUCTS}?filter=${item.cat}`}
              moreLabel={`View all in ${item.category}`}
            />
            <CardGrid items={vm.related} variant="feed" />
          </section>
        )}
      </div>
    </>
  );
}
