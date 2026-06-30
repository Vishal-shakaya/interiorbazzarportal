# PAGE: Architects

```
PROTOTYPE: pages/architects.html        ROUTE: PAGES.ARCHITECTS ("/architects")        LAYOUT: Browsing (topbar + sidebar)
```

The architect / interior-designer listing. A buyer browses verified designers, filters by
specialisation or availability, and opens one to evaluate (architect-detail) — and from there to a
Connect enquiry. Everything in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Let a buyer scan and filter Interior bazzar's verified architects and interior designers, and route
into an architect-detail page (and ultimately a Connect enquiry) as fast as possible.

## 2. Journey
- **Actor:** Buyer (primary).
- **Stage:** Discover → Evaluate.
- **Precedes:** `architect-detail.html`; the Connect modal (intent `project`).
- **Leads to:** Architect detail, the Connect modal, Save (saved list), other listing pages via sidebar.

## 3. Auth
**Public.** No login to browse or filter. The login gate fires later, on the **Connect action**
(from a card or the detail page), not on this page — the shared `IBConnect` overlay handles that. The
active filter key (`?filter=<key>`) is readable while anonymous.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, **`data-active="businesses"`** in the prototype, see
build note, 60px) + collapsible left sidebar (`#sidebar`, 240/72px) + `<main class="main" id="main">`
containing a single `.prod-page` wrapper (shell max-width 1600px). Sidebar visible.

## 5. Sections (top → bottom — exact prototype order)
The body mirrors Businesses one-for-one — one `.prod-page` wrapper, **no in-body `.sec-head`
eyebrow/title band**; the page leads with the filter row. Mounts/classes verbatim:

| # | Section | Prototype node | Content (verbatim) |
|---|---------|----------------|--------------------|
| 1 | Filter row | `<div class="filter-row-mount" id="archFilterRow">` | Reusable **IB Filter Row** (`IBFilterRow.mount`, `../assets/ib-filter-row.js`). Single-select specialisation chips; emits `ibfr:select`. Items in §6. |
| 2 | Hero carousel | `<div class="hero-carousel" id="heroCarousel">` → `#heroTrack` + `#heroDots` + `#heroProgress` | Admin-managed slides injected by `../assets/ib-hero.js` (replicated from home/products). |
| 3 | Sponsored ads | `<div class="prod-banner-slot" data-ib-sponsor-slot>` | Sponsor banner inherited from home, served by spot `business`. |
| 4 | Architect grid | `<div class="arch-grid" id="archGrid">` | Full-width card grid painted by `renderProducts()`. Each card = `.arch-card` → `.arch-portrait` (portrait + `.arch-badge` + `.arch-save` bookmark + `.arch-duration`), `.arch-body` (`.arch-avatar` initials, `.arch-name` = `"{name} — {cat}"` e.g. *"Ar. Priya Sharma — Residential · Luxury Homes"*, `.arch-channel` firm + verified tick, `.arch-meta` star rating + `(N reviews)` + location). List view variant = `.arch-row` / `.arch-list` (`window.__viewMode`). |

> Empty-state markup (verbatim) is injected into the grid: **"No architects match this filter"** /
> **"Try a different chip or clear the filter to see all architects."** (`ti-mood-empty` icon).
> The shared Connect overlay (`#connOverlay`) and full-view dialog (`#fvDialog`/`#fvBackdrop`) are
> appended after `</main>` but are overlays, not page sections.

## 6. Data
Read-only listing (plus the shared Connect/auth writes + Save). All via services → DataSource —
**never** raw `localStorage`/`fetch` (see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Concern | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Architect list (`products[]`) | `ArchitectService.list()` | listing content (principal / interior records: `name` e.g. *"Ar. Priya Sharma"*, `firm`, `type`, `cat`, `rat`, `rev`, `stockL:"IB Verified"`, `badge`, `specs.Experience/Speciality/Projects/Location/Credentials`) |
| Availability | `archIsBooked(p)` predicate | booking content (drives the **Available now** chip) |
| Save toggle | `SaveService.toggle(id)` | saved list |
| Connect | `IBConnect.open({ intent:'project' })` | enquiry engine (see [../modules-features-flow.md](../modules-features-flow.md)) |

**Filter groups (verbatim `ARCH_FR_ITEMS`, single-select):** All architects · Principal Architects ·
Interior Designers · Available now · Residential · Commercial · Hospitality · Luxury · Sustainable ·
Heritage · Smart & 3D · Landscape · Institutional · IB Verified · Top rated. Specialisation keys match
via `ARCH_CAT_NEEDLES` (keyword needles over `cat`/`name`/`title`/`Speciality`);
`principal`/`interior` match on `type`; `available` via `!archIsBooked(p)`; `verified` on `stockL`;
`top` on `badge==='top'`.

**Pagination:** the `.pagination` style exists in the sheet but the prototype grid renders the full
filtered list in one pass (`renderProducts`) — **no pager is mounted**. In React, page or
infinite-scroll the `ArchitectService.list()` result and reflect the page in URL state.

**URL state:** `?filter=<key>` reflects the active chip; read via `useSearchParams` in
`useArchitects.ts` (not `useState`), default `all`.

## 7. Primary CTA
**Open the architect** — the whole `.arch-card` is the link: `goToDetail(id)` →
`architect-detail.html?id=` (React: navigate to `PAGES.ARCHITECT_DETAIL`; the prototype also stashes
`sessionStorage 'selectedArchitectId'`). Secondary CTAs:
- Filter chip select (`ibfr:select`) → repaint grid.
- `.arch-save` bookmark (hover-reveal) → Save toggle (`aria-pressed`).
- **"Connect"** (from the detail page) → Connect modal, intent `project`.

Use exact strings from [../copywriting.md](../copywriting.md) — "Connect", British "enquiry",
no bare verb buttons.

## 8. States
- **Loading:** skeleton cards in `#archGrid` (standard skeleton component, not a bare spinner).
- **Empty:** the verbatim empty block above — never a blank grid; offers "clear the filter" as the
  way forward.
- **Error:** `ArchitectService.list()` failure degrades to the empty/retry block; topbar + filter row
  still render.
- **Success:** n/a at page level; Connect/Save successes owned by their overlays.

## 9. Responsive
- Desktop: full-width `.arch-grid` multi-up; shell 1600px; hero `1.5fr / 1fr`.
- ≤720px: sidebar → drawer; search → overlay; grid reflows; filter row scroll-snaps horizontally
  (`overflow-x:auto`, hidden scrollbar).
- Touch targets ≥ 38px; `.arch-save` (28px) acceptable as secondary.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; the listing grid is a labelled
  region.
- Headings: **one H1** for the page; no skipped levels (this listing has no in-body section titles).
- Filter chips: real `<button>`s with `aria-pressed`, single-select; selection announced.
- Cards: whole-card link has an accessible name (architect name + specialisation); `.arch-save`
  `aria-label="Save"` + `aria-pressed`; portrait `alt` describes the designer.
- Connect/full-view open in a modal (`role="dialog"`, focus-trapped, Esc closes).
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5; tokens/voice [../style.md](../style.md).

## 11. Copy
- No in-body eyebrow/title band — copy lives in the cards (architect name, firm + IB Verified tick,
  `(N reviews)`, location) and the filter chip labels (verbatim §6).
- Empty microcopy verbatim from §5. Brand name lowercase-b "Interior bazzar"; British "enquiry";
  CTAs Title Case, no caps/"!".
- All strings confirmed against the prototype and [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` with: title echoing the prototype `<title>` **"Architects — Interior bazzar"** (tuned for
search, e.g. "Verified architects & interior designers — Interior bazzar"), a one-line description on
the value prop (verified designers, qualified enquiries), canonical "/architects". (Final strings
confirmed against prototype `<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/Architects/index.tsx` + `useArchitects.ts` + `Architects.module.css`;
  composes FilterRow → HeroCarousel → SponsorSlot → ArchitectGrid (card + row view via a `viewMode`
  flag) — structurally identical to Businesses; share the grid/card components, differ only in the
  filter item set, service, and detail route.
- Reuse the shared **IB Filter Row** component and the shared **Connect** overlay (`IBConnect`, intent
  `project`) — do not fork them per page.
- Mock/local data flows from `src/content/architects.content.ts` through `ArchitectService` so editing
  content surfaces in the grid; the same call later hits the API unchanged.
- **Prototype quirk:** `architects.html` topbar carries `data-active="businesses"` (copy-paste from
  Businesses). Set the React active key to `architects` for this route — don't replicate the bug.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare
  `/architects` against `file:///…/pages/architects.html`. Gate with `tsc -b` + `vite build`.
