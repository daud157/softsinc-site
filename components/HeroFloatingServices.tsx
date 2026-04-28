"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";
import type { Service } from "@/lib/services";

function MiniServiceCard({ s }: { s: Service }) {
  return (
    <div className="w-64 rounded-2xl bg-white/85 p-4 text-zinc-900 shadow-[0_20px_60px_-35px_rgba(17,24,39,0.55)] ring-1 ring-black/5 backdrop-blur dark:bg-white/90 dark:text-zinc-950 dark:ring-zinc-200/40">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ss-bg-soft text-sm font-extrabold text-ss-primary ring-1 ring-ss-primary/10">
          {s.iconLabel}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-950">
            {s.title}
          </div>
          <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-700">
            {s.category}
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs leading-5 text-zinc-600 dark:text-zinc-700">
        {s.description}
      </div>
    </div>
  );
}

export function HeroFloatingServices({
  services,
  className,
}: {
  services: Service[];
  className?: string;
}) {
  const a = services[0];
  const b = services[1];
  const c = services[2];
  if (!a || !b || !c) return null;

  return (
    <div className={cn("relative hidden lg:block", className)} aria-hidden="true">
      <motion.div
        className="absolute right-0 top-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <MiniServiceCard s={a} />
      </motion.div>

      <motion.div
        className="absolute right-28 top-44"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <MiniServiceCard s={b} />
      </motion.div>

      <motion.div
        className="absolute right-10 top-80"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <MiniServiceCard s={c} />
      </motion.div>
    </div>
  );
}

