import { Icon, type IconName } from "@/components/ui";
import { SectionHeader } from "@/components/shared";

/* ──────────────────────────────────────────────────────────
   Static content ported verbatim from the prototype
   pages/explore.html (Explore page).
   ────────────────────────────────────────────────────────── */

/** Gradient backgrounds .g1..g12 from the prototype <style>. */
const G: Record<string, string> = {
  g1: "linear-gradient(135deg,#085041,#1d9e75)",
  g2: "linear-gradient(135deg,#854f0b,#d4823a)",
  g3: "linear-gradient(135deg,#185fa5,#5a9bd9)",
  g4: "linear-gradient(135deg,#3c3489,#7a6dd5)",
  g5: "linear-gradient(135deg,#27500a,#5a9e1c)",
  g6: "linear-gradient(135deg,#72243e,#b84d73)",
  g7: "linear-gradient(135deg,#04342c,#1d9e75)",
  g8: "linear-gradient(135deg,#5c3008,#d4823a)",
  g9: "linear-gradient(135deg,#333,#777)",
  g10: "linear-gradient(135deg,#0b3560,#3a8fd4)",
  g11: "linear-gradient(135deg,#7a4502,#e1a052)",
  g12: "linear-gradient(135deg,#1a4206,#5a9e1c)",
  dark: "linear-gradient(135deg,#1a1a17,#4d4944)",
};

/* ════════════════ STYLE CAT-BAR (pills) ════════════════ */

const STYLE_PILLS: { label: string; icon?: IconName }[] = [
  { label: "All styles" },
  { label: "Minimal" },
  { label: "Bohemian" },
  { label: "Classical" },
  { label: "Mid-century" },
  { label: "Biophilic" },
  { label: "Industrial" },
  { label: "Japandi" },
  { label: "Luxe" },
];
const STYLE_PILLS_2: { label: string; icon: IconName }[] = [
  { label: "Near me", icon: "city" },
  { label: "Verified", icon: "rosette" },
];

export function StyleBar() {
  return (
    <div className="-mx-4 flex items-center gap-[7px] overflow-x-auto px-4 py-[10px] [scrollbar-width:none] md:-mx-7 md:px-7 [&::-webkit-scrollbar]:hidden">
      {STYLE_PILLS.map((p, i) => (
        <button
          key={p.label}
          className={
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-[7px] text-[13.5px] font-medium transition " +
            (i === 0 ? "bg-ink text-white" : "bg-chip text-ink hover:bg-chip-hover")
          }
        >
          {p.label}
        </button>
      ))}
      <span className="mx-1.5 h-6 w-px shrink-0 bg-line" />
      {STYLE_PILLS_2.map((p) => (
        <button
          key={p.label}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-chip px-3.5 py-[7px] text-[13.5px] font-medium text-ink transition hover:bg-chip-hover"
        >
          <Icon name={p.icon} size={15} />
          {p.label}
        </button>
      ))}
    </div>
  );
}

/* ════════════════ HERO HEADER ════════════════ */

export function ExploreHero() {
  return (
    <div className="mt-5 mb-1 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col">
        <span className="sec-eye">curated for you</span>
        <h1 className="sec-title text-[38px]">
          Find <em>inspiration</em> for your space
        </h1>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
          Browse real homes, design ideas, materials and the people who can make it happen — sorted
          by your taste, budget, and city.
        </p>
      </div>
      <div className="flex gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-[22px] bg-forest px-3.5 py-[9px] text-[12.5px] font-semibold text-white">
          <Icon name="sparkles" size={14} /> Match wizard
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-[22px] border border-line bg-bone-card px-3.5 py-[9px] text-[12.5px] font-semibold text-ink">
          <Icon name="settings" size={14} /> Filters
        </button>
      </div>
    </div>
  );
}

/* ════════════════ ROOM TILES ════════════════ */

interface RoomTile {
  name: string;
  count: string;
  icon: IconName;
  bg: string;
}

const ROOM_TILES: RoomTile[] = [
  { name: "Kitchens", count: "2,840 ideas", icon: "products", bg: G.g1 },
  { name: "Bathrooms", count: "1,920 ideas", icon: "home", bg: G.g6 },
  { name: "Bedrooms", count: "3,210 ideas", icon: "home", bg: G.g3 },
  { name: "Living rooms", count: "2,540 ideas", icon: "home", bg: G.g7 },
  { name: "Foyer & hall", count: "980 ideas", icon: "architecture", bg: G.g8 },
  { name: "Lighting", count: "1,710 ideas", icon: "sparkles", bg: G.g10 },
  { name: "Balcony", count: "640 ideas", icon: "home", bg: G.g12 },
  { name: "Home office", count: "820 ideas", icon: "business", bg: G.g2 },
  { name: "Kids' room", count: "540 ideas", icon: "home", bg: G.g11 },
  { name: "Tiles & marble", count: "1,180 ideas", icon: "architecture", bg: G.g8 },
  { name: "Doors", count: "410 ideas", icon: "home", bg: G.dark },
  { name: "Flooring", count: "920 ideas", icon: "architecture", bg: G.g12 },
];

export function RoomTiles() {
  return (
    <>
      <div className="mt-7">
        <SectionHeader eyebrow="browse by room" title={<>What are you <em>designing?</em></>} />
      </div>
      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ROOM_TILES.map((t) => (
          <button
            key={t.name}
            style={{ background: t.bg }}
            className="exp-tile group relative flex aspect-[1.1/1] flex-col justify-between overflow-hidden rounded-[14px] p-3.5 text-left text-white transition hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgba(8,80,65,.18)]"
          >
            <span
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(160deg,transparent 40%,rgba(0,0,0,.55))" }}
            />
            <Icon name={t.icon} size={34} className="relative z-[1] text-white/85" />
            <div className="relative z-[1]">
              <div className="mb-0.5 text-[14px] font-bold leading-tight [text-shadow:0_1px_3px_rgba(0,0,0,.3)]">
                {t.name}
              </div>
              <div className="text-[11px] font-medium opacity-80">{t.count}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ════════════════ EDITOR'S PICK FEATURED ════════════════ */

const FEATURED_META: { icon: IconName; label: string }[] = [
  { icon: "architecture", label: "4,200 sq ft" },
  { icon: "calendar", label: "7 months" },
  { icon: "billing", label: "₹1.2 Cr" },
  { icon: "architects", label: "Studio Atrium" },
];

export function FeaturedProject() {
  return (
    <>
      <SectionHeader
        eyebrow="editor's pick"
        title={<>This week's <em>featured</em> project</>}
        moreTo="#"
        moreLabel="All features"
      />
      <div className="mb-7 grid grid-cols-1 overflow-hidden rounded-[22px] border border-line bg-bone-card md:grid-cols-[1.4fr_1fr]">
        <div
          className="relative flex aspect-[5/3] items-center justify-center text-white/45"
          style={{ background: G.g7 }}
        >
          <Icon name="home" size={80} />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[20px] bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
            <Icon name="star-filled" size={13} className="text-amber" /> Editor's pick
          </span>
          <span
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg,transparent 60%,rgba(0,0,0,.35))" }}
          />
        </div>
        <div className="flex flex-col justify-center gap-2.5 p-8">
          <span className="sec-eye">A minimalist Delhi villa</span>
          <div className="font-editorial text-[30px] font-normal leading-[1.15] tracking-[-0.016em]">
            Designed for <em className="not-italic text-forest [font-style:italic]">slow</em> mornings
            &amp; <em className="not-italic text-forest [font-style:italic]">long</em> dinners
          </div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
            Studio Atrium's 4,200 sq ft warm-minimalist home in South Delhi balances raw stone,
            hand-finished walnut and pools of warm light — built within ₹1.2 Cr over 7 months.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-3.5 text-[12px] font-semibold text-ink">
            {FEATURED_META.map((m) => (
              <span key={m.label} className="inline-flex items-center gap-1.5">
                <Icon name={m.icon} size={14} className="text-forest" /> {m.label}
              </span>
            ))}
          </div>
          <button className="mt-3.5 inline-flex w-max items-center gap-1.5 rounded-[24px] bg-ink px-5 py-3 text-[13.5px] font-bold text-white">
            Read the full story <Icon name="arrow-right" size={14} />
          </button>
        </div>
      </div>
    </>
  );
}

/* ════════════════ REAL HOMES INSPIRATION GRID ════════════════ */

interface InspItem {
  cat: string;
  title: string;
  by: string;
  saves: string;
  bg: string;
  icon: IconName;
  sqft: string;
  budget: string;
}

const INSP: InspItem[] = [
  { cat: "Modular kitchen", title: "Walnut + brass with a 7-ft island, Saket flat", by: "Casa & Bloom", saves: "2.4K", bg: G.g1, icon: "products", sqft: "320 sq ft", budget: "₹14L" },
  { cat: "Living room", title: "Quiet luxury in 1,200 sq ft, a Bandra apartment", by: "Studio Atrium", saves: "1.8K", bg: G.g7, icon: "home", sqft: "1,200", budget: "₹22L" },
  { cat: "Bathroom", title: "Matte black & travertine — a 6-week reno", by: "Lustre Sanitary", saves: "1.2K", bg: G.g6, icon: "home", sqft: "48 sq ft", budget: "₹4.8L" },
  { cat: "Bedroom", title: "A Japandi master suite with custom oak wardrobes", by: "Roost Studio", saves: "1.6K", bg: G.g3, icon: "home", sqft: "220", budget: "₹9.2L" },
  { cat: "Lighting", title: "Layered lighting transforms a flat Mumbai ceiling", by: "LumeLab", saves: "980", bg: G.g4, icon: "sparkles", sqft: "1,500", budget: "₹3.6L" },
  { cat: "Foyer & hall", title: "Entry that sets the tone — terrazzo + arched mirror", by: "Verma Studio", saves: "740", bg: G.g8, icon: "architecture", sqft: "60", budget: "₹2.4L" },
  { cat: "Balcony", title: "A 50 sq ft Bangalore balcony turned reading nook", by: "Greenroot Design", saves: "1.1K", bg: G.g12, icon: "home", sqft: "50", budget: "₹1.2L" },
  { cat: "Home office", title: "Built-in desk + acoustic panels for daily WFH", by: "Studio Kala", saves: "860", bg: G.g2, icon: "business", sqft: "120", budget: "₹3.8L" },
];

export function RealHomesGrid() {
  return (
    <>
      <SectionHeader
        eyebrow="design ideas"
        title={<><em>Real</em> homes, real budgets</>}
        subtitle="Browse what other homeowners actually built — with budgets, suppliers, and lessons learned."
        moreTo="#"
        moreLabel="View gallery"
      />
      <div className="mb-7 grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {INSP.map((i) => (
          <button
            key={i.title}
            className="exp-ins group flex flex-col overflow-hidden rounded-[14px] border border-line bg-bone-card text-left transition hover:-translate-y-0.5 hover:border-green-mint hover:shadow-[0_12px_28px_rgba(8,80,65,.1)]"
          >
            <div
              className="relative flex aspect-[1.05/1] items-center justify-center text-white/50"
              style={{ background: i.bg }}
            >
              <Icon name={i.icon} size={40} />
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-[20px] bg-black/50 px-[9px] py-[3px] text-[10.5px] font-bold text-white backdrop-blur-sm">
                <Icon name="heart" size={11} /> {i.saves}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 px-3.5 pb-3.5 pt-3">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-forest">
                {i.cat}
              </div>
              <div className="line-clamp-2 text-[13.5px] font-bold leading-[1.3] tracking-[-0.005em] text-ink">
                {i.title}
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1 text-[11.5px] font-medium text-muted">
                <span>{i.by}</span>
                <span className="inline-block h-0.5 w-0.5 rounded-full bg-muted" />
                <span>{i.sqft}</span>
                <span className="inline-block h-0.5 w-0.5 rounded-full bg-muted" />
                <span>{i.budget}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ════════════════ CURATED COLLECTIONS ════════════════ */

interface Collection {
  items: string;
  title: string;
  caption: string;
  bg: string;
}

const COLLECTIONS: Collection[] = [
  { items: "42 items", title: "Small kitchens, big ideas", caption: "Layouts under 80 sq ft that feel huge", bg: G.g1 },
  { items: "28 items", title: "The marble & brass story", caption: "A timeless pairing, modernised", bg: G.g8 },
  { items: "36 items", title: "Light, layered, lived-in", caption: "Lighting that builds rooms", bg: G.g4 },
  { items: "31 items", title: "The 6-week bathroom", caption: "Real timelines, real costs", bg: G.g6 },
  { items: "22 items", title: "Biophilic homes", caption: "Plants, light & living surfaces", bg: G.g12 },
  { items: "19 items", title: "Quiet luxury at home", caption: "Restraint as a design language", bg: G.dark },
];

export function CuratedCollections() {
  return (
    <>
      <SectionHeader
        eyebrow="curated collections"
        title={<>Themed <em>guides</em> to get you started</>}
        moreTo="#"
        moreLabel="All collections"
      />
      <div className="mb-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <button
            key={c.title}
            style={{ background: c.bg }}
            className="exp-coll relative flex aspect-[1.6/1] items-end overflow-hidden rounded-[16px] p-[18px] text-left text-white transition hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(8,80,65,.16)]"
          >
            <span
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg,transparent 30%,rgba(0,0,0,.65))" }}
            />
            <span className="absolute right-3.5 top-3.5 z-[1] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/90 text-ink">
              <Icon name="arrow-right" size={16} className="-rotate-45" />
            </span>
            <div className="relative z-[1]">
              <div className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.1em] opacity-85">
                {c.items}
              </div>
              <div className="font-editorial text-[22px] italic leading-[1.15] tracking-[-0.014em] [text-shadow:0_1px_4px_rgba(0,0,0,.3)]">
                {c.title}
              </div>
              <div className="mt-1 text-[11.5px] font-medium opacity-85">{c.caption}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
