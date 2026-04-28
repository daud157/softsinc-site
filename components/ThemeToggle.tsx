"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      suppressHydrationWarning
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative z-10 inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-black/10 bg-white text-lg shadow-sm transition hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg dark:border-white/15 dark:bg-zinc-900 dark:text-amber-200 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)] dark:hover:bg-white/8 dark:focus-visible:ring-offset-zinc-950",
        className
      )}
    >
      <span className="sr-only">
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </span>
      <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
}
