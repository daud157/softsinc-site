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
        "fixed bottom-[max(0.9rem,env(safe-area-inset-bottom))] right-4 z-[60] flex items-center justify-center sm:bottom-5 sm:right-5",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Ripple pulses */}
        <motion.span
          aria-hidden
          className="absolute inset-[-6px] rounded-full bg-[#25D366]/35 sm:inset-[-8px]"
          animate={{
            scale: [1, 1.35],
            opacity: [0.45, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-[-6px] rounded-full bg-[#25D366]/20 sm:inset-[-8px]"
          animate={{
            scale: [1, 1.5],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.7,
          }}
        />

        {/* Entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 20,
            mass: 0.85,
          }}
          className="relative"
        >
          {/* Gentle bob + hover */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            whileHover={{
              scale: 1.08,
              y: -8,
              transition: { type: "spring", stiffness: 420, damping: 16 },
            }}
            whileTap={{ scale: 0.9 }}
            className="drop-shadow-[0_8px_28px_rgba(37,211,102,0.45)] dark:drop-shadow-[0_10px_36px_rgba(37,211,102,0.35)]"
          >
            <WhatsAppButton
              variant="brand"
              iconOnly
              aria-label="Chat on WhatsApp"
              className="!h-12 !w-12 shadow-[0_6px_24px_rgba(37,211,102,0.5)] sm:!h-14 sm:!w-14"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
