# PAGE: Product detail

```
PROTOTYPE: pages/product-detail.html   ROUTE: PAGES.PRODUCT_DETAIL ("/product/:id")   LAYOUT: Browsing (topbar + sidebar)
```

The buyer's **evaluate** page for a single product. Public to read; the primary CTA opens the shared
Connect modal with intent `product`. Everything in [README.md](README.md) §B is
answered below.

---

## 1. Purpose
Give a buyer everything needed to **evaluate one product** — gallery, price, stock, specs, installation,
seller, reviews, and related items — and convert that evaluation into a qualified enquiry via Connect.

## 2. Journey
- **Actor:** Buyer (primary).
- **Stage:** Evaluate → Connect.
- **Precedes:** the Connect modal (intent `product`); then the login gate and Success.
- **Leads to:** Connect modal; related listing rows; the seller's other products; products listing.

## 3. Auth
**Public.** No login to read the page. **Gate at the action, not the page** — the login gate fires when
the buyer hits **"Continue"** inside the Connect modal (opened by "Connect with seller" / "Request
sample"), not on page load. `IBConnect.open({ intent })` drives this; not logged in → `auth.html`
(stores `IB_POST_LOGIN_REDIRECT`) → back to the modal.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="products"`, 60px) + collapsible left
sidebar (`#sidebar`) + `<main>`. Breadcrumb (`.pd-crumb`, `aria-label="Breadcrumb"`) → two-column
product grid (`.pd-grid`: sticky `.pd-gallery` left / `.pd-info` right) → full-width tabs
(`.pd-tabs-section`) → suggestions (`.suggestions-wrap`).

## 5. Sections (top → bottom — exact prototype order)
Quote copy **verbatim**:

| # | Section | Component | Copy / IDs (verbatim) | Content |
|---|---------|-----------|------------------------|---------|
| 1 | Breadcrumb | `PDCrumb` | Home › Tiles & Marble › "Italian Carrara White Marble Slab" | `.pd-crumb` nav. |
| 2 | Gallery (left, sticky) | `PDGallery` | badges "Bestseller" + "IB Verified"; `#galCount` "1 / 5" | `.pd-main-img` (`#mainPhoto`) + arrows (`galNav`) + `.pd-thumbs-row` (5 thumbs, `selThumb`) → lightbox (`#lightbox`, `lbNav`). |
| 3 | Info (right) | `PDInfo` | tags "Tiles & Marble" / "IB Verified" / "Origin: Italy"; title "Italian Carrara White Marble Slab — Polished Finish"; "Sold by *The Tile Studio*" · "Responds within 4 hrs" | Seller row + rating row (below). |
| 3a | Rating row | `PDRating` | "4.4" · "(208 reviews)" · "2.4k interested" | `.pd-rating-row`: `.pd-stars` ★★★★★, `.pd-rat-n`, `.pd-rat-c`, `.pd-int`. |
| 3b | Price / stock | `PDPrice` | "₹480" "/sq ft" old "₹580" "Save ₹100/sq ft"; "Minimum order: 50 sq ft"; "+ 18% GST applicable · Price ex-warehouse Delhi"; "In stock" · "Min order: 50 sq ft · Sample: ₹250 (refundable)" | `.pd-price-block` + `.pd-stock-row`. |
| 3c | Quantity | `PDQty` | "Quantity" / "sq ft" | `.qty-ctrl` (`chQty`), min 50 step 10. |
| 3d | CTAs | `PDCtas` | **"Connect with seller"** (primary, `openConn()`) · "Request sample" (`openConn('sample')`) | Below: "Save" / "Share" / "Report" (`.pd-save-share`). |
| 3e | What happens | `PDProcess` | "What happens after you connect" + 4 steps (IB qualifies intent · brief sent to verified seller · seller responds in dashboard, typically within 4 hours · contact stays private until you share) | `.pd-process`. |
| 3f | Trust strip | `PDTrust` | "Secure connection" · "GST invoice" · "Pan India delivery" · "4.4 seller rating" | `.pd-trust`. |
| 4 | Tab anchors + panes | `PDTabs` | "Product details" · "Description" · "Specifications" · "Installation & care" · "About the seller" · "Reviews (208)" | `.pd-anchor-nav` (`#pdAnchorNav`, `goSec`) over panes `#ptab-details`/`-description`/`-specs`/`-install`/`-company`/`-reviews`. |
| 4a | Specifications | `PDSpecs` | groups "Physical properties" / "Surface & finish" / "Standards & compliance" (e.g. "Fire rating — Non-combustible — Class A1 (EN 13501)") | `.spec-tbl` grouped rows. |
| 4b | Reviews | `PDReviews` | "4.4" "Based on 208 reviews"; bars 5→1 (142/40/17/6/3); "Write a review"; 3 verified review cards | `.reviews-layout` = `.rev-summary` + `.rev-list`; each `.rev-card` has author, project type, stars, text, "Helpful?". |
| 5 | Similar products | `PDSimilar` | "Similar *products*" / "More tiles & marble from verified sellers" + "View all in Tiles & Marble" | `.sugg-grid` `#similar-grid` (product `.card`s). |
| 6 | More from seller | `PDSellerMore` | "More from *The Tile Studio*" / "Other products by the same verified seller" + "View seller profile" | `.sugg-grid` `#seller-grid`. |
| 7 | Customers also viewed | `PDAlsoViewed` | "Customers also *viewed*" / "Buyers looking at this product also explored these" | `.av-row` `#also-viewed`. |
| 8 | Recently viewed | `PDRecent` | "Recently *viewed*" / "Pick up where you left off" + "Browse all products" | `.rv-row` `#recent-viewed`. |

## 6. Data
Read-mostly (plus the shared Connect/auth/save/report writes). All via services → DataSource — **never**
raw `localStorage`/`fetch` (see [../../Environment-Management-backend.md](../../Environment-Management-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Product (gallery, info, price, specs, install, description) | `ProductService.get(id)` | listing/product content |
| Seller block (About the seller) | `BusinessService.get(sellerId)` | business content |
| Reviews + summary | `ReviewService.forProduct(id)` | reviews content |
| Similar / same-seller / also-viewed | `ProductService.related(id)` / `.bySeller(sellerId)` | listing content |
| Recently viewed row | `RecentlyViewedService.list()` | recently-viewed history |
| On view | `RecentlyViewedService.record(item)` | history write (page records itself) |
| Save / report | `SavedService.toggle(id)` / `ReportService.open(...)` | saved / reports |
| Connect (enquiry) | `IBConnect.open({ intent:'product' })` → enquiry spine | `enquiries` (`ib:sharedenquiry`) |

**URL state:** `:id` selects the product; gallery index is local UI state. Read params via
`useSearchParams`/route params in `useProductDetail.ts` (not `useState` for URL-derived values).

## 7. Primary CTA
**"Connect with seller"** — opens the Connect modal with **intent `product`** (`PAGE_INTENT = 'product'`).
This is the page's single most important action: turn evaluation into a qualified enquiry routed
exclusively to one seller.

Secondary CTAs:
- "Request sample" → Connect modal, **also intent `product`** (the prototype maps the `sample` hint to the
  product intent and swaps the modal title to "Request a sample").
- Connect modal step labels (from [../modules-features-flow.md](../modules-features-flow.md)
  §Part 2, product intent): "What you need" (Check price / Sample / Bulk / Custom) + note → "Continue" →
  (gate) → "Send enquiry". Success: "Your question is sent to {seller}. Expect a reply within 2 hours."
- "Save" / "Share" / "Report"; tab anchors; related/seller/also-viewed cards → detail; "Browse all
  products", "View all in Tiles & Marble", "View seller profile".

Use exact strings from [../copywriting.md](../copywriting.md) ("Connect", "Send enquiry", "Continue").

## 8. States
- **Loading:** skeleton gallery + info block; skeleton review and suggestion cards (standard skeleton).
- **Empty:** any related row with no items is omitted (never an empty-titled row). A product with no
  reviews shows the summary zeroed + "Write a review" as the next step.
- **Error:** a missing/invalid `:id` → not-found state with "Browse all products" (no dead end); a failed
  suggestion row degrades to hidden while the rest of the page renders.
- **Success:** owned by the Connect modal — ends on a success screen with a concrete timeline
  ("Expect a reply within 2 hours") and a forward action.

## 9. Responsive
- Desktop: two-column `.pd-grid` with a **sticky** gallery (`top:78px`); 4-up suggestion grids.
- ≤720px: `.pd-gallery` stacks above `.pd-info` (border-bottom instead of border-right, no sticky);
  sidebar → drawer; tab anchors scroll horizontally; suggestion grids reflow.
- Touch targets ≥ 38px; qty `.qty-b` and `.pd-icon-btn` sized accordingly; gallery arrows operable by touch.

## 10. Accessibility
- Landmarks: `header`, `nav`/`aside`, `main`; breadcrumb `nav aria-label="Breadcrumb"`; each tab pane and
  each suggestion row is a labelled region (named by its section title).
- Headings: **one H1** = the product title ("Italian Carrara White Marble Slab — Polished Finish"); tab
  pane titles (`.pd-sec-t`) and suggestion titles are H2s — no skipped levels.
- Ratings have a text equivalent ("4.4 — 208 reviews"), not stars alone; review bars labelled.
- Gallery arrows have `aria-label` ("Previous image"/"Next image"); thumbnails are labelled buttons;
  lightbox is `role="dialog"`, focus-trapped, Esc closes, returns focus to the trigger.
- Connect modal: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` the title; focus trapped;
  Esc + backdrop close; options are real `<button>`/labelled radios (see doc 01 §Part 2 a11y).
- Icon-only buttons (Save/Share/Report, qty) carry `aria-label`; verified/stock state pairs icon+text, not
  colour alone. Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Section/tab titles, price, stock, trust, "What happens after you connect" steps: **verbatim** from §5.
- Brand name lowercase-b "Interior bazzar"; British "enquiry"; CTAs Title Case, no caps/"!".
- Enquiry CTAs and Connect copy from [../copywriting.md](../copywriting.md): "Connect", "Request
  sample", "Continue", "Send enquiry"; success line "Your question is sent to {seller}. Expect a reply
  within 2 hours."

## 12. SEO
`PublicPage` with: title "Italian Carrara White Marble Slab — Interior bazzar" pattern, i.e. per-product
"{product name} — Interior bazzar" (verbatim shape from prototype `<title>`); description = a one-line
product summary with price + verified-seller value prop; canonical "/product/:id". (Final strings
confirmed against prototype before build.)

---

### Build notes (React)
- Page shell: `src/pages/ProductDetail/index.tsx` + `useProductDetail.ts` + `ProductDetail.module.css`;
  composes gallery / info / tabs / suggestion rows in prototype order.
- `ProductService.get(id)` (+ related/reviews) flows through services from local content; same calls later
  hit the API unchanged. The page records itself via `RecentlyViewedService.record()` on mount.
- Both enquiry CTAs route through the shared `IBConnect.open({ intent:'product' })` — never a page-local
  enquiry form. Save/report go through their services.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/product/:id`
  against `file:///…/pages/product-detail.html`. Gate with `tsc -b` + `vite build`.
