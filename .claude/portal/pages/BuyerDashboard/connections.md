# TAB: My connections — Buyer Dashboard

```
PARENT: README.md  ·  VIEW id: connections  ·  GROUP: main  ·  PROTOTYPE: pages/dashboard-buyer.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) ·
> style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) ·
> environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) ·
> integration = [../../../Integration.md](../../../Integration.md) ·
> prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html)

---

## 1. Page-tab

**My connections** is the buyer's working home — a 3-pane messaging workspace where each enquiry the
buyer sent to a seller becomes a **tracked conversation**. It is the place an enquiry → conversation →
deal-close lifecycle plays out from the buyer's side.

- **Nav group / label / icon / chip:** group `main` ("My account"); nav label **My connections**;
  icon `ti-send`; the nav item carries a **chip `2`** (unread/active count badge in `dashSections`).
- **Default view?** **Yes — this is the default working view.** (Note: the prototype's `dashState.section`
  default string is `'saved'`, but the README and brief designate **`connections` as the default landing
  view**; the React port lands on `?tab=connections`.) When this view renders, `dash-main` is swapped to a
  full-bleed workspace (`dash-main conn-workspace-mode`).
- **How it's reached:** `?tab=connections` (prototype `goSection('connections')`). A selected connection is
  a **deep-link sub-route**: prototype hash `#connections/IB-2891` → React `?tab=connections&id=IB-2891`
  (the selected id is the second search param, `subRoute`). Switching views uses `replace:true` so it does
  not stack history.
- **Who sees it:** every logged-in **buyer**. The page guard redirects logged-out → `auth.html` and
  logged-in **sellers** → `dashboard-seller.html`; there is no per-tab gating beyond that.

## 2. Module

**Buyer-universal / account.** My connections is **not** behind any module, plan, or subscription — it is
core buyer account functionality available to every signed-in buyer at full depth. There are **no
entitlement reads, no `IB_SECTION_MODULE` / `ib_sectionAllowed` gate, no caps, and no upsell cards** on
this tab. (Plan-gating and entitlement reads apply only to the seller dashboard; the buyer's only upgrade
surface is the separate **Membership** tab, which pitches buyer→seller plans.) The only visibility rule is
the page-level buyer auth guard from §1.

## 3. Features

Discrete sub-areas in the connections workspace (verbatim names from the prototype):

- **Connections list** (left pane, `.cw-list`) — title **"Connections"** + count.
- **Enquire** button (`.cw-new-btn`) → **"Send a new enquiry"** flow.
- **Search** (`#cwSearch`) — "Search by name, subject…".
- **Status filter chips** (`.cw-fchip`): **All / Pending / Awaiting / Active / Declined / Expired / Closed**.
- **Label filter chips** (`.cw-fchip-label`, user-defined labels).
- **Conversation thread** (middle pane, `.cw-chat`) — header, contact actions, menu, enquiry summary
  strip, labels strip, message thread, composer.
- **Contact actions** — **WhatsApp** / call / email / **Close**.
- **Detail menu** (`.detail-menu`): Copy link to enquiry · Mark as unread · Export conversation · Manage
  labels · Manage templates · Report this enquiry · Delete enquiry.
- **Reply composer** (`renderReplyComposer`) — **Quick replies** templates panel, slash palette, attach,
  "Save current as template", **Send**.
- **Activity timeline** (right pane, `.cw-timeline`) — original enquiry brief + event timeline.

## 4. Functionality

### Connections list (`.cw-list`)
Renders all of the buyer's connections. Reads **`EnquiryService.listForBuyer()`** (spine group `enquiries`,
`ib:sharedenquiry`). Header shows title **"Connections"** and `.cw-list-count` = total. Each row
(`.cw-row`, `renderCwRow`) shows avatar/initials, seller name (`co.to`), time, a last-message preview
(prefixed **"You: "** when the buyer sent it, "(attachment)" when bodyless), a `.cw-row-status` pill, and
any label chips. Clicking a row = `selectConnection(id)` → sets `subRoute`, updates the URL, loads the
thread, focuses the composer, and (mobile) hides the list.

### Enquire (primary CTA)
**"Enquire"** (`.cw-new-btn`, `ti-send`, tip **"Send a qualified enquiry to a seller"**) →
`openNewEnquiryModal()`. Modal title **"Send a new enquiry"**; search **"Search sellers, businesses,
architects…"**; a **"From your activity"** recipient list (saved + recently-viewed); footer **"Don't see
who you're looking for? Browse all sellers →"** (→ Home). Picking a recipient opens the brief form, then
writes a new enquiry via **`EnquiryService`** → DataSource (surfaces in the seller's Enquiries). Routes a
qualified enquiry to **exactly one** seller.

### Search & filters
| Control | Behaviour |
|---------|-----------|
| Search `#cwSearch` | `onConnSearch` — soft-updates list body only (keeps input focus); matches `to` (name) / `subject` / `id`, case-insensitive. |
| Status chips `.cw-fchip` | `setConnFilter(key)`. Each chip is **only rendered when its count > 0** and carries a `.cw-fchip-count` badge. **All** chip also clears the label filter. |
| Label chips `.cw-fchip-label` | `renderLabelFilterChips()` after a `.cw-filter-sep`; `setLabelFilter(id)` toggles `connLabelFilter`. Only labels in use (or the active one) show. |

Status-chip → connection-status mapping (verbatim):

| Chip | `connFilter` key | Icon | Maps to status |
|------|------------------|------|----------------|
| **All** | `all` | — | everything |
| **Pending** | `pending` | `ti-clock` | `pending` |
| **Awaiting** | `viewed` | `ti-eye` | `viewed` |
| **Active** | `active` | `ti-message-circle` | `accepted` + `active` |
| **Declined** | `declined` | `ti-x` | `declined` |
| **Expired** | `expired` | `ti-clock-exclamation` | `expired` |
| **Closed** | `closed` | `ti-archive` | `closed` |

Empty filter/search → icon + **"No matches"** / "Try a different filter or search term."

### Conversation thread (`.cw-chat`, `renderCwChat`)
- **Header:** avatar, seller name + verified tick (`ti-rosette-discount-check-filled`, title "IB verified"),
  `.cw-row-status` pill, enquiry id (e.g. `IB-2891`) + "Enquiry {time}".
- **Contact actions** (`.cw-contact-actions`) — revealed only when status is **active/accepted or closed**
  (`showPhone`): **WhatsApp** (`.cw-contact-btn.whatsapp`, `openWhatsApp(phone,id)`, tip "Open WhatsApp ·
  {phone}"), **call** (`tel:`, icon-only), **email** (`mailto:`, icon-only). Otherwise a locked chip
  **"Contact hidden"** (tip **"Phone & email reveal once the seller accepts your enquiry"**). **Close**
  button (`openCloseModal`) shows when not already closed (tip "Mark this enquiry as closed").
- **Menu** (`.cw-menu-btn` → `.detail-menu`), items verbatim: **"Copy link to enquiry"**, **"Mark as
  unread"**, **"Export conversation"** · **"Manage labels"**, **"Manage templates"** · **"Report this
  enquiry"**, **"Delete enquiry"** (danger). Writes go via the relevant service → DataSource.
- **Enquiry summary strip** (`.cw-enq-strip`): product / quantity / timeline / city.
- **Labels strip** (`.cw-chat-labels`): applied label chips + **"Add label"** picker (`toggleLabelPicker`),
  writing label changes via `EnquiryService` → DataSource.
- **Thread** (`.conn-thread-scroll`): `.msg-row` bubbles (mine/theirs, with attachments + download). When
  no messages: **"No replies yet"** with status-specific copy (e.g. pending → "Waiting for {seller} to
  respond. They have 72 hours.").

### Reply composer (`renderReplyComposer`, active connections only)
Rendered only when status is active/accepted (`canMessage`); non-active statuses show a `.thread-footer`
explainer instead (see Working flow). Controls:
- **Quick replies** templates panel — header **"Quick replies"**, search **"Search templates…"**, manage
  gear, close. Category tabs (verbatim): **All / My templates / Greetings / Follow-up / Info request /
  Quote / Closing**. Built-in templates merge with the buyer's **My templates** (`userTemplates`).
- **Slash palette** — type `/` to open; `<kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> insert
  <kbd>esc</kbd> close`.
- **Textarea** — placeholder **"Type your reply… (press / for quick replies)"**.
- **Attach** — **"Attach file (up to 1 GB)"** (`handleFileSelect`, staged with upload progress; over-limit
  → toast "{name} exceeds 1 GB limit").
- **Save current as template** (`ti-bookmark`, "Save current text as a quick reply template").
- Hint: "Press `/` for quick replies · `Ctrl+↵` send".
- **Send** (`.msg-send-btn`, `sendMessage(id)`) → writes a message via **`EnquiryService`** → DataSource.

### Close enquiry (`openCloseModal`)
Modal **"Close this enquiry"** — "How did this enquiry with **{seller}** end? This helps us improve future
matches for you." Radio outcomes (verbatim): **"Deal won — I purchased from this seller"** (reveals
optional **"Deal value (optional)"** input, placeholder "e.g. ₹38L"), **"Lost — I went with another
seller"**, **"Not pursuing this seller"**. Footer: **Cancel** / **"Close enquiry"** (disabled until an
outcome is chosen) → `submitClose` writes the close via `EnquiryService` → DataSource.

### Activity timeline (`.cw-timeline`, `renderCwTimeline`)
Title **"Activity"**, sub "Enquiry brief & timeline". Shows the **Original enquiry · sent {time}** brief
body, then a **Timeline** feed of `ti`-iconed events (`co.timeline`). Read-only. With no selection:
**"Timeline"** + "Select a conversation to view its history." Hidden ≤1100px.

## 5. Working flow

**Core loop — track an enquiry to a deal:**
1. Buyer lands on the dashboard → **My connections** (default, `?tab=connections`); the workspace lists
   their enquiries newest-first.
2. Buyer narrows with a **status chip** (Pending / Awaiting / Active / …), a **label chip**, or **search**.
3. Buyer selects a `.cw-row` → `?tab=connections&id=IB-2891`; the **thread** + **Activity** timeline load.
4. While **Pending/Awaiting**, the composer is replaced by a `.thread-footer` explainer (e.g. "Waiting for
   {seller} to respond. They have 72 hours…"); **contact details stay hidden** ("Contact hidden").
5. When the **seller accepts** (a write in the seller's Enquiries tab → shared `enquiries` spine), the
   connection flips to **Active**: the composer appears and **WhatsApp / call / email** reveal — the buyer
   replies, uses **Quick replies** templates, and attaches files. Each **Send** writes through
   `EnquiryService` → DataSource and surfaces live in the seller's thread.
6. Buyer organises with **labels** ("Add label") and saves reusable **templates**.
7. **Exit:** buyer **Closes** the enquiry with an outcome (Deal won / Lost / Not pursuing) → a success
   toast, the connection moves to **Closed**, and the outcome feeds match quality.

**Send a fresh enquiry:** **Enquire** → "Send a new enquiry" → pick a recipient from activity (or Browse
all sellers) → brief → write via `EnquiryService`. The new connection appears here and as a new enquiry in
the **seller dashboard**.

**Connections to other tabs / shared spine:**
- **Connect modal** (across the platform) and seller **Enquiries** write the **same `enquiries` spine
  (`ib:sharedenquiry`)** this tab reads — enquiry ↔ pipeline ↔ quotation is one shared thread; a buyer
  reply here appears live in the seller dashboard and vice-versa.
- New-enquiry recipients are sourced from **Saved items** + **Recently viewed**; empty states route to
  **Home**.
- **Manage labels / templates** open shared modals reused by the composer and menu.

## 6. Data · States · A11y · Copy

**Data:** `EnquiryService.listForBuyer()` (rows) + `EnquiryService.get(id)` (thread); writes — send
message, mark read/unread, close, add/remove labels, save/manage templates, report/delete enquiry, create
new enquiry — all via **services → DataSource**, spine group **`enquiries` (`ib:sharedenquiry`)**. New-enquiry
recipients also read `SavedService` / `RecentlyViewedService`. **Never** raw `localStorage`/`fetch`.

**States:**
- **Loading:** list-row + thread skeletons (not a bare spinner).
- **Empty:** no connection selected → icon + **"No conversation selected"** / "Pick a connection from the
  left… or send a new enquiry to start one." + **"Send your first enquiry"**. List filter/search →
  **"No matches"** / "Try a different filter or search term." No replies yet → status-specific waiting copy.
- **Error:** failed view degrades to a quiet inline retry; nav/chrome stay usable.
- **Success:** message sent / labels updated / enquiry closed → `showToast(…, 'success')` and re-render;
  destructive actions (delete enquiry) confirm first.
- (No locked/gated/cap states — buyer-universal tab.)

**A11y:** landmarks — dashboard `header`, `<aside class="dash-nav">` as nav, `<main>`; workspace
list/chat/timeline as `aside`/`section`/`aside`. **One H1** per view (the list's "Connections" labels its
region via `aria-labelledby`). Current nav item carries **`aria-current`** (prototype `.on`). Thread is a
labelled log (seller + enquiry id). Status conveyed by **icon + text**, not colour alone. Icon-only buttons
(call, email, menu, attach) get `aria-label`; decorative `ti` icons `aria-hidden`. Composer textarea
labelled; slash palette keyboard-operable (↑↓ navigate, ↵ insert, Esc close). Menus/modals are
`role="dialog"`/`menu` + `aria-modal`, focus-trapped, Esc + backdrop close, focus returns to trigger.

**Copy (verbatim):** "Connections" · **"Enquire"** (tip "Send a qualified enquiry to a seller") · "Search
by name, subject…" · chips **All / Pending / Awaiting / Active / Declined / Expired / Closed** · "No
matches" / "Try a different filter or search term." · "Contact hidden" (tip "Phone & email reveal once the
seller accepts your enquiry") · **WhatsApp** · **Close** (tip "Mark this enquiry as closed") · menu: "Copy
link to enquiry" / "Mark as unread" / "Export conversation" / "Manage labels" / "Manage templates" /
"Report this enquiry" / "Delete enquiry" · "Quick replies" · "Search templates…" · categories **All / My
templates / Greetings / Follow-up / Info request / Quote / Closing** · "Type your reply… (press / for quick
replies)" · "Save current text as a quick reply template" · **Send** · "Add label" · timeline "Activity" /
"Enquiry brief & timeline" · empty "No conversation selected" + **"Send your first enquiry"** · new-enquiry
"Send a new enquiry" / "Search sellers, businesses, architects…" / "From your activity" / "Browse all
sellers →" · close "Close this enquiry" / "Deal won — I purchased from this seller" / "Lost — I went with
another seller" / "Not pursuing this seller" / "Deal value (optional)" / **"Close enquiry"**. Brand
**Interior bazzar**; British **enquiry/enquire**; CTAs Title Case, no caps/"!".

**Build notes (React):** `components/BuyerDashboard/Connections/` (`ConnList` / `ConnThread` /
`ConnTimeline` sub-tree under the `<ViewSwitch>`), using **`EnquiryService`** (reads/writes → DataSource;
spine `enquiries`), with `SavedService` / `RecentlyViewedService` feeding the new-enquiry recipient picker.
