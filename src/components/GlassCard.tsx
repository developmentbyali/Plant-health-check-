"use client";
import { cn } from "@/lib/utils";
import React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
  onClick?: () => void;
  role?: string;
}>;

export default function GlassCard({ children, className, ...rest }: Props) {
  return (
    <div className={cn("glass-card soft-gradient glass-hover p-5", className)} {...rest}>
      {children}
    </div>
  );
}
