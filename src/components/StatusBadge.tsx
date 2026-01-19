"use client";
import React from "react";
import { cn } from "@/lib/utils";

export type HealthStatus = "Healthy" | "Dry" | "Critical";

export default function StatusBadge({ status }: { status: HealthStatus }) {
  const base = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium glass-border";
  const color =
    status === "Healthy"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-300/25"
      : status === "Dry"
      ? "bg-amber-500/15 text-amber-200 border-amber-300/25"
      : "bg-rose-500/15 text-rose-200 border-rose-300/25";

  return <span className={cn(base, color)}>{status}</span>;
}
