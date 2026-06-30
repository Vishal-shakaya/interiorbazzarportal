# PAGE: Explore

```
PROTOTYPE: pages/explore.html        ROUTE: PAGES.EXPLORE ("/explore")        LAYOUT: Browsing (topbar + sidebar)
```

The intent-led browse page — discovery by **style, room and theme** rather than by entity type. Where
Home is the front door and Trending is "what's hot", Explore answers "what am I designing, and in what
taste?". Every field in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Let a buyer browse by taste and intent — pick a style, a room, an editor's feature, a real-budget idea
or a curated guide — and route them into inspiration detail, a listing, or (downstream) a Connect
enquiry, sorted by their taste, budget, and city.

## 2. Journey
- **Actor:** Buyer (primary). Discover stage.
- **Stage:** Discover (a sibling browse entry to Home/Trending; sidebar/topbar `data-active="explore"`).
- **Precedes:** room/style listing pages, inspiration/idea detail, the featured-project story.
- **Leads to:** category listings (room tiles → grid), inspiration detail (idea cards), editorial
  ("Read the full story"), collection pages, and onward to detail → Connect.

## 3. Auth
**Public.** No login to browse styles, rooms, ideas or collections. The shared auth modal (`#authModal`)
is present for the gate, but the gate only fires later on a Connect/enquire action from a detail page —
never on this page. Style pills and "Near me" / "Verified" filters are readable while anonymous.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="explore"`, 60px) + collapsible left
sidebar (`#sidebar`, 240/72px) + `<main class="main">` (`.main-inner`, max-width 1600px). Sidebar
visible. A premium seller banner slot (`data-ib-banner="explore"`) sits above `.main-inner`; a sticky
`.cat-bar` (`top:0; z:5`) holds the style pills.

## 5. Sections (top → bottom — exact prototype order)
Each is its own 3-file component under `components/Explore/`. Section headers use `.sec-head` with a
**SectionHeader** = `.sec-eye` (uppercase green eyebrow + `.sec-eye-line`) + `.sec-title` (DM Serif
Display / Georgia 28–38px, `<em>` in green italic). Quote eyebrow/title **verbatim**:

| # | Section | Component | Eyebrow → Title (verbatim) | Content |
|---|---------|-----------|----------------------------|---------|
| 1 | Style + filter bar | `ExploreFilterBar` | — | `.cat-bar` pills: `All styles (on) / Minimal / Bohemian / Classical / Mid-century / Biophilic / Industrial / Japandi / Luxe` · divider · "Near me" (`ti-map-pin`), "Verified" (`ti-rosette`). |
| 2 | Page header | `ExploreHeader` | "curated for you" → "Find *inspiration* for your space" | `.sec-sub` "Browse real homes, design ideas, materials and the people who can make it happen — sorted by your taste, budget, and city." + actions "Match wizard", "Filters". |
| 3 | Browse by room | `ExploreRooms` | "browse by room" → "What are you *designing?*" | `.exp-cats` 6-col tiles (`.exp-cat`, icon + `.exp-cat-t` + `.exp-cat-c` count): Kitchens 2,840 ideas · Bathrooms 1,920 · Bedrooms 3,210 · Living rooms 2,540 · Foyer & hall 980 · Lighting 1,710 · Balcony 640 · Home office 820 · Kids' room 540 · Tiles & marble 1,180 · Doors 410 · Flooring 920. |
| 4 | Featured project | `ExploreFeature` | "editor's pick" → "This week's *featured* project" | Editorial split card: eyebrow "A minimalist Delhi villa" → "Designed for *slow* mornings & *long* dinners", Studio Atrium · 4,200 sq ft · 7 months · ₹1.2 Cr, CTA "Read the full story". Header link "All features". |
| 5 | Design ideas grid | `ExploreIdeas` | "design ideas" → "*Real* homes, real budgets" | `.sec-sub` "Browse what other homeowners actually built — with budgets, suppliers, and lessons learned." + `#exploreGrid` 4-col `.exp-ins` idea cards (`.exp-ins-cat`, `.exp-ins-t`, `.exp-ins-saves`, meta: by · sq ft · budget). Header link "View gallery". |
| 6 | Curated collections | `ExploreCollections` | "curated collections" → "Themed *guides* to get you started" | 3-col `.exp-coll` cards (`.exp-coll-eye` item count, `.exp-coll-t`, `.exp-coll-c`): "Small kitchens, big ideas", "The marble & brass story", "Light, layered, lived-in", "The 6-week bathroom", "Biophilic homes", "Quiet luxury at home". Header link "All collections". |

> The shared footer follows the feed (layout component, not Explore-specific).

## 6. Data
Read-only page (plus shared auth/connect writes downstream). All via services → DataSource — **never**
raw `localStorage`/`fetch` (see
[../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Banner slot | `BannerService.forPage("explore")` | seller banner-ad content |
| Browse by room | `ExploreService.rooms()` | category content (room → idea count) |
| Featured project | `ExploreService.featured()` / `BlogService.published()` | editorial (`posts`) |
| Design ideas grid | `ExploreService.ideas({ style, room, city })` | inspiration content (the prototype's `INSP` list) |
| Curated collections | `ExploreService.collections()` | collection content |

**URL state:** `?style=<pill>` (All styles default), `?room=<slug>`, plus `?near=1` / `?verified=1`
toggles and `?city=<slug>` scope the ideas grid. Read via `useSearchParams` in `useExplore.ts` (not
`useState`).

## 7. Primary CTA
**Primary** — a **room/category tile** (`.exp-cat`) → the matching style/room listing (the page's core
"browse by intent" action; the whole tile is the link). Secondary CTAs:
- Style pills + "Near me" / "Verified" → filter the ideas grid.
- Idea card (`.exp-ins`) → inspiration detail; card save (heart) → writes to saved.
- "Read the full story" / "All features" → the featured editorial.
- Collection card / "All collections", "View gallery", "Match wizard", "Filters" → matching surface.

Use exact strings from [../copywriting.md](../copywriting.md); the eyebrow/title/CTA labels above
are quoted verbatim from the prototype. Every CTA resolves to the next journey step (tile → listing →
detail → Connect).

## 8. States
- **Loading:** skeleton tiles for rooms/collections and skeleton idea cards (standard skeleton component
  — not a bare spinner). The featured card shows a placeholder band.
- **Empty:** any section with no data is **omitted entirely** (the page never shows an empty-titled
  section). If a style/room/`Near me`/`Verified` filter yields no ideas, the grid shows the standard
  empty state — icon + "No ideas match these filters" + a next-action CTA ("Clear filters" / "Start
  browsing") — never a blank panel.
- **Error:** a failed section degrades to hidden + a quiet inline retry; the rest of the page still
  renders (sections are independent).
- **Success:** n/a at page level; Connect/auth successes are owned by their overlays.

## 9. Responsive
- Desktop: room tiles 6-up (`repeat(6,1fr)`), ideas grid 4-up, collections 3-up, shell 1600px.
- ≤1100px: room tiles → 4-up, ideas grid → 3-up. ≤780px: room tiles → 3-up, ideas grid → 2-up
  (prototype `@media` rules).
- ≤720px: sidebar → drawer; `.cat-bar` stays sticky and scrolls horizontally; the featured split card
  stacks to single-column.
- Touch targets ≥ 38px; the card save heart (28px) acceptable as a secondary action.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`, each section a `<section>` named by its
  `.sec-title` (`aria-labelledby`); the banner slot is a labelled region (`aria-label="Sponsored"`).
- Headings: **one H1** = the page header "Find inspiration for your space"; each `.sec-title` is an H2.
  No skipped levels.
- Room tiles and idea/collection cards are whole-card links with an accessible name; thumbnail `alt`
  describes the room/idea, not "image". Idea-card save button `aria-label="Save"` + `aria-pressed`.
- Style pills + "Near me" / "Verified" are real `<button>`s with `aria-pressed`; the sticky bar is
  keyboard scrollable; "Verified" pairs the rosette icon with text (state, not colour alone).
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Section eyebrows/titles: **verbatim** from §5 (brand voice: serif titles, `<em>` keyword in green).
- Brand name lowercase-b "Interior bazzar". British "enquiry" downstream; copy here favours "ideas",
  "homeowners", "studio" (e.g. "Studio Atrium") per the trade vocabulary in
  [../copywriting.md](../copywriting.md).
- CTAs Title Case, no caps/"!": "Read the full story", "View gallery", "All collections", "Match wizard"
  — quoted from the prototype, aligned to [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` with: title "Explore — Interior bazzar" (matches the prototype `<title>`), a one-line
description echoing the value prop ("browse real homes, rooms, ideas and the verified people who can make
them happen"), canonical "/explore". (Final strings confirmed against prototype `<title>`/meta before
build.)

---

### Build notes (React)
- Page shell: `src/pages/Explore/index.tsx` + `useExplore.ts` + `Explore.module.css`; composes the 6
  section components in order. The banner slot and footer are shared layout components.
- Mock/local data flows from `src/content/explore.content.ts` (rooms, the `INSP` ideas list, collections)
  through `ExploreService` so editing content surfaces in the grid; the same calls later hit the API
  unchanged.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/explore`
  against `file:///…/pages/explore.html`. Gate with `tsc -b` + `vite build`.
