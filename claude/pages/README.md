# Portal Pages — design template, specs & tracker

One markdown spec per portal page, each filling the **12-point design template** below, grounded in the
prototype HTML. A page is built in React **only after** its spec is complete and reviewed.

How to read a spec: purpose, where it sits in the buyer/seller journey, exact section order (matching the
prototype), data it reads/writes, every CTA string, all four states, responsive + accessibility, and SEO.
Build straight from it. [home.md](home.md) is the gold-standard exemplar for depth and tone.

**Prototype root:** every spec's `PROTOTYPE:` field is relative to `../../Prototype/ib_prototype_7.2.1/`.
So `PROTOTYPE: pages/home.html` resolves to `../../Prototype/ib_prototype_7.2.1/pages/home.html` (the two
admin pages live directly under that root: `admin-login.html`, `dashboard-admin.html`). Use this full path
for the screenshot-diff verification step.

---

## A. The per-page design template (every spec fills this)

```
# PAGE: <name>     PROTOTYPE: pages/<file>.html     ROUTE: PAGES.<KEY>     LAYOUT: Browsing|Clean|Dashboard

1. PURPOSE     One sentence — why this page exists for the user.
2. JOURNEY     Actor (buyer|seller|both). Stage (discover|evaluate|connect|track|manage|convert).
               What precedes it; what it leads to.
3. AUTH        Public | Auth-required | Auth-gated-action (which action triggers the gate).
4. LAYOUT      Browsing (topbar+sidebar) | Clean (focused flow) | Dashboard (own chrome). Sidebar shown/hidden.
5. SECTIONS    Ordered, top→bottom, matching the prototype (hero, filter bar, grid, detail blocks,
               related row, CTA band, footer…). A table with verbatim eyebrows/titles/CTAs + key classes.
6. DATA        Reads (service methods) and writes. Shapes = the spine contract. Via services → DataSource only.
7. PRIMARY CTA The single most important action + exact label (from copywriting.md). Secondaries listed.
               Every CTA resolves to a next journey step.
8. STATES      Loading (skeleton), empty (with a next-action CTA), error, success. No dead ends.
9. RESPONSIVE  Desktop grid → mobile reflow. Sidebar → drawer. Touch targets ≥ 38px.
10. A11Y       Landmarks, one H1, labelled controls, focus, aria for any modal/menu. (Checklist in
               ../modules-features-flow.md §5.)
11. COPY       Headline, subhead, eyebrows, CTA strings, empty/error microcopy — brand voice (../copywriting.md).
12. SEO        title / description / canonical (PublicPage).

+ a "Build notes (React)" footer.
```

## B. Page design rules (apply to all)

1. **Match the prototype.** Section order, density, content mirror the prototype HTML. Verify with headless
   screenshots (method in the portal-conversion memory).
2. **One job per page.** A single primary purpose and a single primary CTA; everything else is secondary.
3. **Always offer the next step.** Detail → Connect. Empty dashboards → "Start browsing". Success → a forward
   button. The prototype never strands a user.
4. **Compose from sections, not monoliths.** Each section is a 3-file component; the page just orders them
   (see [../README.md](../README.md) and [../react-project-structure.md](../react-project-structure.md)).
5. **Gate at the action, not the page.** Browsing/detail stay public; the **login gate fires on the
   Connect/enquire action**, then returns the user (`IB_POST_LOGIN_REDIRECT`).
6. **Tokens & voice are not optional.** Colours/spacing/type from [../style.md](../style.md); every word from
   [../copywriting.md](../copywriting.md).

## C. Page → journey map (quick reference)

```
BUYER:   Home/Listing ──▶ Detail ──▶ [Connect modal] ──(login gate)──▶ Success ──▶ Buyer dashboard
         (discover)        (evaluate)   (connect/enquire)                            (track & manage)

SELLER:  Auth ──▶ Plans & checkout ──▶ Seller dashboard ──▶ (Enquiry arrives) ──▶ Pipeline ──▶ Quotation
         (register)  (choose plan)       (set up listings)     (respond)            (convert)
```

Full step-by-step in [../modules-features-flow.md](../modules-features-flow.md). The **Connect modal**
(`connect-modal.md`) is a shared overlay (not a routed page) reused across detail/listing pages.

---

## D. Build order & status (journey-first — Home first)

Status: ☐ not started · ◐ spec drafting · ✅ spec complete · 🔨 built in React

| # | Page | Spec file | Journey stage | Status |
|---|------|-----------|---------------|--------|
| 1 | **Home** | [home.md](home.md) | Buyer · discover (entry) | ✅ |
| 2 | Products | [products.md](products.md) | Buyer · discover | ✅ |
| 3 | Services | [services.md](services.md) | Buyer · discover | ✅ |
| 4 | Catalogues | [catalogues.md](catalogues.md) | Buyer · discover | ✅ |
| 5 | Businesses | [businesses.md](businesses.md) | Buyer · discover | ✅ |
| 6 | Architects | [architects.md](architects.md) | Buyer · discover | ✅ |
| 7 | Shops | [shops.md](shops.md) | Buyer · discover | ✅ |
| 8 | Trending | [trending.md](trending.md) | Buyer · discover | ✅ |
| 9 | Explore | [explore.md](explore.md) | Buyer · discover | ✅ |
| 10 | Recently viewed | [recently-viewed.md](recently-viewed.md) | Buyer · discover | ✅ |
| 11 | Product detail | [product-detail.md](product-detail.md) | Buyer · evaluate → connect | ✅ |
| 12 | Service detail | [service-detail.md](service-detail.md) | Buyer · evaluate → connect | ✅ |
| 13 | Business detail | [business-detail.md](business-detail.md) | Buyer · evaluate → connect | ✅ |
| 14 | Architect detail | [architect-detail.md](architect-detail.md) | Buyer · evaluate → connect | ✅ |
| 15 | **Connect modal** | [connect-modal.md](connect-modal.md) | Buyer · connect (shared overlay) | ✅ |
| 16 | Auth | [auth.md](auth.md) | Buyer/Seller · gate / register | ✅ |
| 17 | Blog | [blog.md](blog.md) | Content | ✅ |
| 18 | Blog post | [blog-post.md](blog-post.md) | Content | ✅ |
| 19 | About | [about.md](about.md) | Content / trust | ✅ |
| 20 | Help & support | [help-support.md](help-support.md) | Content / support | ✅ |
| 21 | Legal (terms/privacy/refund/disclaimer/cookies) | [legal.md](legal.md) | Content / compliance | ✅ |
| 22 | Plans & checkout | [plans-checkout.md](plans-checkout.md) | Seller · choose plan | ✅ |
| 23 | New quotation | [new-quotation.md](new-quotation.md) | Seller · convert | ✅ |
| 24 | Ad enquiry flow | [ad-enquiry-flow.md](ad-enquiry-flow.md) | Seller · explain routing | ✅ |
| 25 | Buyer dashboard | [BuyerDashboard/](BuyerDashboard/README.md) | Buyer · track & manage | ✅ overview + 8 tab specs |
| 26 | Seller dashboard | [SellerDashboard/](SellerDashboard/README.md) | Seller · run business | ✅ overview + 18 tab specs |

**Status: all 26 specs complete** ✅ — grounded in the prototype, consistent format (12 sections + Build
notes each), verified. Ready to start M1 (React build), Home first.

---

## E. Prototype-vs-standard gaps to resolve in the React build

Surfaced by spec writers while reading the prototype — **deliberate upgrades** the React port makes (noted
inline in the specs; collected here so none is missed during M1).

1. **Connect modal has no real OTP step** — phone is only "7+ digits" validated; the standard
   ([../modules-features-flow.md](../modules-features-flow.md) §Part 2) requires an OTP-verify step +
   "Verify phone" CTA. Add it. (`connect-modal.md`)
2. **Enquiry submit writes raw `localStorage`** (`ib_shared_enquiries` / `ib:sharedenquiry`) — route through
   `EnquiryService` → DataSource per the seam. Same for architect-detail's `renderDetail` and auth's direct
   `ib_auth` writes. (`connect-modal.md`, `architect-detail.md`, `auth.md`)
3. **No pagination mounted** on businesses/architects (full filtered list in one pass) — decide paging vs
   infinite-scroll in React. (`businesses.md`, `architects.md`)
4. **`architects.html` topbar bug**: `data-active="businesses"` — set the correct active nav key per route.
5. **"Play all" not in prototype** — trending renders static `.short` thumbs; unify static + interactive
   reels under one **ReelModal** and add the CTA. (`trending.md`)
6. **A11y gaps to fix everywhere**: contact/help "cards" are `<div data-*-action>` not real buttons; modal
   focus-trap + return-focus; `aria-live="polite"` on form validation; `<html lang="en-IN">`.
   (`help-support.md`, `connect-modal.md`, `auth.md`, and ../modules-features-flow.md §5)
7. **Catalogue CTA wording**: prototype says "Download"/"View"; standard canonical is "Get catalogue"
   (Connect intent `catalogue`) — align in React. (`catalogues.md`)
