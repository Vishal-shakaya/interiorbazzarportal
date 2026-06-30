# TAB: Settings — Buyer Dashboard

```
PARENT: README.md  ·  VIEW id: settings  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-buyer.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) · modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) · style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) · environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) · integration = [../../../Integration.md](../../../Integration.md) · prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html)

## 1. Page-tab
**Settings** is the buyer's account-control surface — where they edit their identity, tune which
emails reach them, set locale preferences, control privacy, and (last resort) deactivate or delete the
account. Rendered by `renderSettings()`.

- **Nav placement:** group `account` ("Profile & settings"), label **"Settings"**, icon `ti-settings`,
  no chip/count.
- **Default view?** No. The buyer dashboard default is **My connections** (`connections`); `settings` is
  reached on demand.
- **How it's reached:** the dash-nav button `goSection('settings')` (→ React `?tab=settings`,
  `replace:true`); also from the topbar **avatar menu** (which jumps to profile / membership / settings),
  and the profile tab's **"Edit profile"** action. Hash `#settings` in the prototype maps to
  `?tab=settings`. No deep-link sub-route — it is a single scrolling form view.
- **Who sees it:** any signed-in buyer. Page is auth-gated (logged-out → `auth.html`; signed-in seller →
  `dashboard-seller.html`); within the dashboard every buyer sees Settings — there is no per-tab gating.
- **Heading / breadcrumb (verbatim):** breadcrumb "Dashboard › Settings"; H1 **"Settings"**; sub
  **"Manage your account information, notifications, and preferences."**

## 2. Module
**Universal / account.** Settings is not a subscription module and is **not plan-gated** — it belongs to
every buyer regardless of membership. There are no entitlement reads, no `IB_SECTION_MODULE` /
`ib_sectionAllowed` gate, no caps, and no upsell/lock states on this tab. (Plan-gating, entitlement
meters and `IBEntitlements.of/.limit/.atCap/.meters` are seller-dashboard concerns and do not apply
here.) The one membership adjacency: the Delete-account modal notes "Any subscription — refunds are not
automatic and follow our refund policy"; the upgrade pitch itself lives in the separate **Membership**
tab.

## 3. Features
Two-column grid (`.dm-grid-2`) of cards. Discrete sub-areas, verbatim from the prototype:

- **Account information** (`ti-user-circle`)
- **Email notifications** (`ti-bell`)
- **Preferences** (`ti-language`)
- **Privacy** (`ti-shield`)
- **Danger zone** (`ti-alert-triangle`)

## 4. Functionality
All reads/writes go through services → DataSource (never raw `localStorage`/`fetch`). The account form
hydrates from the signed-in user (`dashState.user`, sourced from auth state); persistence is via
`ProfileService` / `SettingsService` over the `ib_auth` user spine.

### Account information
Edits the buyer's identity. Visible-on-public-profile microcopy is verbatim.

| Control | Type | Source / behaviour |
|---|---|---|
| **Full name** | text input | prefilled `u.name` |
| **Email address** | text input | prefilled `u.email` |
| **Phone** | text input | prefilled `u.phone` |
| **City** | text input | prefilled `u.city` |
| **About me** | textarea | prototype seed "I'm a founder building Feelsafe Technology and Interior bazzar."; help text **"Visible on your public profile"** |
| **"Save changes"** | primary button (`ti-check`) | writes via `ProfileService.update()` → DataSource (`ib_auth` user); on success → `showToast(..., 'success')` |

The same user model feeds the **My profile** tab — edits here surface there.

### Email notifications
Four `.form-toggle` switches; the title/sub copy is verbatim. Reads/writes notification prefs via
`SettingsService` (spine: `ib_auth` user prefs). Default on/off states match the prototype.

| Toggle title | Sub copy | Default |
|---|---|---|
| **Connection status updates** | "When sellers accept or decline your enquiries" | on |
| **New messages** | "Get notified when someone replies to your enquiry" | on |
| **Weekly digest** | "Top picks and trending items in your interests" | off |
| **Marketing & offers** | "Plan upgrades, special offers, product updates" | off |

### Preferences
Locale selects (`.form-select`), persisted via `SettingsService`:

| Field | Options (verbatim) |
|---|---|
| **Language** | English (India) · हिन्दी (Hindi) · मराठी (Marathi) |
| **Currency** | ₹ Indian Rupee (INR) · $ US Dollar (USD) |
| **Country** | 🇮🇳 India · 🇦🇪 UAE |

### Privacy
Three `.form-toggle` switches (all default **on**), persisted via `SettingsService`:

| Toggle title | Sub copy |
|---|---|
| **Public profile** | "Make your profile visible to other IB members" |
| **Show online status** | "Others can see when you're online" |
| **Personalised recommendations** | "Use my activity to suggest better listings" |

("Public profile" off should suppress the public profile that the **My profile** tab links to;
"Personalised recommendations" governs the activity-driven suggestions surfaced elsewhere.)

### Danger zone
Red-tinted card; two destructive actions, each opening a confirm modal first (never one-click).

| Control | Opens | Modal copy (verbatim) | On confirm |
|---|---|---|---|
| **"Deactivate account"** (`ti-archive`) | `deactivateAccount()` | title **"Deactivate your account?"** · body "Deactivating hides your profile and pauses notifications. Your data is preserved — you can reactivate any time by signing back in." · "Active enquiries will be paused. Sellers will not receive replies from you until you reactivate." · buttons **"Cancel"** / **"Deactivate"** | `showToast('Account deactivated — you will be signed out', 'info')` → sign out via auth service |
| **"Delete account permanently"** (`ti-trash`) | `openDeleteAccountModal()` | title **"Delete your account?"** · "This will permanently delete your Interior bazzar account, including:" — list: "All your enquiries and conversations with sellers" / "Saved items, recently viewed history, and preferences" / "Profile information and verification status" / "Any subscription — refunds are not automatic and follow our refund policy" · warning "This cannot be undone. Once deleted, the same email cannot be used to recover this account." · **"Type DELETE to confirm"** input (button stays disabled until value === `DELETE`) · buttons **"Cancel"** / **"Delete my account"** | `showToast('Account deletion request submitted — you will be signed out shortly', 'info')` |

Both are account-lifecycle writes through the auth/account service → DataSource.

## 5. Working flow
1. **Entry:** buyer opens **Settings** from the dash-nav, the avatar menu, or profile's "Edit profile" →
   `?tab=settings`; the form hydrates from the signed-in user (auth state).
2. **Edit identity:** change Full name / Email / Phone / City / About me → **"Save changes"** → success
   toast. The shared user model updates, so the **My profile** tab reflects it on next render.
3. **Tune notifications:** flip the four email toggles → persisted via `SettingsService`. These govern the
   alerts the buyer gets for the **Connections** spine (e.g. "Connection status updates" / "New messages"
   fire when a seller — over in the seller **Enquiries** dashboard — accepts/declines or replies to an
   enquiry written to the shared `ib:sharedenquiry` spine).
4. **Set preferences / privacy:** pick language/currency/country; toggle Public profile, Show online
   status, Personalised recommendations. "Public profile" off hides the profile that **My profile**
   exposes; "Personalised recommendations" governs activity-driven suggestions.
5. **Exit (normal):** navigate to another tab (Connections / Saved / Membership) via dash-nav; URL swaps
   with `replace:true`, no history stacking.
6. **Exit (lifecycle):** Deactivate → confirm → toast → signed out (data preserved, enquiries paused).
   Delete → confirm by typing **DELETE** → request submitted → signed out. Both end the buyer's session
   and, downstream, pause their presence across the shared spine that the seller dashboard reads live.

## 6. Data · States · A11y · Copy
**Data — services + spine groups:** `ProfileService` / `SettingsService` → `ib_auth` user + prefs
(account info, notifications, preferences, privacy); account-lifecycle (deactivate/delete) via the
auth/account service. All via services → DataSource; no raw `localStorage`/`fetch`. No entitlement reads.

**States:**
- **Loading:** form skeleton (field rows, toggle rows) while the user model hydrates — not a bare spinner.
- **Empty:** n/a — the form is always populated from the signed-in user; unset fields render blank inputs.
- **Locked / gated:** none — universal account tab, no plan-gating, no caps.
- **Error:** a failed save degrades to a quiet inline retry; nav/chrome stay usable.
- **Success:** "Save changes" → success toast + re-render; toggles persist optimistically; destructive
  actions confirm first (Deactivate modal; Delete requires typing **DELETE**).

**A11y:** landmarks — dashboard `header`, `<aside class="dash-nav">` as the view nav, `<main>`. Exactly
**one H1** = `.dm-title` "Settings". Current nav item carries `aria-current` (prototype `.on` → add ARIA).
Every input/select/textarea has a `<label class="form-label">`; toggles are real `<button>` switches —
add `role="switch"` + `aria-checked` and an accessible name (don't rely on colour for on/off). Help text
("Visible on your public profile") associated via `aria-describedby`. Modals (deactivate, delete)
`role="dialog"` + `aria-modal`, focus-trapped, Esc + backdrop close, focus returns to trigger; the
DELETE-confirm input gates the destructive button. Danger-zone state conveyed by icon + text, not colour
alone.

**Copy (verbatim):** sub "Manage your account information, notifications, and preferences." · card titles
"Account information" / "Email notifications" / "Preferences" / "Privacy" / "Danger zone" · "About me",
help "Visible on your public profile" · CTA **"Save changes"** · toggle titles/subs and select options as
tabled in §4 · danger CTAs **"Deactivate account"**, **"Delete account permanently"** · modal titles
"Deactivate your account?" / "Delete your account?", confirm prompt "Type DELETE to confirm", buttons
"Cancel" / "Deactivate" / "Delete my account" · toasts "Account deactivated — you will be signed out" /
"Account deletion request submitted — you will be signed out shortly". Brand lowercase-b **"Interior
bazzar"**; British **"enquiry/enquiries"**; CTAs Title Case (no caps, no "!").

---

**Build notes (React):** `components/BuyerDashboard/Settings/` (Settings view + `AccountInfoForm`,
`EmailNotifications`, `Preferences`, `Privacy`, `DangerZone` sub-cards + Deactivate/Delete confirm
modals); uses `ProfileService` / `SettingsService` and the auth/account service, all via DataSource.
