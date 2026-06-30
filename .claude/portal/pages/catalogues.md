# PAGE: Catalogues

```
PROTOTYPE: pages/catalogues.html        ROUTE: PAGES.CATALOGUES        LAYOUT: Browsing (topbar + sidebar)
```

The maker-catalogue surface — a buyer browses brand brochures, project portfolios and editor picks from
verified publishers, previews one, and gets it (download = a qualified catalogue enquiry). Everything in
[README.md](README.md) §B is answered below.

---

## 1. Purpose
Let a buyer discover and get manufacturer/maker catalogues — brand PDFs, project photo portfolios and IB
editor picks — from verified publishers, with the "get catalogue" action captured as a qualified Connect
enquiry routed exclusively to that maker.

## 2. Journey
- **Actor:** Buyer (primary). The publishing maker is the seller who receives the enquiry.
- **Stage:** Discover → (preview) Evaluate → Connect (catalogue intent).
- **Precedes:** the catalogue detail panel (`openDetail`); the Connect/download flow.
- **Leads to:** download confirmation + an enquiry to the maker → buyer dashboard; "View plans" for
  sellers who want to publish.

## 3. Auth
**Public.** Browsing, filtering and previewing are open. The login gate fires only on the **get-catalogue
action**: `catDownload(id)` checks `IBAuth.isLoggedIn()` — logged-in → download toast + logs a Connect
enquiry (`IBConnect.open({intent:'product'})`, catalogue intent); logged-out → stashes
`ib_post_login_action='catalogue_download'` and opens login (`ibOpenLogin()` / `auth.html?next=catalogues.html`).

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="catalogues"`, 60px) + collapsible left
sidebar (`#sidebar`, 240/72px) + `<main class="main" id="main">`. Body (`.prod-page`): full-width
filter bar, then `.main-area` with the **catalogue grid** (`#productGrid`, `repeat(4,1fr)`) and a
**right filter sidebar** (`<aside class="prod-sidebar">` facet panel). Shell max-width 1600px.

## 5. Sections (top → bottom — exact prototype order)
Verbatim from `pages/catalogues.html`.

| # | Section | Prototype anchor | Content (verbatim) |
|---|---------|------------------|--------------------|
| 1 | Filter bar (top chips) | `<div class="filter-bar"><div class="filter-chips">` | `.fchip`: "All catalogues" (on), "Brand catalogues" (`ti-book-2`), "Project portfolios" (`ti-photo`), "IB Editor picks" (`ti-sparkles`), "2026 releases" (`ti-calendar`), "Free downloads" (`ti-download`). |
| 2 | Sponsored banner | `<div class="prod-banner-slot" data-ib-sponsor-slot>` | Renders only when a live sponsored banner exists. |
| 3 | Catalogue grid | `<div class="product-grid" id="productGrid">` (cards from `cardHTML(p)`) | `.cat-card` per catalogue: type tag PDF/PHOTOS/IB PICKS, icon, meta (unit), **company tag** (avatar + seller + `ti-rosette-discount-check-filled` "IB Verified"), optional badge, Save; body = cat, name, rating `★★★★★ {rat} ({rev})`, views `ti-eye {int}`; actions **"Download"** (`catDownload`) + **"View"** (`openDetail`). Inline ad card (`adHTML`) every few rows. |
| 4 | Infinite-scroll feed | `#infLoader` "Loading more…" · `#infSentinel` · `#loadMoreWrap` "Load more catalogues" · `#infEnd` "You've seen all catalogues." | `FEED_BATCH 12 / FEED_MAX 48`; IO sentinel with load-more fallback + end state. |
| 5 | Right filter sidebar | `<aside class="prod-sidebar"><div class="filter-panel">` | Head "Filters" + "Clear all"; **Catalogue type** (All / Brand catalogues / Project portfolios / IB Editor picks); **Format** (PDF brochure / Photo portfolio); **Refine** (IB Verified publishers only [on], Latest 2026 releases, Free download, Hindi available, Includes price guide, Rated 4.5+). |

> **Detail panel** (slide-over, `#dp-panel` + `#dp-backdrop`): gallery, title, "By {seller}", rating,
> tabs, primary **"Download PDF"** (`catDownload`) + a type-specific secondary ("Share" / "Contact
> provider" / "Save for later"). **Connect/download overlay** (`#connOverlay`): head `#conn-h` =
> "View catalogue" (or "Request a sample"), 4 progress dots, steps → "Connection sent." success.

## 6. Data
Read-only listing + preview, plus the get-catalogue Connect/auth writes. All via services → DataSource —
**never** raw `localStorage`/`fetch` (see
[../../Environment-Management-backend.md](../../Environment-Management-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Grid / detail | `CatalogueService.list()` / `CatalogueService.byId(id)` | catalogue content (type, seller, unit, badge, rating, int) |
| Filters (chips + facets) | `CatalogueService.filter({type,format,refine})` | type `brand`/`project`/`collection`; facets pdf/photos/2026/free/hindi/priceguide/rated |
| Sponsor | `SponsorService.slot('catalogues')` | sponsored content |
| Get catalogue (download) | `ConnectService.open({intent:'catalogue'})` → enquiry spine | `enquiries` (`ib:sharedenquiry`) |

**URL state:** filter chips and facets drive the feed via `useSearchParams` (`?filter=<chip>`,
`?type=`, `?page` for the feed) in `useCatalogues.ts` (not `useState`); top chips and right-sidebar
facets stay in sync (prototype `applyCatFilters` / `sbType`).

## 7. Primary CTA
**"Get catalogue"** — the catalogue Connect intent. In the prototype this surfaces as **"Download"**
(card) / **"Download PDF"** (detail panel) via `catDownload`, which logs a qualified enquiry to the
publisher (intent `catalogue`). Secondary CTAs:
- "View" (`openDetail`) → the catalogue detail panel.
- Detail secondary by type: "Share" / "Contact provider" / "Save for later".
- Save (bookmark) on the card; "View plans" on the inline ad → `plans-checkout.html` (seller path).

Every CTA resolves to the next journey step. Use exact strings from [../copywriting.md](../copywriting.md)
("Get catalogue" is the canonical brand-voice label for this action).

## 8. States
- **Loading:** skeleton catalogue cards + the `#infLoader` "Loading more…" during paging (standard
  skeleton — not a bare spinner).
- **Empty (no results for filter):** name it ("No catalogues found") + offer "All catalogues" / "Clear
  all" as the next action — never a blank grid.
- **End of feed:** `#infEnd` "You've seen all catalogues."
- **Get-catalogue success:** logged-in toast "Catalogue queued — you'll receive it in WhatsApp & email"
  + the enquiry is logged; logged-out → login gate then resume.
- **Error:** failed feed/detail degrades to an inline retry; the rest of the page still renders.

## 9. Responsive
- Desktop: 4-up grid + right filter sidebar.
- ≤720px: grid → 2-up (`.catalogues-grid` `repeat(2,1fr)`); right filter sidebar → a filter sheet/drawer;
  sidebar → drawer; search → fixed overlay; top chips scroll-snap.
- Detail + connect overlays are bottom sheets on mobile.
- Touch targets ≥ 38px; Download/View actions sized accordingly.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; the filter panel is an `<aside>`; the
  grid is a labelled region.
- Headings: **one H1** = the page title; catalogue card names are not headings (card titles), detail
  panel title is H2. No skipped levels.
- Filter chips/facets are real `<button>`/labelled inputs with `aria-pressed`/checked state; "IB
  Verified" badge pairs the rosette icon with text, not colour alone.
- Cards: whole card is a labelled link; Download/View/Save are distinct labelled buttons; thumbnail/icon
  has descriptive `alt`/label, decorative `ti-*` icons `aria-hidden`.
- Detail panel + connect overlay: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; focus
  trapped; Esc + backdrop close (prototype `closeDetail`/`closeConn` + Esc handler).
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Filter chips, facet labels, feed strings ("Load more catalogues", "You've seen all catalogues."),
  download toast — **verbatim** from §5/§8.
- Brand name lowercase-b "Interior bazzar". British **"catalogue"** (never "lookbook"/"PDF" as the
  noun). CTAs Title Case, no caps/"!".
- The card action reads "Download" in the prototype; the canonical brand-voice CTA for the action is
  **"Get catalogue"** ([../copywriting.md](../copywriting.md)) — align on build.

## 12. SEO
`PublicPage` with: title **"Catalogues — Interior bazzar"** (prototype `<title>`), a one-line
description echoing the value prop ("fresh catalogues from verified manufacturers — get the brochure,
reach the maker"), canonical "/catalogues". (Final strings confirmed against prototype `<title>`/meta
before build.)

---

### Build notes (React)
- Page shell: `src/pages/Catalogues/index.tsx` + `useCatalogues.ts` + `Catalogues.module.css`; composes
  the filter bar, sponsor banner, infinite-scroll grid, and the right facet sidebar.
- Top chips and right-sidebar facets read/write the same filter state (`useSearchParams`), mirroring the
  prototype's synced `applyCatFilters`/`sbType`.
- Get-catalogue is gated at the action: `catDownload` calls `ConnectService.open({intent:'catalogue'})`
  when logged in, else opens login and stashes `ib_post_login_action`; resume via `IB_POST_LOGIN_REDIRECT`.
- Mock/local data flows from `src/content/catalogues.content.ts` through `CatalogueService`; same calls
  later hit the API unchanged.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/catalogues`
  against `file:///…/pages/catalogues.html`. Gate with `tsc -b` + `vite build`.
