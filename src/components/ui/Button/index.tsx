import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Spinner } from "../Spinner";

const button = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[12px] border border-transparent transition-[transform,background-color,border-color,opacity] duration-150 cursor-pointer select-none disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none",
  {
    variants: {
      variant: {
        primary:
          "bg-forest text-bone shadow-btn hover:bg-forest-deep hover:-translate-y-px active:translate-y-0",
        secondary:
          "bg-transparent border-line text-forest hover:border-forest",
        ghost: "bg-transparent text-forest hover:bg-bone-tint",
        danger: "bg-err text-white hover:opacity-90",
      },
      size: {
        sm: "text-sm px-4 py-2.5",
        md: "text-base px-5 py-[15px]",
        icon: "text-lg w-[54px] py-[15px]",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, loading, disabled, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(button({ variant, size, block }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && <Spinner size={18} />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
