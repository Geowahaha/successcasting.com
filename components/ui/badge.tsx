"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-foreground",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/5",
        success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-100",
        warning: "border-amber-500/30 bg-amber-500/15 text-amber-100",
        danger: "border-red-500/30 bg-red-500/15 text-red-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

