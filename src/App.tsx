import { AppRoutes } from "@/routes";

/** Root component. Providers (Redux/Router/Helmet/overlays) are applied in main.tsx. */
export default function App() {
  return <AppRoutes />;
}
