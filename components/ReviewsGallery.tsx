"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { ReviewCard } from "@/components/ReviewCard";
import { ReviewLightbox } from "@/components/ReviewLightbox";
import type { ReviewItem } from "@/data/reviews";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function ReviewsGallery({
  reviews,
  limit,
}: {
  reviews: ReviewItem[];
  limit?: number;
}) {
  const items = useMemo(
    () => (typeof limit === "number" ? reviews.slice(0, limit) : reviews),
    [reviews, limit]
  );

  const [active, setActive] = useState<ReviewItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-ss-bg-soft/60 p-8 text-center ring-1 ring-ss-primary/10 sm:p-10">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ss-primary ring-1 ring-ss-primary/15 dark:bg-zinc-900 dark:ring-white/10">
          <span aria-hidden="true" className="text-xl">★</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight">
          Reviews coming soon
        </h3>
        <p className="mt-2 text-sm leading-6 text-ss-text/65">
          We&apos;re collecting fresh customer feedback right now. Check back shortly
          to see real Softsinc reviews from our happy clients.
        </p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px 100px 0px" }}
        className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((r) => (
          <motion.div key={r.id} variants={fadeUp}>
            <ReviewCard review={r} onClick={() => setActive(r)} />
          </motion.div>
        ))}
      </motion.div>

      <ReviewLightbox
        review={active}
        open={!!active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

