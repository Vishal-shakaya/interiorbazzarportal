# Prototype Parity — Page-by-Page Exact-Match Tracker

Goal: make every page of the **portal** (React/Vite/Tailwind v4) a **pixel-exact, behavior-exact** match
of the static **prototype** `ib_prototype_7.2.1`, evaluated across **8 dimensions** per page.

- **Prototype:** `D:\Programming\InteriorBazzar\Prototype\ib_prototype_7.2.1\pages\*.html`
  (design source of truth: `assets/theme.css`; demo data + stores: `assets/ib-*.js`)
- **Portal:** `D:\Programming\InteriorBazzar\portal\src\pages\*` (dev server `npm run dev`, currently `:5175`)
- **Admin:** `D:\Programming\InteriorBazzar\admin` — **later phase** (see §Admin). Keep in mind: the portal's
  localStorage backend (§Workstream B) must use the **same store keys** the admin will read/write.

---

## The 8 review dimensions (assessed per page)

1. **Layout** — container width (`max-w-shell`=1600px / narrow columns), grid column counts, section order,
   sticky/scroll behavior, responsive breakpoints (1600 / 1280 / 768 / 390).
2. **Theme** — tokens match `theme.css`: colors, radii (`rounded-card` 14 / `rounded-field` 10), soft shadows,
   fonts (DM Sans body; **Georgia** editorial serif via `font-editorial`/`.sec-title`).
3. **Images** — real Unsplash photos (the prototype's exact IDs) with gradient (`g1..g12`) + icon as the
   `onerror` fallback. Brand/icon assets present. *(See §Image map.)*
4. **Written content** — exact copy, headings, numbers, labels, eyebrows, CTA text — verbatim from prototype.
5. **Components** — shared widgets match prototype anatomy (cards `.card`/`.pcard`/`.shop-card`/`.cat-card`,
   `.sec-eye`/`.sec-title`, hero, shorts, chips, badges, tabs, gallery, reviews, filter panel, dashboard parts).
6. **Styling** — spacing/padding, hover/active/focus states, borders, dividers, transitions, fine CSS details.
7. **Connection & integration flow** — interactive behavior: nav/links, search, filters, the connect/enquiry
   modal, auth, save/bookmark, forms, multi-step flows, dashboard actions — wired to real (localStorage) state.
8. **Backend on localStorage** *(workstream, not per-page)* — persist all data/state in `localStorage` mirroring
   the prototype's stores so reloads keep state and the future admin portal shares the same data. See §Workstream B.

Status legend: ✅ matches · 🔶 needs work · ⬜ not started · ➖ n/a · ✔️ signed off

---

## How we work each page (the loop)

1. Open both at the same viewport — prototype `file:///D:/.../pages/<X>.html`, portal `http://localhost:5175/<route>`.
2. Screenshot both at **1600** and **1280** (and **390** mobile) with headless Edge:
   ```powershell
   $edge="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
   & $edge --headless=new --disable-gpu --hide-scrollbars --window-size=1600,2600 `
     --virtual-time-budget=12000 --screenshot="OUT.png" "URL"
   ```
3. Score the page on the 8 dimensions; fix gaps in the page's own folder (reuse shared components).
4. Re-screenshot, confirm, `npm run build` (must stay green — `tsc -b` is the gate; eslint not installed).
5. Update the page's row + notes below. **Definition of done:** all 8 dimensions ✅ at 1600 & 1280.

---

## Design-system reference (ported — use, don't redefine)

- **Container:** `mx-auto max-w-shell px-4 md:px-7` (`max-w-shell`=1600px). Narrow pages use a tighter column.
- **Tokens:** `bg-bone` #f7f6f2 · `bg-bone-card` #fffdf8 · `text-ink` #1a1a17 · `text-muted` #777 ·
  `border-line` #e8e6df · `border-line-strong` #d8d5cb · `text/bg-forest` #085041 · `bg-forest-deep` #04342c ·
  `text-accent` #1d9e75 · `text/bg-green-mint` #9fe1cb · `bg-green-light` #e1f5ee · `text/bg-amber` #ba7517 ·
  `bg-amber-light` · `bg-chip`/`bg-chip-hover` · `text/bg-success`(-light) · `text/bg-danger`(-light) ·
  `rounded-card` 14 · `rounded-field` 10 · `shadow-card`. Trending red accent: `#d44323` (no token — arbitrary).
- **Type:** body DM Sans; editorial serif = **Georgia** via `font-editorial` / `.sec-title`.
- **Shared components** (`@/components/shared`): SectionHeader, HeroCarousel, ShortsRow, CardGrid
  (`variant:"feed"|"fill"`), ListingCard, PanelCard, Testimonials, FilterChips, BannerSlot, Pagination,
  Breadcrumb, Gallery, Reviews, Tabs, PublicPage. Dashboard: `@/components/dashboard/{DashboardShell,parts}`.
- **Icons:** `<Icon name/>` from `@/components/ui` — fixed allow-list in `Icon/index.tsx`.

---

## 🌐 Phase G — Shared shell & foundation (do FIRST — affects every page)

- [x] **Icon registry** — added `kitchen, bath, bed, bulb, rupee, plant, stairs, door, briefcase, arrow-up,
      arrow-down`. TODO: update Explore/Trending/Detail to use them.
- [ ] **Topbar** *(user is editing — now CMS-brand via `useCmsBrand`)* — match `assets/topbar.js`: search width
      (560/720), mic, "List your business" pill, signed-out `Sign in` + **`Get started`** button, profile dropdown.
- [ ] **Sidebar** — add the green **`.sb-promo`** "Be where buyers look / View plans" card; `Saved`, `24/7 chat`,
      `Feedback` items; city **IN** flag badges; Seed/Reset dev buttons; footer legal line.
- [ ] **Footer** *(user is editing)* — width/columns/legal match.

---

## 🗄️ Workstream B — Backend on localStorage (underpins dimension 7)

The prototype persists everything in `localStorage` (e.g. `ib_house_banners_live`, auth state, saved, recently
viewed, entitlements via `assets/ib-store.js`, `auth-state.js`, `ib-entitlements.js`, `ib-rv.js`). The portal
currently uses an **in-memory mock** (`src/api/mock/db.ts`). Replace it with a **localStorage-backed store** so:
state survives reloads, flows are real, and the future admin writes to the same keys.

- [ ] **Define store keys** (reuse prototype names where sensible): `ib_house_banners_live` (hero/banners),
      `ib_auth` (session/persona), `ib_saved` (bookmarks), `ib_recently_viewed`, `ib_entitlements` (plan),
      `ib_enquiries` (connect/quote submissions), `ib_store` (catalog seed cache).
- [ ] **Persistence layer** — a small `src/api/mock/persist.ts` that hydrates `db` from localStorage on boot and
      writes through on mutations (seed from `content/*.ts` on first run). Keep the `ApiResponseType` contract so
      pages/services are unchanged.
- [ ] **Wire mutations**: auth login/persona, save/unsave, recently-viewed push, connect/enquiry submit,
      quotation save, plan upgrade → all persist. Redux slices (`authSlice`, `savedSlice`) rehydrate from storage.
- [ ] **Connect/Enquiry overlay** — ensure the shared connect modal writes an enquiry record (so buyer/seller
      dashboards show it). This makes the "Connection & integration flow" dimension real end-to-end.
- [ ] **Admin handshake (later)** — document the keys so `admin` can read/write the same data.

---

## 🖼️ Image map (dimension 3) — prototype Unsplash IDs by category

Apply in `src/content/marketplace.content.ts` `build()` (assign `item.image` by `cat`); gradient `bg` stays as the
`onerror` fallback (ListingCard already renders `image` over `bg`). Params: `?w=400&h=260&fit=crop&q=75` (cards),
larger for heroes/detail. IDs harvested from `home.html`:

| Category | Unsplash photo IDs |
|---|---|
| interior / turnkey | 1493809842364-78817add7ffb · 1586023492125-27b2c045efd7 · 1618220179428-22790b461013 |
| modular kitchen | 1556909212-d5b604d0c90d · 1604709177225-055f99402ea3 |
| tiles & marble | 1597072689227-8882273e8f6a · 1581094794329-c8112a89af12 |
| lighting | 1513506003901-1e6a229e2d15 · 1543198126-a8ad8e47fb22 |
| furniture | 1581858726788-75bc0f6a952d · 1631679706909-1844bbd07221 · 1567538096630-e0c55bd6374c · 1506377247377-2a5b3b417ebb |
| sanitary ware | 1620626011761-996317b8d101 · 1552321554-5fefe8c9ef14 |
| architecture | 1503387762-592deb58ef4e · 1486406146926-c627a92ad1ab · 1497366216548-37526070297c |
| catalogue/general | 1506439773649-6e0eb8cfb237 · 1562259949-e8e7689d7828 · 1589939705384-5185137a7f0f · 1487958449943-2429e8be8625 |

---

## 📄 Per-page parity matrix

Columns = the 8 dimensions: **L**ayout · **T**heme · **I**mages · **W**ritten · **C**omponents · **S**tyling · **F**low. (Backend tracked in §Workstream B.)

### Discovery
| # | Page | Route | Prototype | L | T | I | W | C | S | F |
|---|------|-------|-----------|---|---|---|---|---|---|---|
| 1 | Home | `/` | `home.html` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔶 |
| 2 | Explore | `/explore` | `explore.html` | ✅ | ✅ | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |
| 3 | Trending | `/trending` | `trending.html` | ✅ | 🔶 | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |
| 4 | Recently viewed | `/recently-viewed` | `recently-viewed.html` | 🔶 | ✅ | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |

- **Home** — I: add real photos to feed (Image map). C: reels width 248 + "Play all" control. W: add "For you"
  subtitle "Based on your location and recent activity". S: feed gaps 16/12, hero floating-card position. F: wire
  reel play, card→detail, save, connect.
- **Explore** — I/C: room-tile icons (use new `kitchen`/`bath`/`bed`/`bulb` icons). S: tile gradients/sizes.
- **Trending** — T/S: red `#d44323` accent consistency; leaderboard deltas use `arrow-up`/`arrow-down`. F: ticker.
- **Recently viewed** — L/C: prototype is a **day-grouped timeline of rows** (`.rv-row`); current = entity-grouped
  `CardGrid`. F: depends on Workstream B (`ib_recently_viewed`).

### Listing
| # | Page | Route | Prototype | L | T | I | W | C | S | F |
|---|------|-------|-----------|---|---|---|---|---|---|---|
| 5 | Products | `/products` | `products.html` | ✅ | ✅ | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |
| 6 | Services | `/services` | `services.html` | ✅ | ✅ | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |
| 7 | Shops | `/shops` | `shops.html` | ✅ | ✅ | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |
| 8 | Businesses | `/businesses` | `businesses.html` | ✅ | ✅ | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |
| 9 | Architects | `/architects` | `architects.html` | ✅ | ✅ | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |
| 10 | Catalogues | `/catalogues` | `catalogues.html` | ✅ | ✅ | 🔶 | ✅ | 🔶 | 🔶 | 🔶 |

- I: real photos (Image map) — biggest win, shared `PanelCard`. C/S: confirm `.pcard` price serif + 2-button row,
  `.shop-card` cover 84px + status dot + distance, `.cat-card` cover 172px + pages badge. F: filters → URL; connect.

### Detail
| # | Page | Route | Prototype | L | T | I | W | C | S | F |
|---|------|-------|-----------|---|---|---|---|---|---|---|
| 11 | Product detail | `/products/:slug` | `product-detail.html` | ✅ | ✅ | 🔶 | 🔶 | ✅ | 🔶 | 🔶 |
| 12 | Service detail | `/services/:slug` | `service-detail.html` | ✅ | ✅ | 🔶 | ✅ | ✅ | 🔶 | 🔶 |
| 13 | Business detail | `/businesses/:slug` | `business-detail.html` | ✅ | ✅ | 🔶 | ✅ | ✅ | 🔶 | 🔶 |
| 14 | Architect detail | `/architects/:slug` | `architect-detail.html` | ✅ | ✅ | ✅ | ✅ | ✅ | 🔶 | 🔶 |

- I: use real photos on all four (ArchitectDetail already does). W: ProductDetail spec table shows static marble
  copy — make item-aware. F: Contact seller/Request sample → connect overlay → `ib_enquiries`.

### Content
| # | Page | Route | Prototype | L | T | I | W | C | S | F |
|---|------|-------|-----------|---|---|---|---|---|---|---|
| 15 | Blog | `/blog` | `blog.html` | ✅ | ✅ | 🔶 | ✅ | ✅ | 🔶 | 🔶 |
| 16 | Blog post | `/blog/:slug` | `blog-post.html` | ✅ | ✅ | 🔶 | ✅ | ✅ | 🔶 | 🔶 |
| 17 | About | `/about` | `about-ib.html` | ✅ | ✅ | ➖ | ✅ | ✅ | 🔶 | 🔶 |
| 18 | Help | `/help` | `help-support.html` | ✅ | ✅ | ➖ | ✅ | ✅ | 🔶 | 🔶 |
| 19 | Legal ×5 | `/legal/{terms,privacy,refund,disclaimer,cookies}` | `*.html` | ✅ | ✅ | ➖ | 🔶 | 🔶 | 🔶 | ➖ |
| 20 | Contact | `/contact` | *(none — `ib-contact-cta.js`)* | ✅ | ✅ | ➖ | ➖ | ✅ | 🔶 | 🔶 |

- Blog/BlogPost — I: add `cover.src` to blog content for real photos (currently category gradients).
  Legal — W/C: `LegalSection` is `{h,p}`; prototype has sub-heads + lists → richer section type. About headline
  dup already fixed. Contact has no prototype ref → sign off "on-brand" not "exact".

### Flows
| # | Page | Route | Prototype | L | T | I | W | C | S | F |
|---|------|-------|-----------|---|---|---|---|---|---|---|
| 21 | Auth | `/auth` | `auth.html` | ✅ | ✅ | ➖ | ✅ | ✅ | 🔶 | 🔶 |
| 22 | Plans / checkout | `/plans` | `plans-checkout.html` | ✅ | ✅ | ➖ | ✅ | 🔶 | 🔶 | 🔶 |
| 23 | New quotation | `/dashboard/seller/new-quotation` | `new-quotation.html` | ✅ | ✅ | ➖ | ✅ | ✅ | 🔶 | 🔶 |
| 24 | Ad enquiry flow | `/dashboard/seller/ad-enquiry-flow` | `ad-enquiry-flow.html` | ✅ | 🔶 | ➖ | ✅ | ✅ | 🔶 | 🔶 |

- Auth — F: persona/login → `ib_auth` (Workstream B); prototype phone-OTP/forgot/social screens optional.
  Plans — C: add compare table + add-ons + testimonials; F: upgrade → `ib_entitlements`. Quotation — F: save → storage.

### Dashboards (auth-gated — log in via demo persona)
| # | Page | Route | Prototype | L | T | I | W | C | S | F |
|---|------|-------|-----------|---|---|---|---|---|---|---|
| 25 | Buyer dashboard | `/dashboard/buyer` | `dashboard-buyer.html` | 🔶 | ✅ | ➖ | ✅ | 🔶 | 🔶 | 🔶 |
| 26 | Seller dashboard | `/dashboard/seller` | `dashboard-seller.html` | 🔶 | ✅ | ➖ | ✅ | 🔶 | 🔶 | 🔶 |

- Buyer — C/L: Connections is a 3-column chat workspace in the prototype (current = list + status pills).
  F: enquiries/saved/recently-viewed read from Workstream B. Seller — verify pipeline kanban + funnels; F: leads.

---

## 🛠️ Admin portal — LATER (separate app)

`D:\Programming\InteriorBazzar\admin` ← `dashboard-admin.html`, `admin-login.html`. Out of scope until the portal
pass is done, BUT Workstream B must use store keys the admin can read/write (esp. `ib_house_banners_live` for the
hero House-Banners, listings moderation, testimonials). Track here when we start: Layout/Theme/Images/Content/
Components/Styling/Flow + shared-store integration.

---

## Proposed order

1. **Phase G** (shell — icons ✅; sidebar promo / topbar / footer with the user).
2. **Workstream B** (localStorage backend) — unblocks dimension 7 everywhere; do early.
3. Pages: **Home** → **Listing 5–10** → **Detail 11–14** → **Explore/Trending 2,3** → **Content 15–20** →
   **Flows 21–24** → **Dashboards 25,26** → **Recently viewed 4**.
4. **Admin** app.

Each page: diff on the 8 dimensions → fix → re-shoot → tick → build. Keep this file updated as we go.
