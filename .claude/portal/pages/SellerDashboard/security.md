# TAB: Password & security — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: security  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Cross-refs: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) ·
> style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) ·
> environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) ·
> integration = [../../../Integration.md](../../../Integration.md) ·
> prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html).

---

## 1. Page-tab

**What it is.** The seller's account-security console: change password, manage 2-factor
authentication, review active sessions, and see recent security activity. It is the last item in the
seller dashboard nav.

- **Nav group:** `account` — group label **"Profile & settings"** (the ACCOUNT block).
- **Nav label:** **"Password & security"** (`renderSecurity()` → `<h1 class="dm-title">Password & security</h1>`).
- **Icon:** key/shield family (`ti ti-key`, `ti ti-shield-lock`) per card titles; the nav item uses the
  section's `s.icon` from `dashSections`.
- **Chip / count:** none (no `ib_getSidebarChip('security')`, no static `s.chip`).
- **Default view?** No. The dashboard default is `overview`; `security` is reached only on demand.
- **How it's reached.** Prototype routes by hash: `goSection('security')` sets
  `window.location.hash = 'security'` → `renderDash()` → `case 'security': return renderSecurity();`.
  **In React, mirror as `?tab=security`** via `useSearchParams` (per the page brief); keep the
  `#section/sub` nested form available though this tab has no sub-route.
- **Who sees it.** Universal — every authenticated user. `ib_sectionAllowed('security')` is true for all
  (no `IB_SECTION_MODULE` entry, not in `ib_anySellingModule()` set). A buyer-only account resolving to
  `FREE` still sees it.

## 2. Module

**Universal / account.** This tab is **not** module-gated and belongs to no subscription. It carries no
plan-gating, no caps, no meters, and no upsell.

- No entitlement reads. There is **no** `IBEntitlements.of` / `.limit` / `.atCap` / `.meters` call in
  `renderSecurity()` or any of its handlers (confirmed: `ib-entitlements.js` has no
  `security`/`2fa`/`password` keys).
- No `IB_SECTION_MODULE['security']` mapping → `ib_sectionAllowed('security')` returns true universally.
- All state persists through the settings store **`IBSettings`** (groups `twofa` and `meta`), not through
  any plan. In React this is the **`SecurityService` → DataSource** seam — never raw `localStorage`.

> Because this is universal, the SELLER gating-UI standard (disabled+lock / cap toast / "Soon" /
> upsell card) does **not** apply here — there is no paid capability on this tab to signal.

## 3. Features

Verbatim sub-areas (each a `.dm-card` inside `dm-grid-2`):

- **Change password** (`ti ti-key`)
- **Two-factor authentication** (`ti ti-shield-lock`) — SMS verification · Email verification ·
  Authenticator app
- **Active sessions** (`ti ti-device-mobile`)
- **Recent activity** (`ti ti-history`)

Header (verbatim): H1 **"Password & security"** · sub **"Keep your account secure with a strong
password and 2-factor authentication."**

## 4. Functionality

### Change password
What it does: validates and saves a new password, then stamps "Password last updated".

| Control | Verbatim | Behaviour |
|---|---|---|
| Current password | label "Current password", `type=password`, placeholder `••••••••` | required |
| New password | label "New password", help **"At least 8 characters, with one uppercase and one number"** | required; must satisfy `len ≥ 8 && [A-Z] && [0-9]` |
| Confirm new password | label "Confirm new password" | must equal New |
| Submit | **"Update password"** (`.dm-action primary`, `ib_updatePassword`) | runs validation |
| Reset link | "Forgot your password? **Reset via email →**" | toast **"Password reset link sent to your email"** (success) |

Inline error copy (verbatim, `[data-pw-err]`): "Enter your current password." · "Enter a new
password." · **"New password needs at least 8 characters, one uppercase letter and one number."** ·
"New password must be different from your current one." · "New password and confirmation do not match."
On success: clears all three fields, writes `meta.passwordUpdatedISO = now`, toast **"Password
updated"** (success), re-renders. Data: **`SecurityService.updatePassword(...)`** → `meta` group on the
spine; the password value itself is never stored (only the updated-at stamp).

### Two-factor authentication
Three independent toggles (`form-toggle`, `ib_toggle2FA(this, method)`), each `on` when
`IBSettings.on('twofa', method)`:

| Toggle | Sub-copy (verbatim) | Enable flow |
|---|---|---|
| **SMS verification** | "Receive a code via SMS when logging in from a new device" | 2-step modal **"Set up SMS verification"** — Mobile number → "Send code" → "Enter the 6-digit code we sent" (help "Demo: any 6 digits will verify.") → **"Verify & enable"**; toast **"SMS verification enabled"** |
| **Email verification** | "Receive a confirmation email for new device logins" | instant; toast **"Email verification enabled"** |
| **Authenticator app** | "Use Google Authenticator or similar for code generation" | modal **"Set up authenticator app"** — QR + key, "6-digit code" (help "Demo: any 6 digits will verify.") → **"Verify & enable"**; toast **"Authenticator app enabled"** |

Disable flow (any method already on): confirm modal **"Turn off {label}?"** — body "This lowers your
account security. You can turn it back on at any time." — buttons "Keep it on" / **"Turn off"**; on
confirm toast **"Two-factor method turned off"** (info). SMS modal errors (verbatim): "Enter a valid
mobile number." · "Enter the 6-digit code." Data: each toggle writes `twofa.{sms|email|authenticator}`
via **`SecurityService.set2FA(method, on)`** → `twofa` group.

### Active sessions
What it does: lists signed-in devices and lets the user revoke them. Prototype rows are illustrative:
**"MacBook Pro · Chrome"** — "New Delhi · Active now" — badge **CURRENT**; **"iPhone · IB app"** —
"New Delhi · 2 hours ago" — per-row sign-out (`conn-btn`, `signOutDevice`, title "Sign out") → toast
**"Device signed out"** (success), row dims to 0.5 opacity. Footer button **"Sign out all other
devices"** (`signOutAllDevices`) opens modal **"Sign out all other devices?"** — body "This will sign
you out everywhere except this device. Use this if you suspect someone else has access to your
account." — buttons "Cancel" / **"Sign out all"** (`confirmSignOutAll`). Data:
**`SecurityService.sessions()` / `.signOut(id)` / `.signOutAllOthers()`** → sessions spine.

### Recent activity
Read-only security feed (`activity-feed`). Verbatim rows: **"Logged in from Chrome on MacBook"** —
"Just now · New Delhi" (`ti ti-login`); **"Password last updated"** — time from
`ib_passwordUpdatedLabel()` (`ti ti-key`). The label is relative ("Just now", "{n} min ago",
"{n} hrs ago", "{n} days ago", else date), falling back to **"3 months ago"** when no stamp exists; it
updates live the moment Change password succeeds. Data:
**`SecurityService.activity()`** (reads `meta.passwordUpdatedISO`) → audit/meta spine.

## 5. Working flow

**Flow A — change password.**
1. Seller opens the avatar menu / nav → **Password & security** (`?tab=security`).
2. Fills Current / New / Confirm; client validates against "At least 8 characters, with one uppercase
   and one number".
3. **"Update password"** → `SecurityService.updatePassword` writes `meta.passwordUpdatedISO`, fields
   clear, toast **"Password updated"**.
4. **Recent activity** re-renders → "Password last updated" flips to **"Just now"** — same-tab feedback,
   no navigation.

**Flow B — enable 2FA.**
1. In **Two-factor authentication**, toggle **SMS verification** → 2-step modal → verify code →
   toast **"SMS verification enabled"**; toggle persists `on` (survives re-render via
   `ib_tg('twofa','sms')`).
2. (Or Email = instant; Authenticator = QR modal.) Disabling routes through the
   **"Turn off {label}?"** confirm so security is never lowered by a stray tap.

**Flow C — revoke a session.**
1. **Active sessions** → per-row "Sign out" → toast **"Device signed out"**; or **"Sign out all other
   devices"** → confirm modal → **"Sign out all"**.

**Connections to other tabs / spine.** Account-local: this tab does **not** feed the enquiry →
pipeline → quotation spine. It sits beside **Profile** (identity) and **Settings**
(notifications/preferences/privacy) — Settings even cross-links "Manage in Profile". Password-update and
sign-out events are the security analogue of the **Recent activity** (`activity`) audit log; the
"Password last updated" stamp written here is the cross-section signal surfaced in this tab's own feed.

## 6. Data · States · A11y · Copy

**Data.** Single service **`SecurityService`** wrapping the `IBSettings` store →
DataSource (local-first → API later, unchanged components). Spine groups: **`twofa`**
(`sms`/`email`/`authenticator` booleans) and **`meta`** (`passwordUpdatedISO`); sessions via the
sessions spine. No entitlement read, no plan number. Never raw `localStorage`/`fetch`.

**States.**
- *Loading:* card skeletons in `dm-grid-2` (standard skeleton, not a spinner); nav renders immediately.
- *Empty:* not a primary state — 2FA defaults off (toggles show off), Recent activity always has at
  least the login + "Password last updated" rows (falls back to "3 months ago").
- *Locked/gated:* **N/A** — universal tab, no paid capability, no upsell, no cap toast.
- *Error:* inline `[data-pw-err]` / `[data-2fa-err]` validation strings (quoted §4); a failed save
  degrades to inline retry without taking down the rest of the console.
- *Success:* toasts "Password updated" / "SMS verification enabled" / "Email verification enabled" /
  "Authenticator app enabled" / "Two-factor method turned off" / "Device signed out" / "Password reset
  link sent to your email".

**A11y.** Landmarks `header`/`aside`/`main`; this tab owns the single **H1** "Password & security"
(`.dm-title`), no skipped levels. Active nav `.dn-item` is `aria-current`; nav items are real
`<button>`s. Every input is `<label>`-linked (Current/New/Confirm, Mobile number, 6-digit code).
Toggles are operable buttons; modals are `aria-live="polite"`, focus-trapped, Esc/backdrop close.
Status is conveyed by **icon + text**, not colour: the **CURRENT** session pairs a word with the green
pill; toggle on/off state has a visible position, not colour only.

**Copy (verbatim).** H1 "Password & security" · sub "Keep your account secure with a strong password
and 2-factor authentication." · password help "At least 8 characters, with one uppercase and one
number" · CTAs "Update password", "Reset via email →", "Verify & enable", "Send code", "Sign out all
other devices", "Sign out all", "Turn off", "Keep it on" · toggles "SMS verification" / "Email
verification" / "Authenticator app" · disable modal "Turn off {label}?" → "This lowers your account
security. You can turn it back on at any time." All CTAs Title Case, no ALL-CAPS, no "!"; lowercase-b
"Interior bazzar"; British "enquiry" elsewhere in the console.

---

**Build notes (React):** `components/SellerDashboard/Security/` (`Security.tsx` + `Security.module.css`,
ordered in the `account` group of `pages/DashboardSeller`); uses a single **`SecurityService`**
(password update + `twofa` toggles + sessions + activity, all via DataSource) — **no** EntitlementService
read (this tab is universal).
