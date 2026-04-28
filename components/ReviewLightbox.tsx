"use client";

import Image from "next/image";

import { Modal } from "@/components/ui/Modal";
import type { ReviewItem } from "@/data/reviews";

function StarRow({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      className="inline-flex items-center gap-0.5"
      aria-label={`Rated ${filled} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={
            i < filled ? "h-4 w-4 text-amber-400" : "h-4 w-4 text-zinc-300"
          }
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.367 2.446c-.785.57-1.84-.196-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.55 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewLightbox({
  review,
  open,
  onClose,
}: {
  review: ReviewItem | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={review?.service ? `Review — ${review.service}` : "Review"}
      className="max-w-4xl"
    >
      {review ? (
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl bg-ss-bg-soft/40 ring-1 ring-black/10">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={review.image}
                alt={`Review screenshot${review.service ? ` — ${review.service}` : ""}`}
                fill
                className="object-contain bg-white"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>

            {review.featured ? (
              <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-ss-primary to-ss-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md ring-1 ring-white/20">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.367 2.446c-.785.57-1.84-.196-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.55 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
                Featured
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ss-bg-soft/50 px-4 py-3 ring-1 ring-ss-primary/10">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ss-primary to-ss-accent text-sm font-bold text-white shadow-sm ring-2 ring-white"
              >
                {(review.customerName?.trim().charAt(0) ?? "C").toUpperCase()}
              </span>
              <div>
                <div className="text-sm font-semibold text-ss-text">
                  {review.customerName?.trim() || "Verified customer"}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-ss-text/55">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Verified review
                  {review.service ? <span>· {review.service}</span> : null}
                </div>
              </div>
            </div>
            <StarRow rating={review.rating} />
          </div>

          <div className="text-center text-xs text-zinc-500 dark:text-zinc-600">
            Tap outside or press Esc to close
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
