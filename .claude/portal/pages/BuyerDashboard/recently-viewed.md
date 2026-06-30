# TAB: Recently viewed — Buyer Dashboard

```
PARENT: README.md  ·  VIEW id: activity  ·  GROUP: main  ·  PROTOTYPE: pages/dashboard-buyer.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) · modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) · style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) · environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) · integration = [../../../Integration.md](../../../Integration.md) · prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html)

## 1. Page-tab
**Recently viewed** is the buyer's **visit history** — listings, profiles and pages they opened on Interior bazzar in the **last 30 days**, time-bucketed so they can pick up where they left off. It is a low-stakes "where was I" surface that funnels back into Saved and into enquiries.

- **Nav placement:** dashboard left nav `<aside class="dash-nav">`, group **`main`** ("My account"), third item. From `window.dashSections`: `{id:'activity', label:'Recently viewed', icon:'ti-history', group:'main'}` — **label "Recently viewed", icon `ti-history`**. No chip/count badge on the nav item.
- **Default view?** No. The default working view is **My connections** (`dashState.section` default `'saved'` in the prototype seed, with Connections as the documented default working view) — `activity` is reached only when selected.
- **How it's reached:** nav button → `goSection('activity')`; one view renders at a time via `renderContent()` → `case 'activity': return renderActivity();`. React port: **`?tab=activity`** (`setSearchParams({tab:'activity'}, {replace:true})`). No deep-link sub-route — rows resolve to listing routes on click (see §4), not to a sub-param within this tab.
- **Who sees it:** every signed-in buyer. Page-level auth guard only (logged-out → `auth.html`; seller → `dashboard-seller.html`). No per-tab gating.

## 2. Module
**Universal / account** — this is a core buyer-account tab, **not** a subscription module. There is **no plan-gating, no entitlement read, no `IB_SECTION_MODULE` / `ib_sectionAllowed` gate**. Visibility and depth are identical for every buyer; nothing here is locked, capped or upsold. (Entitlement reads, cap toasts and upsell cards are a seller-dashboard concern and do not apply to this tab.)

## 3. Features
Verbatim sub-areas from `renderActivity()`:

- **Header + history stats** — breadcrumb "Dashboard › Recently viewed", H1 "Recently viewed", sub-line item count for the last 30 days + today count.
- **Clear history** — header action (`Clear history`) opening a confirm modal.
- **Search** — "Search recently viewed..." input with a clear button.
- **Filter chips** — All / Products / Services / Businesses / Architects (count-aware).
- **Time-grouped sections** — Today / Yesterday / This week / Earlier, each with a per-group item count.
- **Recently-viewed rows** (`.rv-row`) — thumb, title, type/channel/location/rating meta, "viewed-at" time, and per-row Save + Remove actions.
- **Empty states** — "Nothing here yet" (no history) and "No matches" (filter/search miss).

## 4. Functionality

### Header + history stats
Renders `dm-header`. Breadcrumb: `Dashboard › Recently viewed`. H1 `dm-title` = **"Recently viewed"**. Sub-line `dm-sub` = **"{n} item{s} in the last 30 days"**, appended with **" · {todayCount} from today"** when any item is bucketed `today`. `todayCount` = items whose `viewedAt` resolves to the `today` bucket. **Read:** `RecentlyViewedService.list()` → spine *recently-viewed history*.

### Clear history
Header action button: **`Clear history`** (`ti-trash`), rendered **only when `items.length`**. → `openClearHistoryModal()`:
- If history already empty → toast **"History is already empty"** (`info`), no modal.
- Modal `ib-modal` (icon `warning` `ti-history-toggle`): title **"Clear recently viewed?"**, body **"This removes all {count} items from your recently viewed list."** + microcopy **"Your saved items are not affected — only the visit history. Recommendations may take a few days to retune."**
- Footer: **`Cancel`** / **`Clear history`** (danger). Confirm → `confirmClearHistory()` clears the history list, closes modal, toast **"Recently viewed cleared"** (`success`), re-renders. **Write:** `RecentlyViewedService.clear()` → DataSource (prototype: `window.recentlyViewed = []`). Destructive → confirm-first.

### Search
`.rv-search` input, placeholder **"Search recently viewed..."**, bound to `dashState.rvSearch` via `onRvSearch(value)`. Case-insensitive match against **title OR channel OR location**. A clear button (`ti-x`, tip "Clear search") shows when a query is present → `onRvSearch('')`. After each keystroke the input is re-focused with the caret restored to the end (prototype re-renders the whole view). Read-only filter over the in-memory list — no write.

### Filter chips
`.rv-filters` over `dashState.rvFilter` (default `all`) via `setRvFilter(key)`. Type chips render **only when that type has ≥1 item** (count-aware), each with a `.rv-fchip-count` badge:

| Chip | key | Icon | Always shown? |
|------|-----|------|----------------|
| **All** | `all` | — | yes |
| **Products** | `product` | `ti-box` | only if `counts.product` |
| **Services** | `service` | `ti-tools` | only if `counts.service` |
| **Businesses** | `business` | `ti-building` | only if `counts.business` |
| **Architects** | `architect` | `ti-ruler-2` | only if `counts.architect` |

Counts are computed from the **full** list (not the filtered set). Active chip carries `.on`.

### Time-grouped sections
Filtered items are bucketed by `_rvGroupOf(viewedAt)` into **Today / Yesterday / This week / Earlier** and rendered in that fixed order; empty buckets are skipped. Bucketing rule (verbatim from `_rvGroupOf`): `min`/`now`/`just now`/`…h`/`hour` → **today**; `yesterday` → **yesterday**; `{n} day(s)` with n ≤ 7 → **this week**; everything else (incl. `1 week`) → **earlier**. Each `.rv-section-head` shows the label + **"{n} item{s}"** count. (Prototype uses relative-time strings like `2h`, `yesterday`, `5 days ago` — the React port reads real timestamps and derives these buckets in `RecentlyViewedService`.)

### Recently-viewed rows (`.rv-row`)
Per `renderRvRow(it)`:
- **Thumb** — gradient tile with `it.ic` or the type icon.
- **Title** — `rv-row-title` = `it.title`.
- **Meta** — type pill (`Product` / `Service` / `Business` / `Architect`, with matching icon), then optionally `· {channel}` (`ti-circle-check`), `· {loc}` (`ti-map-pin`), `· {rat} ({rev})` (`ti-star-filled`). Status/type is conveyed by **icon + text**, not colour.
- **When** — `rv-row-when` = `it.viewedAt` (hidden ≤ mobile breakpoint via CSS).
- **Row click** → `openRecentItem(id)` — in the prototype a stub toast **"Opening item — in production this would navigate to the listing"** (`info`); React: navigate to the listing route.
- **Save action** (`.rv-row-btn`) → `toggleSaveRecent(id)`. Toggles the item in/out of saved items: add → toast **`Saved "{title}"`** (`success`, title trimmed at " — "); already saved → toast **"Removed from saved items"** (`info`). Saved state flips icon `ti-bookmark` ↔ `ti-bookmark-filled` + `.saved` class; tip **"Save for later"** / **"Already in your saved items"**. **Write:** `SavedService.save()/unsave()` → spine *saved* (the same spine the **Saved items** tab reads — a save here surfaces there live).
- **Remove action** (`ti-x`) → `removeFromRecent(id)` — drops the item from history, toast **"Removed from recently viewed"** (`info`), re-render. Tip **"Remove from history"**. **Write:** `RecentlyViewedService.remove(id)`.

### Empty states
- **No history at all** (`items.length === 0`): `empty-state` (icon `ti-history-toggle`), title **"Nothing here yet"**, sub **"Listings, profiles, and pages you visit on Interior bazzar will show up here for the last 30 days. Use the history to pick up where you left off."**, primary CTA **"View saved items"** (`ti-bookmarks`) → `goSection('saved')`.
- **Filter/search miss** (`filtered.length === 0` but history non-empty): `empty-state` (icon `ti-search-off`), title **"No matches"**, sub **"Try a different filter or search term."** No CTA (recovery is clearing the search/filter). The toolbar stays visible above it.

## 5. Working flow
1. **Entry** — buyer selects **Recently viewed** in the dash nav → `?tab=activity` → `renderActivity()`.
2. **Orient** — reads the header stat ("12 items in the last 30 days · 2 from today") and scans the **Today / Yesterday / This week / Earlier** sections.
3. **Narrow** (optional) — types in **Search recently viewed...** and/or taps a type chip (**Products / Services / …**); list refilters live; a miss shows **"No matches"**.
4. **Act on a row:**
   - **Re-open** → click the row → navigates to the listing (cross-tab: from a listing the buyer can fire a **Connect enquiry**, which lands in **My connections** and, via the shared spine, in the **seller's Enquiries** dashboard live).
   - **Save for later** → row save toggle → item appears in **Saved items** (`?tab=saved`) immediately, same `saved` spine.
   - **Remove from history** → row removes; **Clear history** wipes all (confirm-first).
5. **Exit** — empty state or a finished scan routes the buyer onward: **"View saved items"** → Saved tab; re-opening a row → listings → Connect → pipeline. No dead ends.

**Spine connections:** writes here touch two shared groups — *recently-viewed history* (remove/clear) and *saved* (save toggle, shared with the **Saved items** tab). Re-opening rows feeds the **enquiry → pipeline → quotation** spine via the listing → Connect modal documented in the parent README §5a/§6.

## 6. Data · States · A11y · Copy
**Data — services + spine groups:** `RecentlyViewedService.list()/remove(id)/clear()` → *recently-viewed history*; `SavedService.save()/unsave()/list()` → *saved* (shared with Saved tab). All reads/writes via services → DataSource — never raw `localStorage`/`fetch`.

**States:**
- **Loading:** row/section skeletons (not a bare spinner).
- **Empty (no history):** "Nothing here yet" + **"View saved items"** CTA.
- **Empty (filter/search miss):** "No matches" + "Try a different filter or search term." (toolbar retained).
- **Error:** quiet inline retry; nav/chrome stay usable.
- **Success:** save / remove / clear → `showToast(...)` and re-render; **Clear history** confirms first (modal).
- *(No locked/cap/upsell state — universal buyer tab.)*

**A11y:** one **H1** = `dm-title` "Recently viewed"; landmarks = dashboard `header` / `<aside class="dash-nav">` (nav, current item `aria-current`) / `<main>`; each time bucket a labelled `section`. Row save/remove + search-clear are icon-only → `aria-label`; decorative `ti` icons `aria-hidden`. Status/type via **icon + text**, not colour alone. Clear-history modal: `role="dialog"` + `aria-modal`, focus-trapped, Esc + backdrop close, focus returns to trigger. Search re-focus preserves caret position.

**Copy (verbatim):** "Recently viewed" · "{n} items in the last 30 days · {n} from today" · "Clear history" · "Search recently viewed..." · "All / Products / Services / Businesses / Architects" · "Today / Yesterday / This week / Earlier" · "Nothing here yet" / "Listings, profiles, and pages you visit on Interior bazzar will show up here for the last 30 days. Use the history to pick up where you left off." / "View saved items" · "No matches" / "Try a different filter or search term." · "Clear recently viewed?" / "This removes all {count} items from your recently viewed list." / "Your saved items are not affected — only the visit history. Recommendations may take a few days to retune." / "Cancel" / "Clear history" · toasts: "History is already empty" · "Recently viewed cleared" · `Saved "{title}"` · "Removed from saved items" · "Removed from recently viewed" · tips: "Save for later" / "Already in your saved items" / "Remove from history" / "Clear search". Brand lowercase-b **"Interior bazzar"**; CTAs Title Case, no caps/"!".

**Build notes (React):** `components/BuyerDashboard/RecentlyViewed/` (rendered by the dashboard `<ViewSwitch>` at `?tab=activity`); uses `RecentlyViewedService` (list/remove/clear) and `SavedService` (save toggle, shared with the Saved tab) → DataSource.
