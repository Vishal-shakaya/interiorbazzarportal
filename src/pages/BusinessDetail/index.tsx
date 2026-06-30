import { Link } from "react-router-dom";
import { Icon, Spinner, type IconName } from "@/components/ui";
import { PublicPage, Breadcrumb, Tabs, Reviews, useOverlays } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleSaved, selectSavedIds } from "@/redux/slice/savedSlice";
import { useAlert } from "@/providers";
import { useDetailItem } from "@/hooks/useDetailItem";
import { initialsOf } from "@/lib/listing";
import { PAGES, canonical } from "@/lib/constants";
import {
  AboutSection,
  WorkSection,
  VisitSection,
  FinalCta,
  ProductGrid,
  ServiceList,
  CatalogueList,
  SecHead,
  type SnapRow,
  type SpecItem,
  type ProjectItem,
  type ProductCard,
  type ServiceCard,
  type CatalogueCard,
  type ContactRow,
  type HoursRow,
} from "./sections";

/* Prototype content seeds (business-detail.html). Dynamic identity fields
   (name, category, city, rating, reviews, verified) come from the data hook. */

const SPECS: SpecItem[] = [
  { icon: "home", iconBg: "#e1f5ee", iconColor: "#085041", title: "Residential interiors", desc: "Apartments, villas, farmhouses — full home or single rooms" },
  { icon: "business", iconBg: "#faeeda", iconColor: "#854f0b", title: "Commercial fit-outs", desc: "Offices, co-working, retail stores — design + build" },
  { icon: "shops", iconBg: "#eeedfe", iconColor: "#3c3489", title: "Hospitality design", desc: "Boutique hotels, restaurants, cafés, and spas" },
  { icon: "architecture", iconBg: "#e1f5ee", iconColor: "#085041", title: "Architectural design", desc: "Building facades, spatial planning, structural coordination" },
  { icon: "services", iconBg: "#eaf3de", iconColor: "#27500a", title: "Turnkey execution", desc: "End-to-end: design → procurement → build → handover" },
  { icon: "sparkles", iconBg: "#faeeda", iconColor: "#854f0b", title: "Material consulting", desc: "Surface, finish, and fixture selection + vendor management" },
];

const PROJECTS: ProjectItem[] = [
  { bg: "linear-gradient(135deg,#085041,#1d9e75)", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&h=320&fit=crop&q=75", icon: "home", tag: "Residential", name: "Villa Ananta — 8,500 sqft", meta: "Jaipur · 9 months · ₹3.2Cr" },
  { bg: "linear-gradient(135deg,#1a1d2e,#3c3489)", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=320&fit=crop&q=75", icon: "business", tag: "Commercial", name: "TechHub Co-working — Noida", meta: "Noida · 5 months · ₹1.8Cr" },
  { bg: "linear-gradient(135deg,#5c3008,#d4823a)", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=320&fit=crop&q=75", icon: "shops", tag: "Hospitality", name: "The River House — Rishikesh", meta: "Rishikesh · 7 months · ₹4.1Cr" },
  { bg: "linear-gradient(135deg,#185fa5,#5a9bd9)", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=320&fit=crop&q=75", icon: "business", tag: "Commercial", name: "Greens Office Park — Noida", meta: "Noida · 11 months · ₹2.4Cr" },
  { bg: "linear-gradient(135deg,#27500a,#5a9e1c)", image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=600&h=320&fit=crop&q=75", icon: "home", tag: "Residential", name: "3BHK Vasant Vihar — 2,100 sqft", meta: "Delhi · 4 months · ₹38L" },
  { bg: "linear-gradient(135deg,#641a2c,#a73d5e)", image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=320&fit=crop&q=75", icon: "shops", tag: "Hospitality", name: "Café Prana — Hauz Khas", meta: "Delhi · 3 months · ₹28L" },
];

const PRODUCTS: ProductCard[] = [
  { image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=320&h=200&fit=crop&q=75", bg: "#e1f5ee", icon: "products", iconColor: "#085041", name: "Walnut accent chair", price: "₹18,500" },
  { image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=320&h=200&fit=crop&q=75", bg: "#dceeff", icon: "sparkles", iconColor: "#185fa5", name: "Brass pendant lamp", price: "₹7,200" },
  { image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=320&h=200&fit=crop&q=75", bg: "#faeeda", icon: "products", iconColor: "#854f0b", name: "Italian marble slab", price: "₹480/sqft" },
  { image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=320&h=200&fit=crop&q=75", bg: "#e8e4d8", icon: "products", iconColor: "#5c574d", name: "Teak pivot door", price: "₹38,000" },
  { image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=320&h=200&fit=crop&q=75", bg: "#eef3ee", icon: "services", iconColor: "#27500a", name: "Modular kitchen unit", price: "₹82,000" },
  { image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=320&h=200&fit=crop&q=75", bg: "#eeedfe", icon: "sparkles", iconColor: "#3c3489", name: "Designer wall sconce", price: "₹12,400" },
  { image: "https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=320&h=200&fit=crop&q=75", bg: "#faeeda", icon: "products", iconColor: "#854f0b", name: "Oak veneer panel", price: "₹2,100/sqft" },
  { image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=320&h=200&fit=crop&q=75", bg: "#e1f5ee", icon: "products", iconColor: "#085041", name: "Handloom area rug", price: "₹24,000" },
];

const SERVICES: ServiceCard[] = [
  { icon: "home", title: "Full-home interior design", desc: "Concept to handover for apartments, villas, and farmhouses", price: "From ₹85k/room" },
  { icon: "architecture", title: "Architectural consultation", desc: "Spatial planning, drawings, structural coordination", price: "₹5,000/session" },
  { icon: "services", title: "Turnkey execution", desc: "End-to-end design, procurement and build management", price: "Custom quote" },
  { icon: "sparkles", title: "Material & finish consulting", desc: "Surface, finish, and fixture selection + vendor management", price: "₹4,500/sqft" },
  { icon: "shops", title: "Commercial fit-out", desc: "Offices, retail and co-working — design and build", price: "₹8,000/room" },
  { icon: "kanban", title: "Project management", desc: "Site supervision, vendor coordination, timeline tracking", price: "Custom quote" },
];

const CATALOGUES: CatalogueCard[] = [
  { icon: "services", iconBg: "#e1f5ee", iconColor: "#085041", title: "Kitchen Systems 2026", meta: "PDF · 42 pages" },
  { icon: "products", iconBg: "#faeeda", iconColor: "#854f0b", title: "Living Room Collection", meta: "PDF · 28 pages" },
  { icon: "catalogue", iconBg: "#eeedfe", iconColor: "#3c3489", title: "Bathroom & Sanitary", meta: "PDF · 36 pages" },
  { icon: "sparkles", iconBg: "#eaf3de", iconColor: "#27500a", title: "Material & Finishes", meta: "PDF · 54 pages" },
];

const HEAD_STATS = [
  { n: "120+", l: "Projects delivered" },
  { n: "4.6", l: "Client rating" },
  { n: "<4h", l: "Avg. response" },
  { n: "98%", l: "Response rate" },
  { n: "₹25L+", l: "Avg. project" },
];

export default function BusinessDetail() {
  const { item, vm, notFound, status } = useDetailItem(["business", "shop"]);
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectSavedIds);
  const { openConnect } = useOverlays();
  const { success } = useAlert();

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
        <h1 className="display-2 mb-2">Business not found</h1>
        <Link to={PAGES.BUSINESSES} className="font-medium text-forest hover:underline">
          Back to businesses
        </Link>
      </div>
    );
  }

  const isSaved = saved.includes(item.id);
  const name = item.title;
  const sellerName = item.by || name;
  const principal = item.by || name;
  const enquiry = () => openConnect({ intent: item.type === "shop" ? "shop" : "project", sellerName });
  const share = () => success("Link copied to clipboard.");

  const snap: SnapRow[] = [
    { k: "Founded", v: `2009 · ${item.city}` },
    { k: "Team size", v: "Studio · 4 people" },
    { k: "Languages", v: "English · Hindi" },
    { k: "Project range", v: "₹38L – ₹4Cr" },
    { k: "Response time", v: "Within 4 hours", good: true },
  ];

  const contact: ContactRow[] = [
    { icon: "shops", k: "Address", v: `Lajpat Nagar-II, ${item.city}` },
    { icon: "phone", k: "Phone", v: "+91 98XX XXXXX" },
    { icon: "whatsapp", k: "WhatsApp", v: "Message us" },
    { icon: "explore", k: "Website", v: "vermadesign.in" },
    { icon: "mail", k: "Email", v: "studio@vermadesign.in" },
  ];

  const hours: HoursRow[] = [
    { d: "Today (Tue)", t: <>10am – 7pm · <span className="font-bold text-accent">Open</span></>, today: true },
    { d: "Wed – Sat", t: "10am – 7pm" },
    { d: "Sunday", t: "11am – 5pm" },
    { d: "Monday", t: <span className="text-muted">Closed</span> },
  ];

  const trust: { icon: IconName; label: string; cls: string }[] = [
    ...(item.verified ? [{ icon: "rosette" as IconName, label: "IB Verified", cls: "bg-green-light text-forest" }] : []),
    { icon: "star-filled", label: `${item.rating} · ${item.reviews} reviews`, cls: "bg-chip text-ink [&_svg]:text-amber" },
    { icon: "clock", label: `${item.open ? "Open" : "Closed"} · 10am–7pm`, cls: "bg-[#eaf3de] text-[#27500a]" },
    { icon: "calendar", label: `${item.experience ?? 15} years active`, cls: "bg-chip text-ink" },
    { icon: "city", label: "Serves 8 states", cls: "bg-chip text-ink" },
  ];

  return (
    <>
      <PublicPage title={name} description={vm.description} canonicalUrl={canonical(`/businesses/${item.slug}`)} />

      <div className="mx-auto max-w-[1080px] px-4 py-5 md:px-7">
        <Breadcrumb
          items={[
            { label: "Home", to: PAGES.HOME },
            { label: "Businesses", to: PAGES.BUSINESSES },
            { label: name },
          ]}
        />

        {/* ── BANNER ── */}
        <div className="relative mt-3.5 h-[200px] overflow-hidden rounded-[20px] shadow-pop" style={{ background: item.bg ?? "linear-gradient(135deg,#04342c 0%,#085041 52%,#0c6249 100%)" }}>
          {item.image && (
            <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          )}
          {item.verified && (
            <div className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-green-mint/30 bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.02em] text-[#eafaf3] backdrop-blur">
              <Icon name="verified" size={14} className="text-green-mint" /> IB Verified · Top 8%
            </div>
          )}
        </div>

        {/* ── HEADER ── */}
        <header className="border-b border-line pb-6">
          <div className="mb-3.5 flex items-end justify-between gap-4">
            <div
              className="-mt-[42px] ml-5 grid h-[84px] w-[84px] place-items-center rounded-[20px] border-4 border-bone font-editorial text-[31px] text-forest-deep shadow-card"
              style={{ background: "linear-gradient(135deg,#9fe1cb,#5dcaa5)" }}
            >
              {initialsOf(name)}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => dispatch(toggleSaved(item.id))}
                title="Save"
                className="grid h-[42px] w-[44px] place-items-center rounded-[12px] border border-line bg-bone-card text-ink transition hover:border-green-mint hover:bg-green-light hover:text-forest"
              >
                <Icon name="bookmark" size={17} className={isSaved ? "fill-forest text-forest" : ""} />
              </button>
              <button
                onClick={share}
                title="Share"
                className="grid h-[42px] w-[44px] place-items-center rounded-[12px] border border-line bg-bone-card text-ink transition hover:border-green-mint hover:bg-green-light hover:text-forest"
              >
                <Icon name="share" size={17} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <h1 className="font-editorial text-[34px] font-medium leading-[1.1] tracking-[-0.01em] text-ink">{name}</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={enquiry}
                className="inline-flex items-center gap-2 rounded-[12px] bg-forest px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-forest-deep"
              >
                <Icon name="send" size={16} /> Send enquiry
              </button>
              <button
                onClick={enquiry}
                className="inline-flex items-center gap-2 rounded-[12px] border border-line bg-bone-card px-4 py-2.5 text-[13.5px] font-semibold text-ink transition hover:border-green-mint hover:bg-green-light hover:text-forest"
              >
                <Icon name="whatsapp" size={16} className="text-[#25d366]" /> WhatsApp
              </button>
              <button
                onClick={enquiry}
                className="inline-flex items-center gap-2 rounded-[12px] border border-line bg-bone-card px-4 py-2.5 text-[13.5px] font-semibold text-ink transition hover:border-green-mint hover:bg-green-light hover:text-forest"
              >
                <Icon name="phone" size={16} /> Phone
              </button>
            </div>
          </div>

          <div className="mt-2.5 text-[15px] text-ink/80">
            {item.category} — led by <strong className="font-semibold text-ink">Ar. {principal}</strong> in {item.city}
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {trust.map((t, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium ${t.cls}`}>
                <Icon name={t.icon} size={14} /> {t.label}
              </span>
            ))}
          </div>

          <div className="mt-[22px] flex overflow-hidden rounded-[18px] border border-line bg-bone-card shadow-card">
            {HEAD_STATS.map((s, i) => (
              <div
                key={s.l}
                className={`min-w-0 flex-1 px-4 py-4 text-center ${i < HEAD_STATS.length - 1 ? "border-r border-dashed border-line" : ""}`}
              >
                <div className="font-editorial text-[24px] leading-none text-forest">{s.n}</div>
                <div className="mt-1.5 text-[11px] text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </header>

        {/* ── TABS ── */}
        <div className="mt-5">
          <Tabs
            sticky
            tabs={[
              {
                key: "overview",
                label: "Overview",
                icon: "explore",
                content: (
                  <div>
                    <AboutSection
                      about={
                        <p>
                          <strong>{name}</strong> is a {item.city}–based architecture and interior design practice founded in
                          2009 by Ar. {principal}. The studio works across <strong>residential, commercial, and hospitality</strong>{" "}
                          projects — from compact apartments to large-format villas and boutique hotels.
                        </p>
                      }
                      aboutExtra={
                        <p>
                          Known for a material-honest, detail-driven approach, the team handles projects end-to-end: concept
                          design, working drawings, material procurement, and on-site execution. Every project is led by a
                          principal designer with a dedicated site supervisor. The studio has delivered over {item.projects ?? 120}{" "}
                          projects across 8 states, with an average project value of ₹25L–₹4Cr.
                        </p>
                      }
                      snap={snap}
                      specs={SPECS}
                    />
                    <WorkSection
                      arch={{
                        initials: initialsOf(principal),
                        name: `Ar. ${principal}`,
                        role: `Principal Architect · COA verified · SPA Delhi, B.Arch 2009 · ${item.experience ?? 15} years`,
                        tags: ["Minimalist", "Sustainable", "Residential", "Commercial", "Hospitality"],
                        quote:
                          '"I don\'t follow trends — I build spaces that age well. Every project starts with understanding how the space will actually be lived in, not how it should look in photos."',
                      }}
                      projects={PROJECTS}
                      fullCount={item.projects ? `${item.projects}+` : "120+"}
                      onFullPortfolio={() => success("Full portfolio coming soon.")}
                      onProject={() => enquiry()}
                    />
                    <section className="scroll-mt-28 border-t border-line py-11">
                      <SecHead eyebrow="What you can buy or book" eyebrowIcon="explore" title="Products, services & catalogues" />
                      <ProductGrid items={PRODUCTS} onAsk={() => enquiry()} />
                    </section>
                    <section className="scroll-mt-28 border-t border-line py-11">
                      <SecHead
                        eyebrow="What clients say"
                        eyebrowIcon="star"
                        title="Reviews from real projects"
                        link={{ label: `See all ${item.reviews}`, onClick: () => success("All reviews coming soon.") }}
                      />
                      <Reviews rating={item.rating ?? 0} count={item.reviews ?? 0} breakdown={vm.ratingBreakdown} reviews={vm.reviews} />
                    </section>
                    <VisitSection
                      contact={contact}
                      hours={hours}
                      onDirections={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(item.city)}`, "_blank")}
                      onBookVisit={enquiry}
                    />
                    <FinalCta sellerName={sellerName} onEnquiry={enquiry} onWhatsapp={enquiry} onCall={enquiry} />
                  </div>
                ),
              },
              { key: "products", label: "Products", icon: "products", content: <ProductGrid items={PRODUCTS} onAsk={() => enquiry()} /> },
              { key: "services", label: "Services", icon: "services", content: <ServiceList items={SERVICES} onBook={enquiry} /> },
              { key: "catalogue", label: "Catalogue", icon: "catalogue", content: <CatalogueList items={CATALOGUES} onView={() => success("Catalogue download coming soon.")} /> },
              {
                key: "reviews",
                label: `Reviews (${item.reviews})`,
                icon: "star",
                content: <Reviews rating={item.rating ?? 0} count={item.reviews ?? 0} breakdown={vm.ratingBreakdown} reviews={vm.reviews} />,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
