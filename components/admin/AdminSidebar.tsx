"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Overview & quick actions",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    description: "Catalog, plans & pricing",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" />
      </svg>
    ),
  },
  {
    href: "/admin/branding",
    label: "Branding",
    description: "Site logo in navbar & footer",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    description: "Customer reviews & screenshots",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.367 2.446c-.785.57-1.84-.196-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.55 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl bg-white/70 p-3 ring-1 ring-black/5 backdrop-blur sm:p-4">
        <div className="flex items-center justify-between gap-2 px-2 pb-3 pt-1">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ss-primary">
              Softsinc
            </div>
            <div className="text-sm font-semibold text-ss-text">Admin Panel</div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-ss-bg-soft px-2.5 py-1 text-[10px] font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Site
          </Link>
        </div>

        <nav className="grid gap-1.5 border-b border-black/5 pb-3 dark:border-white/10">
          {ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-start gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-gradient-to-br from-ss-primary/15 to-ss-accent/10 text-ss-primary ring-1 ring-ss-primary/15"
                    : "text-ss-text/75 hover:bg-ss-bg-soft/70"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors",
                    active
                      ? "bg-ss-primary text-white ring-ss-primary/20"
                      : "bg-white text-ss-primary/80 ring-black/5 group-hover:text-ss-primary"
                  )}
                >
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block font-semibold",
                      active ? "text-ss-primary" : "text-ss-text"
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="block truncate text-[11px] text-ss-text/55">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="mt-3 w-full rounded-2xl px-3 py-2.5 text-left text-xs font-semibold text-ss-text/60 ring-1 ring-black/5 transition hover:bg-red-50 hover:text-red-700 hover:ring-red-100 dark:hover:bg-red-950/30 dark:hover:text-red-300 dark:hover:ring-red-900/40"
          onClick={async () => {
            await fetch("/api/admin/logout", {
              method: "POST",
              credentials: "include",
            });
            window.location.href = "/admin/login";
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
