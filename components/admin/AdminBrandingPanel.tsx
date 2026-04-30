"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { cloudinaryBrandingLogoDeliveryUrl } from "@/lib/cloudinaryBrandingUrl";

export function AdminBrandingPanel() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [siteLogoUrl, setSiteLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/site-settings");
        const data = (await res.json()) as { siteLogoUrl?: string };
        if (!cancelled) {
          setSiteLogoUrl(typeof data.siteLogoUrl === "string" ? data.siteLogoUrl : "");
        }
      } catch {
        if (!cancelled) {
          setMessage({ type: "err", text: "Could not load settings." });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onUpload = async (file: File) => {
    setUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "softsinc/branding");
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      if (res.status === 401) {
        router.replace("/admin/login?from=/admin/branding");
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      const data = (await res.json()) as { secure_url: string };
      setSiteLogoUrl(data.secure_url);
      setMessage({
        type: "ok",
        text: "Image uploaded. Click Save to publish to the live site.",
      });
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Upload failed",
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/site-settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteLogoUrl }),
      });
      if (res.status === 401) {
        router.replace("/admin/login?from=/admin/branding");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      setMessage({ type: "ok", text: "Saved. Navbar and footer will show the new logo." });
      router.refresh();
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-ss-text/60">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Site"
        title="Logo & branding"
        subtitle="Upload a PNG or WebP with a transparent background when you want the logo to float on the navbar. Images are stored without auto-converting to JPEG, and the site delivers them as PNG so alpha is preserved."
      />

      <Card className="p-6 sm:p-8">
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ss-text/55">
              Preview
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 rounded-2xl bg-ss-bg-soft/80 px-4 py-4 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10">
              <div className="rounded-xl bg-ss-bg/55 px-3 py-2 ring-1 ring-black/5 backdrop-blur-sm dark:bg-zinc-950/40 dark:ring-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ss-text/45">
                  Navbar
                </span>
                <div className="mt-2 flex items-center gap-4 md:gap-5">
                  {siteLogoUrl ? (
                    <span className="relative isolate z-[1] block h-10 w-[min(7.5rem,36vw)] max-w-[120px] shrink-0 -translate-x-7 overflow-visible bg-transparent md:-translate-x-10 lg:-translate-x-12">
                      <Image
                        src={cloudinaryBrandingLogoDeliveryUrl(siteLogoUrl)}
                        alt="Site logo preview"
                        fill
                        sizes="(max-width: 767px) 220px, 360px"
                        className="origin-left scale-[1.58] object-contain object-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] md:scale-[2.08] lg:scale-[2.22] xl:scale-[2.35] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                      />
                    </span>
                  ) : (
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-[10px] font-bold text-white shadow-sm ring-1 ring-[#7C3AED]/20">
                      S
                    </span>
                  )}
                  <span className="text-base font-semibold tracking-tight text-ss-text">
                    Softsinc
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="site-logo-url"
              className="text-xs font-semibold uppercase tracking-wide text-ss-text/55"
            >
              Logo image URL
            </label>
            <input
              id="site-logo-url"
              type="url"
              value={siteLogoUrl}
              onChange={(e) => setSiteLogoUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/…"
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ss-text shadow-inner focus:border-ss-primary/40 focus:outline-none focus:ring-2 focus:ring-ss-primary/20 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <p className="mt-2 text-xs text-ss-text/50">
              Only <code className="rounded bg-ss-bg-soft px-1">https://res.cloudinary.com/…</code>{" "}
              URLs are accepted (use upload below).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onUpload(f);
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center justify-center rounded-full bg-ss-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ss-primary/90 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <button
              type="button"
              disabled={saving || siteLogoUrl === ""}
              onClick={() => setSiteLogoUrl("")}
              className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-5 py-2.5 text-sm font-semibold text-ss-text ring-1 ring-black/8 hover:bg-ss-bg-soft/80 disabled:opacity-40 dark:ring-white/10"
            >
              Clear URL
            </button>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-black/5 pt-6 dark:border-white/10">
            <button
              type="button"
              disabled={saving}
              onClick={() => void onSave()}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50 dark:from-ss-primary dark:to-ss-accent"
            >
              {saving ? "Saving…" : "Save to site"}
            </button>
          </div>

          {message ? (
            <p
              className={
                message.type === "ok"
                  ? "rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/50"
                  : "rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-900/50"
              }
            >
              {message.text}
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
