import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Alert, type AlertType } from "@/components/ui";

interface ToastInput {
  type?: AlertType;
  title?: string;
  message: string;
  /** ms before auto-dismiss. 0 = sticky. Default 4000. */
  duration?: number;
}

interface Toast extends Required<Omit<ToastInput, "title">> {
  id: number;
  title?: string;
}

interface AlertApi {
  show: (t: ToastInput) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
}

const AlertContext = createContext<AlertApi | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    ({ type = "info", message, title, duration = 4000 }: ToastInput) => {
      const id = ++seq.current;
      setToasts((list) => [...list, { id, type, message, title, duration }]);
      if (duration > 0) window.setTimeout(() => remove(id), duration);
    },
    [remove],
  );

  const success = useCallback((message: string, title?: string) => show({ type: "success", message, title }), [show]);
  const error = useCallback((message: string, title?: string) => show({ type: "error", message, title }), [show]);

  return (
    <AlertContext.Provider value={{ show, success, error }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
          {toasts.map((t) => (
            <Alert
              key={t.id}
              type={t.type}
              title={t.title}
              message={t.message}
              onClose={() => remove(t.id)}
              className="shadow-card bg-bone-card"
            />
          ))}
        </div>,
        document.body,
      )}
    </AlertContext.Provider>
  );
}

/** App-wide notifications. const { success, error, show } = useAlert(); */
export function useAlert(): AlertApi {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within <AlertProvider>");
  return ctx;
}
