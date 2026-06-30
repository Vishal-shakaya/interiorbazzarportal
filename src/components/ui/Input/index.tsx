import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";
import { cn } from "@/lib/cn";

const baseField =
  "w-full font-sans text-base text-ink bg-bone border-[1.5px] border-line rounded-field px-3.5 py-3 transition-colors duration-150 outline-none placeholder:text-muted/70 focus:border-forest focus:bg-white";

const badField = "border-err bg-err-bg focus:border-err";

export interface FieldShellProps {
  label?: ReactNode;
  hint?: ReactNode;
  /** Optional text, e.g. "(optional)", shown muted next to the label. */
  optionalTag?: string;
  error?: string;
}

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FieldShellProps {
  /** Static addon rendered to the left, e.g. a "+91" country code. */
  leftAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, optionalTag, error, leftAddon, id, className, ...rest }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const errId = `${fieldId}-err`;

    return (
      <div className="mb-3.5 last:mb-0">
        {label && (
          <label htmlFor={fieldId} className="block text-[13px] font-semibold text-forest mb-1.5">
            {label}
            {optionalTag && <span className="font-medium text-muted"> {optionalTag}</span>}
          </label>
        )}

        <div className={cn(leftAddon && "flex gap-2")}>
          {leftAddon && (
            <div className="flex-none grid place-items-center w-[62px] bg-bone-tint border-[1.5px] border-line rounded-field text-[15px] font-semibold text-forest">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={fieldId}
            aria-invalid={!!error}
            aria-describedby={error ? errId : undefined}
            className={cn(baseField, error && badField, leftAddon && "flex-1", className)}
            {...rest}
          />
        </div>

        {hint && !error && <p className="text-[13px] text-muted mt-1.5">{hint}</p>}
        {error && (
          <p id={errId} className="text-[12.5px] text-err mt-1.5 ml-0.5">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
