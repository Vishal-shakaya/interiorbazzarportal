import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Spinner } from "@/components/ui";
import { PublicPage, Breadcrumb, Tabs, CardGrid, useOverlays } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleSaved, selectSavedIds } from "@/redux/slice/savedSlice";
import { useDetailItem } from "@/hooks/useDetailItem";
import { PAGES, canonical } from "@/lib/constants";
import {
  deriveArchitect,
  projImg,
  Card,
  CardHead,
  CardLink,
  Chip,
  SpecRow,
  ProjectsGrid,
  Awards,
  ReviewsPane,
  type DetailReview,
} from "./sections";

export default function ArchitectDetail() {
  const { item, vm, notFound, status } = useDetailItem(["architect"]);
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectSavedIds);
  const { openConnect, openReport } = useOverlays();
  const [slide, setSlide] = useState(0);

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
        <h1 className="display-2 mb-2">Architect not found</h1>
        <Link to={PAGES.ARCHITECTS} className="font-medium text-forest hover:underline">
          Back to architects
        </Link>
      </div>
    );
  }

  const isSaved = saved.includes(item.id);
  const a = deriveArchitect(item);
  const name = item.title;
  const rating = item.rating ?? 0;
  const reviewCount = item.reviews ?? 0;
  const fullName = name.split(" ").slice(1).join(" ") || name;

  const connect = () => openConnect({ intent: "project", sellerName: name });

  // 6 hero carousel slides (project thumbnails)
  const heroSlides = Array.from({ length: 6 }, (_, i) => ({ img: projImg(item.id, i), bg: a.bg }));

  const detailReviews: DetailReview[] = [
    {
      name: "Mehta Family",
      rating: 5,
      date: "3 months ago",
      text: `Working with ${fullName} was the best decision for our home. Listened carefully, delivered ahead of schedule, and the result is everything we imagined and more.`,
    },
    {
      name: "Café Bloom Founders",
      rating: 5,
      date: "6 months ago",
      text: "Our café reflects exactly who we are as a brand. The space tells a story, and customers tell us they love spending time here. Worth every rupee.",
    },
    {
      name: "TechCo Operations",
      rating: 5,
      date: "8 months ago",
      text: "Professional from start to finish. Clear timelines, transparent pricing, and excellent on-site supervision. Will engage again for our next office.",
    },
  ];
  const ratingBars = [
    { stars: 5, pct: 84 },
    { stars: 4, pct: 11 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  /* ── Right sidebar key-details card ── */
  const keyDetails = (
    <div className="sticky top-[120px] rounded-[14px] border border-line bg-bone-card px-6 py-[22px]">
      <CardHead icon="kanban" title="Key details" />
      <div className="flex flex-col gap-3.5">
        <SpecRow icon="business" main={`${a.expLabel} experience`} sub={`${a.projectNum}+ completed projects`} />
        <SpecRow icon="city" main={a.fullLoc} sub={a.firm} />
        <SpecRow icon="rosette" main="Credentials" sub={a.credList.join(" · ")} />
        <SpecRow icon="chat" main="Languages" sub={a.langList.join(" · ")} />
        <SpecRow icon="billing" main={a.moq} sub="Free initial consultation" />
        <SpecRow icon="clock" main="Typical timeline" sub="2–3 weeks concept · 8–24 weeks execution" />
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
        <button
          onClick={connect}
          className="inline-flex items-center justify-center gap-1.5 rounded-[26px] bg-forest px-5 py-3 text-[13.5px] font-bold text-white shadow-card transition hover:bg-forest-deep"
        >
          <Icon name="chat" size={15} /> Start a project
        </button>
        <button
          onClick={connect}
          className="inline-flex items-center justify-center gap-1.5 rounded-[26px] border border-line bg-bone-card px-5 py-3 text-[13.5px] font-bold text-ink transition hover:border-forest hover:bg-green-light hover:text-forest"
        >
          <Icon name="calendar" size={15} /> Book consultation
        </button>
      </div>
    </div>
  );

  /* ── Tab panes ── */
  const overviewPane = (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <Card>
          <CardHead icon="about" title="About" link={<CardLink>Read full profile →</CardLink>} />
          <p className="text-[14px] leading-relaxed text-ink">{vm.description}</p>
          <div className="mt-3.5 flex flex-wrap gap-[7px]">
            {a.services.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead icon="photo" title="Recent projects" link={<CardLink>View all {a.projectNum} →</CardLink>} />
          <ProjectsGrid projects={a.projects.slice(0, 3)} />
        </Card>

        <Card>
          <CardHead icon="chat" title="What clients say" link={<CardLink>All {reviewCount} reviews →</CardLink>} />
          <div className="mb-3.5 flex items-center gap-[18px] border-b border-line pb-3.5">
            <div className="font-editorial text-[38px] leading-none text-forest">{rating.toFixed(1)}</div>
            <div>
              <span className="inline-flex text-amber">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon key={n} name={n <= Math.round(rating) ? "star-filled" : "star"} size={14} />
                ))}
              </span>
              <div className="mt-0.5 text-[12px] text-muted">{reviewCount} client reviews · 84% are 5-star</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-sel-bg font-editorial text-[15px] text-forest">
              M
            </span>
            <div className="flex-1">
              <div className="text-[13.5px] font-bold text-ink">{detailReviews[0].name}</div>
              <div className="text-[11.5px] text-muted">{detailReviews[0].date}</div>
            </div>
            <span className="inline-flex text-amber">
              {[1, 2, 3, 4, 5].map((n) => (
                <Icon key={n} name="star-filled" size={13} />
              ))}
            </span>
          </div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">{detailReviews[0].text}</p>
        </Card>

        <Card>
          <CardHead icon="rosette" title="Recent recognition" link={<CardLink>All awards →</CardLink>} />
          <Awards awards={a.awards.slice(0, 2)} />
        </Card>
      </div>
      {keyDetails}
    </div>
  );

  const profilePane = (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <Card>
          <CardHead icon="about" title="About" />
          <div className="space-y-3 text-[14px] leading-relaxed text-ink">
            <p>{vm.description}</p>
            <p>
              With {a.expYrs}+ years of practice, {fullName} brings a deep understanding of Indian context,
              contemporary design language, and the practical realities of building in metro markets. {a.firm}{" "}
              maintains close working relationships with material suppliers, contractors, and craftsmen — ensuring
              projects move smoothly from concept to handover.
            </p>
          </div>
        </Card>

        <Card>
          <CardHead icon="architecture" title="Areas of expertise" />
          <div className="flex flex-wrap gap-[7px]">
            {a.services.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead icon="explore" title="Engagement process" />
          <div className="flex flex-col gap-[18px]">
            {[
              { t: "Discovery call", d: "Free 30-minute consultation to understand your vision, timeline, and constraints." },
              { t: "Site assessment", d: "In-person visit, measurements, existing condition documentation, and feasibility review." },
              { t: "Concept & design", d: "3D renders, material palette, layout iterations, and detailed costing for your approval." },
              { t: "Execution & handover", d: "On-site supervision, contractor coordination, quality checks, and final walkthrough." },
            ].map((step, i, arr) => (
              <div key={step.t} className="relative flex items-start gap-4">
                {i < arr.length - 1 && (
                  <span className="absolute left-[18px] top-[42px] -bottom-[18px] w-px bg-line" />
                )}
                <div className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest font-editorial text-[16px] text-white">
                  {i + 1}
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="mb-1 text-[14px] font-bold text-ink">{step.t}</div>
                  <div className="text-[13px] leading-normal text-muted">{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {keyDetails}
    </div>
  );

  const projectsPane = (
    <Card>
      <CardHead icon="photo" title="Featured projects" link={<CardLink>View all {a.projectNum} →</CardLink>} />
      <ProjectsGrid projects={a.projects} />
    </Card>
  );

  const awardsPane = (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <Card>
          <CardHead icon="rosette" title="Recognition & awards" />
          <Awards awards={a.awards} />
        </Card>
      </div>
      <div>
        <div className="sticky top-[120px] rounded-[14px] border border-line bg-bone-card px-6 py-[22px]">
          <CardHead icon="verified" title="Credentials" />
          <div className="flex flex-col items-start gap-2">
            {a.credList.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const contactPane = (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <Card>
          <CardHead icon="mail" title="Ways to get in touch" />
          <div className="flex flex-col gap-3.5">
            <SpecRow icon="chat" main="Start a project chat" sub="Send your brief — usually responds within 4 hours during business days" />
            <SpecRow icon="calendar" main="Book a 30-min discovery call" sub="Free · No commitment · Phone or video" />
            <SpecRow icon="phone" main="+91 98XXX XXX42" sub="WhatsApp · Mon–Sat 10 AM – 7 PM IST" />
            <SpecRow
              icon="mail"
              main={`${a.firm.toLowerCase().replace(/[^a-z]/g, "")}@architects.in`}
              sub="For detailed briefs, contracts, and formal queries"
            />
            <SpecRow icon="city" main={a.firm} sub={`${a.fullLoc} · Studio visits by appointment`} />
          </div>
        </Card>
      </div>
      <div>
        <div className="sticky top-[120px] rounded-[14px] border border-line bg-bone-card px-6 py-[22px]">
          <CardHead icon="rocket" title="Quick start" />
          <button
            onClick={connect}
            className="mb-2 inline-flex w-full items-center justify-center gap-1.5 rounded-[26px] bg-forest px-5 py-3 text-[13.5px] font-bold text-white shadow-card transition hover:bg-forest-deep"
          >
            <Icon name="chat" size={15} /> Start a project
          </button>
          <button
            onClick={connect}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-[26px] border border-line bg-bone-card px-5 py-3 text-[13.5px] font-bold text-ink transition hover:border-forest hover:bg-green-light hover:text-forest"
          >
            <Icon name="calendar" size={15} /> Book consultation
          </button>
        </div>
      </div>
    </div>
  );

  const reviewsPane = (
    <ReviewsPane rating={rating} count={reviewCount} breakdown={ratingBars} reviews={detailReviews} />
  );

  return (
    <>
      <PublicPage title={name} description={vm.description} canonicalUrl={canonical(`/architects/${item.slug}`)} />

      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        {/* Top nav: breadcrumb + actions */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Breadcrumb
            items={[
              { label: "Home", to: PAGES.HOME },
              { label: "Architects", to: PAGES.ARCHITECTS },
              { label: fullName },
            ]}
          />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleSaved(item.id))}
              title={isSaved ? "Saved" : "Save"}
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bone-card text-ink transition hover:border-forest hover:text-forest"
            >
              <Icon name={isSaved ? "heart" : "bookmark"} size={17} className={isSaved ? "text-danger" : ""} />
            </button>
            <button
              title="Share"
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bone-card text-ink transition hover:border-forest hover:text-forest"
            >
              <Icon name="share" size={17} />
            </button>
            <button
              onClick={openReport}
              title="Report this listing"
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bone-card text-ink transition hover:border-forest hover:text-forest"
            >
              <Icon name="flag" size={17} />
            </button>
          </div>
        </div>

        {/* HERO */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-[380px_1fr]">
          {/* Portrait carousel */}
          <div className="group relative grid aspect-[3/4] place-items-center overflow-hidden rounded-[18px] shadow-card">
            {heroSlides.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-300"
                style={{ background: s.bg, opacity: i === slide ? 1 : 0 }}
              >
                <img src={s.img} alt={`${fullName} featured work`} className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
              </div>
            ))}
            <button
              onClick={() => setSlide((slide + 5) % 6)}
              title="Previous"
              className="absolute left-3.5 top-1/2 z-10 grid h-[38px] w-[38px] -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink opacity-0 shadow-card transition hover:text-forest group-hover:opacity-100"
            >
              <Icon name="chevron-left" size={18} />
            </button>
            <button
              onClick={() => setSlide((slide + 1) % 6)}
              title="Next"
              className="absolute right-3.5 top-1/2 z-10 grid h-[38px] w-[38px] -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink opacity-0 shadow-card transition hover:text-forest group-hover:opacity-100"
            >
              <Icon name="chevron-right" size={18} />
            </button>
            <span className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-1.5 text-[12px] font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
              <span className="h-[7px] w-[7px] rounded-full bg-green-mint shadow-[0_0_0_2.5px_rgba(93,214,116,0.3)]" />
              Available now
            </span>
            <div className="absolute bottom-5 right-5 z-10 flex gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`h-[7px] rounded-full transition-all ${i === slide ? "w-[22px] bg-white" : "w-[7px] bg-white/45"}`}
                />
              ))}
            </div>
          </div>

          {/* Hero info */}
          <div className="flex flex-col pt-1">
            <span className="mb-3 inline-flex items-center gap-2 self-start rounded-[20px] border border-green-mint bg-green-light px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-forest">
              <Icon name="verified" size={13} /> IB Verified · {a.titleLabel}
            </span>
            <h1 className="mb-2 font-editorial text-[46px] font-normal leading-[1.05] tracking-tight text-ink">
              {fullName}
            </h1>
            <div className="mb-[18px] flex flex-wrap items-center gap-2 text-[16px] font-medium text-muted">
              {a.jobTitle}
              {a.styleHint && (
                <span className="inline-flex items-center rounded-[20px] border border-green-mint bg-green-light px-2.5 py-0.5 text-[11px] font-bold text-forest">
                  {a.styleHint}
                </span>
              )}
            </div>

            <div className="mb-[22px] grid grid-cols-4 gap-3.5 rounded-[12px] border border-line bg-bone-card px-4 py-[18px]">
              {[
                { n: `${a.projectNum}+`, l: "Projects" },
                { n: `${a.expYrs}+`, l: "Years" },
                { n: rating.toFixed(1), l: "Rating" },
                { n: String(reviewCount), l: "Reviews" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center text-center">
                  <div className="mb-1 font-editorial text-[28px] leading-none text-forest">{s.n}</div>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted">{s.l}</div>
                </div>
              ))}
            </div>

            <p className="mb-[22px] text-[14.5px] leading-relaxed text-ink">{vm.description}</p>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={connect}
                className="inline-flex items-center gap-1.5 rounded-[26px] bg-forest px-[22px] py-[13px] text-[13.5px] font-bold text-white shadow-card transition hover:bg-forest-deep"
              >
                <Icon name="chat" size={15} /> Start a project
              </button>
              <button
                onClick={connect}
                className="inline-flex items-center gap-1.5 rounded-[26px] border border-line bg-bone-card px-5 py-[13px] text-[13.5px] font-bold text-ink transition hover:border-forest hover:bg-green-light hover:text-forest"
              >
                <Icon name="calendar" size={15} /> Book consultation
              </button>
              <button
                onClick={connect}
                className="inline-flex items-center gap-1.5 rounded-[26px] border border-line bg-bone-card px-5 py-[13px] text-[13.5px] font-bold text-ink transition hover:border-forest hover:bg-green-light hover:text-forest"
              >
                <Icon name="phone" size={15} /> Call
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <Tabs
          sticky
          tabs={[
            { key: "overview", label: "Overview", icon: "dashboard", content: overviewPane },
            { key: "profile", label: "Profile", icon: "user", content: profilePane },
            { key: "projects", label: `Projects (${a.projectNum})`, icon: "photo", content: projectsPane },
            { key: "reviews", label: `Reviews (${reviewCount})`, icon: "chat", content: reviewsPane },
            { key: "awards", label: "Awards", icon: "rosette", content: awardsPane },
            { key: "contact", label: "Contact", icon: "mail", content: contactPane },
          ]}
        />

        {/* Similar architects */}
        {vm.related.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex flex-col">
              <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.1em] text-forest">
                <span className="h-px w-6 bg-forest" /> Explore more
              </span>
              <h2 className="font-editorial text-[28px] font-normal leading-tight text-ink">
                Similar <em className="not-italic text-forest">architects</em>
              </h2>
            </div>
            <CardGrid items={vm.related} />
          </section>
        )}
      </div>
    </>
  );
}
