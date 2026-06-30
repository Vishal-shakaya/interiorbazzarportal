# Portal — user-facing app (M1, built first)

The Portal is what end users see (browsing + buyer/seller dashboards). Rebuild the static prototype **page-by-page to match it exactly**.

## Read first
- **[PROTOTYPE_PARITY.md](PROTOTYPE_PARITY.md)** — the live tracker: the 8 parity dimensions, the per-page status matrix, the screenshot-diff loop, and the ported design tokens. **Read before touching any page.**
- **[docs/README.md](docs/README.md)** — portal overview + index of the standards below.
- App specs in **[docs/](docs/)**: `style.md`, `seo.md`, `copywriting.md`, `react-project-structure.md`, `modules-features-flow.md`, and **`docs/pages/<page>.md`** — read the one page you're building.
- Source of truth: **`../Prototype/ib_prototype_7.2.1/`** (design = `assets/theme.css`, data = `assets/ib-*.js`).
- Shared: [../docs/integration.md](../docs/integration.md) · [../docs/environment-and-backend.md](../docs/environment-and-backend.md) · [../docs/milestones.md](../docs/milestones.md).

## Non-negotiable rules
- **3-file pattern:** `index.tsx` (UI) · `Component.module.css` · `useComponent.ts` (logic).
- **Never** call `fetch` or read `localStorage` in a page/component — go through a **service → DataSource**.
- **Routes** from the central `PAGES` constant — never hardcode paths.
- **URL-persistent state** (page / tab / city / category filters) → `useSearchParams`, not `useState`.
- **SEO:** every page mounts `PublicPage` (helmet) with title/description/canonical.
- The portal is mostly a **reader**; user writes (registration, enquiries, reports, feedback, support, banner submissions) flow into the shared spine the Admin processes — see [../docs/integration.md](../docs/integration.md).

## Definition of done
All 8 parity dimensions ✅ at **1600 & 1280** vs the prototype, zero raw `fetch`/`localStorage` in components, fully usable in the **local** flavour, and `tsc -b` + `vite build` green. Run with `npm run dev`.
