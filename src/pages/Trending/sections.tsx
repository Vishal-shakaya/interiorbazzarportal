import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui";

/* ════════════════════════ DATA — ported 1:1 from trending.html ════════════════════════ */

const RED = "#d44323";

/** image gradients (g1..g12) from the prototype <style>. */
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
};

export const CAT_FILTERS = {
  ranges: ["Today", "This week", "This month", "All time"],
  cats: ["Overall", "Businesses", "Architects", "Products", "Services", "Kitchens", "Bathrooms", "Lighting", "Furniture"],
};

export const KPIS = [
  { label: "Enquiries · this week", value: "14,820", delta: "+28% vs last week", up: true, stroke: "#107a5b", points: "0,18 10,16 20,14 30,15 40,11 50,9 60,7 70,5 80,3" },
  { label: "New connections", value: "2,418", delta: "+14% vs last week", up: true, stroke: "#185fa5", points: "0,16 10,15 20,17 30,12 40,13 50,10 60,9 70,7 80,6" },
  { label: "New businesses listed", value: "186", delta: "+9% vs last week", up: true, stroke: "#ba7517", points: "0,17 10,16 20,15 30,15 40,13 50,12 60,11 70,10 80,8" },
  { label: "Avg response time", value: "3.2", unit: "hrs", delta: "42 min faster", up: false, stroke: "#3c3489", points: "0,8 10,10 20,9 30,12 40,11 50,13 60,12 70,14 80,16" },
];

export const TICKER: { who: ReactNode; what: ReactNode; t: string }[] = [
  { who: <>A homeowner in <b>Saket</b></>, what: <>enquired with <b>Modi Kitchen Hub</b></>, t: "just now" },
  { who: <b>Verma Studio</b>, what: <>jumped <b>+2 spots</b> on the leaderboard</>, t: "2 min ago" },
  { who: <>A homeowner in <b>Mumbai</b></>, what: <>saved <b>Brass Pendant Lamp</b></>, t: "3 min ago" },
  { who: <b>The Tile Studio</b>, what: <>replied within <b>9 min</b> to 4 enquiries</>, t: "5 min ago" },
  { who: <>A homeowner in <b>Bangalore</b></>, what: <>opened <b>matte black faucet set</b></>, t: "7 min ago" },
  { who: <b>ArtLight Studio</b>, what: <>crossed <b>10K weekly views</b></>, t: "9 min ago" },
  { who: <>A homeowner in <b>Delhi</b></>, what: <>booked a video tour with <b>Roost Studio</b></>, t: "12 min ago" },
  { who: <b>Perfekte Furniture</b>, what: <>is now <b>#7 overall</b></>, t: "14 min ago" },
];

interface BoardRow {
  rank: number; prev: number; type: string; cat: string; name: string; by: string; rate: number; rev: number; views: string; g: string; icon: IconName;
}
export const BOARD: BoardRow[] = [
  { rank: 1, prev: 1, type: "business", cat: "Modular kitchen", name: "Modi Kitchen Hub — Saket", by: "Modi Kitchen Hub", rate: 4.8, rev: 87, views: "24.3K", g: "g1", icon: "home" },
  { rank: 2, prev: 4, type: "business", cat: "Architecture", name: "Verma Design Studio", by: "Verma Studio", rate: 4.6, rev: 52, views: "18.4K", g: "g7", icon: "business" },
  { rank: 3, prev: 2, type: "shop", cat: "Tiles & marble", name: "The Tile Studio — Carrara", by: "The Tile Studio", rate: 4.4, rev: 38, views: "16.1K", g: "g8", icon: "products" },
  { rank: 4, prev: 7, type: "product", cat: "Lighting", name: "Brass Pendant Lamp — handmade", by: "ArtLight Studio", rate: 4.8, rev: 44, views: "12.7K", g: "g10", icon: "sparkles" },
  { rank: 5, prev: 3, type: "shop", cat: "Flooring", name: "Luxe Flooring Co. — SPC vinyl", by: "Luxe Flooring Co.", rate: 4.5, rev: 61, views: "9.8K", g: "g12", icon: "products" },
  { rank: 6, prev: 6, type: "service", cat: "Bath renovation", name: "Bathroom full renovation", by: "Lustre Sanitary", rate: 4.6, rev: 74, views: "8.1K", g: "g6", icon: "services" },
  { rank: 7, prev: 5, type: "business", cat: "Furniture", name: "Perfekte Furniture — accent line", by: "Perfekte Furn.", rate: 4.7, rev: 124, views: "7.6K", g: "g2", icon: "products" },
  { rank: 8, prev: 12, type: "product", cat: "Sanitary", name: "Matte Black Faucet Set", by: "Home Sanitary", rate: 4.5, rev: 67, views: "6.9K", g: "g11", icon: "services" },
  { rank: 9, prev: 9, type: "business", cat: "Lighting", name: "LumeLab — architectural lighting", by: "LumeLab", rate: 4.6, rev: 124, views: "5.4K", g: "g4", icon: "sparkles" },
  { rank: 10, prev: 14, type: "product", cat: "Doors", name: "Teak Pivot Door — custom size", by: "Luxe Doors", rate: 4.6, rev: 56, views: "4.8K", g: "g8", icon: "products" },
];

interface CatBoardItem { n: number; name: string; by: string; views: string; g: string; icon: IconName }
export const CAT_BOARDS: { title: string; icon: IconName; items: CatBoardItem[] }[] = [
  { title: "Kitchens", icon: "home", items: [
    { n: 1, name: "Modi Kitchen Hub — Saket", by: "Modi Kitchen Hub", views: "24.3K", g: "g1", icon: "home" },
    { n: 2, name: "Roost Studio — compact kitchens", by: "Roost Studio", views: "7.8K", g: "g3", icon: "products" },
    { n: 3, name: "Casa & Bloom — walnut + brass", by: "Casa & Bloom", views: "5.6K", g: "g7", icon: "sparkles" },
    { n: 4, name: "Studio Atrium — open plan", by: "Studio Atrium", views: "4.2K", g: "g5", icon: "architecture" },
  ] },
  { title: "Bathrooms", icon: "services", items: [
    { n: 1, name: "Lustre Sanitary — full reno", by: "Lustre Sanitary", views: "8.1K", g: "g6", icon: "services" },
    { n: 2, name: "Matte Black Faucet Set", by: "Home Sanitary", views: "6.9K", g: "g11", icon: "services" },
    { n: 3, name: "The Tile Studio — Carrara", by: "The Tile Studio", views: "5.1K", g: "g8", icon: "products" },
    { n: 4, name: "Travertine & matte black", by: "Marble Brothers", views: "3.4K", g: "g8", icon: "products" },
  ] },
  { title: "Lighting", icon: "sparkles", items: [
    { n: 1, name: "Brass Pendant Lamp", by: "ArtLight Studio", views: "12.7K", g: "g10", icon: "sparkles" },
    { n: 2, name: "LumeLab — architectural", by: "LumeLab", views: "5.4K", g: "g4", icon: "sparkles" },
    { n: 3, name: "Linear LED Strip", by: "BrightLine", views: "3.8K", g: "g7", icon: "sparkles" },
    { n: 4, name: "Brass wall sconce", by: "ArtLight Studio", views: "2.9K", g: "g10", icon: "sparkles" },
  ] },
];

export const SEARCHES = [
  { q: "modular kitchen near saket", count: "4,820", delta: 42 },
  { q: "walnut and brass kitchen", count: "3,140", delta: 128 },
  { q: "italian carrara marble price", count: "2,910", delta: 18 },
  { q: "matte black faucet set", count: "2,640", delta: 64 },
  { q: "modular wardrobe under 3 lakh", count: "2,180", delta: 9 },
  { q: "spc vinyl flooring waterproof", count: "1,920", delta: -6 },
  { q: "interior designer in mumbai", count: "1,720", delta: 22 },
  { q: "pivot door teak custom", count: "1,310", delta: 36 },
];

interface SavedItem { name: string; by: string; saves: number; g: string; icon: IconName }
export const SAVED: SavedItem[] = [
  { name: "Brass Pendant Lamp — handmade", by: "ArtLight Studio", saves: 2340, g: "g10", icon: "sparkles" },
  { name: "Italian Carrara White Marble", by: "The Tile Studio", saves: 1980, g: "g8", icon: "products" },
  { name: "Solid Walnut Accent Chair", by: "Perfekte Furn.", saves: 1620, g: "g2", icon: "products" },
  { name: "Matte Black Faucet Set", by: "Home Sanitary", saves: 1340, g: "g11", icon: "services" },
  { name: "Teak Pivot Door — custom size", by: "Luxe Doors", saves: 1120, g: "g8", icon: "products" },
];

interface CityItem { flag: string; city: string; count: string; g: string; icon: IconName; top: string; cat: string; delta: number }
export const CITIES: CityItem[] = [
  { flag: "🇮🇳", city: "New Delhi", count: "412 hot picks", g: "g7", icon: "business", top: "Modi Kitchen Hub", cat: "Modular kitchen", delta: 42 },
  { flag: "🇮🇳", city: "Mumbai", count: "386 hot picks", g: "g3", icon: "business", top: "Studio Atrium", cat: "Architecture", delta: 36 },
  { flag: "🇮🇳", city: "Bangalore", count: "298 hot picks", g: "g5", icon: "city", top: "Greenroot Design", cat: "Biophilic interiors", delta: 28 },
];

interface RisingItem { thumb: string; icon: IconName; jump: string; t: string; by: string; rate: number; n: number; views: string; pct: number }
export const RISING: RisingItem[] = [
  { thumb: "g2", icon: "products", jump: "jumped 32 spots", t: "Perfekte Furniture — solid walnut accent chair", by: "Perfekte Furn.", rate: 4.7, n: 124, views: "1,840", pct: 78 },
  { thumb: "g6", icon: "services", jump: "jumped 24 spots", t: "Lustre Sanitary — matte black faucet set", by: "Home Sanitary", rate: 4.5, n: 67, views: "1,210", pct: 64 },
  { thumb: "g4", icon: "architecture", jump: "new in top 50", t: "Ar. Rahul Verma — minimalist residential", by: "Verma Studio", rate: 4.7, n: 52, views: "980", pct: 52 },
  { thumb: "g10", icon: "sparkles", jump: "jumped 19 spots", t: "ArtLight Studio — handmade brass pendant", by: "ArtLight Studio", rate: 4.8, n: 89, views: "820", pct: 46 },
];

/* ════════════════════════ small inline helper ════════════════════════ */

/** RED uppercase eyebrow with a leading rule (prototype .sec-eye, recoloured). */
function RedEye({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: RED }}>
      <span className="h-px w-6" style={{ background: RED }} /> {children}
    </div>
  );
}

/* ════════════════════════ 1. CATEGORY PILL BAR ════════════════════════ */

export function CategoryPillBar() {
  return (
    <div className="sticky top-0 z-[5] -mx-4 mb-1 flex items-center gap-1.5 overflow-x-auto bg-bone px-4 py-2.5 [scrollbar-width:none] md:-mx-7 md:px-7 [&::-webkit-scrollbar]:hidden">
      {CAT_FILTERS.ranges.map((r) => (
        <button
          key={r}
          className={`inline-flex shrink-0 items-center rounded-lg px-3.5 py-1.5 text-[13.5px] font-medium transition ${
            r === "This week" ? "bg-ink text-white" : "bg-chip text-ink hover:bg-chip-hover"
          }`}
        >
          {r}
        </button>
      ))}
      <span className="mx-1.5 h-6 w-px bg-line" />
      {CAT_FILTERS.cats.map((c) => (
        <button key={c} className="inline-flex shrink-0 items-center rounded-lg bg-chip px-3.5 py-1.5 text-[13.5px] font-medium text-ink transition hover:bg-chip-hover">
          {c}
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════ 2. PAGE HEADER ════════════════════════ */

export function TrendingHeader() {
  const btn = "inline-flex items-center gap-1.5 rounded-[22px] border border-line bg-bone-card px-3.5 py-2 text-[12.5px] font-semibold text-ink transition hover:border-line-strong";
  return (
    <div className="mt-5 mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col">
        <RedEye>updated 8 min ago</RedEye>
        <h1 className="font-editorial text-[38px] font-normal leading-[1.1] tracking-[-0.01em] text-ink">
          What's <em style={{ color: RED, fontStyle: "italic" }}>hot</em> right now
        </h1>
        <p className="mt-1.5 text-[17px] leading-relaxed text-muted">
          The most-viewed businesses, products and services on Interior bazzar this week — ranked by enquiries, saves, and watch-time.
        </p>
      </div>
      <div className="flex gap-2">
        <button className={btn}><Icon name="bell" size={14} /> Notify on changes</button>
        <button className={btn}><Icon name="share" size={14} /> Share leaderboard</button>
      </div>
    </div>
  );
}

/* ════════════════════════ 3. LIVE ACTIVITY TICKER ════════════════════════ */

export function LiveTicker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative mb-3.5 flex items-center gap-3.5 overflow-hidden rounded-[14px] border border-line bg-bone-card px-4 py-2.5">
      <div className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.09em]" style={{ color: RED }}>
        <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: RED, boxShadow: "0 0 0 4px rgba(212,67,35,.18)" }} />
        Live
      </div>
      <div className="h-[18px] w-px shrink-0 bg-line" />
      <div
        className="flex-1 overflow-hidden"
        style={{ maskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)" }}
      >
        <div className="inline-flex gap-9 whitespace-nowrap pl-4 text-[13px] text-ink" style={{ animation: "ib-tk-slide 42s linear infinite" }}>
          {items.map((i, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              {i.who} {i.what}
              <span className="h-[5px] w-[5px] rounded-full bg-green-mint" />
              <span className="text-[11.5px] font-semibold text-muted">{i.t}</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes ib-tk-slide{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* ════════════════════════ 4. KPI STRIP ════════════════════════ */

export function KpiStrip() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {KPIS.map((k) => (
        <div key={k.label} className="relative overflow-hidden rounded-[14px] border border-line bg-bone-card px-4.5 py-4" style={{ padding: "16px 18px" }}>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-muted">{k.label}</div>
          <div className="mt-1.5 font-editorial text-[30px] font-normal leading-[1.05] tracking-[-0.014em] text-ink">
            {k.value}
            {k.unit && <span className="text-[18px] text-muted"> {k.unit}</span>}
          </div>
          <div className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-bold" style={{ color: "#107a5b" }}>
            <Icon name="trending" size={13} /> {k.delta}
          </div>
          <svg viewBox="0 0 80 22" preserveAspectRatio="none" className="absolute bottom-3.5 right-3.5 h-6 w-[78px]">
            <polyline points={k.points} fill="none" stroke={k.stroke} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════ 5. #1 DARK HERO CARD ════════════════════════ */

export function TopHero() {
  return (
    <div className="relative mb-7 grid gap-4.5 overflow-hidden rounded-[22px] p-6.5 text-white md:grid-cols-[1.35fr_1fr]" style={{ background: "linear-gradient(110deg,#1a1a17,#2a2624)", padding: "26px", gap: "18px" }}>
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[16px] text-white/50" style={{ background: G.g7 }}>
        <Icon name="home" size={80} stroke={1.1} />
        <div className="absolute left-3.5 top-3.5 flex h-[54px] w-[54px] items-center justify-center rounded-full font-editorial text-[30px] italic" style={{ background: RED, color: "#fff", boxShadow: "0 6px 16px rgba(212,67,35,.45)" }}>1</div>
        <div className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-[20px] bg-black/55 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur">
          <Icon name="explore" size={14} style={{ color: RED }} /> 24,318 views this week
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 50%,rgba(0,0,0,.45))" }} />
      </div>
      <div className="flex flex-col justify-center gap-2.5">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: RED }}>
          <Icon name="trending" size={14} /> #1 trending overall
        </div>
        <div className="font-editorial text-[38px] font-normal leading-[1.1] tracking-[-0.018em]">
          Modi Kitchen Hub — <em className="italic" style={{ color: "#9fe1cb" }}>Saket</em>
        </div>
        <div className="flex items-center gap-2 text-[14px] text-white/70">
          <span style={{ color: "#f4a629" }}>★ 4.8</span>
          <span className="h-[3px] w-[3px] rounded-full bg-white/40" /> <span>87 reviews</span>
          <span className="h-[3px] w-[3px] rounded-full bg-white/40" /> <span>312 projects</span>
        </div>
        <div className="mt-3.5 flex flex-wrap gap-6">
          {[["+148%", "enquiries"], ["2.3K", "saves"], ["18m", "avg view-time"]].map(([n, l]) => (
            <div key={l}>
              <div className="font-editorial text-[24px] italic leading-none">{n}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">{l}</div>
            </div>
          ))}
        </div>
        <button className="mt-3.5 inline-flex w-max items-center gap-1.5 rounded-[26px] px-5.5 py-3 text-[14px] font-bold text-white" style={{ background: RED, padding: "13px 22px" }}>
          View profile <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════ 6. TOP-10 LEADERBOARD ════════════════════════ */

export function Leaderboard() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <RedEye>leaderboard</RedEye>
          <h2 className="sec-title">Top <em style={{ color: RED, fontStyle: "italic" }}>10</em> this week</h2>
        </div>
        <button className="group flex shrink-0 items-center gap-1 text-[14px] font-semibold text-forest transition-all hover:gap-2">
          View full ranking <Icon name="arrow-right" size={14} />
        </button>
      </div>
      <div className="mb-7 flex flex-col gap-2.5">
        {BOARD.map((b) => {
          const move = b.prev - b.rank;
          const tone = move > 0 ? "#107a5b" : move < 0 ? "#c0392b" : "#888";
          const bg = move > 0 ? "#e1f5ee" : move < 0 ? "#fdecea" : "#eeece5";
          const moveTxt = move > 0 ? `+${move}` : move < 0 ? `${move}` : "—";
          const top3 = b.rank <= 3;
          return (
            <div
              key={b.rank}
              className="grid cursor-pointer items-center gap-4 rounded-[14px] border border-line transition hover:border-[#d44323]"
              style={{ gridTemplateColumns: "48px 100px 1fr auto auto", padding: "12px 18px 12px 14px", background: top3 ? "linear-gradient(90deg,#fffdf8,#fef3e0)" : "#fff" }}
            >
              <div className="text-center font-editorial text-[32px] italic leading-none" style={{ color: top3 ? RED : "#aaa" }}>{b.rank}</div>
              <div className="relative flex aspect-[1.18/1] items-center justify-center rounded-[11px] text-white/50" style={{ background: G[b.g] }}>
                <Icon name={b.icon} size={30} stroke={1.1} />
                <span className="absolute left-[5px] top-[5px] rounded-[20px] bg-black/55 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-white">{b.type}</span>
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-forest">{b.cat}</div>
                <div className="mb-1.5 text-[15px] font-bold leading-snug tracking-[-0.005em] text-ink">{b.name}</div>
                <div className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-muted">
                  <span className="font-semibold text-ink">{b.by}</span>
                  <span className="h-[2px] w-[2px] rounded-full bg-muted" />
                  <span><span className="text-amber">★</span> {b.rate} · {b.rev} reviews</span>
                </div>
              </div>
              <div className="min-w-[90px] text-right">
                <div className="font-editorial text-[20px] font-normal leading-none text-ink">{b.views}</div>
                <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted">views</div>
              </div>
              <div className="inline-flex items-center gap-1 whitespace-nowrap rounded-[20px] px-2.5 py-1.5 text-[11px] font-bold" style={{ background: bg, color: tone }}>
                <Icon name={move > 0 ? "trending" : move < 0 ? "trending" : "minus"} size={13} /> {moveTxt}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ════════════════════════ 7. CATEGORY MINI-BOARDS ════════════════════════ */

export function CategoryMiniBoards() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <RedEye>category leaderboards</RedEye>
          <h2 className="sec-title"><em>Hot</em> in your favourite categories</h2>
        </div>
        <button className="group flex shrink-0 items-center gap-1 text-[14px] font-semibold text-forest transition-all hover:gap-2">
          See all categories <Icon name="arrow-right" size={14} />
        </button>
      </div>
      <div className="mb-7 grid gap-3.5 md:grid-cols-3">
        {CAT_BOARDS.map((c) => (
          <div key={c.title} className="rounded-[16px] border border-line bg-bone-card px-4.5 pb-1.5 pt-4.5" style={{ padding: "18px 18px 6px" }}>
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px]" style={{ background: "#fef3e0", color: RED }}>
                <Icon name={c.icon} size={15} />
              </div>
              <div className="font-editorial text-[18px] font-normal tracking-[-0.012em]">{c.title}</div>
              <span className="ml-auto rounded-[20px] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.06em]" style={{ background: "#fef3e0", color: RED }}>live</span>
            </div>
            {c.items.map((it) => (
              <div key={it.n} className="grid items-center gap-2.5 border-t border-line py-2" style={{ gridTemplateColumns: "22px 42px 1fr auto" }}>
                <div className="font-editorial text-[18px] italic leading-none" style={{ color: it.n === 1 ? RED : "#aaa" }}>{it.n}</div>
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] text-white/55" style={{ background: G[it.g] }}>
                  <Icon name={it.icon} size={18} stroke={1.1} />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[12.5px] font-bold leading-snug tracking-[-0.003em] text-ink">{it.name}</div>
                  <div className="mt-0.5 text-[11px] font-medium text-muted">{it.by}</div>
                </div>
                <div className="text-[11px] font-semibold text-muted">{it.views}</div>
              </div>
            ))}
            <div className="mt-1 border-t border-line py-2.5 text-center">
              <button className="inline-flex items-center gap-1 text-[11.5px] font-bold text-forest">
                See full leaderboard <Icon name="arrow-right" size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ════════════════════════ 9. SEARCH TRENDS + MOST SAVED SPLIT ════════════════════════ */

export function SearchAndSaved() {
  const maxSaves = SAVED[0].saves;
  return (
    <div className="my-7 grid gap-4 md:grid-cols-2">
      {/* Trending searches */}
      <div className="rounded-[18px] border border-line bg-bone-card px-5.5 pb-3.5 pt-5.5" style={{ padding: "22px 22px 14px" }}>
        <div className="mb-3.5 flex items-end justify-between">
          <div>
            <RedEye>what people search</RedEye>
            <div className="font-editorial text-[22px] font-normal tracking-[-0.014em]">Trending <em className="italic" style={{ color: RED }}>searches</em></div>
          </div>
          <span className="text-[11px] font-semibold text-muted">updated hourly</span>
        </div>
        <div>
          {SEARCHES.map((s, i) => (
            <div key={s.q} className={`grid items-center gap-3 py-2.5 ${i === 0 ? "" : "border-t border-line"}`} style={{ gridTemplateColumns: "24px 1fr auto auto" }}>
              <div className="text-center font-editorial text-[16px] italic leading-none" style={{ color: i < 3 ? RED : "#aaa" }}>{i + 1}</div>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold leading-snug tracking-[-0.003em] text-ink">
                <Icon name="search" size={13} className="text-muted" /> {s.q}
              </div>
              <div className="text-[11.5px] font-semibold text-muted">{s.count}</div>
              <div className="inline-flex items-center gap-0.5 text-[10.5px] font-bold" style={{ color: s.delta >= 0 ? "#107a5b" : "#c0392b" }}>
                <Icon name="trending" size={12} /> {Math.abs(s.delta)}%
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Most saved */}
      <div className="rounded-[18px] border border-line bg-bone-card px-5.5 pb-3.5 pt-5.5" style={{ padding: "22px 22px 14px" }}>
        <div className="mb-3.5 flex items-end justify-between">
          <div>
            <div className="sec-eye mb-1.5">the wishlist board</div>
            <div className="font-editorial text-[22px] font-normal tracking-[-0.014em]"><em>Most saved</em> this week</div>
          </div>
          <button className="text-[14px] font-semibold text-forest">See all</button>
        </div>
        <div>
          {SAVED.map((s, i) => (
            <div key={s.name} className={`grid items-center gap-3 py-2.5 ${i === 0 ? "" : "border-t border-line"}`} style={{ gridTemplateColumns: "54px 1fr auto" }}>
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[10px] text-white/55" style={{ background: G[s.g] }}>
                <Icon name={s.icon} size={22} stroke={1.1} />
              </div>
              <div className="min-w-0">
                <div className="mb-1 truncate text-[13px] font-bold leading-snug tracking-[-0.003em] text-ink">{s.name}</div>
                <div className="h-[5px] overflow-hidden rounded-[3px]" style={{ background: "#eeece5" }}>
                  <div className="h-full rounded-[3px]" style={{ background: RED, width: `${(s.saves / maxSaves) * 100}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[10.5px] font-semibold text-muted">
                  <span>{s.by}</span>
                  <span style={{ color: RED }}><Icon name="heart" size={11} className="inline" /> {s.saves.toLocaleString()} saves</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════ 10. HOT PICKS BY CITY ════════════════════════ */

export function HotByCity() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <div className="sec-eye">city pulse</div>
          <h2 className="sec-title">Hot picks <em>by city</em></h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">What homeowners in your city are enquiring about most this week.</p>
        </div>
        <button className="group flex shrink-0 items-center gap-1 text-[14px] font-semibold text-forest transition-all hover:gap-2">
          Change city <Icon name="arrow-right" size={14} />
        </button>
      </div>
      <div className="mb-7 grid gap-3.5 md:grid-cols-3">
        {CITIES.map((c) => (
          <div key={c.city} className="cursor-pointer overflow-hidden rounded-[18px] border border-line bg-bone-card transition hover:border-[#d44323]">
            <div className="relative flex aspect-[16/7] items-end justify-between p-4 text-white" style={{ background: G[c.g] }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 40%,rgba(0,0,0,.45))" }} />
              <div className="relative z-[1]">
                <div className="text-[22px]">{c.flag}</div>
                <div className="mt-1.5 font-editorial text-[24px] italic leading-[1.1] tracking-[-0.012em]">{c.city}</div>
              </div>
              <div className="relative z-[1] inline-flex items-center gap-1 rounded-[20px] bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-ink">
                <Icon name="trending" size={12} style={{ color: "#107a5b" }} /> +{c.delta}%
              </div>
            </div>
            <div className="p-4">
              <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">#1 in {c.city}</div>
              <div className="grid items-center gap-2.5 py-1.5" style={{ gridTemplateColumns: "42px 1fr" }}>
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9px] text-white/55" style={{ background: G[c.g] }}>
                  <Icon name={c.icon} size={18} stroke={1.1} />
                </div>
                <div>
                  <div className="text-[13px] font-bold leading-snug tracking-[-0.003em] text-ink">{c.top}</div>
                  <div className="mt-0.5 text-[11px] font-medium text-muted">{c.cat} · {c.count}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ════════════════════════ 11. RISING FAST ════════════════════════ */

export function RisingFast() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <RedEye>momentum</RedEye>
          <h2 className="sec-title"><em style={{ color: RED, fontStyle: "italic" }}>Rising</em> fast this week</h2>
        </div>
        <button className="group flex shrink-0 items-center gap-1 text-[14px] font-semibold text-forest transition-all hover:gap-2">
          View all rising <Icon name="arrow-right" size={14} />
        </button>
      </div>
      <div className="mb-7 grid gap-3.5 md:grid-cols-2">
        {RISING.map((r) => (
          <div key={r.t} className="grid cursor-pointer gap-3.5 rounded-[16px] border border-line bg-bone-card p-4.5 transition hover:border-[#d44323]" style={{ gridTemplateColumns: "84px 1fr", padding: "18px" }}>
            <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-[12px] text-white/55" style={{ background: G[r.thumb] }}>
              <Icon name={r.icon} size={32} stroke={1.1} />
            </div>
            <div>
              <div className="mb-1 inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[0.09em]" style={{ color: RED }}>
                <Icon name="trending" size={12} /> rising · {r.jump}
              </div>
              <div className="mb-1.5 text-[15px] font-bold leading-snug tracking-[-0.005em] text-ink">{r.t}</div>
              <div className="text-[12px] text-muted">by <strong className="font-semibold text-ink">{r.by}</strong> · ★ {r.rate} · {r.n} projects</div>
              <div className="mt-2 h-[5px] overflow-hidden rounded-[3px]" style={{ background: "#eeece5" }}>
                <div className="h-full rounded-[3px]" style={{ background: "linear-gradient(90deg,#ba7517,#d44323)", width: `${r.pct}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-muted">
                <span>{r.views} views today</span>
                <span style={{ color: RED }}>+{r.pct}% vs last week</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ════════════════════════ 12. BEHIND THE TREND — EDITORIAL ════════════════════════ */

export function BehindTheTrend() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <RedEye>behind the trend</RedEye>
          <h2 className="sec-title">Why <em style={{ color: RED, fontStyle: "italic" }}>walnut + brass</em> is having a moment</h2>
        </div>
        <button className="group flex shrink-0 items-center gap-1 text-[14px] font-semibold text-forest transition-all hover:gap-2">
          Read the story <Icon name="arrow-right" size={14} />
        </button>
      </div>
      <div className="mb-7 grid overflow-hidden rounded-[22px] border border-line bg-bone-card md:grid-cols-[1.2fr_1fr]">
        <div className="relative flex aspect-[5/3] items-center justify-center text-white/45" style={{ background: G.g8 }}>
          <Icon name="home" size={80} stroke={1.1} />
          <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-[20px] bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
            <Icon name="trending" size={13} style={{ color: RED }} /> +148% enquiries
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 60%,rgba(0,0,0,.35))" }} />
        </div>
        <div className="flex flex-col justify-center gap-2.5 p-7.5" style={{ padding: "30px" }}>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.11em]" style={{ color: RED }}>
            <span className="h-px w-[18px]" style={{ background: RED }} /> The story behind #1
          </div>
          <div className="font-editorial text-[26px] font-normal leading-[1.18] tracking-[-0.014em]">
            A return to <em className="italic" style={{ color: RED }}>warm</em> materials &amp; <em className="italic" style={{ color: RED }}>handmade</em> details
          </div>
          <div className="mt-0.5 text-[13.5px] leading-relaxed text-muted">
            Over the last 6 weeks, walnut-and-brass kitchens jumped from #14 to #1 — driven by tight homes that need warmth, lower budgets that demand longevity, and a shift away from glossy white slab everything.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["#walnut", "#brass", "#handmade", "#smallkitchens"].map((t) => (
              <span key={t} className="rounded-[20px] px-2.5 py-1.5 text-[11.5px] font-bold text-ink" style={{ background: "#fef3e0" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════ 13. WEEKLY DIGEST CTA ════════════════════════ */

export function WeeklyDigest() {
  return (
    <div className="relative mb-5 grid items-center gap-5 overflow-hidden rounded-[22px] p-7 text-white md:grid-cols-[1fr_auto]" style={{ background: "linear-gradient(110deg,#04342c,#085041)", padding: "26px 28px" }}>
      <div className="pointer-events-none absolute -top-1/2 right-[-5%] h-[200%] w-1/2" style={{ background: "radial-gradient(circle,rgba(159,225,203,.18) 0%,transparent 60%)" }} />
      <div className="relative z-[1]">
        <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9fe1cb" }}>
          <Icon name="mail" size={13} /> the trend digest
        </div>
        <div className="font-editorial text-[24px] font-normal leading-[1.2] tracking-[-0.014em]">
          Get the <em className="italic" style={{ color: "#9fe1cb" }}>weekly leaderboard</em> in your inbox
        </div>
        <div className="mt-1 max-w-[520px] text-[13.5px] leading-relaxed text-white/70">
          Every Friday. Top movers, rising shops, new architects in your city, and the materials people are buying — 3-minute reads.
        </div>
      </div>
      <div className="relative z-[1] flex items-center gap-1.5 rounded-[30px] border border-white/20 bg-white/[0.08] py-1.5 pl-4 pr-1.5">
        <input placeholder="you@example.com" className="w-[200px] bg-transparent px-1 py-2 text-[13.5px] text-white outline-none placeholder:text-white/50" />
        <button className="inline-flex items-center gap-1.5 rounded-[24px] px-4.5 py-2.5 text-[13px] font-bold text-white" style={{ background: RED, padding: "10px 18px" }}>
          Subscribe <Icon name="arrow-right" size={14} />
        </button>
      </div>
    </div>
  );
}
