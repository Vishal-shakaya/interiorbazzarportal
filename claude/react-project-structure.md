# React Project Structure (Version-1)

How the Version-1 React app is organised. This supersedes the legacy v3 docs in
[reference/](reference/) — it keeps the proven conventions (3-file pattern, services, tokens) but
adds the **local-first DataSource seam** from
[../../docs/environment-and-backend.md](../../docs/environment-and-backend.md).

## Stack

React 18 · Vite · TypeScript · Tailwind v4 (`@tailwindcss/vite`) + CSS Modules · React Router ·
state via hooks + lightweight store (Redux Toolkit only where global state is real). `react-helmet-async`
for SEO. Design tokens ported 1:1 from the prototype `theme.css` (see [style.md](style.md)).

## The 3-file pattern (every component)

```
ComponentName/
├── index.tsx                 → UI only (JSX). Destructures props/handlers from the hook. No logic.
├── ComponentName.module.css  → scoped styles, using the tokens from style.md.
└── useComponentName.ts        → ALL logic: state, effects, service calls, handlers.
```

Pages compose section components; section components stay presentational and receive state + setters.

## Folder layout (`src/`)

```
src/
├── api/
│   ├── datasource/        # THE SEAM — types.ts (DataSource interface), local.ts (LocalDataSource),
│   │                      #   api.ts (ApiDataSource stub), index.ts (selects by ENV.dataMode)
│   ├── services/          # domain modules: ProductService, EnquiryService, BlogService, AuthService…
│   │                      #   same method signatures across every backend flavour
│   └── endpoints.ts       # resource keys / API paths (used by ApiDataSource)
├── config/
│   └── env.ts             # reads import.meta.env once → typed ENV { name, dataMode, apiBaseUrl }
├── content/               # static *.content.ts seeds (first-render data; LocalDataSource reads these)
├── components/
│   ├── ui/                # atoms: Button, Input, Badge, Chip, Skeleton…
│   ├── shared/            # Topbar, Sidebar, SectionHeader, Card, Seo (PublicPage), ConnectModal…
│   ├── layout/            # Browsing, Clean, Dashboard layouts
│   └── <domain>/          # page-specific sections (Home/, productsX/, …) — see style.md naming
├── pages/                 # routed containers: <Name>/index.tsx + use<Name>.ts + <Name>.module.css
├── routes/                # route registry (paths from the PAGES constant)
├── store/                 # global state (auth/user/search) if/when needed
├── utils/                 # constants (PAGES), pagination, validators, helpers
├── styles/                # tokens.css (the theme.css port) + globals
└── main.tsx / App.tsx
```

## The data seam (non-negotiable)

```
UI → page hook (use*.ts) → service module → DataSource → ( LocalDataSource | ApiDataSource )
```

- **No component, hook, or page touches `localStorage` or `fetch` directly.** Only the DataSource does.
- Services expose domain verbs (`ProductService.list()`, `EnquiryService.create()`); signatures are
  identical in every flavour. Components never know which backend is live.
- `LocalDataSource` mirrors the prototype's `IBStore` keys + `window` events; `ApiDataSource` is a stub
  until M3. Selection is by `ENV.dataMode` (`local` | `api`) — a config flip, not a code change.
- Full rules + the DataSource interface: [../../docs/environment-and-backend.md](../../docs/environment-and-backend.md).

## Conventions

1. **No hardcoded routes** — use the `PAGES` constant. No hardcoded endpoints — use `endpoints.ts`.
2. **Tokens, not literals** — colours/spacing/radius/type from [style.md](style.md) (CSS vars / Tailwind tokens).
3. **URL-persistent state** (page, tab, city, filter) lives in `useSearchParams` (`replace: true`), not `useState`.
4. **SEO** — every page's first child is `<PublicPage title… description… canonicalUrl… />`.
5. **Strict typing** — shared types in `src/types`; the LocalDataSource return shapes are the API contract.
6. **States** — every async surface ships loading (Skeleton), empty (with a next-action CTA), error, success.

## Per-page build flow

For each page: open its spec in [pages/](pages/README.md) → scaffold `pages/<Name>/` (3 files) +
`content/<name>.content.ts` → add `PAGES.<KEY>` + a route → compose section components → wire data through
the service → verify against the prototype with headless screenshots → gate with `tsc -b` + `vite build`.
