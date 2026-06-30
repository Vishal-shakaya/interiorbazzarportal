# PAGE: Home

```
PROTOTYPE: pages/home.html        ROUTE: PAGES.HOME ("/")        LAYOUT: Browsing (topbar + sidebar)
```

The buyer's front door and the most important page in the portal. Everything in
[README.md](README.md) §B is answered below.

---

## 1. Purpose
Give a buyer an immediate, scannable overview of everything Interior Bazzar offers — products,
services, studios, shops, catalogues, inspiration, proof — and route them into a listing or a detail
page (and ultimately a Connect enquiry) as fast as possible.

## 2. Journey
- **Actor:** Buyer (primary). Sellers pass through but their journey starts at Auth → Plans.
- **Stage:** Discover (entry point).
- **Precedes:** any listing page or detail page; the Connect modal.
- **Leads to:** Product/Service/Business/Architect detail, listing pages, Catalogues, Auth (via sidebar/topbar).

## 3. Auth
**Public.** No login to browse. The login gate only fires later, on a Connect/enquire action from a
detail page or a card CTA (the shared auth modal `#authModal` is present on Home for that). City
context (`?city=`) and category filter (`?filter=`) are readable while anonymous.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="home"`, 60px) + collapsible left
sidebar (`#sidebar`, 240/72px) + `<main class="main">` (shell max-width 1600px). Sidebar visible.

## 5. Sections (top → bottom — exact prototype order)
Each is its own 3-file component under `components/Home/`. Each non-hero section opens with a
**SectionHeader** = `.sec-eye` (uppercase green eyebrow, with `.sec-eye-line`) + `.sec-title` (Georgia
serif 28px, `<em>` in green italic). Quote the eyebrow/title **verbatim**:

| # | Section | Component | Eyebrow → Title (verbatim) | Content |
|---|---------|-----------|----------------------------|---------|
| 1 | Hero carousel | `HeroCarousel` | — | `#heroTrack` slides + `#heroDots` + `#heroProgress` (2.5px). Gradient photo bands, serif H1 with mint emphasis, dual CTA, stats row. Auto-advance 7s, touch + arrow keys. |
| 2 | Trending shorts | `TrendingShorts` | "Trending now" → "*Hot* this week" | `#ibFeaturedShorts` horizontal shorts row (YouTube thumbnails → ReelModal). |
| 3 | Recommended feed | `RecommendedFeed` | "Recommended" → "*For* you" | Mixed recommendation grid. |
| 4 | Trending products | `TrendingProducts` | "Trending products" → "Shop *globally,* delivered to you" | Product `.card` grid (4-up). |
| 5 | Interior services | `InteriorServices` | "Interior services" → "Hire *verified* professionals" | Service `.card` grid. |
| 6 | Verified businesses | `VerifiedBusinesses` | "Verified businesses" → "Find the *right studio* for your project" | Business cards. |
| 7 | Shops near you | `ShopsNearYou` | "Shops near you" → "Walk in, *touch & feel* before you decide" | Shop cards: `.shop-status-dot` (open/closed), `.shop-dist` (e.g. "2.1 km"), verified tag. |
| 8 | Latest catalogues | `LatestCatalogues` | "Fresh from manufacturers" → "Latest *catalogues*" | Catalogue cards → "Get catalogue". |
| 9 | Inspiration | `Inspiration` | "Get inspired" → "Design *ideas* & projects" | Inspiration bento/grid. |
| 10 | Video stories | `VideoStories` | "Video stories" → "See it from *their own words*" | `#ibTestimonials` video testimonial grid (`.ibt-grid`). |
| 11 | Proof / stats | `ProofStats` | "In their words" → "What the *numbers don't capture*" | Stats / proof band. |
| 12 | From the journal | `FromJournal` | "From the journal" → "Ideas for *your practice*" | `#ibHomeJournalSection` — **hidden (`display:none`) unless published posts exist** (`posts` group). Renders into `#ibHomeJournal`. |

> Final CTA band + footer follow the feed (shared layout components, not Home-specific).

## 6. Data
Read-only page (plus the shared auth/connect writes). All via services → DataSource — **never** raw
`localStorage`/`fetch` (see [../../Environment-Management-backend.md](../../Environment-Management-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Hero | `HomeService.hero()` | static content → API |
| Shorts | `ShortsService.featured()` | shorts content |
| Products/Services/Businesses/Shops/Catalogues | `ProductService.trending()`, `ServiceService.list()`, `BusinessService.list()`, `ShopService.nearby(city)`, `CatalogueService.latest()` | listing content |
| Video stories / proof | `TestimonialService.list()` | testimonials content |
| Journal | `BlogService.published()` | `posts` (`ib_blog_posts`) — Admin-authored |

**URL state:** `?city=<slug>` filters Shops/feed by city; `?filter=<pill>` filters the category feed.
Read via `useSearchParams` in `useHome.ts` (not `useState`).

## 7. Primary CTA
**Hero primary** — "Explore now" (into discovery). Secondary CTAs across the page:
- Card → detail navigation (whole card is the link).
- "Get catalogue" (catalogue cards) → Connect modal, intent `catalogue`.
- Card save (heart, hover-reveal) → writes to saved.
- "Connect" on business/shop cards → Connect modal (intent `project`/`shop`).
- "Browse more …" section links → the matching listing page.

Every CTA resolves to the next journey step. Use exact strings from [../copywriting.md](../copywriting.md).

## 8. States
- **Loading:** skeleton cards per section (standard skeleton component — not a bare spinner). Hero shows a
  placeholder band.
- **Empty:** any section with no data is **omitted entirely** (the Journal section already does this via
  `display:none`). The page never shows an empty-titled section.
- **Error:** a failed section degrades to hidden + a quiet inline retry; the rest of the page still renders
  (sections are independent).
- **Success:** n/a at page level; Connect/auth successes are owned by their overlays.

## 9. Responsive
- Desktop: 4-up card grids, hero `1.5fr / 1fr`. Shell 1600px.
- ≤720px: sidebar → drawer; search → fixed overlay; grids reflow; horizontal rows (shorts) scroll-snap.
- Sticky category bar (`top:0; z:5`) stays; hero remains usable (single-column band on small screens).
- Touch targets ≥ 38px; card save button (28px) acceptable as secondary.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`, each section a `<section>` with its
  SectionHeader title as the accessible name (`aria-labelledby`).
- Headings: **one H1** = the hero title; each `.sec-title` is an H2. No skipped levels.
- Carousel: arrow-key operable, dots are labelled buttons, auto-advance pauses on focus/hover; respect
  `prefers-reduced-motion`.
- Cards: whole-card link has an accessible name; save button `aria-label="Save"` + `aria-pressed`;
  thumbnail `alt` describes the item.
- Shorts/video open in a modal (`role="dialog"`, focus-trapped, Esc closes).
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Section eyebrows/titles: **verbatim** from §5 table (brand voice: serif titles, `<em>` keyword in green).
- Brand name lowercase-b "Interior bazzar". CTAs Title Case, no caps/"!".
- Hero copy, card metadata, "Get catalogue", "Connect", "Browse more …" — all from
  [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` with: title "Interior Bazzar — Find verified interior products, services & studios"
(tune to brand), a one-line description echoing the value prop ("qualified enquiries, not noise"),
canonical "/". (Final strings confirmed against prototype `<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/Home/index.tsx` + `useHome.ts` + `Home.module.css`; composes the 12 section
  components in order.
- Mock/local data flows from `src/content/home.content.ts` through the services so editing content
  surfaces in the feed; same calls later hit the API unchanged.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare
  `/` against `file:///…/pages/home.html`. Gate with `tsc -b` + `vite build`.
