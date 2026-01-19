"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm transition-colors",
        pathname === href ? "bg-white/10 text-white" : "text-zinc-200/80 hover:text-white hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );

  return (
    <nav className="glass-card glass-border soft-gradient flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        <Leaf className="text-emerald-300" size={18} />
        <span className="text-sm text-zinc-200/90">Plant & Soil Health</span>
      </div>
      <div className="flex items-center gap-1">
        {link("/", "Dashboard")}
        {link("/history", "History")}
        {link("/settings", "Settings")}
      </div>
    </nav>
  );
}
