"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] text-foreground border border-white/10 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))]",
        secondary:
          "bg-white/5 text-foreground border border-white/10 hover:bg-white/10",
        outline: "bg-transparent border border-white/15 text-foreground hover:bg-white/5",
        ghost: "bg-transparent border border-transparent text-foreground hover:bg-white/5",
        destructive: "bg-red-600/20 text-red-100 border border-red-500/30 hover:bg-red-600/25",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-6",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

