# TAB: Saved — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: saved  ·  GROUP: personal  ·  PROTOTYPE: pages/dashboard-seller.html
```

The seller-as-buyer bookmark surface: marketplace items (products / services / businesses /
architects) the seller has saved to revisit. Same shape as the buyer dashboard's Saved — a universal,
account-level section, no plan gating. Grounded verbatim in `renderSaved` / `renderSavedCard` /
`renderEmptySaved` / `filterSaved` (prototype lines ~30421–30514) and the topbar dropdown
`ib_renderSavedDropdown` (~35723).

---

## 1. Page-tab

**What it is:** a grid of bookmarked Interior bazzar marketplace listings the seller has saved while
browsing — the seller acting as a buyer. Each card is a saved product, service, business or architect;
the seller can open it or remove the save.

**Where it sits in the nav:** group **`personal`** (rendered under the group label **"Personal"** by
`renderNav()`), section definition `{id:'saved', label:'Saved', icon:'ti-bookmark', group:'personal'}`
(prototype line 28607). Nav item label **"Saved"**, icon **`ti-bookmark`**.

**Chip / count:** live count from `ib_getSidebarChip('saved')` = `window.savedItems.length` (returns the
count string, or `null`/no chip when empty). The same count drives the **topbar Saved badge**
`#dtSavedBadge` (`renderDash` syncs `badge.textContent = window.savedItems.length`, hidden when 0).

**Default view?** No. The default seller section is **Overview** (`overview`). Saved is reached on demand.

**How it's reached:**
- Prototype: `goSection('saved')` → `dashState.section = 'saved'` (hash `#saved`); `renderContent()`
  switches `case 'saved': return renderSaved();`.
- Also reached from the **topbar Saved dropdown** (`ib_toggleSavedDropdown`): shows up to 5 recent saved
  rows, each row and the footer **"View all saved items"** call `goSection('saved')`.
- **React:** mirror as **`?tab=saved`** via `useSearchParams`. No nested sub-route — the in-tab type
  filter (`all/product/service/business/architect`) is client-side UI state, not a deep link.

**Who sees it:** **everyone.** `ib_sectionAllowed('saved')` returns `true` (universal surface — `saved`
is not in `IB_SECTION_MODULE`, not in the `pipeline/quotations/reviews` any-selling-module group). Visible
to a logged-in buyer-only account (resolves `FREE`) and to every seller plan alike.

## 2. Module

**Universal / account section — no module, no plan-gating.** Saved belongs to no subscription module and
is identical across plans (visibility and depth). There is **no** `IB_SECTION_MODULE` entry for `saved`
and **no** `ib-entitlements.js` limit, meter or cap for saved items (Grep of `ib-entitlements.js` for
`saved` returns no matches). Therefore:

- **No** `IBEntitlements.of` / `.limit` / `.atCap` / `.meters` reads gate this tab.
- **No** upsell card, "Soon" chip, cap toast or disabled-with-lock control appears here — there is nothing
  to gate. (House rule "never silently hide a paid capability" is satisfied trivially: there is no paid
  capability in this tab.)
- It is the seller-side mirror of the buyer dashboard's Saved — same card shape, same behaviour.

## 3. Features

Verbatim sub-areas from `renderSaved`:

- **Header** — H1 **"Saved items"** + sub `"{n} items you've bookmarked across products, services,
  businesses, and architects."`
- **Type filter row** (`sh-chips sv-filter-row`) — chips: **All**, **Products**, **Services**,
  **Businesses**, **Architects**, each with a live count.
- **Saved grid** (`saved-grid` / `#savedGrid`) — cards (`renderSavedCard` → `.dcard`), one per saved item.
- **Remove from saved** — per-card unsave button (`.dcard-unsave`, `title="Remove from saved"`).
- **Empty state** (`renderEmptySaved`) — shown when there are no saved items (and a per-type empty when a
  filter yields none).
- **Topbar Saved dropdown** (`ib_renderSavedDropdown`) — chrome-level peek (top 5) that links into this tab.

## 4. Functionality

Reads/writes go through **`SavedService`** → DataSource (spine group: buyer-shape **saved** items; in the
prototype this is `window.savedItems`). **Never** raw `localStorage`/`fetch`.

| Feature | What it does — controls, data, behaviour |
|---|---|
| **Header / count** | H1 **"Saved items"**; sub-line `"{n} items you've bookmarked across products, services, businesses, and architects."` `{n}` = `SavedService.list().length` (`window.savedItems.length`). Read-only. |
| **Type filter row** | Five chips (`sh-chip`, active = `.on`). Verbatim with icons + counts: **All** `{total}`; **`ti-box` Products** `{count type==='product'}`; **`ti-tools` Services** `{count type==='service'}`; **`ti-building` Businesses** `{count type==='business'}`; **`ti-ruler-2` Architects** `{count type==='architect'}`. `filterSaved(el,key)` toggles `.on` **scoped to this row only** (note: `sh-chip` is reused by Shop's status filter, so a global selector would mis-toggle — scope to the row's parent) and re-renders `#savedGrid` with `key==='all' ? all : items.filter(type===key)`. Client-side filter; no write. |
| **Saved grid / card** (`renderSavedCard`) | One `.dcard` per item. Shows: gradient thumb with the item's icon (`it.ic`); optional **tag** pill (`it.tag` — e.g. "New", "Verified"; tags **"Top rated" / "In demand" / "Bestseller"** get the `hot` class → 🔥 prefix); the **unsave** button; an avatar (channel initials); **title** (`it.title`); **channel** with a verified check (`ti-rosette-discount-check-filled`); meta row = **rating** (`★ {rat}`) · `({rev})` reviews · `{loc}`. **Open:** card `onclick` opens the item's detail (prototype stub `alert('Open ...')`; React → navigate to the public listing detail for that `type`/id). Read-only render. |
| **Remove from saved** | `.dcard-unsave` button (`title="Remove from saved"`, icon `ti-bookmark-filled`). `onclick` stops propagation then `unsaveItem(id)` → **confirm** `"Remove this item from your saved list?"`; on confirm removes the item (`savedItems.filter(it=>it.id!==id)`) and re-renders. **React:** `SavedService.remove(id)` (write to the saved spine) then re-render; the topbar `#dtSavedBadge` and the nav chip update from the new count. |
| **Empty state** (`renderEmptySaved`) | When `savedItems.length === 0`: icon `ti-bookmark-off`, title **"No saved items yet"**, sub **"Browse Interior bazzar listings — products, services, businesses, and architects — and bookmark the ones you want to revisit. They'll show up here for quick access."** Per-type empty (filter yields none): title **"No saved {key}s yet"**, sub **"Browse and save {key}s you're interested in — they'll show up here for easy access."** |
| **Topbar Saved dropdown** (`ib_renderSavedDropdown`) | Chrome, not part of `#dashMain`, but feeds this tab. Header **"Saved items"** + count; lists top 5 (`items.slice(0,5)`) — each row title + `"{channel} · {loc}"`, click → `goSection('saved')`. Empty: icon `ti-bookmark`, **"Nothing saved yet"**, **"Bookmark products, businesses and architects to find them here."** Footer **"View all saved items"** → `goSection('saved')`. |

No caps, no gating UI — universal.

## 5. Working flow

**Core flow — review and prune saved items**
1. Seller opens the dashboard (default **Overview**), sees the **Saved** count chip in the `personal` nav
   group and the **`#dtSavedBadge`** in the topbar.
2. Seller clicks **Saved** (`?tab=saved`) — or opens the **topbar Saved dropdown** and clicks **"View all
   saved items"** — landing on **"Saved items"** with all cards.
3. Seller narrows by type via the filter chips (**Products / Services / Businesses / Architects**); grid
   re-renders in place (no navigation, no write).
4. Seller **opens** a card → the public listing detail for that product / service / business / architect
   (where they can then start an enquiry on the live marketplace).
5. Seller **removes** an item via the card unsave button → confirm → item gone; count chip + topbar badge
   decrement immediately.
6. Exit: navigate to any other section, or open a listing detail to act on it.

**Empty path:** no saves → **"No saved items yet"** empty state with the browse-and-bookmark next action
(no dead end).

**Connections to other tabs / shared spine**
- **Topbar Saved dropdown ↔ this tab:** both read the same saved spine; the dropdown is the quick-peek,
  this tab is the full surface; both link via `goSection('saved')` / `?tab=saved`.
- **Nav chip + `#dtSavedBadge`:** both derive from `SavedService.list().length` (`ib_getSidebarChip`),
  so an unsave here updates the badge and chip in the same render.
- **Buyer dashboard parity:** this is the seller-as-buyer mirror of the buyer dashboard's Saved — **same
  service, same spine group, same card shape** — so a save made while browsing surfaces identically in
  whichever dashboard the account is viewing.
- **Opening a card → marketplace:** a saved item opens its public listing detail, the entry point back
  into browsing / starting a fresh enquiry (which then flows into the shared enquiry → pipeline →
  quotation spine on the *other* side of the account). Saved itself does **not** write to that spine.

## 6. Data · States · A11y · Copy

**Data:** `SavedService.list()` / `.remove(id)` → DataSource; spine group = buyer-shape **saved** items
(prototype `window.savedItems`: `{type, id, title, tag, ic, g, rat, rev, channel, loc}`). No entitlement
reads. Count powers both `ib_getSidebarChip('saved')` and `#dtSavedBadge`.

**States:**
- **Loading:** saved-grid skeleton cards (standard skeleton, not a bare spinner); nav renders immediately.
- **Empty:** **"No saved items yet"** + browse-and-bookmark sub (next action, no dead end); per-filter
  empty **"No saved {key}s yet"**.
- **Locked / gated:** **none** — universal section, no module, no cap, no upsell.
- **Error:** failed load degrades to an inline retry; the rest of the console still renders.
- **Success:** unsave → item removed + count/badge update (prototype uses a `confirm`; React →
  `SavedService.remove` then re-render, optional success toast).

**A11y:** landmarks `header`/`aside`/`main` (`#dashMain`); **one H1** — **"Saved items"** (`.dm-title`);
active `.dn-item` `aria-current`; filter chips are real `<button>`s with text + count (and an icon) — the
active state pairs text/markup, not colour alone; the verified check and tag pills carry text/icon, not
colour-only; unsave button keeps `title="Remove from saved"` exposed to AT; the remove `confirm` (React:
modal) is announced (`aria-live="polite"`), focus-trapped, Esc/backdrop close.

**Copy (verbatim):**
- H1 **"Saved items"** · sub **"{n} items you've bookmarked across products, services, businesses, and
  architects."**
- Chips: **All**, **Products**, **Services**, **Businesses**, **Architects**.
- Unsave tooltip **"Remove from saved"** · confirm **"Remove this item from your saved list?"**
- Empty **"No saved items yet"** / **"Browse Interior bazzar listings — products, services, businesses,
  and architects — and bookmark the ones you want to revisit. They'll show up here for quick access."**
- Per-type empty **"No saved {key}s yet"** / **"Browse and save {key}s you're interested in — they'll
  show up here for easy access."**
- Dropdown: **"Saved items"** · **"Nothing saved yet"** / **"Bookmark products, businesses and architects
  to find them here."** · **"View all saved items"**

---

**Build notes (React):** `components/SellerDashboard/Saved/` (Saved grid + type-filter chips + unsave +
empty state), reached via `?tab=saved`; uses **`SavedService`** (`.list()` / `.remove()`) → DataSource —
no `EntitlementService` read (universal). The topbar Saved dropdown + `#dtSavedBadge` and the `personal`
nav chip all read the same `SavedService.list()` count. Cross-refs: [README.md](README.md),
[pages index](../README.md), [modules-features-flow](../../modules-features-flow.md),
[style](../../style.md), [copywriting](../../copywriting.md),
[environment seam](../../../Environment-Management-backend.md),
[integration](../../../Integration.md),
prototype `../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html`.
