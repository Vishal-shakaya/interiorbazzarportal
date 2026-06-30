import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui";

interface OpenOptions {
  title?: ReactNode;
  size?: "sm" | "md" | "lg";
  dismissible?: boolean;
}

interface ModalApi {
  open: (content: ReactNode, options?: OpenOptions) => void;
  close: () => void;
}

const ModalContext = createContext<ModalApi | null>(null);

/** Imperative modal host: openModal(<SomeForm />) from anywhere. */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [options, setOptions] = useState<OpenOptions>({});

  const open = useCallback((node: ReactNode, opts: OpenOptions = {}) => {
    setOptions(opts);
    setContent(node);
  }, []);

  const close = useCallback(() => setContent(null), []);

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      <Modal open={!!content} onClose={close} title={options.title} size={options.size} dismissible={options.dismissible}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModal(): ModalApi {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within <ModalProvider>");
  return ctx;
}
