# PAGE: Services

```
PROTOTYPE: pages/services.html        ROUTE: PAGES.SERVICES ("/services")        LAYOUT: Browsing (topbar + sidebar)
```

The services listing page: the same filter-row + card-grid + right-filter-panel pattern as Products,
tuned for interior service providers. Everything in [README.md](README.md) §B
is answered below.

---

## 1. Purpose
Let a buyer browse verified interior service providers, narrow by service category and price/attribute
filters, open a provider in the slide-over detail panel, and route into a Connect enquiry
(intent `service`) — including a "Book free consultation" path.

## 2. Journey
- **Actor:** Buyer (primary). Service sellers browse competitively; their journey is Auth → Plans.
- **Stage:** Discover → evaluate (grid discovers; the detail panel evaluates in place).
- **Precedes:** Service detail (`service-detail.html`, via card click or the slide panel) and the Connect modal.
- **Leads to:** Connect (intent `service`), saved items, sibling listings via category chips.

## 3. Auth
**Public.** Browsing, filtering and the detail panel are anonymous. The login gate fires only on the
Connect/enquire **action** (card "Contact" / "Book free consultation" → `IBConnect.open({ intent: 'service' })`).
Category context (`?cat=`) is readable while anonymous.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="services"`, 60px) + collapsible left
sidebar (`#sidebar`) + `<main class="main">`. Inside main, the **two-column `.prod-page`** grid
(content + **right** filter sidebar `.prod-sidebar`), collapsing to one column ≤1080px.
(The stylesheet also defines a `.svc-page` variant, but the rendered DOM uses `.prod-page`.)

## 5. Sections (top → bottom — exact prototype order)
Listing page — filter-row → banner → grid → infinite-scroll end, plus a sticky right filter panel.
Quote class names/copy **verbatim**:

| # | Section | Element | Content (verbatim) |
|---|---------|---------|--------------------|
| 1 | Filter row | `.filter-row-mount#svcFilterRow` | Reusable IB Filter Row (`ib-filter-row.js`): service-category chips (`.fchip` / `.fchip.on`) + scroll arrows. Emits `ibfr:select`. Full width. |
| 2 | Sponsored banner | `.prod-banner-slot[data-ib-sponsor-slot]` | Mounted by `ib-sponsored.js` (page-target `services`); collapses when empty. |
| 3 | Service grid | `.product-grid#svcGrid` | `.pcard` grid (`auto-fill minmax(220px,1fr)`). Each card: `.pc-thumb` (img + `.pc-badge` hot/new + `.pc-save` "Save"), `.pc-cat`, `.pc-name`, `.pc-seller` (verified rosette, the **provider**), `.pc-meta` (`.pc-rating` + `.pc-rev` + `.pc-eye`), `.pc-price-row` (`.pc-price` + `.pc-unit` priceNote), `.pc-actions` → "Contact" + "View". |
| 4 | Infinite-scroll end | `#svcFeedSentinel` + `#svcFeedEnd` | Pure IntersectionObserver feed (no load-more button). End state `.svc-feed-end`: "You've reached the end · 1,284 verified services across Delhi NCR". |
| 5 | Right filter panel | `aside.prod-sidebar` → `.filter-panel` (sticky) | Head `.fp-head` "Filters" + "Clear all" (`clearFilters()`). `.fp-section` "Starting price": `.sb2-price` dual-thumb track + Min/Max inputs (₹0 – ₹5,000+). `.sb2-checks`: "IB Verified only" (on by default), "Open today", "Residential projects", "Commercial projects", "Free consultation", "4+ star rating". |
| — | Detail slide-over | `#dp-backdrop` + `#dp-panel` | Opens in-page on card "View" (`openDetail(id)`); crumb root "Services"; not a separate route. |

> The Connect modal (`#connOverlay`, header "Contact provider" / "Book free consultation") is a shared overlay, not a section.

## 6. Data
Read-mostly page (plus the shared Connect/save writes). All via services → DataSource — **never** raw
`localStorage`/`fetch` (see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Concern | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Service list / feed | `ServiceService.list({ cat, filters })` | listing content |
| Category chips | `CategoryService.services()` | taxonomy |
| Similar (detail tab) | `ServiceService.similar(id)` | listing content |
| Save (bookmark) | `SavedService.toggle(id)` | `saved` |
| Connect / consultation | `ConnectService.open({ intent:'service' })` | enquiries |

**URL state:** `?cat=<slug>` pre-filters the feed (slug `-`→space match) and highlights the matching
chip — read via `useSearchParams` in `useServices.ts` (not `useState`). Filter-panel selections and
price range also live in URL/query so a filtered view is shareable and back-button safe.

## 7. Primary CTA
**Card "Contact"** — `.pc-connect` → Connect modal, intent `service`. Secondary:
- "Book free consultation" → Connect modal (header swaps to "Book free consultation").
- Card "View" / whole-card click → `openDetail(id)` slide panel (or `service-detail.html`).
- `.pc-save` (bookmark, hover-reveal) → writes to saved.
- Category chips re-filter; "Clear all" resets the filter panel.

Every CTA resolves to the next journey step. Use exact strings from [../copywriting.md](../copywriting.md).

## 8. States
- **Loading:** skeleton `.pcard` grid for the first batch + observer-driven appends (standard skeleton, not a bare spinner).
- **Empty:** a no-results filter shows "No services found" (per doc 03 "No products found" pattern) plus a way forward ("Clear all" / browse a sibling category) — never a dead grid.
- **Error:** a failed list degrades to a quiet inline retry; the filter row and panel still render.
- **Success:** end-of-feed shows "You've reached the end · 1,284 verified services across Delhi NCR"; Connect/save successes are owned by their overlays.

## 9. Responsive
- Desktop: content + sticky right filter panel; grid `auto-fill minmax(220px,1fr)`.
- ≤1080px: `.prod-page` collapses to one column, filter panel becomes static below/over the grid.
- ≤900px: grid → 2-up; detail panel goes full-width.
- ≤720px: sidebar → drawer; filter chips scroll horizontally. Touch targets ≥ 38px (save button 30px acceptable as secondary).

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`, the filter panel `aside.prod-sidebar`.
- Headings: **one H1** (page/grid title); `.fp-sub` filter group labels are not headings — label the panel as a region.
- Filter chips: a labelled, keyboard-operable group; active chip carries `aria-pressed`/`aria-current`.
- Cards: whole-card link has an accessible name; `.pc-save` already `aria-label="Save"` + needs `aria-pressed`; thumbnail `alt` = service name; "Contact"/"View" are distinct labelled buttons.
- Detail slide-over + Connect modal: `role="dialog"`, focus-trapped, Esc closes (`closeDetail()`/`closeConn()`).
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Filter labels verbatim from §5 ("IB Verified only", "Open today", "Residential projects", "Commercial projects", "Free consultation", "4+ star rating"; "Starting price"; "Clear all").
- Connect header strings verbatim: "Contact provider" (default) / "Book free consultation" (consult intent) — "Book a consultation" is the doc-03 canonical; reconcile at build.
- Brand name lowercase-b "Interior bazzar"; British "enquiry". CTAs Title Case, no caps/"!".
- Card CTAs ("Contact", "View"), end-state text — keep verbatim; refine against [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` with: title "Services — Interior bazzar" (from prototype `<title>`), a one-line
description echoing the value prop (verified interior professionals, qualified enquiries), canonical
"/services" (category views `?cat=` canonicalise to the base or a category URL). Confirm strings
against the prototype `<title>`/meta before build.

---

### Build notes (React)
- Page shell: `src/pages/Services/index.tsx` + `useServices.ts` + `Services.module.css`; composes
  FilterRow, SponsorSlot, ServiceGrid (reusing ProductCard), InfiniteFeed end-state, and FilterPanel.
- Reuse the shared ProductCard / FilterPanel / DetailPanel from Products (identical `.prod-page` /
  `.pcard` markup); only the filter groups, price ceiling (₹5,000+), end-state copy and Connect
  intent (`service`, incl. "Book free consultation") differ.
- Mock/local data flows from `src/content/services.content.ts` through `ServiceService` so editing
  content surfaces in the grid; the same calls later hit the API unchanged.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare
  `/services` against `file:///…/pages/services.html`. Gate with `tsc -b` + `vite build`.
