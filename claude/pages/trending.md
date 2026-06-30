# PAGE: Trending

```
PROTOTYPE: pages/trending.html        ROUTE: PAGES.TRENDING ("/trending")        LAYOUT: Browsing (topbar + sidebar)
```

The "what's hot" page — a live leaderboard of the most-watched, most-saved, most-enquired entities on
Interior bazzar, plus the studio-reel/shorts viewer. Every field in
[README.md](README.md) §B is answered below.

---

## 1. Purpose
Show a buyer what is gaining momentum right now — the top businesses, products, services, searches,
cities and materials this week — ranked by real signals (enquiries, saves, watch-time) so they can ride
the trend into a detail page and a Connect enquiry.

## 2. Journey
- **Actor:** Buyer (primary). Discover stage.
- **Stage:** Discover (a sibling entry to Home, reached from the sidebar/topbar `data-active="trending"`).
- **Precedes:** any detail page (Business/Product/Service/Architect) or a listing page.
- **Leads to:** detail pages (via leaderboard rows, hero #1 "View profile", reel/short tap), the Connect
  modal (downstream of detail), the trend-story editorial, and the city/category listings.

## 3. Auth
**Public.** No login to browse trends or play reels. The shared auth modal (`#authModal`) is present for
the gate, but the gate only fires later on a Connect/enquire action from a detail page — never on this
page. Time range (`This week`) and category pills are readable while anonymous.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="trending"`, 60px) + collapsible left
sidebar (`#sidebar`, 240/72px) + `<main class="main">` (shell `.main-inner`, max-width 1600px). Sidebar
visible. A sticky `.cat-bar` (`top:0; z:5`) holds time-range + category pills.

## 5. Sections (top → bottom — exact prototype order)
Each is its own 3-file component under `components/Trending/`. Section headers use `.sec-head` with a
**SectionHeader** = `.sec-eye` (uppercase eyebrow + `.sec-eye-line`) + `.sec-title` (DM Serif Display /
Georgia 28–38px, `<em>` in accent italic). Trending's accent eyebrows are the warm `#d44323`
("hot/momentum") variant; calmer sections use the default green. Quote eyebrow/title **verbatim**:

| # | Section | Component | Eyebrow → Title (verbatim) | Content |
|---|---------|-----------|----------------------------|---------|
| 1 | Time + category bar | `TrendFilterBar` | — | `.cat-bar` pills: time range `Today / This week (on) / This month / All time` · divider · `Overall / Businesses / Architects / Products / Services / Kitchens / Bathrooms / Lighting / Furniture`. |
| 2 | Page header | `TrendHeader` | "updated 8 min ago" → "What's *hot* right now" | `.sec-sub` "The most-viewed businesses, products and services on Interior bazzar this week — ranked by enquiries, saves, and watch-time." + actions "Notify on changes", "Share leaderboard". |
| 3 | Live activity ticker | `LiveTicker` | "Live" (pulse dot) | `#liveTicker` marquee of recent activity (`.tk-item`, animated). |
| 4 | KPI strip | `TrendKpis` | — | 4 stat cards: "Enquiries · this week" 14,820 (+28%), "New connections" 2,418 (+14%), "New businesses listed" 186 (+9%), "Avg response time" 3.2 hrs (42 min faster), each with a sparkline. |
| 5 | #1 hero spotlight | `TrendHeroOne` | "#1 trending overall" | Dark hero card: "Modi Kitchen Hub — *Saket*", ★ 4.8 · 87 reviews · 312 projects, stats +148% enquiries / 2.3K saves / 18m avg view-time, CTA "View profile". |
| 6 | Leaderboard | `TrendLeaderboard` | "leaderboard" → "Top *10* this week" | `#trendBoard` ranked rows. Link "View full ranking". |
| 7 | Category leaderboards | `TrendCatBoards` | "category leaderboards" → "*Hot* in your favourite categories" | `#trendCatBoards` three compact mini-boards. Link "See all categories". |
| 8 | Studio reels / shorts | `TrendReels` | "video tours" → "*Hot* studio reels" | `.shorts-row` of `.short` cards (9:16, rank `.short-tag` #1–#6, `.short-eye` view count, `.short-title`, `.short-meta` ★/reviews). Tap → **ReelModal** player. Link "See all reels". |
| 9 | Search + saved split | `TrendSearchSaved` | "what people search" → "Trending *searches*" · "the wishlist board" → "*Most saved* this week" | Two-up: `#trendSearch` ("updated hourly") and `#trendSaved` (link "See all"). |
| 10 | Hot picks by city | `TrendCities` | "city pulse" → "Hot picks *by city*" | `.sec-sub` "What homeowners in your city are enquiring about most this week." + `#trendCities` 3-col. Link "Change city". |
| 11 | Rising fast | `TrendRising` | "momentum" → "*Rising* fast this week" | `#trendRising` 2-col movers. Link "View all rising". |
| 12 | Behind the trend | `TrendStory` | "behind the trend" → "Why *walnut + brass* is having a moment" | Editorial split card ("The story behind #1", tags #walnut #brass #handmade #smallkitchens). Link "Read the story". |

> A "the trend digest" email-capture band ("Get the *weekly leaderboard* in your inbox") follows the
> feed, then the shared footer (layout components, not Trending-specific).

**Reel system (§8 detail).** The prototype defines an interactive reel player (`.reel-card`, `.reel-bar`,
`reel-anim` 8s, `playReel()`) alongside the static `.short` thumbnails. In React this becomes a single
**ReelModal**: tapping any short/reel opens a focus-trapped player overlay that auto-advances each clip
(~8s progress bar) and offers next/prev; the row's first item supports **"Play all"** (sequential
playback). It is the same shorts surface used by Home's `TrendingShorts` (`#ibFeaturedShorts`).

## 6. Data
Read-only page (plus the shared auth/connect writes downstream). All via services → DataSource —
**never** raw `localStorage`/`fetch` (see
[../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| KPI strip / ticker | `TrendingService.stats()`, `TrendingService.activity()` | trending metrics content |
| #1 hero / leaderboard / category boards / rising | `TrendingService.leaderboard({ range, category })` | listing content (ranked) |
| Reels / shorts | `ShortsService.featured()` | shorts content |
| Trending searches | `TrendingService.searches()` | search-trends content |
| Most saved | `SavedService.topSaved()` | saved content |
| By city | `TrendingService.byCity(city)` | listing content (city-scoped) |
| Behind the trend | `BlogService.published()` / `TrendingService.story()` | editorial (`posts`) |

**URL state:** `?range=<today|week|month|all>` and `?category=<pill>` drive the leaderboard;
`?city=<slug>` scopes "by city". Read via `useSearchParams` in `useTrending.ts` (not `useState`).

## 7. Primary CTA
**Primary** — **"Play all"** (open the ReelModal and play the studio reels in sequence) for the page's
signature discovery moment; equally, every leaderboard row and the #1 hero "View profile" are
whole-row/CTA links into a detail page. Secondary CTAs:
- Card / leaderboard row → detail navigation (the whole row is the link).
- Short / reel tap → ReelModal.
- Card save (bookmark, hover-reveal) → writes to saved.
- "View full ranking", "See all categories", "See all reels", "Change city", "View all rising",
  "Read the story" → matching listing/editorial.

Use exact strings from [../copywriting.md](../copywriting.md) ("Play all" is in the CTA library);
the editorial/ticker labels above are quoted verbatim from the prototype. Every CTA resolves to the next
journey step.

## 8. States
- **Loading:** skeleton rows per board + skeleton short tiles (standard skeleton component — not a bare
  spinner). KPI cards show placeholder bands.
- **Empty:** any board with no data for the chosen range/category is **omitted entirely** (the page never
  shows an empty-titled section); the reel row, if empty, hides. The ticker hides when there is no recent
  activity.
- **Error:** a failed section degrades to hidden + a quiet inline retry; the rest of the page still
  renders (sections are independent).
- **Success:** n/a at page level; ReelModal close and any Connect/auth successes are owned by their
  overlays.

## 9. Responsive
- Desktop: KPI strip 4-up, category boards/cities 3-up, rising 2-up, shell 1600px.
- The `.shorts-row`/`.reel-row` are horizontal scroll-snap rows (`overflow-x:auto`, hidden scrollbar) on
  every breakpoint.
- ≤720px: sidebar → drawer; `.cat-bar` stays sticky and scrolls horizontally; grids reflow to fewer
  columns; the #1 hero and trend-story cards stack to single-column.
- Touch targets ≥ 38px; card save / reel controls (28–48px) acceptable; the reel play button is 48px.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`, each section a `<section>` named by its
  `.sec-title` (`aria-labelledby`).
- Headings: **one H1** = the page header "What's hot right now"; each `.sec-title` is an H2. No skipped
  levels.
- Leaderboard ranks and trend deltas pair the colour/arrow with text (state, not colour alone); the live
  ticker is `aria-live="off"` decorative (the static board is the accessible source of truth).
- Time-range / category pills are real `<button>`s with `aria-pressed`; the sticky bar is keyboard
  scrollable.
- **ReelModal:** `role="dialog"` + `aria-modal="true"` + `aria-labelledby` the reel title; focus trapped;
  Esc + backdrop close; play/next/prev are labelled buttons; "Play all" announced; respect
  `prefers-reduced-motion` (no auto-advance animation when set). Shorts thumbnails have descriptive `alt`.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Section eyebrows/titles: **verbatim** from §5 (brand voice: serif titles, `<em>` keyword; trending uses
  the warm `#d44323` eyebrow for hot/momentum sections).
- Brand name lowercase-b "Interior bazzar" (as in the §2 sub: "…on Interior bazzar this week…"). British
  "enquiry" throughout (KPIs/sub-copy say "enquiries", never "leads"/"inquiries").
- CTAs Title Case, no caps/"!": "Play all", "View full ranking", "See all reels", "Change city",
  "Read the story" — from [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` with: title "Trending now — Interior bazzar" (matches the prototype `<title>`), a one-line
description echoing the value prop ("the most-watched studios, products and services this week — ranked
by qualified enquiries, not noise"), canonical "/trending". (Final strings confirmed against prototype
`<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/Trending/index.tsx` + `useTrending.ts` + `Trending.module.css`; composes the 12
  section components in order. The ReelModal is a shared overlay (also used by Home's shorts).
- Mock/local data flows from `src/content/trending.content.ts` through `TrendingService` / `ShortsService`
  so editing content surfaces in the boards; the same calls later hit the API unchanged.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/trending`
  against `file:///…/pages/trending.html`. Gate with `tsc -b` + `vite build`.
