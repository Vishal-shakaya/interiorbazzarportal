# TAB: Saved items — Buyer Dashboard

```
PARENT: README.md  ·  VIEW id: saved  ·  GROUP: main  ·  PROTOTYPE: pages/dashboard-buyer.html
```

The buyer's bookmark shelf — every product, service, business and architect they tapped the bookmark on, in one filterable grid they can share or export. Parent overview: [README.md](README.md) · pages index: [../README.md](../README.md) · modules/features/flow: [../../modules-features-flow.md](../../modules-features-flow.md) · style: [../../style.md](../../style.md) · copywriting: [../../copywriting.md](../../copywriting.md) · environment seam: [../../../../docs/environment-and-backend.md](../../../../docs/environment-and-backend.md) · integration: [../../../../docs/integration.md](../../../../docs/integration.md).

## 1. Page-tab
**What it is:** `renderSaved()` — a card grid of the buyer's saved listings drawn across **products, services, businesses, and architects**, with header share/export actions and type filter chips. It is the buyer's persistent "things I bookmarked" shelf.

**Where it sits in the nav:** dashboard nav (`<aside class="dash-nav">`), group **main** ("My account"), label **Saved items**, icon `ti-bookmark`. No chip/count sits on the nav item itself — instead the **topbar carries a live saved-items badge** `#dtSavedBadge` that shows `window.savedItems.length` and hides at zero (synced on every `renderDash()`).

**Default view?** No. The nav default is `connections` ("My connections"). (Note: the prototype's `dashState.section` and the `renderContent()` `default:` both fall back to `renderSaved()`, but the shipped default working view per README §5 is Connections.)

**How it's reached:** `goSection('saved')` → React `?tab=saved` (`setSearchParams({tab:'saved'},{replace:true})`); the prototype's legacy hash is `#saved` (used by Share list). No deep-link sub-route — the type filter is in-memory client state, not a URL param.

**Who sees it:** every logged-in buyer. Auth-gated page (guard redirects logged-out → `auth.html`, sellers → `dashboard-seller.html`); no per-tab gating.

## 2. Module
**Buyer — universal / account.** Saved items is part of every buyer's standard account; there is no module subscription, plan-gating, entitlement read, or cap. No `IBEntitlements` / `IB_SECTION_MODULE` / `ib_sectionAllowed` gate applies here — that machinery is seller-side. Visibility is simply "logged-in buyer", and the feature is full-depth for all of them.

## 3. Features
Verbatim sub-areas of the Saved items view:
- **Header** — breadcrumb "Dashboard › Saved items", H1 "Saved items", subtitle item-count line.
- **Share list** (`.dm-action`, `ti-share`).
- **Export** (`.dm-action`, `ti-download`).
- **Type filter chips** (`.dm-fchip`): **All / Products / Services / Businesses / Architects**.
- **Saved card grid** (`#savedGrid`, `.saved-grid`) of `.dcard`s, each with a **Remove from saved** control (`.dcard-unsave`).
- **Empty states** — "No saved items yet" (whole list) and per-type "No saved {type}s yet".

## 4. Functionality

| Feature | What it does | Controls / data / behaviour |
|---|---|---|
| **Header / count** | Frames the view. Breadcrumb `<i ti-layout-dashboard> Dashboard › Saved items`; H1 `.dm-title` "Saved items"; subtitle: `{n} items you've bookmarked across products, services, businesses, and architects.` | Reads `SavedService.list()` (spine group `saved`) for the count. One H1 per view. |
| **Share list** | Produces a shareable link to the saved shelf. Prototype `shareSavedList()` builds `…#saved`, uses `navigator.share` if present, else copies to clipboard. | Label **"Share list"**. Success toast `Share link copied to clipboard` (`success`). In React the deep link is `?tab=saved`; share/copy via a UI service, not raw clipboard scatter. |
| **Export** | Downloads the saved list as CSV. Prototype `exportSavedList()` emits header `Type,Title,Channel,Location,Rating,Reviews` then a row per item; filename `interior-bazzar-saved.csv`. | Label **"Export"**. Empty → toast `No saved items to export` (`info`); success → toast `Exported {n} saved items` (`success`). Reads `SavedService.list()`; file build via service helper, never inline `fetch`. |
| **Type filter chips** | Narrow the grid by listing type. `filterSaved(el,key)` toggles `.on` and re-renders `#savedGrid` from `savedItems` where `it.type === key`. | Chips verbatim: **All** (shows total count `{n}`, default `.on`), **Products** (`ti-box`, `product`), **Services** (`ti-tools`, `service`), **Businesses** (`ti-building`, `business`), **Architects** (`ti-ruler-2`, `architect`). Client-side filter over the already-loaded `SavedService.list()` result — no refetch. |
| **Saved card** (`.dcard`) | One bookmarked listing. Card click opens the listing detail (prototype stubs `alert('Open … detail')`). | Renders thumb (gradient + type icon), optional tag (`New` / `Top rated` / `Verified` / `In demand` / `Bestseller`; the "hot" tags get a 🔥 + dark pill), channel name + verified tick (`ti-rosette-discount-check-filled`), rating `★ {rat}`, `({rev})` reviews, location. In React, navigate to the listing route. |
| **Remove from saved** (`.dcard-unsave`) | Unsaves the item. `unsaveItem(id)` confirms `Remove this item from your saved list?`, filters it out of `savedItems`, re-renders (and the topbar badge re-syncs). | Icon-only `ti-bookmark-filled`, `title="Remove from saved"`; `event.stopPropagation()` so it doesn't open the card. **Write:** `SavedService.remove(id)` → DataSource (spine `saved`). Confirm before destructive removal. |

**Cross-tab write coupling (read-only here, written elsewhere):** the same `saved` spine is mutated from **Recently viewed** — `toggleSaveRecent(id)` either `savedItems.unshift({...item})` (toast `Saved "{title}"`, `success`) or splices it out (toast `Removed from saved items`, `info`). So saving from Recently viewed makes the item appear in this grid and increments the topbar `#dtSavedBadge`.

## 5. Working flow
1. **Entry** — buyer opens the dashboard and clicks **Saved items** in the dash-nav (`?tab=saved`), or follows the topbar saved badge `#dtSavedBadge`.
2. **Load** — `SavedService.list()` reads the `saved` spine; grid renders `.dcard`s, **All** chip active with the live count, subtitle shows `{n} items…`.
3. **Filter** — buyer taps **Products / Services / Businesses / Architects** to narrow; an empty result shows "No saved {type}s yet". No URL change, no refetch.
4. **Act on a card** — click a card → open that listing's detail page (continue browsing / enquire from there); or tap **Remove from saved** → confirm → item drops out, count and topbar badge decrement.
5. **Share / Export** — **Share list** copies a link to the shelf (toast), **Export** downloads `interior-bazzar-saved.csv` (toast), letting the buyer take the list off-platform.
6. **Empty / exit** — with nothing saved, the empty state's **Start browsing** routes to Home (`home.html`); a removed-everything shelf funnels back into discovery — no dead end.

**Connections to other tabs + spine:**
- **Recently viewed** writes into this same `saved` spine (save/remove a recently-viewed row → it surfaces here live).
- A saved card's detail page is the on-ramp to **Connect → enquiry**, which lands in **My connections** (`enquiries` spine) and surfaces in the seller's **Enquiries** dashboard — saved is the top of that track funnel.
- The topbar **#dtSavedBadge** mirrors this list count platform-wide within the dashboard chrome.

## 6. Data · States · A11y · Copy
**Data:** `SavedService.list()` / `SavedService.remove(id)` / `SavedService.export()` → DataSource, spine group **`saved`**. Cross-written by Recently viewed's `toggleSave`. All reads/writes via services → DataSource — never raw `localStorage`/`fetch`.

**States:**
- **Loading** — card-grid skeleton (`.dcard` placeholders), not a bare spinner.
- **Empty (whole list)** — `ti-bookmark-off`, title **"No saved items yet"**, sub "Browse listings and click the bookmark icon to save items you like. They'll appear here for easy access.", CTA **"Start browsing"** (`ti-search`, → Home). The topbar badge hides at zero.
- **Empty (per type filter)** — `ti-bookmark-off`, title **"No saved {type}s yet"**, sub "Browse and save {type}s you're interested in — they'll show up here for easy access." (no CTA in prototype).
- **Error** — quiet inline retry; nav/chrome stay usable.
- **Success** — unsave / save / export → `showToast(…, 'success'|'info')` and the grid + badge re-render; destructive **Remove from saved** confirms first.
- (No locked/cap/upsell state — buyer-universal feature.)

**A11y:** landmarks — dashboard `header`, `<aside class="dash-nav">` (view nav), `<main>`; the active nav item carries **`aria-current`** (prototype `.on`). Exactly **one H1** = `.dm-title` "Saved items". Verified status conveyed by **icon + text**, not colour. Icon-only **Remove from saved** gets `aria-label="Remove from saved"`; decorative `ti` icons `aria-hidden`. Filter chips are real `<button>`s with pressed state; touch targets ≥ 38px; card grid reflows to single column on mobile.

**Copy (verbatim):** breadcrumb "Dashboard › Saved items" · H1 "Saved items" · subtitle "{n} items you've bookmarked across products, services, businesses, and architects." · actions **"Share list"**, **"Export"** · chips **All / Products / Services / Businesses / Architects** · card tooltip "Remove from saved" · confirm "Remove this item from your saved list?" · empty "No saved items yet" + **"Start browsing"** · toasts "Share link copied to clipboard", "No saved items to export", "Exported {n} saved items", "Removed from saved items", 'Saved "{title}"'. Brand lowercase-b **"Interior bazzar"**; CTAs Title Case.

---

**Build notes (React):** `components/BuyerDashboard/Saved/` (`Saved.tsx` + `SavedCard.tsx` + `useSaved.ts`) rendered by the dashboard `<ViewSwitch>` on `?tab=saved`; uses **`SavedService`** (list / remove / export, spine `saved`) → DataSource, plus the shared toast/clipboard UI service.
