# Portal — the user-facing app

> The Portal is what **end users** see: buyers browsing interior products, services,
> catalogues, businesses and architects, plus the buyer/seller dashboards.
> It is built in React from the static prototype, page-by-page, to match it exactly.
> Read [Environment & Backend Strategy](../Environment-Management-backend.md) first.

## What's in this folder

| File | Purpose |
|------|---------|
| [style.md](style.md) | UI/UX standards — design tokens, components, layout, interaction, responsive, states. |
| [copywriting.md](copywriting.md) | Brand voice, vocabulary, the CTA library, microcopy. |
| [react-project-structure.md](react-project-structure.md) | Version-1 React conventions — 3-file pattern, services, the DataSource seam, folder layout. |
| [modules-features-flow.md](modules-features-flow.md) | Modules → features → use cases → buyer & seller journeys → accessibility. |
| [pages/](pages/README.md) | Per-page specs (26) + the 12-point design template, build tracker, and gaps. |
| [reference/](reference/) | Archived legacy v3 frontend docs (context only — superseded by the above). |

This README is the **portal overview**; the files above are the build standards. Start here, then
go to `pages/` to build a specific page.

---

## 1. What the Portal is

The Portal replicates the static prototype at
`Prototype/ib_prototype_7.2.1/` in React (Vite + React 18 + TypeScript + Tailwind v4).
Design source-of-truth is the prototype's `assets/theme.css`; content/shape source-of-truth
is the prototype's `assets/ib-*.js` data files. The portal renders the **same pages, layout,
and content** as the prototype — the difference is React + a swappable data layer.

## 2. Pages (from the prototype `pages/`)

Public / browsing:
`home` · `trending` · `explore` · `products` + `product-detail` · `services` + `service-detail`
· `catalogues` · `businesses` + `business-detail` · `architects` + `architect-detail` · `shops`
· `recently-viewed`

Content / info:
`blog` + `blog-post` · `about-ib` · `help-support` · `terms` · `privacy` · `refund`
· `disclaimer` · `cookies`

Flows:
`auth` · `plans-checkout` · `new-quotation` · `ad-enquiry-flow`

Dashboards (auth-gated):
`dashboard-buyer` · `dashboard-seller`

## 3. Architecture (the conventions we follow)

Defined in [react-project-structure.md](react-project-structure.md) (the legacy v3 docs in
[reference/](reference/) are background only). In short, the Portal follows:

- **3-file pattern** per component: `index.tsx` (UI only), `Component.module.css` (scoped
  styles), `useComponent.ts` (all logic/state/effects).
- **Layouts:** a standard browsing layout (topbar + collapsible sidebar), a clean/focused
  layout (auth, contact), and self-contained dashboards that own their own chrome.
- **Routing:** every path comes from a central `PAGES` constant — never hardcode route strings.
- **SEO:** every page mounts a `PublicPage` (helmet) with title/description/canonical.
- **Styling:** CSS Modules + design tokens ported 1:1 from the prototype's `theme.css`.

## 4. How the Portal gets its data (the important part)

The prototype seeds content from static JS data files. In React we keep that as **static
content files** (`src/content/*.content.ts`) for first render, but every page reads through a
**page hook → service module → DataSource** so it can swap to a backend later
(see [Environment & Backend Strategy](../Environment-Management-backend.md)).

```ts
// use<Page>.ts  — local-first, API-ready
useEffect(() => {
  // LOCAL flavour: service resolves from localStorage / static content
  ProductService.list().then(setProducts);
  // when wired: the SAME call hits the dev/stage/prod API — no UI change
}, []);
```

Rules the Portal obeys:

- **Never** call `fetch` or read `localStorage` in a page/component. Go through a service.
- The portal is mostly a **reader**: it consumes data the Admin produces (blog posts, plans,
  banners, entitlements) and writes a few user actions (registration, enquiries, reports,
  feedback, support tickets). Those writes flow into the same shared spine the Admin reads
  — see [Integration](../Integration.md).
- URL-persistent state (page number, active tab, city filter, category filter) lives in
  `useSearchParams`, not `useState`, so it survives reload and is shareable.

## 5. What the Portal writes (becomes Admin's inbox)

| User action (portal)        | Lands in (shared spine)        | Admin sees it as |
|-----------------------------|--------------------------------|------------------|
| Register / login            | `users` (`ib_registrations`)   | Buyers/Users list |
| Send enquiry / Connect      | `enquiries` (`ib_shared_*`)    | Enquiry routing queue |
| Buy / change a plan         | `subs` / `planChanges`         | Payments / plan-change approvals |
| Report a listing            | `reports`                      | Moderation queue |
| Submit feedback             | `feedback`                     | Feedback queue |
| Contact support             | `support`                      | Support desk |
| Submit a banner ad          | `banners`                      | Ad approvals |

(These are the exact `IBStore` groups in the prototype — we preserve the names/shapes.)

## 6. What the Portal reads (produced by Admin)

- **Blog posts** — Admin's editor writes them; portal blog list/detail render the same records.
- **Plans & entitlements** — what a seller's plan unlocks (the prototype's `ib-entitlements.js`).
- **Active banner ad** — the approved banner shown in portal banner slots.
- **Subscription state** — reflected on next login to gate seller features.

## 7. Definition of done (Portal milestone)

- Every prototype page rebuilt in React and visually matching (headless screenshot diff vs the
  prototype HTML — same method noted in the portal-conversion memory).
- All data read/written through services + DataSource; **zero** raw `localStorage`/`fetch` in
  components.
- Fully usable in the **local** flavour with no backend running.
- `ApiDataSource` methods exist as stubs (so the swap surface is visible) but are not required
  to be wired yet.
- `tsc -b` + `vite build` pass clean; mobile-responsive.

See [Milestones](../Milestone.md) for sequencing (Portal is built **first**).
