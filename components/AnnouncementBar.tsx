import Link from "next/link";

import { Container } from "@/components/Container";
import { IconStars } from "@/components/icons/HomeIcons";
import { WHATSAPP_LINK } from "@/lib/site";
import { cn } from "@/lib/cn";

export function AnnouncementBar() {
  return (
    <div
      className={cn(
        "relative z-8 dark:border-white/10",
        "bg-[#FAF9FF] dark:bg-zinc-900/40"
      )}
    >
      {/* <Container className="relative py-2.5 sm:px-4 sm:py-2 lg:py-2">
        <p
          className={cn(
            "mx-auto flex w-full max-w-2xl items-center justify-center gap-2 rounded-full px-3 py-2.5 text-center sm:gap-2.5",
            "bg-gradient-to-r from-[#7C3AED]/10 via-[#A855F7]/8 to-[#7C3AED]/10",
            "text-[11px] font-medium leading-snug text-ss-text/80",
            "ring-1 ring-[#7C3AED]/10 dark:ring-white/10 sm:text-xs"
          )}
        >
          <IconStars className="h-4 w-4 shrink-0 text-ss-primary sm:h-[1.125rem] sm:w-[1.125rem]" />
          <span>
            Limited-time offers —{" "}
            <Link
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ss-primary underline-offset-2 hover:underline dark:text-ss-accent"
            >
              Chat on WhatsApp
            </Link>
          </span>
        </p>
        <Link
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/20 hover:bg-white/90 dark:bg-zinc-800 dark:ring-white/10 lg:inline-flex"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#25D366]" aria-hidden />
          WhatsApp
        </Link>
      </Container> */}
    </div>
  );
}
