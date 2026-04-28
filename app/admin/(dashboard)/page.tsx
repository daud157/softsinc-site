import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

type Section = {
  href: string;
  title: string;
  description: string;
  cta: string;
  accent: "primary" | "accent";
  icon: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    href: "/admin/products",
    title: "Products",
    description:
      "Add or edit products in your catalog. Upload a logo, set top-level pricing, and configure plans with their own pricing.",
    cta: "Manage products",
    accent: "primary",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h1.17A3.001 3.001 0 015 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" />
      </svg>
    ),
  },
  {
    href: "/admin/reviews",
    title: "Reviews",
    description:
      "Upload customer review screenshots, attach service + customer details, mark featured, and remove old reviews.",
    cta: "Manage reviews",
    accent: "accent",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.367 2.446c-.785.57-1.84-.196-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.55 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
      </svg>
    ),
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Admin"
        title="Dashboard"
        subtitle="Welcome back. Choose a section below to manage your site content."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-30px_rgba(124,58,237,0.45)] sm:p-7"
          >
            <div
              className={
                s.accent === "primary"
                  ? "pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-ss-primary/10 blur-2xl"
                  : "pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-ss-accent/15 blur-2xl"
              }
            />
            <div className="relative flex items-start gap-4">
              <span
                className={
                  s.accent === "primary"
                    ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ss-primary text-white shadow-sm ring-1 ring-ss-primary/20"
                    : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-ss-primary to-ss-accent text-white shadow-sm ring-1 ring-white/20"
                }
              >
                {s.icon}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight text-ss-text">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-ss-text/65">
                  {s.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ss-primary">
                  {s.cta}
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-3xl bg-ss-bg-soft/60 p-5 ring-1 ring-ss-primary/10 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight text-ss-text">
          Tips
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-ss-text/70 sm:grid-cols-2">
          <li className="flex gap-2">
            <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-ss-primary" />
            <span>
              Set <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-black/10">
                ADMIN_PASSWORD
              </code>{" "}
              in <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-black/10">
                .env.local
              </code>{" "}
              to require sign-in at{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-black/10">
                /admin/login
              </code>{" "}
              (httpOnly session cookie). Optional{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-black/10">
                ADMIN_SESSION_SECRET
              </code>{" "}
              signs cookies separately from the password. Scripts can still use{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-black/10">
                x-admin-password
              </code>{" "}
              or Bearer.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-ss-primary" />
            <span>
              Disabling a product or plan hides it from the public catalog
              without deleting your data.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-ss-primary" />
            <span>
              Images upload to Cloudinary and the CDN URL is saved with the
              record. Deletes also clean up the Cloudinary asset.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-ss-primary" />
            <span>
              All admin pages are tagged{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-black/10">
                noindex
              </code>{" "}
              so they don&apos;t show up in search results.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
