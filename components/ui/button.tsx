"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  disableMotion?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#1d3a28] text-white shadow-md hover:bg-[#152a1b] active:bg-[#0f1f13]",
  outline: "border border-[#1d3a28] bg-transparent text-[#1d3a28] hover:bg-stone-200/60",
  ghost: "bg-transparent text-stone-800 hover:bg-stone-200/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs font-bold uppercase tracking-wider",
  md: "h-11 px-5 text-xs font-bold uppercase tracking-wider min-h-[44px]",
  lg: "h-12 px-7 text-sm font-bold uppercase tracking-wider min-h-[48px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disableMotion = false, whileHover, whileTap, children, ...props }, ref) => {
    const defaultHover = disableMotion ? {} : whileHover ?? { scale: 1.02 };
    const defaultTap = disableMotion ? {} : whileTap ?? { scale: 0.98 };

    return (
      <motion.button
        ref={ref}
        whileHover={defaultHover}
        whileTap={defaultTap}
        className={cn(
          "inline-flex items-center justify-center rounded-none transition-colors focus-visible:outline-none cursor-pointer select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
