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
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-stone-900 text-stone-100 hover:bg-[#1d3a28] border border-stone-800 shadow-md",
  outline: "border border-stone-800 bg-transparent text-stone-900 hover:bg-stone-200/60",
  ghost: "bg-transparent text-stone-800 hover:bg-stone-200/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs font-mono uppercase tracking-widest",
  md: "h-11 px-6 text-xs font-mono uppercase tracking-widest font-bold min-h-[44px]",
  lg: "h-12 px-8 text-xs font-mono uppercase tracking-widest font-extrabold min-h-[48px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", whileHover, whileTap, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={whileHover ?? { scale: 1.01 }}
        whileTap={whileTap ?? { scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-sm transition-colors cursor-pointer select-none",
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
