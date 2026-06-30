# TAB: Reviews — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: reviews  ·  GROUP: main (WORK — "Inbox & pipeline")  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Cross-refs: parent overview [README.md](README.md) · pages index [../README.md](../README.md) ·
> [../../modules-features-flow.md](../../modules-features-flow.md) · [../../style.md](../../style.md) ·
> [../../copywriting.md](../../copywriting.md) · [environment seam](../../../../docs/environment-and-backend.md) ·
> [integration](../../../../docs/integration.md) · prototype `../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html`.

---

## 1. Page-tab

**What it is.** The seller's reputation console — one place where every buyer review across all their
profiles (Business, Shops, Architects) lands. The seller reads each review, **replies** publicly,
**edits/deletes** their reply, and **flags** a review for moderation (which hides it pending review).
Header `<h1 class="dm-title">Reviews</h1>` with a sub-line that doubles as the count summary:
`{n} review{s} · {n} awaiting reply` (or the empty-state line when there are none).

**Where it sits in the nav.** Group **WORK** (`group:'main'` → "Inbox & pipeline"), label **"Reviews"**,
icon `ti-star` (`{id:'reviews', label:'Reviews', icon:'ti-star', group:'main'}`). It is the **6th** WORK
item (after Quotations, before Insights).

**Chip / count.** Live chip from `ib_getSidebarChip('reviews')` = **unreplied published** reviews
(`r.status === 'published' && !r.seller_reply`). Excludes `under_review` (being moderated) and any
already-replied. Returns `null` at inbox-zero (no chip drawn).

**Default view?** No. The default seller section is **Overview**. Reviews is reached on demand.

**How it's reached.** Prototype routes by `window.location.hash` → `goSection('reviews')`. **In React,
mirror as `?tab=reviews`** via `useSearchParams`. No nested sub-route in the prototype — filters/search
are in-memory UI state (`window.reviewsUI`), not URL-addressable. (Keep `#section/sub` deep-link form
reserved per the page brief, but Reviews uses none today.)

**Who sees it.** Gated by `ib_sectionAllowed('reviews')` → `ib_anySellingModule()`: visible only when the
seller holds **any** selling module (`autogrowth` / `business` / `shop` / `architect` / `bannerAds`). A
logged-in buyer with no selling module (`FREE`) does not see Reviews in the nav.

## 2. Module

**Belongs to:** the **WORK** surface, shared across all selling modules — Reviews is **not** owned by one
subscription. It is **any-module gated**, not feature-metered.

**Visibility gate (the read):**
```
ib_sectionAllowed('reviews')  →  (id === 'reviews') ? ib_anySellingModule() : …
ib_anySellingModule()         →  IB_SELLING_MODULES.some(k => sellerModules[k])
```
There is **no `IB_SECTION_MODULE` entry** for `reviews` (that map is for single-module ids like
`business`/`shop`/`architect`); Reviews takes the **any-selling-module** branch alongside `pipeline` and
`quotations`.

**Depth / limits.** Grepping `ib-entitlements.js` for review/reply limits returns **no matches** — Reviews
has **no plan-graded cap or meter**. Reply length is a product constant, not a plan number:
`window.IB_REPLY_MAX_CHARS = 1000`. There is therefore **no `IBEntitlements.limit/atCap/meters` read in
this tab** and **no cap toast or upsell card inside it** — the only gating is the binary nav visibility
above. (House rule still holds: the capability isn't *hidden from a paying seller* — it appears the moment
any selling module is active. Do not invent a per-plan review limit.)

## 3. Features

Verbatim sub-areas from `renderReviewsSection()` and its helpers:

- **Header + count summary** — `<h1>Reviews</h1>` + `{n} reviews · {n} awaiting reply`.
- **Score sidebar** (`rv-side`) — big average `{avg}`, star row, "based on {n} reviews", and an
  **"{n} awaiting reply"** toggle button (`rv-score-await`) that filters to unreplied.
- **Filter by profile** (`rv-typepills`) — pills **"All reviews" · "Business" · "Architects" · "Shops"**
  with per-type counts; empty types are `disabled`/`is-empty`.
- **Recent reviews** list (`rv-main`) — title **"Recent reviews"**, a count line
  `{typeLabel}{ · awaiting reply} · {n}`, and a **search** box (`Search reviews…`).
- **Review card** (`rv-card-simple`) — reviewer avatar/name, **"Verified"** badge, city · relative time,
  star rating, target chips, review text, and the reply block.
- **Reply composer** (`rv-composer`) — "Reply to this review" → textarea + char counter + **Post reply** /
  **Cancel**; existing replies show **Edit** / **Delete**.
- **Flag / unflag** (Stage 3) — kebab menu → **flag modal** (reason + notes) sets `under_review`
  ("Hidden from public · under review"); **Remove flag · republish** restores it.
- **Empty state** (`rv_renderEmptyState`) and **no-matches state** (`rv_renderNoMatchesState`).

> Note: the prototype's `reviewsUI` also carries `entityFilter`, `ratingFilter`, a `replied/verified`
> status filter and a `sortBy` (recent/oldest/highest/lowest/most-helpful) — wired in the filter/sort
> functions and available to the per-entity scorecard/rollup helpers, but the **simplified Stage-1 layout
> that ships** renders only the type pills + search + the awaiting-reply toggle. Build the visible surface;
> keep the richer filter/sort state available behind it.

## 4. Functionality

All reads/writes go through **`ReviewService`** → DataSource (spine group **seller reviews**;
prototype source `window.sellerReviews`). Identity for replies comes from `sellerEntities.replyIdentity`;
target/entity names resolve via `sellerEntities.{business,shops,architects}`. **Never touch raw
localStorage/fetch.**

| Feature | What it does | Controls | Data (Service → spine) | Gating UI | Behaviour |
|---|---|---|---|---|---|
| Count summary | Header sub-line | — | `ReviewService.forSeller()`; `rv_computeAnalytics` over the **full** set (analytics reflect whole reputation, not the filtered view) | none | `{n} reviews · {analytics.unreplied} awaiting reply`. Empty → empty-state line. |
| Score sidebar | Average + star row + total | "{n} awaiting reply" toggle (`rv-score-await`) | analytics: `avgOverall`, `total`, `unreplied` (over `status==='published'`) | none | Avg shown `avg.toFixed(1)`; "based on {total} reviews". Toggle flips `statusFilter` between `unreplied` ↔ `all` (`rv_setStatusFilter`). |
| Filter by profile pills | Scope list to a profile type | `rv_setTypeFilter('all'\|'business'\|'architect'\|'shop')` | counts from `r.targets[].type` | empty type → `disabled` + `is-empty` (no module-gating) | `role="tablist"`, each pill `role="tab"` `aria-selected`. Type-filter ANDs with rating/status/search in `rv_filterReviews`. |
| Recent reviews + search | List the filtered/sorted cards | `Search reviews…` input → `rv_setSearch` (debounced) | `rv_filterReviews` → `rv_sortReviews`; search matches reviewer name / text / tag labels | none | Count line `{typeLabel}{ · awaiting reply} · {sorted.length}`. Clear (`×`) resets search. Re-render is scroll-anchored (`rv_rerenderAnchored`) so the list doesn't jump. |
| Review card | Render one review | (per-card reply/flag controls) | one `sellerReviews` record | "Verified" badge only if `verification.is_verified_buyer` | Shows initials avatar, city · `rv_formatRelative(submitted_at)`, star rating, target chips. `under_review` → `rv-card-flagged` + banner **"Hidden from public · under review"**. |
| Reply composer | Post / edit a public reply | **"Reply to this review"** → textarea + counter + **Post reply** / **Cancel**; existing reply → **Edit** / **Delete** | write `r.seller_reply` via `ReviewService.reply(id, text)` (author = `sellerEntities.replyIdentity`) | none | `IB_REPLY_MAX_CHARS = 1000`; counter `{remaining} / 1000`, warns < 100, blocks > 0 over. Post disabled until non-whitespace content. New → toast **"Reply posted"**; edit preserves `posted_at`, sets `edited_at`, toast **"Reply updated"**; reply shows "replied {relative} · edited". |
| Delete reply | Remove the reply (review stays) | **Delete** → styled confirm (`qs_openConfirmModal`) | `ReviewService.reply(id, null)` (nulls `seller_reply`) | none | Confirm copy: *"Your reply will be removed and the review will look as though you never responded. The original review stays in place."* "**Delete reply**" / "Cancel". Toast **"Reply deleted"**. |
| Flag for moderation | Hide a review pending review | kebab → **flag modal**: **Reason** select (`IB_FLAG_REASONS`) + **Notes** | `ReviewService` write: append `r.flags[]`, set `status='under_review'` | none (moderation, not plan) | Reasons: *Fake / impersonation · Spam or off-topic · Inappropriate content · Conflict of interest · Other (please describe)* ("Other" requires notes). Toast **"Review flagged for moderation"**; public sees "Under review" badge. |
| Remove flag | Republish a flagged review | kebab → **"Remove flag · republish"** → confirm | set `status='published'`, append unflag audit entry | none | Confirm: *"This will republish the review… The flag history stays in our internal log for audit purposes."* Toast **"Flag removed · review republished"**. |
| Empty state | No reviews at all | — | `reviews.length === 0` | n/a | Sub-line *"No reviews yet — your first review will appear here when a buyer rates you."*; body card title **"No reviews yet"** + *"When buyers review your business, shops, or designers, they'll all appear here in one place."* |
| No-matches state | Filters exclude everything | **"Clear filters"** (`rv_clearFilters`) | — | n/a | Title *"No reviews {matching "…"}{with N★}{(unreplied)}"* + *"Try different filters, or clear them to see all {n} reviews."* |

**Verbatim labels & microcopy:** `Reviews` · `{n} review(s) · {n} awaiting reply` · `based on {n} review(s)`
· `{n} awaiting reply` · `Filter by profile` · `All reviews` / `Business` / `Architects` / `Shops` ·
`Recent reviews` · `Search reviews…` · `Verified` · `Reply to this review` · `Replying as` / `Editing reply`
· `Post reply` / `Save changes` / `Cancel` · `Edit` / `Delete` · `replied {relative} · edited` ·
`Hidden from public · under review` · `Reason` / `Notes (optional)` · `Review flagged for moderation` ·
`Remove flag · republish` / `Keep flagged` · `Reply posted` / `Reply updated` / `Reply deleted` ·
textarea placeholder *"Write a thoughtful reply. Future buyers will read this — being honest about issues
raised, or warm about praise received, builds trust."*

## 5. Working flow

**Core loop — read → reply.**
1. Seller (holding any selling module) opens the dashboard; nav shows **Reviews** with a chip = unreplied
   count. They click it → `?tab=reviews` (`goSection('reviews')`).
2. The page reads `ReviewService.forSeller()`; analytics compute the average, total and `unreplied`.
   Sub-line reads `{n} reviews · {n} awaiting reply`.
3. Seller taps **"{n} awaiting reply"** in the score sidebar to filter to the ones needing them, or a
   **profile pill** (Business / Architects / Shops) to scope by entity type, or searches.
4. On a card they click **"Reply to this review"**, type within the 1000-char limit, **Post reply**.
   `ReviewService.reply` writes `seller_reply`; toast **"Reply posted"**; the unreplied count (and the nav
   chip) drop by one.
5. Optionally **Edit** / **Delete** the reply later, or **flag** a suspicious review → it goes
   `under_review` (hidden publicly) until moderation acts; **Remove flag · republish** restores it.
6. **Exit:** chip clears at inbox-zero; seller returns to Overview/Enquiries to keep working the pipeline.

**How it connects to other tabs + the shared spine.**
- **Overview** surfaces the same numbers: its KPI/foot shows `{n} awaiting reply` and the **Insights**
  "Reviews snapshot" (advanced+) reads `published`/`unreplied` from the same `sellerReviews` and links
  **"Manage"** → `goSection('reviews')`. A reply posted here drops those counts live.
- Reviews are the **trust output of the deal spine**: a buyer who went enquiry → pipeline → quotation →
  won leaves a **deal-linked** review (`is_verified_buyer` → "Verified" badge, can target up to 3 entities
  — business + shop + architect); open phone-verified reviews are single-target (anti-abuse). Replying
  here feeds **Insights** ("Replying to reviews builds trust and lifts your placement") and the public
  listing's rating — the seller's reputation surface buyers see when the next enquiry begins.

## 6. Data · States · A11y · Copy

**Data.** Service: **`ReviewService.forSeller()` / `.reply(id, text|null)`** (and flag/unflag status
writes) → DataSource, spine group **seller reviews** (`window.sellerReviews`). Identity for replies:
`sellerEntities.replyIdentity`; entity/target names: `sellerEntities.{business,shops,architects}`.
**No `EntitlementService` read in this tab** (no review limit exists). Constant: `IB_REPLY_MAX_CHARS = 1000`.

**States.**
- **Loading:** standard section skeleton (not a bare spinner); nav renders immediately from `dashSections`.
- **Empty (with next action):** sub-line *"No reviews yet — your first review will appear here when a buyer
  rates you."* + card *"No reviews yet"* / *"When buyers review your business, shops, or designers, they'll
  all appear here in one place."* (No CTA inside — the next action is to win a deal; no dead end.)
- **No-matches:** *"No reviews {filters}"* + **"Clear filters"**.
- **Locked / gated:** binary — if no selling module, the whole section is **not in the nav**
  (`ib_anySellingModule()` false). No in-tab upsell card or cap toast (no paid sub-feature here).
- **Error:** failed load degrades to inline retry; rest of console still renders.
- **Success:** **"Reply posted"** / **"Reply updated"** / **"Reply deleted"** / **"Review flagged for
  moderation"** / **"Flag removed · review republished"** toasts (`aria-live="polite"`).

**A11y.** Landmarks: `aside.rv-side` within `main#dashMain`; one **H1** per section (`Reviews`); active
`.dn-item` is `aria-current`. Type pills are a real tablist (`role="tablist"` / `role="tab"` /
`aria-selected`); empty types `disabled`. Status is **icon + text**, not colour: the `under_review` banner
shows `ti-flag-3-filled` **and** "Hidden from public · under review"; "Verified" pairs the rosette icon
with the word. Composer textarea `<label>`/identity-linked; Post disabled until valid; modals
focus-trapped, Esc/backdrop close, scroll-anchored re-render keeps focus position.

**Copy (verbatim).** All strings as listed in §4. Brand voice lowercase-b "Interior bazzar", British
"enquiry"; CTAs Title Case (no ALL-CAPS, no "!"). Never re-word the moderation/flag copy.

---

**Build notes (React):** component `components/DashboardSeller/Reviews/` (e.g. `index.tsx` +
`ReviewCard`, `ReplyComposer`, `FlagModal`, `TypePills`); uses **`ReviewService`** (read/reply/flag) plus
`ib_anySellingModule()`-equivalent visibility from the resolved plan and `sellerEntities` for reply
identity + target names. No entitlement-limit read (`IB_REPLY_MAX_CHARS` is a product constant).
