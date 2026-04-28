"use client";

import Image from "next/image";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { ReviewItem } from "@/data/reviews";

function StarRating({
  rating,
  size = "sm",
  className,
}: {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const total = 5;
  const filled = Math.max(0, Math.min(total, Math.round(rating)));
  const sizeClass = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`Rated ${filled} out of ${total} stars`}
      role="img"
    >
      {Array.from({ length: total }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={cn(
            sizeClass,
            i < filled
              ? "text-amber-400 drop-shadow-[0_1px_0_rgba(0,0,0,0.04)]"
              : "text-ss-text/15"
          )}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.367 2.446c-.785.57-1.84-.196-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.55 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

function CustomerAvatar({ name }: { name?: string }) {
  const initial = (name?.trim().charAt(0) ?? "C").toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ss-primary to-ss-accent text-sm font-bold text-white shadow-sm ring-2 ring-white"
    >
      {initial}
    </span>
  );
}

export function ReviewCard({
  review,
  onClick,
  className,
}: {
  review: ReviewItem;
  onClick?: () => void;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const customerLabel = review.customerName?.trim() || "Verified customer";

  return (
    <div className={className}>
      <div
        className={cn(
          "group relative h-full rounded-2xl p-[1px] transition-all duration-300",
          "bg-gradient-to-br",
          review.featured
            ? "from-ss-primary/55 via-ss-accent/35 to-ss-primary/25"
            : "from-ss-primary/25 via-ss-accent/15 to-transparent",
          "hover:from-ss-primary/55 hover:via-ss-accent/35 hover:to-ss-primary/20"
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.32),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.24),transparent_55%)]" />

        <Card
          className={cn(
            "relative h-full cursor-pointer p-3 sm:p-4 transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-[0_22px_60px_-30px_rgba(124,58,237,0.55)]",
            "active:translate-y-0 active:scale-[0.99]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg"
          )}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={
            onClick
              ? `View full review${review.service ? ` for ${review.service}` : ""}`
              : undefined
          }
          onClick={onClick}
          onKeyDown={(e) => {
            if (!onClick) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick();
            }
          }}
        >
          {/* Image frame — inset with padding so the screenshot is never edge-to-edge */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-ss-bg-soft/70 via-white to-ss-bg-soft/50 ring-1 ring-black/5 sm:aspect-[5/4]">
            {!imgError ? (
              <>
                <div className="absolute inset-2 sm:inset-3">
                  <div className="relative h-full w-full">
                    <Image
                      src={review.image}
                      alt={`Review screenshot${review.service ? ` — ${review.service}` : ""}`}
                      fill
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={() => setImgError(true)}
                    />
                  </div>
                </div>

                {/* Top-left: featured ribbon */}
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

                {/* Top-right: service chip */}
                {review.service ? (
                  <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm backdrop-blur ring-1 ring-black/5 dark:bg-white/95 dark:text-zinc-900">
                    {review.service}
                  </span>
                ) : null}

                {/* Hover/focus: View pill */}
                <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-ss-primary shadow-lg backdrop-blur ring-1 ring-ss-primary/20">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9zm6.25-2.25a.75.75 0 011.5 0V8.25h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5V6.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View full review
                  </span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center p-6 text-center">
                <div>
                  <div className="text-sm font-semibold text-ss-text">
                    Review image missing
                  </div>
                  <div className="mt-2 text-xs leading-5 text-ss-text/60">
                    The image URL could not be loaded.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-3.5 flex items-center justify-between gap-3 sm:mt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <CustomerAvatar name={review.customerName} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-ss-text">
                  {customerLabel}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-ss-text/55">
                  <span
                    aria-hidden="true"
                    className="relative inline-flex h-1.5 w-1.5"
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Verified review
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <StarRating rating={review.rating} />
              {review.date ? (
                <span className="text-[10px] text-ss-text/45">{review.date}</span>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
