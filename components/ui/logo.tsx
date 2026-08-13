"use client";

import * as React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: "icon" | "full";
  height?: number;
}

export function Logo({ variant = "full", height = 44, className = "", alt = "GAMTARA Logo", ...props }: LogoProps) {
  const src = variant === "icon" ? "/logo.png" : "/logo-full.png";

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: `${height}px`, width: "auto" }}
      className={`object-contain select-none ${className}`}
      {...props}
    />
  );
}
