"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || `Login failed (${res.status})`);
        return;
      }
      router.replace(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md p-8 shadow-lg ring-1 ring-black/5">
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ss-primary">
            Softsinc
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ss-text">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-ss-text/65">
            Enter the password configured as{" "}
            <code className="rounded bg-ss-bg-soft px-1 py-0.5 text-xs ring-1 ring-ss-primary/15">
              ADMIN_PASSWORD
            </code>{" "}
            on the server. In local <code className="text-xs">next dev</code>, if
            that variable is unset, the repo&apos;s dev fallback applies (
            <code className="rounded bg-ss-bg-soft px-1 py-0.5 text-xs ring-1 ring-ss-primary/15">
              lib/adminSession.ts
            </code>
            ).
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="admin-login-password"
              className="text-xs font-semibold uppercase tracking-wide text-ss-text/55"
            >
              Password
            </label>
            <input
              id="admin-login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ss-text shadow-inner focus:border-ss-primary/40 focus:outline-none focus:ring-2 focus:ring-ss-primary/20 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-900/50">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full rounded-xl bg-ss-primary py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ss-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ss-text/50">
          <Link href="/" className="font-semibold text-ss-primary hover:underline">
            ← Back to site
          </Link>
        </p>
      </Card>
    </Container>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[70vh] items-center justify-center py-12">
          <p className="text-sm text-ss-text/60">Loading…</p>
        </Container>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
