# TAB: Settings — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: settings  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Cross-refs: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) ·
> style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) ·
> environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) ·
> integration = [../../../Integration.md](../../../Integration.md) ·
> prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html).

## 1. Page-tab

**Settings** is the account-preferences surface — the place a seller controls *how Interior bazzar behaves
for them*: notifications, preferences, privacy, and account lifecycle (deactivate / delete). It is **not**
profile-of-record (name/email/phone/city live on **Profile**) and **not** the security surface (password /
2FA / sessions live on **Password & security**) — Settings shows account fields read-only and points
across to those tabs.

- **Nav group:** `account` — the **"Profile & settings"** block (rendered last by `renderNav()`).
- **Label / icon:** "Settings" · `ti-settings` (`{id:'settings', label:'Settings', icon:'ti-settings', group:'account'}`).
- **Chip/count:** none — no live `ib_getSidebarChip` and no static `s.chip` for this id.
- **Default view?** No. The default section is `overview`; Settings is reached on demand.
- **Reached via:** prototype hash `#settings`; **in React `?tab=settings`** (mirror the hash router per the
  page brief). No nested deep-link sub-route — `dashState.subRoute` is unused here. `goSection('settings')`
  switches to it (and the Account card's "Manage in Profile" calls `goSection('profile')`).
- **Who sees it:** every authenticated seller (and a logged-in buyer-on-no-plan). `ib_sectionAllowed('settings')`
  is **universal** — not in `IB_SECTION_MODULE`, not a selling-module section. Always visible, never gated.

H1 is **"Settings"** with sub-title **"How Interior bazzar behaves for you — notifications, preferences, and privacy."**

## 2. Module

**Universal / account** — no subscription module, no plan-gating. Settings belongs to the account surface,
not to any selling module.

- **No entitlement reads.** There are **no** `IBEntitlements.of` / `.limit` / `.atCap` / `.meters` calls in
  `renderSettings()`, and no `IB_SECTION_MODULE` entry / `ib_sectionAllowed` module branch for `settings`.
  Nothing in this tab is a paid capability, so nothing here is signalled, capped, or upsold.
- **Plan-independence is the rule:** even a seller on `FREE` ("No active plan") gets the full Settings tab.
  Per the house rules, were a setting ever to become plan-gated it must be *signalled* (disabled + lock +
  tooltip / cap toast / "Soon" chip), never hidden — but in the current prototype no such gate exists.

## 3. Features

The tab is a two-column grid (`dm-grid-2`) of cards (verbatim card titles):

- **Account** (`ti-user-circle`) — read-only identity summary + cross-link to Profile.
- **Notifications** (`ti-bell`) — four alert toggles.
- **Preferences** (`ti-language`) — Language / Currency / Country selects.
- **Privacy** (`ti-shield`) — three visibility / personalisation toggles.
- **Danger zone** (`ti-alert-triangle`) — Deactivate account / Delete account permanently.

## 4. Functionality

All state for this tab lives in one store, `window.IBSettings` (prototype key `ib_seller_settings`), with
groups `notif` / `privacy` / `prefs` / `twofa` / `meta` and the `DEFAULTS` below. **In React this is read/written
through `SettingsService` → DataSource — never raw `localStorage`.** Toggles call `ib_toggleSetting(this,group,key)`
(flip + persist), selects call `ib_setPref(this,key)` (persist + toast). The `twofa`/`meta` groups are owned by
**Password & security**, not this tab.

### Account (read-only summary)

| Field | Source | Display |
|-------|--------|---------|
| Name | `dashState.user.name` | value or `—` |
| Email | `dashState.user.email` | value or `—` |
| Phone | `dashState.user.phone` | value or `—` |
| City | `dashState.user.city` | value or `—` |

- **Read-only here.** Footnote (verbatim): "Name & contact live on your profile." with `ti-info-circle`.
- **CTA:** "Manage in Profile" (`ti-user-circle`) → `goSection('profile')` (React: `?tab=profile`). Data via
  `ProfileService.get()` (the seller identity record); Settings only *reads* it.

### Notifications (4 toggles · group `notif`)

| Toggle title (verbatim) | Sub-copy (verbatim) | Key | Default |
|-------------------------|---------------------|-----|---------|
| New enquiry alerts | WhatsApp + email the moment a buyer sends you an enquiry | `enquiryAlerts` | on |
| Pending response reminders | Nudge me 24h before an enquiry's SLA expires | `pendingReminders` | on |
| Weekly performance report | Every Monday — enquiries, deals, win rate, ROI | `weeklyReport` | on |
| Marketing & product updates | New features, offers, tips and case studies | `marketing` | off |

Each is a `toggle-switch` button; flipping it persists immediately (no Save). Writes go through
`SettingsService.toggle('notif', key)`.

### Preferences (3 selects · group `prefs`)

| Label | Options (verbatim, in order) | Default | Key |
|-------|------------------------------|---------|-----|
| Language | English (India) · हिन्दी (Hindi) · मराठी (Marathi) | English (India) | `language` |
| Currency | ₹ Indian Rupee (INR) · $ US Dollar (USD) | ₹ Indian Rupee (INR) | `currency` |
| Country | India · UAE | India | `country` |

`onchange` → `ib_setPref` persists and fires the toast **"Preference saved"** (`success`).
React: `SettingsService.set('prefs', key, value)`.

### Privacy (3 toggles · group `privacy`)

| Toggle title (verbatim) | Sub-copy (verbatim) | Key | Default |
|-------------------------|---------------------|-----|---------|
| Public profile | Make your profile visible to other IB members | `publicProfile` | on |
| Show online status | Others can see when you're online | `onlineStatus` | on |
| Personalised recommendations | Use my activity to suggest better listings | `personalisedRecs` | on |

Same toggle mechanism / persistence as Notifications (`SettingsService.toggle('privacy', key)`).

### Danger zone (card styled red; title colour `#c2392c`)

- **"Deactivate account"** (`ti-archive`) → `deactivateAccount()` opens a warning modal titled
  **"Deactivate your account?"** Body (verbatim): *"Deactivating hides your profile and pauses notifications.
  Your data is preserved — you can reactivate any time by signing back in."* + *"Active enquiries will be paused.
  Sellers will not receive replies from you until you reactivate."* Buttons "Cancel" / "Deactivate".
- **"Delete account permanently"** (`ti-trash`) → `openDeleteAccountModal()` opens a danger modal titled
  **"Delete your account?"** Body lists what is removed (verbatim): *"All your enquiries and conversations with
  sellers"*, *"Saved items, recently viewed history, and preferences"*, *"Profile information and verification
  status"*, *"Any subscription — refunds are not automatic and follow our refund policy"*; warning band:
  *"This cannot be undone. Once deleted, the same email cannot be used to recover this account."* Requires typing
  **DELETE** (label "Type DELETE to confirm") to enable the **"Delete my account"** button; "Cancel" dismisses.
  Confirm → toast *"Account deletion request submitted — you will be signed out shortly"* then *"Demo — in
  production this would sign you out"*.

These lifecycle actions route through `AccountService.deactivate()` / `AccountService.requestDeletion()` → DataSource.

## 5. Working flow

**Adjust how IB behaves for me (core loop):**
1. Seller opens **Settings** from the nav (`?tab=settings`) → page renders the four cards from `IBSettings`/user.
2. Toggles a notification or privacy switch → `SettingsService.toggle(...)` persists instantly; the switch reflects state.
3. Changes a preference select (e.g. Currency) → `SettingsService.set('prefs',…)` persists → toast "Preference saved".
4. Done — no Save button; leaves by choosing any other nav section.

**Fix my identity (cross-tab):** Account card shows name/email/phone/city read-only → "Manage in Profile" →
**Profile** (`?tab=profile`) → edits via `ProfileService` → returning to Settings shows the updated values
(same `dashState.user`). Notification/privacy choices set here govern the rest of the console — e.g.
**"New enquiry alerts"** gates the WhatsApp+email ping fired when the **Connect** modal writes an enquiry to the
shared spine (`ib:sharedenquiry`) that lands in **Enquiries** → **Pipeline**; **"Public profile"** governs whether
the seller's listings/profile surface to other members. **Password & security** owns 2FA/sessions (the `twofa`/`meta`
groups), so Settings deliberately stops at the read-only Account card and links out.

**Exit / lifecycle:** Danger zone → Deactivate (reversible, pauses enquiries) or Delete (type-DELETE confirm,
deletion request) → signs the seller out of the console.

## 6. Data · States · A11y · Copy

- **Data:** `SettingsService` (groups `notif`/`prefs`/`privacy`; store key `ib_seller_settings`) for all
  toggles/selects; `ProfileService.get()` (read-only Account summary, owned by Profile); `AccountService`
  (deactivate / delete request). No entitlement service — universal tab. All via services → DataSource, never
  raw `localStorage`/`fetch`.
- **States:** *Loading* — card skeletons (nav renders immediately). *Empty* — n/a; Account fields fall back to
  `—` when missing. *Locked-gated* — **none** (no paid capability in this tab; nothing to upsell or cap).
  *Error* — a failed write degrades to inline retry; rest of console still renders; failed toggle reverts.
  *Success* — preference save → toast "Preference saved"; deactivate/delete → confirmation toasts above.
- **A11y:** landmarks `header`/`aside`/`main`; **one H1** "Settings"; the active nav `.dn-item` is `aria-current`.
  Each toggle is a real `<button>` with an accessible name (title + sub paired with the visual on/off, not
  colour-only); selects are `<label for>`-linked. Danger-zone modals are `aria-live="polite"`, focus-trapped,
  Esc/backdrop close; "Delete my account" stays `disabled` until "DELETE" is typed.
- **Copy (verbatim):** H1 "Settings" / sub "How Interior bazzar behaves for you — notifications, preferences,
  and privacy."; card titles "Account", "Notifications", "Preferences", "Privacy", "Danger zone"; "Name & contact
  live on your profile."; CTA "Manage in Profile"; toggle + sub copy per the §4 tables; "Preference saved";
  "Deactivate account" / "Delete account permanently"; modal titles "Deactivate your account?" / "Delete your
  account?"; "Type DELETE to confirm"; "Delete my account"; "Account deletion request submitted — you will be
  signed out shortly". British "enquiry"; lowercase-b "Interior bazzar"; CTAs Title Case.

**Build notes (React):** `components/DashboardSeller/Settings/` — `SettingsService` (notif/prefs/privacy + account
lifecycle), reading `ProfileService` for the Account summary and `goSection('profile')` to cross-link; no
`EntitlementService` (universal tab); all data via services → DataSource.
