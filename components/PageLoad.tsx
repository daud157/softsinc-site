"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { fadeUp } from "@/lib/animations";

export function PageLoad({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith("/product/") ?? false;

  // Product pages are interaction-heavy (plan pills, qty, gallery). Framer’s
  // animated page wrapper has been observed to swallow taps on some mobile
  // browsers; use a plain div here so native click/pointer events always reach
  // the buttons/links underneath.
  if (isProductPage) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

