import { cn } from "@/lib/cn";

export type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const styles: Record<AlertType, string> = {
  success: "bg-sel-bg border-forest text-forest",
  error: "bg-err-bg border-err text-err",
  info: "bg-bone-tint border-line text-ink",
  warning: "bg-amber/10 border-amber text-amber",
};

const icons: Record<AlertType, string> = {
  success: "✓",
  error: "!",
  info: "i",
  warning: "▲",
};

/** Presentational alert banner. For app-wide toasts, use useAlert(). */
export function Alert({ type = "info", title, message, onClose, className }: AlertProps) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 border-[1.5px] rounded-field px-4 py-3 text-sm",
        styles[type],
        className,
      )}
    >
      <span className="flex-none grid place-items-center w-5 h-5 rounded-full bg-current/15 text-xs font-bold">
        {icons[type]}
      </span>
      <div className="flex-1">
        {title && <p className="font-semibold leading-tight">{title}</p>}
        <p className={cn(title && "mt-0.5", "opacity-90")}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="flex-none text-lg leading-none opacity-70 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
}
