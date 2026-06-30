# Project Context: Interior Bazzar Frontend

This document serves as the project context directory and coding guide for the **Interior Bazzar Frontend** web application. It outlines the architectural patterns, styling standards, tech stack, and conventions used across the project to assist developers and AI agents in writing compatible, high-quality code.

---

## 1. Project Overview & Tech Stack

**Interior Bazzar** is a digital marketplace platform for interior design, products, services, catalogues, and business connections. The frontend is built using a modern Single Page Application (SPA) architecture with React and Vite.

### Core Technologies
- **Framework**: [React 18](https://react.dev/) (Client-side rendering)
- **Build Tool**: [Vite 7](https://vite.dev/) (TypeScript config)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite` integration) & Custom CSS design tokens in `src/index.css`, alongside extensive use of **CSS Modules**.
- **Routing**: [React Router Dom v7](https://reactrouter.com/) (Layout nested routes config)
- **State Management**: 
  - [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit` and `react-redux`) for global app states.
  - Custom React Contexts for UI components (Alerts, Dialogs, Modals).
- **Payment Gateway**: `@cashfreepayments/cashfree-js` for checkout and payments.
- **Rich Text Editor**: `quill` & `react-quill` for WYSIWYG editing.
- **Image Editing**: `react-cropper` for visual image cropping.
- **SEO/Metadata**: `react-helmet-async` for page titles and meta descriptions.

---

## 2. Component Architecture & The "3-File Pattern"

The project strictly adheres to a modular component architecture, separating UI rendering, logic, and styling.

### The Universal "3-File Pattern"
For almost all components (from dashboard forms to shared headers), the structure is a dedicated folder containing exactly three files:

```
ComponentName/
├── index.tsx              → Pure UI rendering (JSX/TSX). No business logic here. Destructures props and handlers from the hook.
├── ComponentName.module.css → Scoped styling using CSS Modules.
└── useComponentName.ts    → ALL logic: state management, side effects, API calls, and event handlers.
```

**Example (Dashboard Product Form):**
- `ProductForm/index.tsx`: Renders the form UI, inputs, and buttons.
- `ProductForm/ProductForm.module.css`: Styles specific to the form.
- `ProductForm/useProductForm.ts`: Fetches product details, handles category selection limits, manages image uploads via `useFileUploader`, and submits the form via `MarketService`.

### Atomic UI Components (`src/components/ui/`)
- Located in `src/components/ui/`.
- Examples: `Button`, `InputField`, `OtpInput`.
- Structure: Folder-per-component (e.g., `Button/index.tsx`, `Button/Button.module.css`).
- They use CSS modules and compose classes dynamically (e.g., ``className={`${styles.button} ${styles[variant]}`}``).
- Exposed via a centralized barrel export (`src/components/ui/index.tsx`).

### Shared Components (`src/components/shared/`)
- Located in `src/components/shared/`.
- Contains reusable functional blocks like `Header`, `Sidebar`, `Forms` (e.g., `ConnectForm`), and `Seo`.
- Uses the 3-File Pattern (e.g., `Header/index.tsx`, `Header/Header.module.css`, `Header/useHeader.tsx`).

### Page Composition Pattern
Pages (e.g., `src/pages/Home/`) compose sub-components and logic hooks:
```tsx
// src/pages/Home/index.tsx
import { useHome } from "./useHome";
import { PublicPage } from "../../components/shared/Seo";
import { Hero, OfferHero, BusinessCardContainer } from "../../components/Home";

const Home = () => {
  const { businesses, incrementPage } = useHome(); // Logic extracted
  return (
    <>
      <PublicPage title="..." />
      <Hero />
      <BusinessCardContainer businesses={businesses} />
    </>
  );
};
```

---

## 3. Directory Structure

The codebase is structured under the `src` directory to decouple business domains, UI presentation, state, configurations, and utilities:

```
interiorbazzarfrontend/
├── public/                 # Static assets directly served (icons, raw PDFs)
├── src/
│   ├── api/                # API client configuration and backend endpoints
│   │   ├── apiService/     # HTTP Client wrapper (ApiService, fetchWithAuthRetry)
│   │   ├── endpoints/      # AppUrl mapping of versioned backend routes
│   │   └── modules/        # API calls organized by logical modules (business, ads, auth, etc.)
│   ├── assets/             # Static UI assets (images, vectors, etc.)
│   ├── components/         # Reusable presentation and layout components
│   │   ├── ui/             # Atomic design elements (Button, InputField, Icons)
│   │   ├── shared/         # Globally shared utilities (Header, Footer, Forms, Seo)
│   │   ├── layout/         # Root layouts (Admin, Marketplace, General, Funnel, FullPage, Revamp)
│   │   ├── dashboard/      # Feature components: Admin panels, Business tools (uses deep nesting)
│   │   ├── overlays/       # Modals, Dialogs, Alerts (uses React Portals)
│   │   ├── Home/           # Page-specific components for the homepage (Hero, v2 section)
│   │   └── Shimmer/        # Loading skeleton components (uses Tailwind classes)
│   ├── config/             # Configurations, schema validations, and SEO setup
│   ├── context/            # React Context providers (Alert, Dialog, Modal contexts)
│   ├── hooks/              # Custom React hooks (auth, paginatedFetch, payment, upload)
│   ├── locales/            # i18n JSON files (ar, es, hi)
│   ├── pages/              # Routed view containers (Home, Blog, Dashboard, Revamp Pages)
│   ├── redux/              # Redux slices (auth, user, search) and store hooks
│   ├── routes/             # App routing registry (index.tsx)
│   ├── types/              # TypeScript interfaces (content, global, propTypes, reqResType)
│   ├── utils/              # Helper utilities (constants, logger, schema builders, Validator)
│   ├── App.tsx             # Root component wrapping routes
│   ├── index.css           # Tailwind v4 import, fonts, custom css, and design tokens
│   └── main.tsx            # DOM mounting and AppProvider initialization
├── .env.sample             # Local environment variables template
├── package.json            # Node script configurations and dependency locks
├── tsconfig.json           # Root TypeScript compiler rules
└── vite.config.ts          # Vite build engine options with Tailwind CSS plugin config
```

---

## 4. Navigation, Layouts & Routing System

Routing is configured in `src/routes/index.tsx` using React Router's `Routes` and nested layout structures.

### Layout Wrappers
1. **`GeneralLayout`**: Default header/footer for main informational pages.
2. **`FullPageLayout`**: Blank page template for authentication flows.
3. **`AdminLayout`**: Dashboards, lead tools, listing updates. Uses `useAdmin.ts` for logic (sidebar state, auth check).
4. **`FunnelPageLayout`**: Optimized landing pages.
5. **`MktLayout`**: Standard navigation for marketplace browsing.
6. **`RevampLayout`**: Complex layout with nested topbar and sidebar, each having its own hook and CSS module.

### Pages Paths Constant Mapping
Always reference paths via the `PAGES` object in `src/utils/constants/app.ts` rather than hardcoded strings (e.g., `PAGES.HOME`, `PAGES.BUSINESS_DETAIL`, `PAGES.ADMIN_BUSINESS`).

---

## 5. State Management & Hooks

### A. Redux Toolkit
- **Slices** (`src/redux/slice/`): `authSlice.ts`, `userSlice.ts`, `searchSlice.ts`.
- **Hooks**: Use custom typed hooks `useAppDispatch` and `useAppSelector` from `src/redux/store/hook.ts`.

### B. Custom UI Providers
Wrapped under `ParentContextProvider` in `src/context/index.tsx`:
- `AlertContextProvider`: System-wide notification banners.
- `DialogProvider`: Confirmation action dialogs.
- `ModalProvider`: Custom modal popups using `createPortal`.

### C. Reusable Custom Hooks (`src/hooks/`)
- Domain-specific logic extracted into reusable hooks:
  - `usePaginatedResource`: Generic paginated data fetcher.
  - `useFileUploader`: S3 file upload with progress tracking.
  - `useInitUser`: Bootstraps user auth on app load.

---

## 6. API Client Integration & Services

All asynchronous communication goes through a standardized API client service layer.

1. **`ApiService`** (`src/api/apiService/index.ts`): Exposes strongly-typed HTTP helpers (`getGetApiResponse<T>`, etc.).
2. **`fetchWithAuthRetry`**: Handles token insertion and automatic session refresh loops on 401s.
3. **`AppUrl`** (`src/api/endpoints/index.ts`): Central repository for backend endpoint paths.
4. **Modules** (`src/api/modules/`): 18 domain-specific service classes (e.g., `MarketService`, `BusinessService`).

### Standard API Response Type
```typescript
export interface ApiResponseType<T> {
  data: T;
  response: boolean;
  message: string;
  code: number;
}
```

---

## 7. Styling, Tokens, and Design Guidelines

### CSS Modules
CSS Modules (`.module.css`) are the primary styling mechanism used in over 140 components. Styles are scoped locally to prevent leakage.

### Global CSS & Design Tokens
`src/index.css` defines the Tailwind v4 base and a robust set of CSS custom properties (variables) for colors, spacing, typography, and breakpoints.

- **Primary Brand**: `var(--color-brand-primary)` (`rgb(25, 71, 45)`)
- **Backgrounds**: `var(--color-bg-primary)`, `var(--color-bg-section)`
- **Responsive Breakpoints**: Defined directly in CSS media queries adjusting base font sizes dynamically.

*Note: The `Shimmer` components are an exception, utilizing inline Tailwind utility classes (e.g., `animate-pulse`, `bg-gray-200`) instead of CSS modules.*

---

## 8. Execution Commands

Use these npm script entries inside the workspace terminal:

- **`npm run dev`**: Starts local Vite HMR server (`--host`).
- **`npm run build`**: Compiles TS files (`tsc -b`) and bundles for production (`vite build --mode prod`).
- **`npm run preview`**: Launches local preview server of the generated bundle.
- **`npm run lint`**: Runs ESLint.

---

## 9. Coding Standards & Guidelines

When modifying or expanding this application, you MUST follow these rules:

1. **Adhere to the 3-File Pattern**: New components must separate UI (`index.tsx`), styling (`.module.css`), and logic (`useComponent.ts`).
2. **Component UI Rendering Only**: `.tsx` files should only contain JSX rendering, basic structural logic, and destructuring from custom hooks. Do not embed API calls or complex state management directly in the component file.
3. **Use CSS Modules**: Style components using `import styles from "./Component.module.css"`. Avoid global CSS pollution. Leverage CSS custom variables defined in `index.css`.
4. **No Hardcoded URLs**: Use the `PAGES` constant for frontend routes and `AppUrl` for backend endpoints.
5. **API via Modules**: Do not use `fetch` or `axios` directly in components. Define API methods in `src/api/modules/` and use `apiService`.
6. **Strict Typing**: Use interfaces from `src/types/`. Avoid `any`.
7. **SEO Management**: Utilize the `PublicPage` shared component (which wraps `react-helmet-async`) and schemas from `src/config/pages.schema.ts` for page-level SEO.
