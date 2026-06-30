# PAGE: Products

```
PROTOTYPE: pages/products.html        ROUTE: PAGES.PRODUCTS ("/products")        LAYOUT: Browsing (topbar + sidebar)
```

The flagship listing page: a filterable, infinitely-scrolling product grid with a right-hand
filter panel. Everything in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Let a buyer browse the full catalogue of interior products, narrow it with category chips and a
price/attribute filter panel, open a product in the slide-over detail panel, and route into a
Connect enquiry (intent `product`) — without ever leaving the grid context.

## 2. Journey
- **Actor:** Buyer (primary). Sellers browse competitively but their journey is Auth → Plans.
- **Stage:** Discover → evaluate (the grid is discover; the detail panel is evaluate-in-place).
- **Precedes:** Product detail (via the in-page slide panel) and the Connect modal.
- **Leads to:** Connect (intent `product`), saved items, `service-detail`/sibling listings via category chips.

## 3. Auth
**Public.** Browsing, filtering and opening the detail panel are all anonymous. The login gate fires
only on the Connect/enquire **action** (the card "Contact" button / panel Connect → `IBConnect.open({ intent: 'product' })`).
Category context (`?cat=`) is readable while anonymous.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="products"`, 60px) + collapsible left
sidebar (`#sidebar`) + `<main class="main">`. Inside main, a **two-column listing grid**
`.prod-page` = `grid-template-columns:minmax(0,1fr) 290px` (content + **right** filter sidebar),
collapsing to one column ≤1080px.

## 5. Sections (top → bottom — exact prototype order)
Listing page, so no `.sec-eye`/`.sec-title` headers; the structure is filter-row → banner → grid →
infinite-scroll controls, plus a sticky right filter panel. Quote class names/copy **verbatim**:

| # | Section | Element | Content (verbatim) |
|---|---------|---------|--------------------|
| 1 | Filter row | `.filter-row-mount[data-ib-filter-row]` | Reusable IB Filter Row (`ib-filter-row.js`): category chips (`.fchip`, active `.fchip.on`) + Trending-style scroll arrows. Emits `ibfr:select`. Spans full width (`grid-column:1 / -1`). |
| 2 | Sponsored banner | `.prod-banner-slot[data-ib-sponsor-slot]` | Mounted by `ib-sponsored.js`; full-width; collapses when empty. |
| 3 | Product grid | `.product-grid#productGrid` | `.pcard` grid, `repeat(auto-fill,minmax(220px,1fr))`. Each card: `.pc-thumb` (img + `.pc-badge` hot/new/bulk/sale + `.pc-save` bookmark), `.pc-cat`, `.pc-name`, `.pc-seller` (verified rosette), `.pc-meta` (`.pc-rating` stars + `.pc-eye` interested), `.pc-price-row` (`.pc-price` + `.pc-unit` + `.pc-old` + `.pc-stock`), `.pc-actions` → "Contact" + "View". |
| 4 | Infinite-scroll controls | `#infLoader` / `#infSentinel` / `#loadMoreWrap` / `#infEnd` | Loader "Loading more…", IntersectionObserver sentinel, fallback button "Load more products", end state "You've seen all products." |
| 5 | Right filter panel | `aside.prod-sidebar` → `.filter-panel` (sticky) | Head `.fp-head` "Filters" + "Clear all" (`clearFilters()`). `.fp-section` "Price range": `.sb2-price` dual-thumb track + Min/Max inputs (₹0 – ₹5,00,000+). `.sb2-checks`: "IB Verified sellers only" (on by default), "In stock only", "Bulk available", "Sample available", "International shipping". |
| — | Detail slide-over | `#dp-backdrop` + `#dp-panel` | Opens in-page on card "View" (`openDetail(id)`); tabs Details/Description/Specs/Company/Similar; not a separate route. |

> The Connect modal (`#connOverlay`, header "Connect with seller") is a shared overlay, not a section.

## 6. Data
Read-mostly page (plus the shared Connect/save writes). All via services → DataSource — **never** raw
`localStorage`/`fetch` (see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Concern | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Product list / pages | `ProductService.list({ cat, filters, page })` | listing content |
| Category chips | `CategoryService.products()` | taxonomy |
| Similar (detail tab) | `ProductService.similar(id)` | listing content |
| Save (heart/bookmark) | `SavedService.toggle(id)` | `saved` |
| Connect enquiry | `ConnectService.open({ intent:'product' })` | enquiries |

**URL state:** `?cat=<slug>` pre-filters the grid and highlights the matching chip (read via
`useSearchParams` in `useProducts.ts`, not `useState`). Filter-panel selections and price range also
belong in URL/query so a filtered view is shareable and back-button safe.

## 7. Primary CTA
**Card "Contact"** — `.pc-connect` → Connect modal, intent `product` (the enquiry is the page's job).
Secondary:
- Card "View" / whole-card click → `openDetail(id)` slide panel.
- `.pc-save` (bookmark, hover-reveal) → writes to saved.
- Category chips → re-filter grid; "Clear all" resets the filter panel.
- "Load more products" → next batch.

Every CTA resolves to the next journey step. Use exact strings from [../copywriting.md](../copywriting.md).

## 8. States
- **Loading:** skeleton `.pcard` grid + "Loading more…" loader for subsequent batches (standard skeleton, not a bare spinner).
- **Empty:** a no-results filter shows "No products found" plus a way forward ("Clear all" / browse a sibling category) — never a dead grid.
- **Error:** a failed list degrades to a quiet inline retry; chrome (filter row, panel) still renders.
- **Success:** end-of-feed shows "You've seen all products."; Connect/save successes are owned by their overlays.

## 9. Responsive
- Desktop: content + 290px sticky right filter panel; grid `auto-fill minmax(220px,1fr)`.
- ≤1080px: `.prod-page` collapses to one column, filter panel becomes static (`max-height:none`) below/over the grid.
- ≤900px: grid → 2-up; detail panel goes full-width.
- ≤720px: sidebar → drawer; filter chips scroll horizontally (`overflow-x:auto`). Touch targets ≥ 38px (save button 30px acceptable as secondary).

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`, the filter panel `aside.prod-sidebar`.
- Headings: **one H1** (page/grid title); filter-panel `.fp-sub` group labels are not headings — label the panel as a region.
- Filter chips: a labelled, keyboard-operable group; active chip carries `aria-pressed`/`aria-current`.
- Cards: whole-card link has an accessible name; `.pc-save` `aria-label="Save"` + `aria-pressed`; thumbnail `alt` = product name; "Contact"/"View" are distinct labelled buttons.
- Detail slide-over + Connect modal: `role="dialog"`, focus-trapped, Esc closes (prototype binds Esc → `closeDetail()`/`closeConn()`).
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Filter labels verbatim from §5 ("IB Verified sellers only", "In stock only", "Bulk available", "Sample available", "International shipping"; "Price range"; "Clear all").
- Brand name lowercase-b "Interior bazzar"; British "enquiry". CTAs Title Case, no caps/"!".
- Card CTAs ("Contact", "View"), "Load more products", "You've seen all products.", "No products found" — keep verbatim; refine against [../copywriting.md](../copywriting.md) (note doc 03 prefers "Connect" over "Contact us"; the card button label is reviewed there).

## 12. SEO
`PublicPage` with: title "Products — Interior bazzar" (from prototype `<title>`), a one-line
description echoing the value prop (verified products, qualified enquiries), canonical "/products"
(category views `?cat=` canonicalise to the base or a category URL). Confirm strings against the
prototype `<title>`/meta before build.

---

### Build notes (React)
- Page shell: `src/pages/Products/index.tsx` + `useProducts.ts` + `Products.module.css`; composes
  FilterRow, SponsorSlot, ProductGrid (+ ProductCard), InfiniteFeed controls, and FilterPanel.
- Reuse the shared ProductCard, FilterPanel and the slide-over DetailPanel across Products/Services
  (same `.prod-page` / `.pcard` markup). Connect routes through the shared `IBConnect` with `intent:'product'`.
- Mock/local data flows from `src/content/products.content.ts` through `ProductService` so editing
  content surfaces in the grid; the same calls later hit the API unchanged.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare
  `/products` against `file:///…/pages/products.html`. Gate with `tsc -b` + `vite build`.
