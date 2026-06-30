# TAB: Profile — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: profile  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Cross-refs: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> [modules-features-flow](../../modules-features-flow.md) · [style](../../style.md) ·
> [copywriting](../../copywriting.md) · [environment seam](../../../Environment-Management-backend.md) ·
> [integration](../../../Integration.md) ·
> prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html).

## 1. Page-tab
**Profile is the seller's *personal* account-identity surface** — the human user behind the business:
their name, contact, and how they want to be reached. The prototype is explicit that this is
**"Separate from your Business profile (the public company listing)"** — Business (`business` tab, ASSETS
group) is the public company; Profile (this tab, ACCOUNT group) is the person who owns it.

- **Nav placement:** group **`account`** — rendered under the **"Profile & settings"** group label by
  `renderNav()`. Item: `{id:'profile', label:'Profile', icon:'ti-user-circle', group:'account'}`.
- **Label / icon:** **"Profile"**, `ti-user-circle`.
- **Chip / count:** none (no `chip`, no `ib_getSidebarChip` entry) — it is a static identity surface, not a
  list.
- **Default view?** No. The dashboard default section is `overview`; Profile is reached on demand.
- **How it's reached:** prototype routes by `window.location.hash` → `dashState.section`; `goSection('profile')`
  switches and re-renders. **In React, mirror as `?tab=profile`** via `useSearchParams`. Three Quick-action
  rows and a Business-link card here deep-link onward via `goSection(...)` (→ `?tab=security`, `?tab=membership`,
  `?tab=settings`, `?tab=business`).
- **Who sees it (visibility gating):** **universal.** `profile` is **not** in `IB_SECTION_MODULE`, and not one
  of `pipeline`/`quotations`/`reviews`, so `ib_sectionAllowed('profile')` falls through to `return true` —
  every logged-in seller sees it on every plan, including a buyer-with-no-selling-module who resolves to
  `FREE`.

## 2. Module
**Module: none — universal account surface.** Profile belongs to no subscription module. Its gate is the
default branch of `ib_sectionAllowed(id)`:

```js
function ib_sectionAllowed(id){
  if (id in IB_SECTION_MODULE) return ib_hasModule(IB_SECTION_MODULE[id]);
  if (id === 'pipeline' || id === 'quotations' || id === 'reviews') return ib_anySellingModule();
  return true;   // ← profile lands here: universal surface
}
```

There is **no `IBEntitlements.of` / `.limit` / `.atCap` / `.meters` read in `renderProfile()`** — the tab
reads nothing plan-gated and writes nothing plan-gated, so there are **no caps, no upsell card, no "Soon"
chip** on this tab. Plan awareness here is **display-only, read from already-resolved user state**, never
a gate:
- The header **plan badge** shows the tier word via `IBPlans.tier(u.sellerPlan)` (tooltip `IBPlans.full(...)`),
  and only renders `if (u.isSeller && u.sellerPlan)`.
- The Business-link card shows `${u.sellerPlan} plan · renews ${u.planRenewsOn}` only `if (u.sellerPlan)`.

These are labels, not entitlement gates — a buyer with no plan simply sees those badges omitted. (The
*plan surface* with meters and caps is the **Plans** tab; the per-module limit reads from `ib-entitlements.js`
live there, not here.)

## 3. Features
Verbatim sub-areas in `renderProfile()`:

- **Header card** — avatar + identity + badges + personal stats (Enquiries / Deals won / Response rate / Member since).
- **Personal info** card (left column).
- **Notifications & preferences** pointer card (left column) — slim pointer into Settings.
- **`${businessName}` business-link card** (right column) — "Open business profile".
- **Quick actions** card (right column) — Password & security · Billing · Settings · Sign out.
- **Edit personal info** modal (`openEditPersonalInfo()` → `saveEditPersonalInfo()`).

## 4. Functionality

| Feature | What it does | Controls (verbatim) | Data — reads / writes |
|---|---|---|---|
| **Page header** | Title + subtitle; one edit entry-point. | H1 **"Your profile"**; sub **"Personal account info — your name, contact, and how you want to be reached. Separate from your Business profile (the public company listing)."**; action button **"Edit profile"** (`ti-edit`) → `openEditPersonalInfo()`. | reads `UserService` (`dashState.user`). |
| **Header card** | Avatar (`u.initials`), name, `${email} · ${city}, India`, badge row, and a 4-up personal-stats strip. | Badges: **"IB Verified"** (`ti-rosette-discount-check-filled`, only `if u.verified`); plan badge `IBPlans.tier(u.sellerPlan)` (`ti-crown`, only `if u.isSeller && u.sellerPlan`, tooltip = full plan name); **"Owner · ${businessName}"** (`ti-briefcase`). | reads `UserService` + `sellerProfile` (`businessName`). |
| **Personal stats** | Activity counters derived live, **not** plan-gated metrics. | Tiles: **"Enquiries"** = `connections.length`; **"Deals won"** = connections where `dealStage==='won'`; **"Response rate"** = `% of connections where status≠pending & ≠expired`; **"Member since"** = `u.joined`. | reads `EnquiryService.list()` (spine `enquiries` / `ib:sharedenquiry`) + `UserService`. Read-only. |
| **Personal info** | Read view of the user's identity fields with verified ticks. | Card head **"Personal info"** (`ti-user`) + **"Edit"** (`data-tip="Edit personal info"`) → `openEditPersonalInfo()`. Fields: **Full name**, **Email** (green verified tick, `title="Verified"`), **Phone** (verified tick), **Location** = `${city}, India`, **"Role at ${businessName}"** = **"Owner / Founder"**. | reads `UserService` + `sellerProfile`. |
| **Notifications & preferences** | Slim pointer card — notifications now live in Settings. | Title **"Notifications & preferences"**, sub **"Email alerts, language, currency & privacy"**; button **"Manage in Settings"** (`ti-settings`) → `goSection('settings')`. | navigation only. |
| **Business-link card** | Bridges to the public company profile. | Title = `${businessName}` (fallback **"Your business"**); sub = `${tagline}` (fallback **"Set a tagline in your Business profile"**); meta rows: `${headquartersCity}, ${headquartersState}` (`ti-map-pin`), `${cin}` if set (`ti-id`), `${sellerPlan} plan · renews ${planRenewsOn}` if a plan exists (`ti-rosette`); button **"Open business profile"** (`ti-arrow-right`) → `goSection('business')`. | reads `sellerProfile` + `UserService`. |
| **Quick actions** | Four account shortcuts. | Card head **"Quick actions"** (`ti-bolt`). Rows: **"Password & security"** / *"Change password, 2FA, login sessions"* → `goSection('security')`; **"Billing"** / *"Invoices, payments & shop subscriptions"* → `goSection('membership')`; **"Settings"** / *"Display, language, time zone, integrations"* → `goSection('settings')`; **"Sign out"** / *"End this session on this device"* (danger row) → `confirmSignOut()` → `ib_signOut()`. | navigation + session (sign-out via `AuthService`). |
| **Edit personal info** (modal) | Edits the four identity fields; recomputes initials. | Modal title **"Edit personal info"** (`ti-user`). Inputs `Full name`, `Email`, `Phone`, `City`. Footer **"Cancel"** / **"Save changes"** (`ti-check`). On save: write name/email/phone/city, recompute `u.initials`, close, toast **"Personal info updated"**, re-render. | **writes** `UserService.update(...)` (user identity). |

**Caps / gating UI:** none. There is no paid capability on this tab, therefore nothing to disable, lock,
cap-toast, mark "Soon", or wrap in an upsell card. Plan/verified badges are display-only and simply omit
when absent.

## 5. Working flow

**A — Edit my personal details (core loop):**
1. Seller opens `?tab=profile` (avatar menu or nav "Profile" under "Profile & settings").
2. Reads identity + live stats (Enquiries / Deals won / Response rate / Member since) and badges (IB Verified, plan tier, "Owner · {business}").
3. Clicks **"Edit profile"** / **"Edit"** → **"Edit personal info"** modal.
4. Edits Full name / Email / Phone / City → **"Save changes"** → `UserService.update` → toast **"Personal info updated"**; header, Personal-info card and nav user-card re-render with new name/initials.
5. Exit: stays on Profile, or deep-links onward via a Quick action.

**B — Branch to an adjacent surface:**
1. From **Quick actions**, jump to **Password & security** (`?tab=security`), **Billing** (`?tab=membership`), or **Settings** (`?tab=settings`) — Profile deliberately defers notifications/language/currency/privacy to Settings (the pointer card states this).
2. From the **business-link card**, **"Open business profile"** → `?tab=business` — the *public company* surface, distinct from this *personal* one.
3. **"Sign out"** ends the session and returns to home.

**Connections to other tabs / the shared spine:**
- **Personal stats read the live enquiry spine** — Enquiries / Deals won / Response rate are computed from the same `connections` (`EnquiryService` → `enquiries` / `ib:sharedenquiry`) that drive **Overview** KPIs, **Enquiries** inbox and **Pipeline**: a deal moved to `won` in Pipeline, or an enquiry answered, surfaces here as updated stats with no extra wiring.
- **Identity edits propagate** — `UserService.update` here updates the topbar avatar/menu and the nav user-card (`renderNav`) immediately; the same user record powers every other section.
- **It is the hub for the ACCOUNT group** — the single screen that fans out to Business, Security, Billing and Settings.

## 6. Data · States · A11y · Copy
**Data (services → DataSource; never raw localStorage/fetch):** `UserService` (identity — read + `.update`),
`AuthService` (sign-out), `EnquiryService.list()` (spine `enquiries` / `ib:sharedenquiry` — read-only, for
the three stat tiles), `sellerProfile`-equivalent business read (business name / tagline / HQ / CIN / plan
labels). Optional display reads: `IBPlans.tier`/`.full` for the badge word/tooltip (label only). **No
entitlement/cap read on this tab.**

**States:**
- **Loading:** standard section skeleton (header card + two columns); nav renders immediately from `dashSections`.
- **Empty:** never fully empty — identity always present. Stats degrade gracefully (Response rate = `0` when no enquiries); business-link card shows fallbacks **"Your business"** / **"Set a tagline in your Business profile"** / `—` HQ; verified/plan badges simply omit.
- **Locked / gated:** **n/a** — universal surface, no paid capability, no upsell or cap.
- **Error:** failed section degrades to an inline retry; the rest of the console still renders.
- **Success:** save → toast **"Personal info updated"** (`success`) + re-render.

**A11y:** landmarks `header`/`aside`/`main` (`#dashMain`); the active `.dn-item` is `aria-current`; **one H1**
per section — **"Your profile"** (`.dm-title`). Verified status is conveyed by **icon + `title="Verified"`
text**, not colour alone; the plan/verified badges pair icon **and** text. Modal: `<label>`-linked inputs,
focus-trapped, `aria-live="polite"`, Esc/backdrop close. Quick-action and edit triggers are real `<button>`s
(≥38px touch targets).

**Copy (verbatim):** H1 **"Your profile"** · sub **"Personal account info — your name, contact, and how you
want to be reached. Separate from your Business profile (the public company listing)."** · CTAs **"Edit
profile"**, **"Edit"**, **"Manage in Settings"**, **"Open business profile"**, **"Save changes"**, **"Cancel"**
· cards **"Personal info"**, **"Notifications & preferences"** (*"Email alerts, language, currency &
privacy"*), **"Quick actions"** · rows **"Password & security"**, **"Billing"**, **"Settings"**, **"Sign
out"** (*"End this session on this device"*) · badge **"IB Verified"** · stat labels **"Enquiries"** / **"Deals
won"** / **"Response rate"** / **"Member since"** · role **"Owner / Founder"** · toast **"Personal info
updated"**. Brand voice lowercase-b **"Interior bazzar"**, British **"enquiry"**, CTAs Title Case (no
ALL-CAPS, no "!").

**Build notes (React):** `components/SellerDashboard/Profile/` — uses `UserService` (read + update),
`AuthService` (sign-out) and `EnquiryService.list()` (read-only stats); no `EntitlementService` read on this tab.
