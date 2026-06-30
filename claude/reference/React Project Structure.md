# Interior Bazzar — V3 Frontend Context

This document covers everything introduced in the **v3 prototype** layer of the codebase. Read the root `CLAUDE.md` first for base conventions (3-file pattern, CSS modules, API layer, Redux). This file documents only what is new or different in v3.

> **Isolation rule**: V3 pages never import from old routes, old layouts, or old components. Every destination inside v3 is a v3 route. Old code (`/home`, `/marketplace`, etc.) is untouched.

---

## 1. V3 Routing

All v3 routes live in `src/routes/v3Routes.tsx`. Route paths come from `PAGES` in `src/utils/constants/app.ts` — never hardcode strings.

```
/home-v3                    → HomeV3             (V3Layout)           ← will swap to "/" once approved
/v3/trending                → TrendingV3         (V3Layout)
/v3/explore                 → ExploreV3          (V3Layout)
/v3/products                → ProductsV3         (V3Layout)
/v3/products/:slug          → ProductDetailV3    (V3Layout)
/v3/services                → ServicesV3         (V3Layout)
/v3/services/:slug          → ServiceDetailV3    (V3Layout)
/v3/catalogues              → CataloguesV3       (V3Layout)
/v3/businesses              → BusinessesV3       (V3Layout)
/v3/architects              → ArchitectsV3       (V3Layout)
/v3/architects/:slug        → ArchitectDetailV3  (V3Layout)
/v3/shops                   → ShopsV3            (V3Layout)
/b/v3/:slug                 → BusinessDetailV3   (V3Layout)
/v3/blog                    → BlogV3             (V3Layout)
/v3/recently-viewed         → RecentlyViewedV3   (V3Layout)
/v3/help                    → HelpSupportV3      (V3Layout)
/about-v3                   → AboutV3            (V3Layout)
/v3/plans                   → PlansCheckoutV3    (V3Layout hideSidebar)
/v3/legal/terms             → LegalV3            (V3Layout)
/v3/legal/privacy           → LegalV3            (V3Layout)
/v3/legal/refund            → LegalV3            (V3Layout)
/v3/legal/disclaimer        → LegalV3            (V3Layout)
/v3/contact                 → ContactV3          (V3CleanLayout)
/v3/auth                    → AuthV3             (V3CleanLayout)
/v3/dashboard/buyer         → DashboardBuyerV3   (self-contained — NO layout wrapper)
/v3/dashboard/seller        → DashboardSellerV3  (self-contained — NO layout wrapper)
```

`BLOG_DETAIL_V3` (`/v3/blog/:slug`) is in PAGES but has no route entry yet.

---

## 2. V3 Layouts

### `V3Layout` — `src/components/layout/V3/`

The standard wrapper for all browsing pages.

```ts
interface Props {
  children: ReactNode;
  hideSidebar?: boolean; // default false
}
```

- Renders `V3Navbar` (topbar + collapsible left sidebar) + `<main>`.
- On desktop (≥1024px): sidebar collapses inline, `<main>` shifts via `padding-left`.
- On mobile: sidebar is a full-height overlay drawer; auto-closes on route change.
- `hideSidebar={true}`: completely suppresses the sidebar and its toggle. Use this on any page that ships its own sidebar (currently only `PlansCheckoutV3`).
- Sidebar open/collapse state lives in `V3Layout`, **not** in `V3Navbar`.

### `V3CleanLayout` — `src/components/layout/V3Clean/`

Minimal wrapper for focused pages (auth, contact). No navbar, no sidebar.

```ts
interface Props { children: ReactNode; }
```

- Renders a fixed **Back** button at top-right.
- Clicking Back calls `navigate(-1)`; falls back to `PAGES.HOME_V3` if no history.
- Use this for any page that should feel like a modal/flow (future: onboarding, checkout confirmation).

### Self-contained dashboards

`DashboardBuyerV3` and `DashboardSellerV3` are **not** wrapped in any layout. They own their entire chrome (topbar + sidebar) internally via `dashboardBuyerV3/DashTopbar` and `dashboardBuyerV3/DashSidebar`.

---

## 3. V3Navbar

**Files:** `src/components/layout/V3/V3Navbar/index.tsx` + `useV3Navbar.ts`

Content comes entirely from `src/content/v3-nav.content.ts` (`V3_NAV_CONTENT`).

### Active sidebar highlight

Computed in `useV3Navbar` — exact path match first, then longest prefix match. **Never** compare with `pathname.startsWith("/")` (that always matches).

### City links

City chips in the sidebar navigate to `PAGES.HOME_V3 + ?city=<slug>`. The Home page reads `?city` to filter.

### Saved picker modal

The "Saved" nav link does **not** navigate. It opens a local picker modal that asks Buyer/Seller, then navigates to `PAGES.DASHBOARD_BUYER_V3?tab=saved` or `PAGES.DASHBOARD_SELLER_V3?tab=saved`. This modal can be removed at any time — it is temporary scaffolding until a unified saved page is built.

### Voice search

`useV3Navbar` contains a full Web Speech API state machine:
`VoiceState = "idle" | "listening" | "heard" | "success" | "error"`
Degrades gracefully when the browser doesn't support Web Speech API (`voiceSupported = false`).

---

## 4. Content Files

Every v3 page gets its data from a static TypeScript content file in `src/content/`. **No API calls live in content files.** The API-swap pattern is:

```ts
// In the page hook's useEffect:
setContent(PRODUCTS_CONTENT); // ← future: const res = await MarketService.list(); setContent(res.data);
```

### Content file naming

| Page | Content file | Main export |
|---|---|---|
| Home | `home.content.ts` | `HOME_CONTENT` |
| Nav/sidebar | `v3-nav.content.ts` | `V3_NAV_CONTENT` |
| Trending | `trending.content.ts` | `TRENDING_CONTENT` |
| Explore | `explore.content.ts` | `EXPLORE_CONTENT` |
| Products | `products.content.ts` | `PRODUCTS_CONTENT` |
| Product detail | `product-detail.content.ts` | `PRODUCT_DETAIL_CONTENT` |
| Services | `services.content.ts` | `SERVICES_CONTENT` |
| Service detail | `service-detail.content.ts` | `SERVICE_DETAIL_CONTENT` |
| Catalogues | `catalogues.content.ts` | `CATALOGUES_CONTENT` |
| Businesses | `businesses.content.ts` | `BUSINESSES_CONTENT` |
| Business detail | `business-detail.content.ts` | `BUSINESS_DETAIL_CONTENT` |
| Architects | `architects.content.ts` | `ARCHITECTS_CONTENT` |
| Architect detail | `architect-detail.content.ts` | `ARCHITECT_DETAIL_CONTENT` |
| Shops | `shops.content.ts` | `SHOPS_CONTENT` |
| Blog | `blog.content.ts` | `BLOG_CONTENT` |
| Recently viewed | `recently-viewed.content.ts` | `RECENTLY_VIEWED_CONTENT` |
| Help & support | `help-support.content.ts` | `HELP_CONTENT` |
| Plans/checkout | `plans-checkout.content.ts` | `PLANS_CHECKOUT_CONTENT` |
| Auth | `auth.content.ts` | `AUTH_CONTENT` |
| About | `about.content.ts` | `ABOUT_CONTENT` |
| Buyer dashboard | `dashboard-buyer.content.ts` | `DASHBOARD_BUYER_CONTENT` |
| Seller dashboard chrome | `dashboard-seller.content.ts` | `DASHBOARD_SELLER_CHROME` |
| Seller views | `dashboard-seller-*.content.ts` (one per view) | individual exports |

### Shared action type — `HomeCtaAction`

Defined in `home.content.ts`. Used in **every** content file for CTA destinations:

```ts
type HomeCtaAction =
  | { kind: "route"; to: keyof typeof PAGES }
  | { kind: "dialog" }   // → navigates to PAGES.CONTACT_V3
  | { kind: "auth" }     // → navigates to PAGES.AUTH_V3
```

Never hardcode a URL in content — always use `HomeCtaAction`.

---

## 5. `useHomeCta` — the v3 navigation hook

**File:** `src/components/Home/v3/shared/useHomeCta.ts`

Every v3 component that has a CTA resolves navigation through this hook:

```ts
const handleCta = useHomeCta();
// ...
<button onClick={() => handleCta(card.action)}>...</button>
```

It handles all three `HomeCtaAction` kinds: `route` → `navigate(PAGES[to])`, `dialog` → `PAGES.CONTACT_V3`, `auth` → `PAGES.AUTH_V3`. Import it wherever a button or card needs to navigate.

---

## 6. URL State — `useSearchParams` Patterns

V3 uses `useSearchParams` for any state that should survive a page reload or be shareable via URL. All updates use `replace: true` to avoid polluting browser history.

| Param | Where | Values | Notes |
|---|---|---|---|
| `?page=` | Products, Services, Catalogues, Architects page hooks | Integer ≥1 (absent = page 1) | Updated by `setCurrentPage`; drives `buildPageWindow()` |
| `?tab=` | `useDashboardBuyerV3`, `useDashboardSellerV3` | Buyer: `connections \| saved \| activity \| profile \| membership`; Seller: 14 `SellerSection` values | `{ replace: true }` replaces ALL params on dashboard URLs |
| `?filter=` | `useCategoryFilterBar` (Home category chips) | Pill id string; absent = `"all"` | Set by category pill bar on `/home-v3` |
| `?city=` | V3Navbar city links | URL slug e.g. `"new-delhi"` | Appended to `PAGES.HOME_V3` by city chip clicks |

**Rule:** Never use `useState` for page-level state that should survive reload. Use `useSearchParams` in the page hook, not in the component.

---

## 7. Pagination System

**Utility:** `src/utils/paginationWindow.ts`

```ts
buildPageWindow(current: number, total: number): string[]
// buildPageWindow(5, 24) → ["1","…","3","4","5","6","7","…","24"]
// buildPageWindow(1, 5)  → ["1","2","3","4","5"]  (≤7 total: no ellipsis)
```

Always shows page 1, page N (last), and ±2 around current. Inserts `"…"` between gaps.

### Wiring pattern (all 4 listing pages follow this):

1. **Page hook** (`useProductsV3`, `useServicesV3`, `useCataloguesV3`, `useArchitectsV3`): reads `?page=` via `useSearchParams`, exposes `currentPage: number` and `setCurrentPage: (p: number) => void`.
2. **Grid component** (`ProductGrid`, `ServiceGrid`, `CatalogueGrid`, `architectsV3/Pagination`): receives `currentPage`, `totalPages`, `onPageChange`. Calls `buildPageWindow(currentPage, totalPages)` to get the visible window. `"…"` buttons are `disabled`. Prev/Next are `disabled` at boundaries.
3. `totalPages` is derived from the last numeric entry in the static `pagination.pages` array in the content file (`pages.filter(p => p !== "…").at(-1)`), or hardcoded in the hook when not in content (Services: `18`).

---

## 8. Video Reels System

**Components:** `src/components/trendingV3/StudioReels/` + `src/components/trendingV3/ReelModal/`

Used on both the Trending page ("Video Tours / Hot studio reels") and the Home page (replaces the old `ReelRow`).

### Content shape

```ts
// from trending.content.ts (re-exported by home.content.ts)
interface ReelItem {
  id: string;
  title: string;
  studio: string;
  bg: string;           // CSS gradient for placeholder
  icon: string;         // Tabler icon name
  views: string;
  url?: string;         // YouTube URL, Instagram URL, or direct video file URL
  platform?: "youtube" | "instagram" | "video";
}
```

### ReelModal embed strategy

The modal detects `platform` and renders accordingly:
- `youtube`: extracts video ID from the URL, renders `<iframe>` with `youtube-nocookie.com/embed/<id>`
- `instagram`: extracts shortcode, renders Instagram embed `<iframe>`
- `video`: renders `<video src={url} controls>`
- No URL / no platform: renders a gradient placeholder card

### Adding to a page

Import `StudioReels` and pass a `ReelsSection` data object:
```tsx
import StudioReels from "../../../components/trendingV3/StudioReels";
<StudioReels data={c.studioReels} />
```

---

## 9. Filter Sidebar Scroll Pattern

Product, Service, and Catalogue pages have a right/left filter sidebar that must scroll independently of the main content. The pattern:

```css
.sidebar {
  position: sticky;
  top: 60px;                    /* height of the V3 topbar */
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 24px;
  scrollbar-width: thin;
}
```

The `60px` is the V3Navbar topbar height. If the topbar height ever changes, update this value in all three sidebar CSS files:
- `components/productsV3/ProductSidebar/ProductSidebar.module.css`
- `components/servicesV3/ServicesSidebar/ServicesSidebar.module.css`
- `components/cataloguesV3/CatalogueSidebar/CatalogueSidebar.module.css`

---

## 10. Dashboard Architecture

### Buyer dashboard — `src/pages/DashboardBuyer/v3/`

**Views** (`DashboardView` type):
`connections | saved | activity | profile | membership`

- Active view driven by `?tab=` param in `useDashboardBuyerV3`.
- Default: `connections`.
- `DashTopbar` receives `onGoView: (view: DashboardView) => void` — used by the profile dropdown and notification panel to jump views.

### Seller dashboard — `src/pages/DashboardSeller/v3/`

**Sections** (`SellerSection` type — 14 values):
`overview | connections | pipeline | quotations | reviews | business | shop | architecture | saved | activity | profile | membership | settings | security`

- Active section driven by `?tab=` param in `useDashboardSellerV3`.
- Default: `overview`.
- `DashTopbar` receives `goSection: (section: SellerSection) => void` and `runCta: () => void`.
- Every view component receives `{ goSection, runCta }` as `SellerViewProps`.

### Shared chrome pattern

Both dashboards render their own full chrome — never use `V3Layout` for these routes. The page (`index.tsx`) assembles `DashTopbar` + `DashSidebar` + the active view component in a flex layout.

---

## 11. Component Folder Naming Convention

V3-specific components follow a consistent naming scheme:

| Domain | Component folder |
|---|---|
| Home sections | `src/components/Home/v3/<ComponentName>/` |
| Products page | `src/components/productsV3/<ComponentName>/` |
| Services page | `src/components/servicesV3/<ComponentName>/` |
| Catalogues page | `src/components/cataloguesV3/<ComponentName>/` |
| Architects page | `src/components/architectsV3/<ComponentName>/` |
| Shops page | `src/components/shopsV3/<ComponentName>/` |
| Businesses page | `src/components/businessesV3/<ComponentName>/` |
| Trending page | `src/components/trendingV3/<ComponentName>/` |
| Explore page | `src/components/exploreV3/<ComponentName>/` |
| Blog page | `src/components/blogV3/<ComponentName>/` |
| Auth page | `src/components/authV3/<ComponentName>/` |
| Help page | `src/components/helpV3/<ComponentName>/` |
| Plans/checkout | `src/components/plansV3/<ComponentName>/` |
| About page | `src/components/about/v3/<ComponentName>/` |
| Business detail | `src/components/businessDetail/v3/<ComponentName>/` |
| Product detail | `src/components/productDetailV3/<ComponentName>/` |
| Service detail | `src/components/serviceDetailV3/<ComponentName>/` |
| Architect detail | `src/components/architectDetailV3/<ComponentName>/` |
| Buyer dashboard | `src/components/dashboardBuyerV3/<ComponentName>/` |
| Seller dashboard | `src/components/dashboardSellerV3/<ComponentName>/` |

New page-specific v3 components go into the domain folder, not into `components/shared/`. Only utilities that are genuinely cross-domain belong in `shared/` or `utils/`.

---

## 12. Key Patterns Quick Reference

### Adding a new v3 page

1. Create `src/pages/<Name>/v3/index.tsx`, `use<Name>V3.ts`, `<Name>V3.module.css`.
2. Create `src/content/<name>.content.ts` with static data + exported types.
3. Add `PAGES.<NAME>_V3: "/v3/<path>"` to `src/utils/constants/app.ts`.
4. Add the route to `src/routes/v3Routes.tsx` using the right layout:
   - Normal page → `<V3Layout>`
   - Page with own sidebar → `<V3Layout hideSidebar>`
   - Auth/contact-style focused flow → `<V3CleanLayout>`
   - Full-chrome dashboard → no wrapper

### Adding a new listing page feature (filter/sort/pagination)

- Store all URL-persistent state in `useSearchParams` inside the page hook (`replace: true`).
- Keep component files presentational — they receive state + setters as props.
- For pagination: add `currentPage`/`setCurrentPage` to the hook, pass `currentPage` + `totalPages` + `onPageChange` to the grid component, use `buildPageWindow` for the visible window.

### Navigating from any v3 component

```ts
const handleCta = useHomeCta();
handleCta({ kind: "route", to: "PRODUCTS_V3" });   // goes to /v3/products
handleCta({ kind: "dialog" });                      // goes to /v3/contact
handleCta({ kind: "auth" });                        // goes to /v3/auth
```

Never call `useNavigate` directly in v3 components for CTA actions. Use `useHomeCta`.

### SEO on every v3 page

```tsx
import { PublicPage } from "../../../components/shared/Seo";
// First child of the page:
<PublicPage title={c.seo.title} description={c.seo.description} canonicalUrl={c.seo.canonicalUrl} />
```
