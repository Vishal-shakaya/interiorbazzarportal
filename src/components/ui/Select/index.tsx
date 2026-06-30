import { forwardRef, type SelectHTMLAttributes, useId } from "react";
import { cn } from "@/lib/cn";
import type { FieldShellProps } from "../Input";

// `select-chevron` (the dropdown arrow) is defined in theme/index.css —
// arbitrary Tailwind url() values can't contain the spaces in the inline SVG.
const baseField =
  "select-chevron w-full font-sans text-base text-ink bg-bone border-[1.5px] border-line rounded-field pl-3.5 pr-10 py-3 transition-colors duration-150 outline-none appearance-none focus:border-forest focus:bg-white";

const badField = "border-err bg-err-bg focus:border-err";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    FieldShellProps {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, optionalTag, error, id, className, children, ...rest }, ref) => {
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
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={cn(baseField, error && badField, className)}
          {...rest}
        >
          {children}
        </select>
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

Select.displayName = "Select";
