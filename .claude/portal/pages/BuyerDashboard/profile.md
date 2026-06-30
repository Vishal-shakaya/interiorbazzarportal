# TAB: My profile — Buyer Dashboard

```
PARENT: README.md  ·  VIEW id: profile  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-buyer.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) ·
> style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) ·
> environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) ·
> integration = [../../../Integration.md](../../../Integration.md) ·
> prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html)
> (`renderProfile()`).

## 1. Page-tab

**My profile** is the buyer's **public-facing identity card** — a read-only summary of how the member
appears to other members and businesses on **Interior bazzar**. Per the prototype subtitle: *"This is
how other members and businesses see you on Interior bazzar."* It does **not** edit anything itself;
editing is delegated to **Settings**.

- **Nav group:** `account` (the "Profile & settings" group of the `dashSections` nav).
- **Nav label / icon:** **My profile** · `ti-user-circle`.
- **Chip / count:** none.
- **Default view?** No — the buyer dashboard default working view is **My connections** (`connections`);
  `dashState.section` falls back to `'saved'` only as an internal seed. Profile is reached deliberately.
- **How it's reached:** `goSection('profile')` from the dash-nav, or from the **dashboard topbar avatar
  menu** (which jumps to profile / membership / settings). React route: **`?tab=profile`**
  (`setSearchParams({tab:'profile'}, {replace:true})`). No deep-link sub-route — it is a single,
  self-contained view.
- **Who sees it (visibility gating):** every logged-in **buyer**. The page guard already redirects
  logged-out users to `auth.html` and sellers to `dashboard-seller.html`, so this tab is universal for the
  one actor that reaches the buyer dashboard. The card is **identity-adaptive**: if the signed-in user is
  also a seller (`u.isSeller && u.sellerPlan`) it additionally surfaces a seller badge and a Plan stat
  (see §4).

## 2. Module

**Universal / account.** My profile is **not** a paid module and carries **no plan-gating** — it ships
to every buyer as part of the account surface. There is no `IB_SECTION_MODULE` / `ib_sectionAllowed`
gate, no `IBEntitlements` read, and no cap or upsell on this tab. (Entitlement reads live on the **seller**
dashboard; the only entitlement-flavoured echo here is the optional read-only **seller badge + Plan stat**,
which simply *displays* `u.sellerPlan` for a buyer who also holds a seller plan — it never gates or limits
the profile view.)

## 3. Features

Verbatim sub-areas from `renderProfile()`:

- **My profile** header — breadcrumb *Dashboard › My profile*, title, subtitle, and two header actions:
  **View public profile** and **Edit profile**.
- **Identity card** — avatar (`u.initials`), name, `email · city`, **IB Verified member** badge,
  optional **{plan} seller** badge, and a stats row.
- **Stats row** — **Saved** · **Connections** · (optional) **Plan** · **Member since**.
- **About me** — free-text bio card.
- **My interests** — interest tag chips.
- **Contact details** — **Email** / **Phone** / **Location**.

## 4. Functionality

Everything here is **read-only display** hydrated from the signed-in user model (`window.dashState.user`,
itself seeded from shared auth state). In React it reads through **`ProfileService.get()`** / auth state
(spine group `ib_auth` user) — never raw `localStorage`. The only interactive controls are the two header
actions, both **navigations** (no writes happen on this tab).

| Feature | Controls / data | Behaviour |
|---|---|---|
| **Header actions** | **View public profile** (`ti-eye`, `viewPublicProfile()`); **Edit profile** (primary, `ti-edit`, `goSection('settings')`) | "View public profile" opens the member's outward public profile; **"Edit profile"** routes to the **Settings** tab (`?tab=settings`) — this tab owns *display*, Settings owns *editing*. |
| **Identity card** | `dn-avatar` = `u.initials`; name (`u.name`); `${u.email} · ${u.city}`; **IB Verified member** badge shown when `u.verified` (icon `ti-rosette-discount-check-filled`); **`${u.sellerPlan}` seller** badge shown when `u.isSeller && u.sellerPlan` (icon `ti-crown`) | Pure render from the user model. The seller badge is a read-only echo of a seller plan, not a gate. |
| **Stats row** | grid of `repeat(${u.isSeller ? 4 : 3},1fr)`: **Saved** = `window.savedItems.length`; **Connections** = `window.connections.length`; **Plan** = `u.sellerPlan` (only when `u.isSeller && u.sellerPlan`); **Member since** = `u.joined` | Counts mirror the **Saved items** and **My connections** tabs — same `SavedService` / `EnquiryService` spine, so the numbers stay live with those tabs. **Plan** column appears only for seller-buyers. |
| **About me** | card `ti-info-circle`, title **About me**; free-text bio | Read-only paragraph from the user model. |
| **My interests** | card `ti-heart`, title **My interests**; chips: **Italian Marble · Modular Kitchens · Smart Home · Modern Architecture · Sustainable Design · Heritage Restoration** | Read-only interest tags. |
| **Contact details** | card `ti-id`, title **Contact details**; **Email** = `u.email`; **Phone** = `u.phone`; **Location** = `${u.city}, India` | Read-only contact summary. |

**Caps / gating UI:** none — buyer/account tab, no entitlement limits.

## 5. Working flow

1. **Entry** — buyer opens **My profile** from the dash-nav (`account` group) or the topbar avatar menu →
   React `?tab=profile`. Guard has already ensured a logged-in buyer.
2. **Hydrate** — the view reads the user model via `ProfileService.get()` / auth state and renders the
   identity card, stats, About me, My interests and Contact details.
3. **Core loop (review)** — buyer reviews how they appear publicly. Stats (**Saved**, **Connections**,
   **Member since**, and **Plan** if a seller) give an at-a-glance snapshot pulled from the same spine as
   the **Saved items** and **My connections** tabs.
4. **Branch — preview** — **"View public profile"** opens the outward-facing profile other members see.
5. **Branch — edit** — **"Edit profile"** → **Settings** (`?tab=settings`). The buyer changes name,
   bio, interests, contact, etc. there; on save those writes (via `ProfileService` → DataSource) flow back
   into the user model, so returning to **My profile** shows the updated card.
6. **Exit** — back to **My connections** (the working view) or onward to **Membership** (the buyer→seller
   upgrade pitch) via the same `account` nav group.

**Connections to other tabs / shared spine:** this tab is a **read-only mirror** of the account spine —
its **Saved** / **Connections** counts reflect live state from **Saved items** (`SavedService`) and
**My connections** (`EnquiryService`, the shared `ib:sharedenquiry` spine that the seller dashboard also
reads). All *editing* is owned by **Settings**; a profile edit saved there surfaces here on next render.
For a buyer who also sells, the **{plan} seller** badge + **Plan** stat tie through to **Membership** /
seller entitlements (display-only).

## 6. Data · States · A11y · Copy

- **Data:** `ProfileService.get()` / auth state (spine `ib_auth` user); display-only counts via
  `SavedService.list()` (`saved`) and `EnquiryService.listForBuyer()` (`enquiries` / `ib:sharedenquiry`).
  No writes on this tab — edits delegate to Settings. All via services → DataSource (never raw
  `localStorage`/`fetch`).
- **States:**
  - **Loading:** card + stats-row skeleton (avatar, name line, stat tiles), not a bare spinner.
  - **Empty:** identity is always present for a logged-in buyer, so the card never fully empties; thin
    fields degrade gracefully (e.g. no bio → hide About me; counts show `0`). No dead-end — header
    **Edit profile** is the standing next-action CTA to complete a sparse profile.
  - **Error:** failed hydrate degrades to a quiet inline retry; nav/chrome stay usable.
  - **Success:** not applicable on this tab (no writes here); a profile save happens in **Settings** and
    re-renders this card on return.
- **A11y:** dashboard `header` + `<aside class="dash-nav">` (view nav) + `<main>` landmarks; **exactly one
  H1** = `.dm-title` **"My profile"**; the nav button for this view carries **`aria-current`** (prototype
  `.on` class → add ARIA in React). **View public profile** / **Edit profile** are real `<button>`s;
  decorative `ti` icons `aria-hidden`. Verified/seller status conveyed by **icon + text**, not colour
  alone (badges pair an icon with their label).
- **Copy (verbatim):** title **"My profile"**; breadcrumb **"Dashboard › My profile"**; subtitle **"This
  is how other members and businesses see you on Interior bazzar."**; actions **"View public profile"**,
  **"Edit profile"**; badges **"IB Verified member"**, **"{plan} seller"**; stat labels **"Saved"**,
  **"Connections"**, **"Plan"**, **"Member since"**; card titles **"About me"**, **"My interests"**,
  **"Contact details"**; field labels **"Email"**, **"Phone"**, **"Location"**. CTAs Title Case; British
  **"enquiry"**; brand lowercase-b **"Interior bazzar"**.

---

**Build notes (React):** `components/BuyerDashboard/Profile/` (read-only identity card); reads via
`ProfileService` (auth/`ib_auth` user) with display-only counts from `SavedService` and `EnquiryService`;
**Edit profile** routes to `?tab=settings` — no writes on this tab.
