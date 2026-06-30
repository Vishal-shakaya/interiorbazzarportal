import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/theme/index.css";
import { AppProviders } from "@/providers";
import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
