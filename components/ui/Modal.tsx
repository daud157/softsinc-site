"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
            type="button"
          />

          <div className="relative mx-auto flex min-h-full w-full max-w-2xl items-end px-4 py-6 sm:items-center sm:px-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title ?? "Dialog"}
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className={cn(
                "w-full overflow-hidden rounded-2xl bg-white text-zinc-900 shadow-[0_30px_80px_-35px_rgba(17,24,39,0.55)] ring-1 ring-black/10 dark:bg-zinc-50 dark:text-zinc-950 dark:ring-black/15",
                className
              )}
            >
              {title ? (
                <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-black/10">
                  <div className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-950">
                    {title}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
                  >
                    Close
                  </button>
                </div>
              ) : null}
              <div className="px-5 py-5">{children}</div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

