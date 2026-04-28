"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {items.map((it, idx) => {
        const open = openIdx === idx;
        return (
          <Card key={it.question} className="p-0">
            <button
              type="button"
              onClick={() => setOpenIdx((v) => (v === idx ? null : idx))}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={open}
            >
              <span className="text-base font-semibold tracking-tight">
                {it.question}
              </span>
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full bg-ss-bg-soft text-sm font-black text-ss-primary ring-1 ring-ss-primary/10 transition-transform",
                  open && "rotate-45"
                )}
              >
                +
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-sm leading-6 text-ss-text/70">
                    {it.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}

