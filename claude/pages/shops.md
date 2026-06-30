# PAGE: Shops

```
PROTOTYPE: pages/shops.html        ROUTE: PAGES.SHOPS        LAYOUT: Browsing (topbar + sidebar)
```

The retail/storefront discovery surface — a buyer finds a real, walk-in-able shop (showroom or
studio), checks if it's open and how far, previews it, and connects. Everything in
[README.md](README.md) §B is answered below.

---

## 1. Purpose
Let a buyer find a verified shop near them — see open/closed status and distance at a glance, preview
its photos, hours, contact and reviews in place, and connect (visit, appointment, callback, quote)
without leaving the page.

## 2. Journey
- **Actor:** Buyer (primary). Sellers appear as the connected shop, not as actors here.
- **Stage:** Discover → (preview) Evaluate → Connect.
- **Precedes:** Business detail (`business-detail.html?id=`, "View full page"); the Connect/enquiry sheet.
- **Leads to:** the enquiry-options sheet → Connect modal → (login gate) → buyer dashboard.

## 3. Auth
**Public.** No login to browse, preview, filter or read reviews. The login gate fires only on a Connect
**action** — `shopEnquire(...)` / "Book appointment" / the enquiry-options picker route through the
shared `IBConnect.open({intent:'shop'})` modal, where step 1 OTP/login gates the submit. The shared
auth modal (`#authModal`) is present for that. URL category context (`?cat=`) is readable while anon.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="shops"`, 60px) + collapsible left
sidebar (`#sidebar`, 240/72px) + `<main class="main" id="main">`. Distinct **60/40 split** body
(`.shop-split`): left **shop list** column (`#shopListCol`, rows), right **sticky preview** column
(`<aside class="shop-preview-col" id="shopPreviewCol">`). Shell max-width 1600px.

## 5. Sections (top → bottom — exact prototype order)
Verbatim from `pages/shops.html`. The three top banners are reusable IB components; the body is the
list + preview split (not the standard 4-up card grid).

| # | Section | Prototype anchor | Content (verbatim) |
|---|---------|------------------|--------------------|
| 1 | Filtration row | `<div class="filter-row-mount" id="shopFilterRow">` (BANNER 1, reusable `IBFilterRow`) | Chips from `SHOP_FR_ITEMS`: "All shops", "Showrooms", "Studios & Offices", "Open now", "Tiles & Marble", "Modular Kitchen", "Paint & Finishes", "Furniture", "Bath & Sanitary", "Hardware", "IB Verified". |
| 2 | Hero carousel | `<div class="hero-carousel" id="heroCarousel">` (BANNER 2, `assets/ib-hero.js`) | `#heroTrack` slides + `#heroDots` + `#heroProgress`. Admin-managed real photos. |
| 3 | Sponsored banner | `<div class="prod-banner-slot" data-ib-sponsor-slot>` (BANNER 3, spot `shops`) | Renders only when a live sponsored banner exists. |
| 4 | Shop list (left 60%) | `<div class="shop-list-col" id="shopListCol">` → `.shop-row` (injected by `renderProducts()`) | Per row: numbered thumb + "12" photo count; category + type ("Showroom"/"Studio"); name; rating line `★★★★★ (N reviews)`; **info line** — `Open · Closes 9 PM` **or** `.shop-row-status.closed` "Closed", `<i ti-map-pin> {Distance}`, `<i ti-clock-hour-3> {N}+ yrs`; speciality chips; quick "Save" (`ti-bookmark`). |
| 5 | Preview empty state | `<div class="preview-empty" id="previewEmpty">` | `ti-building-store` icon · "Select a shop to preview" · "Tap any shop on the left to see its details, opening hours, and contact options." |
| 6 | Preview content (right 40%, sticky) | `<div class="preview-content" id="previewContent">` (built by `openPreview(id)`) | Photo hero carousel; cat · type; title; rating; **status** `.preview-status-line` "Open · Closes 9 PM" (pulsing green dot); instant chips **WhatsApp · Call · Directions · Reviews**; sections **Contact** (phone, location/`Distance`, "Call"/"Directions"), **Customer segments**, **Updates** ("{n} latest"), reviews ("See all {rev}"), **About**, "Write a review". |
| 7 | Preview footer (sticky CTAs) | `<div class="preview-foot">` | Primary "Send enquiry" (`openEnquiryOptions`), "Book appointment" (`shopEnquire(id,'appointment')`), "View full page" → `business-detail.html?id=`. |

> **Enquiry-options sheet** (overlay, `#eoSheet role="dialog"`): eyebrow "Verified enquiry", title
> "How would you like to connect with *{shop}*?", reassurance "Your enquiry reaches this one shop only
> — never shared with its competitors." Options (`EO_OPTIONS`): "Book an appointment" (priority,
> "Recommended · fastest way to connect"), "Request a site visit", "Get a quote", "Request a callback",
> "General enquiry". Footer: "Takes under a minute. We confirm contact, genuineness & urgency — then
> connect you."

## 6. Data
Read-only listing + preview, plus the shared Connect/auth/review writes. All via services → DataSource
— **never** raw `localStorage`/`fetch` (see
[../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Shop list / preview | `ShopService.list(city)` / `ShopService.byId(id)` | listing content (open status, `Distance`, `Established`, speciality, `Location`) |
| Filtration row | `ShopService.filter(key)` | `SHOP_FR_ITEMS` keys |
| Hero / sponsor | `HomeService.hero()` / `SponsorService.slot('shops')` | hero + sponsored content |
| Reviews | `ReviewService.forShop(id)` / `ReviewService.create(...)` | reviews spine |
| Enquiry / appointment | `ConnectService.open({intent:'shop'})` → enquiry spine | `enquiries` (`ib:sharedenquiry`) |

**URL state:** the prototype reads **`?cat=<slug>`** (`new URLSearchParams(...).get('cat')`) to
pre-filter and pre-select the filtration row; the React port additionally honours **`?city=<slug>`** so
shops can be scoped by city. Read via `useSearchParams` in `useShops.ts` (not `useState`).

## 7. Primary CTA
**"Send enquiry"** (`preview-primary`, opens the enquiry-options sheet, then the Connect modal,
intent `shop`). Secondary CTAs:
- "Book appointment" (`shopEnquire(id,'appointment')`) — the priority/recommended path.
- Instant contact chips: WhatsApp · Call · Directions (log-then-redirect).
- "Connect with shop" / "Visit the showroom" map to the sheet options "Request a site visit" / "Book an
  appointment" (use exact prototype option strings above).
- "View full page" → `business-detail.html?id=`. "Write a review" → review compose sheet. Save (bookmark).

Every CTA resolves to the next journey step. Use exact strings from [../copywriting.md](../copywriting.md).

## 8. States
- **Loading:** skeleton shop rows in the list column + a placeholder preview band (standard skeleton —
  not a bare spinner).
- **Empty (no preview selected):** the built-in `#previewEmpty` ("Select a shop to preview" + how-to).
- **Empty (no shops for filter/city):** name it + offer "All shops" / clear filter as the next action —
  never a blank list.
- **Open/closed:** status is **text + colour + dot** ("Open · Closes 9 PM" / "Closed"), never colour
  alone (a11y rule, [style.md §6](../style.md)).
- **Error:** failed list/preview degrades to an inline retry; the rest of the page still renders.
- **Success:** owned by the Connect/review overlays (concrete timeline + forward action).

## 9. Responsive
- Desktop: 60/40 `.shop-split`; preview column sticky.
- ≤720px: split stacks — list first, tapping a row opens the preview (sheet/drawer); sidebar → drawer;
  search → fixed overlay; filtration row scroll-snaps.
- Enquiry-options + review sheets are bottom sheets on mobile.
- Touch targets ≥ 38px; instant chips and quick-save sized accordingly.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; preview is `<aside>`; each preview block
  a `<section>` with its head as accessible name.
- Headings: **one H1** = the page title; preview shop name is an H2; section heads H3. No skipped levels.
- Shop rows: whole row is a labelled control ("{name}, {category}, {open/closed}, {distance}"); status
  conveyed by icon + text, not colour alone.
- Sheets/modals: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` the title; focus trapped;
  Esc + backdrop close (prototype `closeEnquiryOptions`/`closeReviewCompose` + Esc handler).
- Icon-only buttons (Save, close, WhatsApp/Call/Directions) carry `aria-label`; decorative `ti-*` icons
  `aria-hidden`. Pulsing status dot respects `prefers-reduced-motion`.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Filtration chips, status ("Open · Closes 9 PM" / "Closed"), distance, "{N}+ yrs", segment lists,
  empty-state — **verbatim** from §5/§6.
- Brand name lowercase-b "Interior bazzar". British "enquiry". CTAs Title Case, no caps/"!".
- Enquiry-sheet reassurance ("…reaches this one shop only — never shared with its competitors.") and
  footer copy are verbatim; all strings cross-checked against [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` with: title **"Shops — Interior bazzar"** (prototype `<title>`), a one-line description
echoing the value prop ("verified shops near you — walk in, touch & feel before you decide"),
canonical "/shops". (Final strings confirmed against prototype `<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/Shops/index.tsx` + `useShops.ts` + `Shops.module.css`; composes the
  filtration row, hero, sponsor banner, and the `ShopList` + `ShopPreview` split.
- `ShopPreview` is a separate component fed by the selected `id`; the enquiry-options sheet and review
  compose sheet are shared overlays, not Shops-specific.
- Connect is gated at the action: `shopEnquire`/"Book appointment" call `ConnectService.open({intent:
  'shop'})`; login fires at Connect step 1, then returns via `IB_POST_LOGIN_REDIRECT`.
- Mock/local data flows from `src/content/shops.content.ts` through `ShopService`; same calls later hit
  the API unchanged.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/shops`
  against `file:///…/pages/shops.html`. Gate with `tsc -b` + `vite build`.
