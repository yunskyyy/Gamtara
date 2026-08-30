"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  isInteractive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, isInteractive = false, whileHover, children, ...props }, ref) => {
    const motionHover = isInteractive ? whileHover ?? { y: -3, transition: { duration: 0.2 } } : {};

    return (
      <motion.div
        ref={ref}
        whileHover={motionHover}
        className={cn(
          "rounded-none border border-stone-800 bg-[#f5f3ec] p-5 shadow-lg font-sans text-stone-900 transition-all duration-200",
          isInteractive && "hover:border-emerald-800 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";
