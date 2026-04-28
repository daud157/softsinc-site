"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { ApiReview } from "@/data/reviews";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; message?: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function AdminReviewsPanel() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [listStatus, setListStatus] = useState<Status>({ kind: "loading" });
  const [formStatus, setFormStatus] = useState<Status>({ kind: "idle" });

  const [service, setService] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const goToLogin = useCallback(() => {
    router.push("/admin/login");
  }, [router]);

  const fetchReviews = useCallback(async () => {
    setListStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/reviews", {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Failed to load (${res.status})`);
      }
      const data = (await res.json()) as { reviews: ApiReview[] };
      setReviews(data.reviews);
      setListStatus({ kind: "idle" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load reviews";
      setListStatus({ kind: "error", message });
    }
  }, []);

  useEffect(() => {
    // Initial load + refetch when fetchReviews identity changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews();
  }, [fetchReviews]);

  const resetForm = () => {
    setService("");
    setCustomerName("");
    setRating(5);
    setFeatured(false);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setFormStatus({ kind: "error", message: "Please choose an image to upload." });
      return;
    }
    if (!service.trim()) {
      setFormStatus({ kind: "error", message: "Service is required." });
      return;
    }

    setFormStatus({ kind: "loading", message: "Uploading image to Cloudinary..." });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "softsinc/reviews");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (uploadRes.status === 401) {
        goToLogin();
        throw new Error("Session expired. Sign in again.");
      }

      if (!uploadRes.ok) {
        const data = (await uploadRes.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error || `Upload failed (${uploadRes.status})`);
      }

      const uploaded = (await uploadRes.json()) as { secure_url: string };
      setFormStatus({ kind: "loading", message: "Saving review to database..." });

      const saveRes = await fetch("/api/reviews", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploaded.secure_url,
          service: service.trim(),
          customerName: customerName.trim(),
          rating,
          featured,
        }),
      });

      if (saveRes.status === 401) {
        goToLogin();
        throw new Error("Session expired. Sign in again.");
      }

      if (!saveRes.ok) {
        const data = (await saveRes.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error || `Save failed (${saveRes.status})`);
      }

      setFormStatus({ kind: "success", message: "Review added successfully." });
      resetForm();
      fetchReviews();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setFormStatus({ kind: "error", message });
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Delete this review? This cannot be undone.");
      if (!ok) return;
    }
    setFormStatus({ kind: "loading", message: "Deleting review..." });
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        goToLogin();
        throw new Error("Session expired. Sign in again.");
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Delete failed (${res.status})`);
      }
      setFormStatus({ kind: "success", message: "Review deleted." });
      fetchReviews();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      setFormStatus({ kind: "error", message });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <Card className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">Add new review</h3>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ss-text/60">
              Review screenshot
            </label>
            <div
              className={cn(
                "mt-2 grid gap-3 rounded-2xl border border-dashed border-ss-primary/30 bg-ss-bg-soft/50 p-4",
                "transition-colors hover:border-ss-primary/60"
              )}
            >
              {previewUrl ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
                  {/* Object URL preview - use plain img to avoid next/image config */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Selected review preview"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="grid place-items-center rounded-xl bg-white/70 p-6 text-center text-sm text-ss-text/60 ring-1 ring-black/5">
                  PNG, JPG, or WebP up to 8 MB
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ss-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-ss-primary/90"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="service"
                className="text-xs font-semibold uppercase tracking-wide text-ss-text/60"
              >
                Service <span className="text-red-500">*</span>
              </label>
              <input
                id="service"
                type="text"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. LinkedIn Premium"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm focus:border-ss-primary/40 focus:outline-none focus:ring-2 focus:ring-ss-primary/20"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label
                htmlFor="customer"
                className="text-xs font-semibold uppercase tracking-wide text-ss-text/60"
              >
                Customer name (optional)
              </label>
              <input
                id="customer"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ahmed K."
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm focus:border-ss-primary/40 focus:outline-none focus:ring-2 focus:ring-ss-primary/20"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-ss-text/60">
                Rating
              </span>
              <div className="mt-2 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`Rate ${n} stars`}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full text-base ring-1 transition-colors",
                      n <= rating
                        ? "bg-ss-primary text-white ring-ss-primary/40"
                        : "bg-ss-bg-soft text-ss-text/60 ring-ss-primary/10 hover:bg-ss-bg-soft/80"
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <label className="inline-flex cursor-pointer select-none items-center gap-3 rounded-xl bg-ss-bg-soft/70 px-4 py-3 ring-1 ring-ss-primary/10">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 accent-[var(--ss-primary)]"
                  suppressHydrationWarning
                />
                <span className="text-sm font-semibold text-ss-text/80">
                  Mark as featured
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={formStatus.kind === "loading"}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ss-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all",
              "hover:bg-ss-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {formStatus.kind === "loading" ? (
              <>
                <Spinner />
                <span>{formStatus.message ?? "Working..."}</span>
              </>
            ) : (
              <span>Add review</span>
            )}
          </button>

          {formStatus.kind === "success" ? (
            <StatusPill tone="success">{formStatus.message}</StatusPill>
          ) : null}
          {formStatus.kind === "error" ? (
            <StatusPill tone="error">{formStatus.message}</StatusPill>
          ) : null}
        </form>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">
            All reviews{" "}
            <span className="ml-1 text-sm font-medium text-ss-text/55">
              ({reviews.length})
            </span>
          </h3>
          <button
            type="button"
            onClick={fetchReviews}
            className="text-xs font-semibold text-ss-primary/80 hover:text-ss-primary"
          >
            Refresh
          </button>
        </div>

        {listStatus.kind === "loading" ? (
          <div className="mt-6 grid place-items-center rounded-2xl bg-ss-bg-soft/50 p-10 text-sm text-ss-text/60 ring-1 ring-ss-primary/10">
            <Spinner />
            <div className="mt-2">Loading reviews...</div>
          </div>
        ) : listStatus.kind === "error" ? (
          <StatusPill tone="error" className="mt-5">
            {listStatus.message}
          </StatusPill>
        ) : reviews.length === 0 ? (
          <div className="mt-6 grid place-items-center rounded-2xl bg-ss-bg-soft/50 p-10 text-center text-sm text-ss-text/60 ring-1 ring-ss-primary/10">
            <div>
              <div className="text-base font-semibold text-ss-text/80">
                No reviews yet
              </div>
              <div className="mt-1 text-ss-text/55">
                Add your first review using the form on the left.
              </div>
            </div>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {reviews.map((r) => (
              <li
                key={r._id}
                className="flex items-center gap-4 rounded-2xl bg-ss-bg-soft/40 p-3 ring-1 ring-ss-primary/10"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
                  <Image
                    src={r.image}
                    alt={`Review ${r.service}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-ss-text/85">
                      {r.service}
                    </span>
                    {r.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-ss-primary to-ss-accent px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-white/20">
                        ★ Featured
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-ss-text/60">
                    <span className="text-ss-text/80">
                      {"★".repeat(Math.min(5, Math.max(1, r.rating)))}
                      <span className="text-ss-text/25">
                        {"★".repeat(5 - Math.min(5, Math.max(1, r.rating)))}
                      </span>
                    </span>
                    {r.customerName ? <span>· {r.customerName}</span> : null}
                    {r.createdAt ? (
                      <span>· {new Date(r.createdAt).toLocaleDateString()}</span>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(r._id)}
                  className="inline-flex h-9 items-center justify-center rounded-full bg-white px-3 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

function StatusPill({
  tone,
  children,
  className,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex w-full items-start gap-2 rounded-xl px-3 py-2 text-sm ring-1",
        tone === "success"
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-red-50 text-red-700 ring-red-200",
        className
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <span aria-hidden="true" className="mt-0.5">
        {tone === "success" ? "✓" : "!"}
      </span>
      <span>{children}</span>
    </div>
  );
}
