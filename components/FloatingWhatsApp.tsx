"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/cn";

export function FloatingWhatsApp({ className }: { className?: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/product/") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-[max(0.9rem,env(safe-area-inset-bottom))] right-4 z-[60] flex items-center justify-center sm:bottom-5 sm:right-5 dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="drop-shadow-[0_14px_30px_rgba(17,24,39,0.18)]"
      >
        <WhatsAppButton label="WhatsApp" className="px-4 py-2.5 sm:px-5 sm:py-3" />
      </motion.div>
    </div>
  );
}

