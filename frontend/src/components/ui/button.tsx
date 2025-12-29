import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 shadow-[0_0_20px_rgba(14,165,233,0.3)]",
        destructive: "bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90",
        outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
        secondary: "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:opacity-80 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
        ghost: "hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
        hero: "bg-gradient-to-r from-[#0ea5e9] via-[#a855f7] to-[#2dd4bf] text-[#0a0f1a] font-semibold hover:opacity-90 shadow-[0_0_30px_rgba(14,165,233,0.4)]",
        glass: "bg-[var(--color-muted)]/50 backdrop-blur-md border border-[var(--color-border)]/50 hover:bg-[var(--color-muted)]/70 hover:border-[var(--color-primary)]/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
