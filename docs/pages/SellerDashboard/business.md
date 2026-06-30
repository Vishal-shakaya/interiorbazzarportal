# TAB: Business — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: business  ·  GROUP: business ("My business")  ·  PROTOTYPE: pages/dashboard-seller.html
```

The seller's **listing-management console** — where they author the business profile buyers see and
the products, services and catalogues that drive enquiries. Grounded verbatim in
[`dashboard-seller.html`](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html)
(`renderBusiness` / `renderBusinessHeader` / `setBusinessTab` / `ent_capGuard`) and gated by
[`ib-entitlements.js`](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js) (`business-*` family).

---

## 1. Page-tab

**What it is.** The **"Your business"** workspace (`<h1 class="biz-title">Your business</h1>`) — a single
section that holds a **tab strip** (`.biz-tabs`, rendered by `renderBusinessHeader`) of six sub-tabs:

| Sub-tab | id | icon | count chip |
|---------|----|------|-----------|
| **Profile** | `profile` | `ti-building` | — (wizard, count-less) |
| **Contact & forms** | `contact` | `ti-mail-fast` | — |
| **Products** | `products` | `ti-box` | `window.products.length` |
| **Services** | `services` | `ti-tools` | `window.services.length` |
| **Catalogue** | `catalogue` | `ti-book` | `window.catalogues.length` |
| **Analytics** | `analytics` | `ti-chart-bar` | — |

**Where it sits.** Nav group **`business` → "My business"** (ASSETS). The nav `.dn-item` chip = the
**products + services + catalogues total** (per README §5). Icon: the section's nav icon; sub-tabs carry
their own icons above.

**Default view?** No — the dashboard default is `overview`. Within Business the default sub-tab is
**`profile`** (`window.dashState.businessTab || 'profile'`).

**How it's reached.** Nav click → `goSection('business')`. In the prototype the active sub-tab is
`window.dashState.businessTab`, set by `setBusinessTab(tab)` and **persisted** to
`ib_seller_businessTab` so a refresh re-lands the seller on the same tab. **In React: mirror as
`?tab=business` (the section) with the sub-tab as the nested deep-link** (`#business/products`,
`#business/products/<id>` for a detail editor) — Products/Services/Catalogue each switch list ↔ detail.

**Who sees it.** Module-gated. `ib_sectionAllowed('business')` → `ib_hasModule(IB_SECTION_MODULE['business'])`
where `IB_SECTION_MODULE.business === 'business'`. The nav item is **hidden** unless the seller holds a
`business-*` plan. (Note: a **Shop** seller without a Business profile who tries to add products hits the
"register a Business profile" guard — see §4.)

---

## 2. Module

**Module:** **Business listing** (`business` module; `IB_SECTION_MODULE.business → 'business'`,
nav label "Business listing", "Businesses listing page", `monthly:6999`). The `business-*` family in
`ib-entitlements.js` has three tiers — **never hardcode these numbers, read them live:**

| Plan key | `label` | `products` | `services` | `catalogues` | `categories` | `keywords` | `states` |
|----------|---------|-----------|-----------|-------------|------------|-----------|----------|
| `business-verified` | **Verified** | 25 | 10 | 2 | 1 | 3 | 3 |
| `business-trusted` | **Trusted Business** | 100 | 50 | 10 | 2 | 5 | ∞ |
| `business-leader` | **Industry Leader** | ∞ | ∞ | ∞ | 3 | 10 | ∞ |

(`∞` = `INF`/`Infinity` → "Unlimited" via `fmtLimit`.) Depth also grades: `proposals`
smart→professional→branded, `pipeline` tracker→visual→multi-stage, `analytics` basic→advanced→professional.

**Entitlement reads (authoritative — via `EntitlementService` wrapping `ib-entitlements.js`):**

- **Visibility gate:** `ib_sectionAllowed('business')` → `ib_hasModule('business')` (the `IB_SECTION_MODULE`
  map). Nav item hides if the module isn't held.
- **`IBEntitlements.of(plan)`** → resolved plan object (`.family`, `.label`, `.products`/`.services`/`.catalogues`).
- **`IBEntitlements.limit(plan, feature)`** → the cap for the cap toast.
- **`IBEntitlements.atCap(plan, feature, used)`** → the **Add** cap-guard (`ent_capGuard`, §4).
- **`IBEntitlements.meters(plan, usage)`** → the per-feature usage meters surfaced on the **Plans** tab
  (Products/Services/Catalogues/Categories/Search keywords), each `{used, limit, unlimited, pct, atCap}`.

**House rule:** a paid capability is **never silently hidden** — add buttons stay visible and signal at the
cap (toast); `soon` tabs show a `Soon` chip; a Shop-without-Business hits the register guard.

---

## 3. Features

Verbatim from `renderBusinessHeader` tab strip + the dispatch in `renderBusiness`:

- **Your business** header — `<h1>Your business</h1>` + per-tab header actions.
- **Profile** — 4-step business profile wizard.
- **Contact & forms** — contact methods + enquiry forms toggles.
- **Products** — list ↔ detail editor; **Import CSV** + **Add product**.
- **Services** — list ↔ detail editor; **Add service**.
- **Catalogue** — list ↔ detail editor; **Add catalogue**.
- **Analytics** — listing performance (top product/service/catalogue).
- **Preview listing** (header action, Profile tab) → public business page.

---

## 4. Functionality

### Header actions (`renderBusinessHeader`)
Context-gated per active sub-tab. CTAs verbatim, Title Case:

| Active tab | Buttons (verbatim) | onclick | Behaviour |
|-----------|--------------------|---------|-----------|
| Profile | "Preview listing" (`ti-eye`) | `viewPublicProfile()` | Opens the public business page. |
| Products | "Import CSV" (`ti-upload`) · **"Add product"** (`ti-plus`, primary) | `pr_importCSV()` · `pr_create()` | Add is **cap-guarded** (below). |
| Services | **"Add service"** (primary) | `sv_create()` | Cap-guarded. |
| Catalogue | **"Add catalogue"** (primary) | `cat_create()` | Cap-guarded. |

### Profile (`renderBusinessTab_Profile`)
Two-column wizard (`.bp-wizard`): left **step nav** (`.bp-steps`), right **step content**. Four steps
(`totalSteps = 4`), each with a status (`complete`/`partial`) computed by `computeProfileStepStatus(p)`:

1. **Business basics** (`ti-building-skyscraper`) — "Name, type, founder".
2. **Categories & coverage** (`ti-category`) — "What you sell, where".
3. **Verification documents** (`ti-shield-check`) — "GST, CIN, PAN".
4. **Public presence** (`ti-photo`) — "Logo, description, hours".

Sidebar progress block: **"Profile progress"** + `{completionPct}%` bar, `"{n} of 4 sections complete"`,
and a status pill — **"Live"** (`ti-check`) at 100% else **"Private"**. Step badges: **"Done"** /
**"Started"**. Reads/writes `window.sellerProfile` → **`ProfileService` / `BusinessService`** (spine: seller
profile). `setProfileStep(id)` switches the active step.

### Contact & forms (`renderBusinessTab_Contact`)
Header **"Contact & forms"** + sub *"Set how buyers reach your business and which enquiry forms appear on
your public profile — the same controls a shop has, applied to your business listing."*

- **"How can buyers reach your business?"** — sub *"Shown on your public business profile. A WhatsApp or
  phone number is strongly recommended."* Fields (`biz_updateContact(field,value)` — in-memory, no
  re-render to keep focus):
  - **WhatsApp business** `· recommended` — hint *"A dedicated WhatsApp Business number converts buyers
    faster than a regular phone line."*
  - **Phone** `· optional`, **Public email** `· optional`, **Website** `· optional`.
- **"Enquiry forms"** `· {n} on` — sub *"Pick which forms buyers can submit from your business profile.
  Each collects different details — turn on the ones that match how you sell."* Cards from
  `IB_ENQUIRY_FORMS`; the **contact** form is **locked on** ("Always on", `ti-lock`); others toggle via
  `biz_toggleEnquiryForm(id)` (in-place card update, no scroll jump). Response-time picker
  (`biz_setResponseTime`, default `4hr`). Writes `window.sellerProfile.enquiryForms` / `.responseTime` →
  **`BusinessService`**.

### Products · Services · Catalogue (list ↔ detail editors)
`renderBusinessTab_Products → renderProducts()`, `_Services → renderServicesList()`,
`_Catalogue → renderCataloguesList()`. When `…UI.view === 'detail'`, `renderBusiness()` bypasses the
header/tabs and renders the **full-bleed detail editor** (`renderProductDetailPage()` etc., with their own
breadcrumb back to **"Business"** via `setBusinessTab('profile')`). `setBusinessTab` always resets the
sub-UI to `view:'list'` (no stale detail). Data → **`ProductService` / `ServiceService` / `CatalogueService`**
(spine: listing content).

**Cap-guard (`ent_capGuard(feature)`) — the gating UI for Add.** Every create runs the guard first
(`pr_create`/`sv_create`/`cat_create` all `if (ent_capGuard(...)) return;`). It reads usage from
`window.products/services/catalogues` length and the cap from entitlements:

1. **Shop-without-Business guard** — if `ent.family === 'shop' && !u.hasBusinessProfile`, the add is blocked
   with `showToastWithAction`: title **"That lives on a Business profile"**, body *"Shops show a lightweight
   products & services list. To add full products, services & catalogues with quotations, register a
   Business profile."*, CTA **"Register business"** → `openRegisterBusiness()` (else `goSection('membership')`).
2. **At cap** — if `E.atCap(plan, feature, used)`, toast title **"You've reached your {feature} limit"**,
   body *"Your {plan label} plan includes {cap} {feature}. Upgrade to add more."*, CTA **"Upgrade plan"**
   → `goSection('plans')`. (Caps live: products 25/100/∞, services 10/50/∞, catalogues 2/10/∞ — **read via
   `limit`, never hardcoded**.)
3. **Under cap** → returns `false`, the editor opens. The guard **fails open** on any error (never blocks).

The **count chips** on each tab (`window.products.length`, etc.) give the seller a running usage signal that
foreshadows the cap.

### Analytics (`renderBusinessTab_Analytics`)
Listing performance. Empty: *"Add products, services or catalogues to see what's drawing views."* Perf cards
deep-link into the editor (`setBusinessTab('products'); …pr_openDetail(id)`). Depth grades by plan
(`analytics: basic→advanced→professional`). Reads aggregate listing stats → **`ProductService` /
`ServiceService` / `CatalogueService`** (analytics view).

---

## 5. Working flow

**A. Set up the listing (entry → core loop).**
1. Seller opens **Business** from nav ("My business"). Lands on **Profile** (or last `ib_seller_businessTab`).
2. Works the 4-step wizard (basics → categories → verification → presence); sidebar shows
   `{pct}%` and flips **"Private" → "Live"** at 100% — only then does the public listing go live.
3. Switches to **Contact & forms**; adds WhatsApp/phone, toggles which enquiry forms appear, sets response time.
4. **Add product / Add service / Add catalogue** — `ent_capGuard` runs:
   - under cap → full detail editor opens, save → item appears in the list, **count chip increments**.
   - at cap → **"You've reached your {feature} limit"** toast → **"Upgrade plan"** → **Plans** tab.
   - Shop seller without Business → **"That lives on a Business profile"** → **"Register business"**.
5. **Preview listing** (Profile header) opens the public business page to check buyer-facing result.

**B. Connection to other tabs + the shared spine.**
- Products/services/catalogues authored here are the **listing content buyers browse** → enquiries land in
  **Enquiries** (`connections`), flow to **Pipeline**, then convert to **Quotations** (line items pull from
  these listings). A write here surfaces on the public marketplace and downstream in the seller pipeline.
- Usage authored here drives the **meters on the Plans tab** (`IBEntitlements.meters`) — hitting a cap here
  routes the seller to **Plans** to upgrade (`goSection('plans')`).
- The **Analytics** sub-tab and the section **chip** both read the same product/service/catalogue counts.

**Exit.** Back to nav (another section), or the cap/Shop toasts forward to **Plans** / register-business.

---

## 6. Data · States · A11y · Copy

**Data (services → DataSource; never raw localStorage/fetch):**
`BusinessService` / `ProfileService` (profile + contact/forms, spine: `sellerProfile`), `ProductService` /
`ServiceService` / `CatalogueService` (listing content), `EntitlementService` wrapping `ib-entitlements.js`
(`of` / `limit` / `atCap` / `meters` for the `business-*` family). Sub-tab persistence (`ib_seller_businessTab`)
goes via the service/DataSource layer, not direct localStorage.

**States.**
- **Loading:** per-tab skeleton (standard skeleton); the tab strip + header render immediately.
- **Empty:** Products/Services/Catalogue list-empty offers its **Add** CTA; Analytics empty —
  *"Add products, services or catalogues to see what's drawing views."*; Profile incomplete → **"Private"**.
- **Locked / gated:** module not held → section hidden by `ib_sectionAllowed` (it does not appear in nav for
  a seller without a `business-*` plan); **at cap** → modal toast (`showToastWithAction`) with **"Upgrade
  plan"**; **Shop-without-Business** → **"Register business"** toast; `soon` tabs → `data-tip="Coming soon"`
  + `<span class="biz-tab-soon">Soon</span>`. No paid capability is silently hidden.
- **Error:** the cap-guard fails open (never blocks add on error); a failed sub-tab degrades to inline retry,
  the rest of the console renders.
- **Success:** save → item joins the list, count chip increments; profile at 100% → **"Live"** pill.

**A11y.** Landmarks: `header` / `aside` (nav) / `main` (`#dashMain`). One **H1** per view (`.biz-title`
"Your business"; Contact uses an H2). Active nav `.dn-item` = `aria-current`; tab strip buttons are real
`<button>`s. Locked/cap state exposed by **icon + text + `data-tip`** in the DOM (not colour-only):
`ti-lock` "Always on", `Soon` chip. Inputs `<label for>`-linked; toasts `aria-live="polite"`, focus-trapped,
Esc/backdrop close. Tab strip scrolls horizontally on narrow; touch targets ≥ 38px.

**Copy (verbatim).** "Your business"; "Profile · Contact & forms · Products · Services · Catalogue ·
Analytics"; "Preview listing"; "Import CSV"; "Add product" / "Add service" / "Add catalogue"; "Contact &
forms"; "How can buyers reach your business?"; "Enquiry forms"; "WhatsApp business · recommended"; "Always
on"; "Profile progress"; "{n} of 4 sections complete"; "Live" / "Private"; "Done" / "Started". Cap toast:
**"You've reached your {feature} limit"** / *"Your {plan} plan includes {cap} {feature}. Upgrade to add
more."* / **"Upgrade plan"**. Shop guard: **"That lives on a Business profile"** / *"Shops show a
lightweight products & services list. To add full products, services & catalogues with quotations, register
a Business profile."* / **"Register business"**. Brand voice lowercase-b "Interior bazzar"; British
"enquiry"; CTAs Title Case, no caps/"!".

---

**Build notes (React):** `components/SellerDashboard/Business/` (Profile wizard, Contact & forms,
Products/Services/Catalogue list↔detail editors, Analytics sub-components), driven by `?tab=business`
+ `#business/<sub>/<id>` deep links; uses **`BusinessService` / `ProductService` / `ServiceService` /
`CatalogueService`** for content and **`EntitlementService`** (wrapping `ib-entitlements.js`) for the
`ent_capGuard` add-gating, section visibility, and Plans-tab meters. Cross-refs:
[README.md](README.md) · [pages index](../README.md) ·
[modules-features-flow.md](../../modules-features-flow.md) · [style.md](../../style.md) ·
[copywriting.md](../../copywriting.md) ·
[Environment-Management-backend.md](../../../../docs/environment-and-backend.md) ·
[Integration.md](../../../../docs/integration.md) · prototype
`../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html`.
