import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { store } from "@/redux/store";
import { AlertProvider } from "./AlertProvider";
import { ConfirmProvider } from "./ConfirmProvider";
import { ModalProvider } from "./ModalProvider";

/**
 * Single composition point for every app-wide provider.
 * Wrap <App /> with this in main.tsx.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <AlertProvider>
            <ModalProvider>
              <ConfirmProvider>{children}</ConfirmProvider>
            </ModalProvider>
          </AlertProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ReduxProvider>
  );
}

export { useAlert } from "./AlertProvider";
export { useConfirm } from "./ConfirmProvider";
export { useModal } from "./ModalProvider";
