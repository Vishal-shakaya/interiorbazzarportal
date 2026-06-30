# PAGE: Recently viewed

```
PROTOTYPE: pages/recently-viewed.html   ROUTE: PAGES.RECENTLY_VIEWED ("/recently-viewed")   LAYOUT: Browsing (topbar + sidebar)
```

A re-engagement page: the buyer's own browsing history as a clearable, filterable timeline. Everything
in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Let a returning buyer **pick up where they left off** — replay everything they viewed in the last week
(businesses, products, services, architects, shops) as a time-grouped list and route straight back into
a detail page.

## 2. Journey
- **Actor:** Buyer (primary).
- **Stage:** Discover (re-engagement / return visit).
- **Precedes:** any detail page (a history row links back to the thing the buyer was looking at).
- **Leads to:** Product/Service/Business/Architect/Shop detail; "Continue" jumps to the last-opened item.

## 3. Auth
**Public.** No login to view your own history. History is a local read (see §6). The login gate only
fires later if the buyer hits a Connect/enquire action from the detail page a row leads to — never on
this page. The shared auth modal (`#authModal`) is present for that downstream action.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="recent"`, 60px) + collapsible left
sidebar (`#sidebar`, 240/72px) + `<main class="main" id="main">` (`.main-inner`). Sidebar visible.

## 5. Sections (top → bottom — exact prototype order)
Quote the eyebrow/title **verbatim**:

| # | Section | Component | Copy (verbatim) | Content |
|---|---------|-----------|-----------------|---------|
| 1 | Filter pills (`.cat-bar`) | `RVFilterBar` | "All" · "Businesses" · "Products" · "Services" · "Architects" · "Shops" | Six `.pill` buttons (`data-rv-pill`), each with a live `.rv-pill-cnt` count; "All" is `.on` by default. `rvFilter(type)` re-renders. |
| 2 | Section header (`.sec-head`) | `RVHeader` | `.sec-eye` "last 7 days" → `.sec-title` "Pick up where you *left off*" | `.sec-sub` "Everything you've viewed in the last week — businesses, products, services. Search through, save, or clear with one click." + right-side actions: "Export" + "Clear history" (`data-rv-clear`, red). |
| 3 | KPI strip | `RVStats` | "Items viewed" · "Businesses" · "Products" · "Services" | 4-up stat cards (`#rv-kpi-total`, `#rv-kpi-biz`, `#rv-kpi-prod`, `#rv-kpi-svc`), serif numbers, computed from the history list. |
| 4 | Continue band | `RVContinue` | eyebrow "last opened · 12 minutes ago"; "*Casa & Bloom* — Walnut + brass modular kitchen"; "You spent 4 minutes looking at this profile. They responded to your earlier enquiry — pick up the conversation?" + CTA "Continue" | Amber gradient resume card pointing at the most-recent item. |
| 5 | Timeline (`#rvTimeline`) | `RVTimeline` | day heads (`.rv-day-h`, e.g. "*Today*") + `.rv-day-count` ("N items") | History grouped by day; each day renders `.rv-row` entries (see below). Rendered by `renderAll()`. |

**`.rv-row` anatomy (one history entry):** `.rv-time` (e.g. timestamp, DM Mono) · `.rv-thumb` with a
`.rv-type` badge (business/product/service/architect/shop) · `.rv-cat` (category) + `.rv-title` (name) +
`.rv-meta` (`.by` seller, `.stars` rating, projects/orders count) · `.rv-price` (+ `.rv-price small`
label) · `.rv-actions` = save (heart, `aria-label="Save"`) + remove (`.rv-remove`, `rvRemove(id)`). The
whole row is an `<a href>` to the item's detail page.

> No final CTA band / footer is Recently-viewed-specific; shared layout components follow the timeline.

## 6. Data
**Local-first, read-mostly.** History is owned by the recently-viewed store (`IBRV` in the prototype, via
`ib-rv.js`). In React this is a **service → DataSource** read — **never** raw `localStorage` (see
[../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Action | Service (local-first) | Spine/source |
|--------|-----------------------|--------------|
| List history | `RecentlyViewedService.list()` | recently-viewed history (`IBRV.list()`) |
| Day grouping / time labels | `RecentlyViewedService.dayGroup(iso)` / `.timeLabel(iso)` | `IBRV.dayGroup` / `IBRV.timeLabel` |
| Remove one | `RecentlyViewedService.remove(id)` | `IBRV.remove(id)` |
| Clear all | `RecentlyViewedService.clear()` | `IBRV.clear()` |
| KPI / pill counts | derived in `useRecentlyViewed.ts` from the list | — |

**URL state:** active filter is the prototype's in-memory `activeFilter`; in React mirror it to
`?filter=<all|business|product|service|architect|shop>` via `useSearchParams` (not `useState`).

## 7. Primary CTA
**"Continue"** — the resume band jumps the buyer to their last-opened item (the page's single most
important action: get them back into the journey).

Secondary CTAs:
- Row → detail navigation (whole `.rv-row` is the link).
- Save (heart) on a row → writes to saved.
- Remove (`.rv-remove`) → `RecentlyViewedService.remove(id)`, re-render.
- "Clear history" → confirm, then `RecentlyViewedService.clear()`. Prototype confirm copy: "Clear your
  entire viewing history? This cannot be undone."
- "Export" → export the history list.
- Filter pills → narrow the timeline by type.

Empty-state CTA: **"Start exploring"** → Home. Use exact strings from [../copywriting.md](../copywriting.md).

## 8. States
- **Loading:** skeleton rows in `#rvTimeline` + zeroed KPI/pill counts (standard skeleton, not a spinner).
- **Empty:** the timeline shows the prototype empty card verbatim — "*Nothing viewed yet*" /
  "Start exploring to build your history" / **"Start exploring"** → `home.html`. Never a dead end (matches
  doc 03 "name the emptiness, then offer the next step").
- **Filtered-empty:** same empty card when a filter has no items.
- **Error:** history read failure degrades to the empty card + a quiet retry; KPIs show 0.
- **Success:** removing/clearing re-renders immediately; the resume band hides when there is no history.

## 9. Responsive
- Desktop: KPI strip 4-up; `.rv-row` is a `grid-template-columns:auto 80px 1fr auto auto`.
- ≤720px: sidebar → drawer; KPI strip and row grid reflow (price/actions wrap under the title); pills
  scroll horizontally.
- Touch targets ≥ 38px; `.rv-act` buttons (34px) acceptable as secondary actions.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; the timeline is a labelled region named
  by the `.sec-title`.
- Headings: **one H1** = "Pick up where you left off" (`.sec-title`); day heads (`.rv-day-h`) are H2s/sub
  headings — no skipped levels.
- Filter pills are real `<button>`s with `aria-pressed` reflecting `.on`; pill counts read as part of the
  accessible name.
- Each row is a single link with an accessible name (item title + type); save = `aria-label="Save"` +
  `aria-pressed`; remove = `aria-label="Remove from history"`; thumbnail `alt` describes the item.
- "Clear history" confirmation announced; destructive action distinguished by text + icon, not colour alone.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Eyebrow/title/sub: **verbatim** from §5 (serif title, `<em>` keyword in green).
- Brand name lowercase-b "Interior bazzar"; British "enquiry"; CTAs Title Case, no caps/"!".
- Empty state, "Continue", "Clear history", "Export", "Start exploring" — all from
  [../copywriting.md](../copywriting.md) (cf. buyer-dashboard "Recently viewed" / "Start browsing").

## 12. SEO
`PublicPage` with: title "Recently viewed — Interior bazzar" (verbatim from prototype `<title>`), a
one-line description ("pick up where you left off — everything you viewed this week"), canonical
"/recently-viewed". (Final strings confirmed against prototype before build.)

---

### Build notes (React)
- Page shell: `src/pages/RecentlyViewed/index.tsx` + `useRecentlyViewed.ts` + `RecentlyViewed.module.css`;
  composes the 5 sections; KPI + pill counts derived from one `RecentlyViewedService.list()` call.
- History flows from the recently-viewed store through `RecentlyViewedService` (never raw `localStorage`);
  the same calls later hit the API unchanged. Writes (remove/clear/save) go through the service too.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare
  `/recently-viewed` against `file:///…/pages/recently-viewed.html`. Gate with `tsc -b` + `vite build`.
