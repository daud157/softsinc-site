"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

const SHOW_AFTER_PX = 520;

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isProductPage = pathname?.startsWith("/product/") ?? false;

  useEffect(() => {
    if (isAdmin || isProductPage) return;
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin, isProductPage]);

  if (isAdmin || isProductPage) return null;

  function scrollTop() {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-24 left-4 z-[55] inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-black/10 bg-ss-bg/95 text-sm font-bold text-ss-text shadow-lg backdrop-blur transition-opacity duration-200 hover:bg-ss-bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg dark:border-white/15 dark:bg-zinc-900/95 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-950 sm:bottom-28",
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
