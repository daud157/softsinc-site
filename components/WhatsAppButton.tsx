"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { WHATSAPP_LINK } from "@/lib/site";

export function WhatsAppButton({
  href = WHATSAPP_LINK,
  label = "Order on WhatsApp",
  className,
  variant = "primary",
}: {
  href?: string;
  label?: string;
  className?: string;
  variant?: "primary" | "ghost" | "white";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/35 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg";

  const variants: Record<NonNullable<typeof variant>, string> = {
    primary:
      "bg-[#4ade80] text-zinc-950 shadow-sm ring-1 ring-emerald-600/25 hover:bg-[#3fc871] active:bg-[#39ba69]",
    ghost:
      "bg-transparent text-ss-text ring-1 ring-black/10 hover:bg-black/5 active:bg-black/10",
    white:
      "bg-white text-zinc-900 shadow-sm ring-1 ring-black/10 hover:bg-zinc-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:ring-black/15",
  };

  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variants[variant], className)}
      >
        {label}
      </Link>
    </motion.div>
  );
}

