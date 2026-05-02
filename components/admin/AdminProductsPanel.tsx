"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProductLogoTile } from "@/components/ProductLogoTile";
import { Card } from "@/components/ui/Card";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { cn } from "@/lib/cn";
import {
  PRODUCT_CATEGORIES,
  type ApiPlan,
  type ApiProduct,
} from "@/data/products";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; message?: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type FormState = {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  category: ApiProduct["category"];
  logoUrl: string;
  images: string[];
  iconLabel: string;
  popular: boolean;
  disabled: boolean;
  /** Whole number ≥ 0 for catalog order; empty on create = append last. */
  sortOrder: string;
  benefitsText: string;
  originalPrice: string;
  offerPrice: string;
  priceSuffix: string;
  discountPercent: string;
  plans: ApiPlan[];
};

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  description: "",
  category: "Productivity",
  logoUrl: "",
  images: [],
  iconLabel: "",
  popular: false,
  disabled: false,
  sortOrder: "",
  benefitsText: "",
  originalPrice: "",
  offerPrice: "",
  priceSuffix: "/month",
  discountPercent: "",
  plans: [],
};

function formatRs(n?: number) {
  if (typeof n !== "number") return "—";
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function catalogSortKey(p: ApiProduct): number {
  return typeof p.sortOrder === "number" ? p.sortOrder : 0;
}

function compareCatalogProducts(a: ApiProduct, b: ApiProduct): number {
  const ao = catalogSortKey(a);
  const bo = catalogSortKey(b);
  if (ao !== bo) return ao - bo;
  const ad = a.createdAt ?? "";
  const bd = b.createdAt ?? "";
  return bd.localeCompare(ad);
}

function putPayloadFromProduct(
  p: ApiProduct,
  overrides?: { sortOrder?: number; disabled?: boolean }
) {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description ?? "",
    category: p.category,
    logoUrl: p.logoUrl ?? "",
    images: Array.isArray(p.images) ? p.images : [],
    iconLabel: p.iconLabel ?? "",
    popular: Boolean(p.popular),
    disabled:
      overrides?.disabled !== undefined ? overrides.disabled : Boolean(p.disabled),
    benefits: Array.isArray(p.benefits) ? p.benefits : [],
    originalPrice: p.originalPrice,
    offerPrice: p.offerPrice,
    priceSuffix: p.priceSuffix ?? "/month",
    discountPercent: p.discountPercent,
    plans: p.plans ?? [],
    sortOrder:
      overrides?.sortOrder !== undefined ? overrides.sortOrder : catalogSortKey(p),
  };
}

export function AdminProductsPanel() {
  const router = useRouter();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [listStatus, setListStatus] = useState<Status>({ kind: "loading" });
  const [actionStatus, setActionStatus] = useState<Status>({ kind: "idle" });

  const [mode, setMode] = useState<"list" | "edit" | "create">("list");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const goToLogin = useCallback(() => {
    router.push("/admin/login");
  }, [router]);

  const fetchProducts = useCallback(async () => {
    setListStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/products", {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Failed to load (${res.status})`);
      }
      const data = (await res.json()) as { products: ApiProduct[] };
      setProducts(data.products);
      setListStatus({ kind: "idle" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load products";
      setListStatus({ kind: "error", message });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const startCreate = () => {
    setForm(EMPTY_FORM);
    setMode("create");
    setActionStatus({ kind: "idle" });
  };

  const startEdit = (p: ApiProduct) => {
    setForm({
      _id: p._id,
      slug: p.slug,
      title: p.title,
      description: p.description ?? "",
      category: p.category,
      logoUrl: p.logoUrl ?? "",
      images: Array.isArray(p.images) ? [...p.images] : [],
      iconLabel: p.iconLabel ?? "",
      popular: Boolean(p.popular),
      disabled: Boolean(p.disabled),
      sortOrder:
        typeof p.sortOrder === "number" ? String(p.sortOrder) : "",
      benefitsText: (p.benefits ?? []).join("\n"),
      originalPrice:
        typeof p.originalPrice === "number" ? String(p.originalPrice) : "",
      offerPrice: String(p.offerPrice),
      priceSuffix: p.priceSuffix ?? "/month",
      discountPercent:
        typeof p.discountPercent === "number" ? String(p.discountPercent) : "",
      plans: (p.plans ?? []).map((pl) => ({
        ...pl,
        headline: pl.headline ?? "",
        originalPriceNote: pl.originalPriceNote ?? "",
        keyHighlights: Array.isArray(pl.keyHighlights)
          ? [...pl.keyHighlights]
          : [],
        benefits: Array.isArray(pl.benefits) ? [...pl.benefits] : [],
        requirements: Array.isArray(pl.requirements)
          ? [...pl.requirements]
          : [],
        activationSteps: Array.isArray(pl.activationSteps)
          ? [...pl.activationSteps]
          : [],
        customHeading: pl.customHeading
          ? {
              eyebrow: pl.customHeading.eyebrow ?? "",
              title: pl.customHeading.title ?? "",
              subtitle: pl.customHeading.subtitle ?? "",
              tone: pl.customHeading.tone ?? "primary",
            }
          : undefined,
        customContent: pl.customContent ?? "",
      })),
    });
    setMode("edit");
    setActionStatus({ kind: "idle" });
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setMode("list");
    setActionStatus({ kind: "idle" });
  };

  const handleDelete = async (p: ApiProduct) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        `Delete "${p.title}" permanently? This cannot be undone.`
      );
      if (!ok) return;
    }
    setActionStatus({ kind: "loading", message: "Deleting product..." });
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(p._id)}`, {
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
      setActionStatus({ kind: "success", message: `Deleted "${p.title}".` });
      fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      setActionStatus({ kind: "error", message });
    }
  };

  const toggleDisabled = async (p: ApiProduct) => {
    setActionStatus({
      kind: "loading",
      message: p.disabled ? "Enabling..." : "Disabling...",
    });
    try {
      const payload = putPayloadFromProduct(p, { disabled: !p.disabled });
      const res = await fetch(`/api/products/${encodeURIComponent(p._id)}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        goToLogin();
        throw new Error("Session expired. Sign in again.");
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Update failed (${res.status})`);
      }
      setActionStatus({
        kind: "success",
        message: p.disabled ? "Product enabled." : "Product disabled.",
      });
      fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update";
      setActionStatus({ kind: "error", message });
    }
  };

  const reorderProduct = useCallback(
    async (p: ApiProduct, dir: -1 | 1) => {
      const sorted = [...products].sort(compareCatalogProducts);
      const idx = sorted.findIndex((x) => x._id === p._id);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= sorted.length) return;

      const reordered = [...sorted];
      [reordered[idx], reordered[j]] = [reordered[j], reordered[idx]];

      setActionStatus({ kind: "loading", message: "Updating order..." });
      try {
        const updates = reordered
          .map((prod, order) => ({ prod, order }))
          .filter(({ prod, order }) => catalogSortKey(prod) !== order);

        await Promise.all(
          updates.map(({ prod, order }) =>
            fetch(`/api/products/${encodeURIComponent(prod._id)}`, {
              method: "PUT",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(
                putPayloadFromProduct(prod, { sortOrder: order })
              ),
            }).then(async (res) => {
              if (res.status === 401) {
                goToLogin();
                throw new Error("Session expired. Sign in again.");
              }
              if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as {
                  error?: string;
                };
                throw new Error(data.error || `Update failed (${res.status})`);
              }
            })
          )
        );

        setActionStatus({
          kind: "success",
          message: "Catalog order updated.",
        });
        fetchProducts();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update order";
        setActionStatus({ kind: "error", message });
      }
    },
    [products, fetchProducts, goToLogin]
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ss-text/55">
              Catalog
            </div>
            <div className="mt-0.5 text-sm text-ss-text/75">
              <span className="font-semibold text-ss-text">
                {products.length}
              </span>{" "}
              product{products.length === 1 ? "" : "s"} ·{" "}
              <span className="font-semibold text-emerald-600">
                {products.filter((p) => !p.disabled).length}
              </span>{" "}
              live ·{" "}
              <span className="font-semibold text-ss-text/55">
                {products.filter((p) => p.disabled).length}
              </span>{" "}
              disabled
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fetchProducts}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ss-text/70 ring-1 ring-black/10 hover:bg-black/5"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-1.5 rounded-full bg-ss-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-ss-primary/90"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add product
            </button>
          </div>
        </div>

        {actionStatus.kind === "success" ? (
          <StatusPill tone="success" className="mt-4">
            {actionStatus.message}
          </StatusPill>
        ) : null}
        {actionStatus.kind === "error" ? (
          <StatusPill tone="error" className="mt-4">
            {actionStatus.message}
          </StatusPill>
        ) : null}
      </Card>

      {/* Form */}
      {mode !== "list" ? (
        <ProductForm
          form={form}
          setForm={setForm}
          mode={mode}
          onCancel={cancelForm}
          onSaved={() => {
            setActionStatus({
              kind: "success",
              message: mode === "create" ? "Product created." : "Product updated.",
            });
            cancelForm();
            fetchProducts();
          }}
          onAuthRequired={goToLogin}
        />
      ) : null}

      {/* Products list */}
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight">Products</h3>
        </div>

        {listStatus.kind === "loading" ? (
          <div className="mt-5 grid place-items-center rounded-2xl bg-ss-bg-soft/50 p-10 text-sm text-ss-text/60 ring-1 ring-ss-primary/10">
            <Spinner />
            <div className="mt-2">Loading products...</div>
          </div>
        ) : listStatus.kind === "error" ? (
          <StatusPill tone="error" className="mt-5">
            {listStatus.message}
          </StatusPill>
        ) : products.length === 0 ? (
          <div className="mt-6 grid place-items-center rounded-2xl bg-ss-bg-soft/50 p-10 text-center text-sm text-ss-text/60 ring-1 ring-ss-primary/10">
            <div>
              <div className="text-base font-semibold text-ss-text/80">
                No products yet
              </div>
              <div className="mt-1 text-ss-text/55">
                Click <span className="font-semibold">Add product</span> above
                to create your first one.
              </div>
            </div>
          </div>
        ) : (
          <ul className="mt-5 grid gap-3">
            {[...products].sort(compareCatalogProducts).map((p, listIdx, arr) => (
              <li
                key={p._id}
                className={cn(
                  "rounded-2xl bg-white p-3 ring-1 transition-colors sm:p-4",
                  p.disabled
                    ? "ring-black/5 opacity-70"
                    : "ring-ss-primary/10 hover:ring-ss-primary/20"
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:gap-1">
                    <span
                      className="grid min-w-[2rem] place-items-center rounded-lg bg-ss-bg-soft px-2 py-1 text-xs font-bold tabular-nums text-ss-primary ring-1 ring-ss-primary/15"
                      title="Catalog position"
                    >
                      {listIdx + 1}
                    </span>
                    <div className="flex gap-0.5">
                      <button
                        type="button"
                        title="Move up"
                        aria-label={`Move ${p.title} up`}
                        disabled={listIdx === 0 || actionStatus.kind === "loading"}
                        onClick={() => reorderProduct(p, -1)}
                        className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-ss-text/70 ring-1 ring-black/10 hover:bg-black/5 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        title="Move down"
                        aria-label={`Move ${p.title} down`}
                        disabled={
                          listIdx >= arr.length - 1 ||
                          actionStatus.kind === "loading"
                        }
                        onClick={() => reorderProduct(p, 1)}
                        className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-ss-text/70 ring-1 ring-black/10 hover:bg-black/5 disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ss-bg-soft ring-1 ring-black/5 sm:h-20 sm:w-20">
                    {p.logoUrl ? (
                      <Image
                        src={p.logoUrl}
                        alt={`${p.title} logo`}
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[11px] font-bold uppercase tracking-wider text-ss-primary/70">
                        {(p.iconLabel || p.title.slice(0, 2)).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-ss-text">
                        {p.title}
                      </span>
                      <span className="rounded-full bg-ss-bg-soft px-2 py-0.5 text-[10px] font-semibold text-ss-primary ring-1 ring-ss-primary/10">
                        {p.category}
                      </span>
                      {p.popular ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">
                          Popular
                        </span>
                      ) : null}
                      {p.disabled ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 ring-1 ring-red-200">
                          Disabled
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-ss-text/55">
                      /{p.slug}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ss-text/65">
                      <span>
                        From{" "}
                        <span className="font-semibold text-ss-primary">
                          {formatRs(p.offerPrice)}
                          {p.priceSuffix}
                        </span>
                      </span>
                      <span>
                        {(p.plans ?? []).length} plan
                        {(p.plans ?? []).length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDisabled(p)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors",
                        p.disabled
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100"
                          : "bg-ss-bg-soft text-ss-text/80 ring-black/10 hover:bg-ss-bg-soft/70"
                      )}
                    >
                      {p.disabled ? "Enable" : "Disable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="rounded-full bg-ss-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-ss-primary/90"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

// --- Form -----------------------------------------------------------------

function ProductForm({
  form,
  setForm,
  mode,
  onCancel,
  onSaved,
  onAuthRequired,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  mode: "edit" | "create";
  onCancel: () => void;
  onSaved: () => void;
  onAuthRequired: () => void;
}) {
  const [submitStatus, setSubmitStatus] = useState<Status>({ kind: "idle" });
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    setSubmitStatus({ kind: "loading", message: "Uploading logo..." });
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "softsinc/products");
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      if (res.status === 401) {
        onAuthRequired();
        throw new Error("Session expired. Sign in again.");
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      const data = (await res.json()) as { secure_url: string };
      setForm((f) => ({ ...f, logoUrl: data.secure_url }));
      setSubmitStatus({ kind: "success", message: "Logo uploaded." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setSubmitStatus({ kind: "error", message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const uploadOneToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "softsinc/products");
    const res = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    if (res.status === 401) {
      onAuthRequired();
      throw new Error("Session expired. Sign in again.");
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error || `Upload failed (${res.status})`);
    }
    const data = (await res.json()) as { secure_url: string };
    return data.secure_url;
  };

  const handleGalleryUpload = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setGalleryUploading(true);
    setGalleryProgress({ done: 0, total: list.length });
    setSubmitStatus({
      kind: "loading",
      message:
        list.length === 1
          ? "Uploading image..."
          : `Uploading ${list.length} images...`,
    });

    const uploaded: string[] = [];
    let firstError: string | null = null;
    for (let i = 0; i < list.length; i++) {
      try {
        const url = await uploadOneToCloudinary(list[i]);
        uploaded.push(url);
      } catch (err) {
        if (!firstError) {
          firstError = err instanceof Error ? err.message : "Upload failed";
        }
      } finally {
        setGalleryProgress({ done: i + 1, total: list.length });
      }
    }

    if (uploaded.length > 0) {
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    }

    setGalleryUploading(false);
    setGalleryProgress(null);
    if (galleryInputRef.current) galleryInputRef.current.value = "";

    if (firstError && uploaded.length === 0) {
      setSubmitStatus({ kind: "error", message: firstError });
    } else if (firstError) {
      setSubmitStatus({
        kind: "error",
        message: `Uploaded ${uploaded.length}/${list.length}. ${firstError}`,
      });
    } else {
      setSubmitStatus({
        kind: "success",
        message:
          uploaded.length === 1
            ? "Image added to gallery."
            : `${uploaded.length} images added to gallery.`,
      });
    }
  };

  const removeGalleryImage = (idx: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }));
  };

  const moveGalleryImage = (idx: number, direction: -1 | 1) => {
    setForm((f) => {
      const target = idx + direction;
      if (target < 0 || target >= f.images.length) return f;
      const next = [...f.images];
      const [moved] = next.splice(idx, 1);
      next.splice(target, 0, moved);
      return { ...f, images: next };
    });
  };

  const setImageAsLogo = (url: string) => {
    setForm((f) => ({ ...f, logoUrl: url }));
    setSubmitStatus({ kind: "success", message: "Set as catalog logo." });
  };

  const updatePlan = (idx: number, patch: Partial<ApiPlan>) => {
    setForm((f) => ({
      ...f,
      plans: f.plans.map((pl, i) => (i === idx ? { ...pl, ...patch } : pl)),
    }));
  };

  const addPlan = () => {
    setForm((f) => ({
      ...f,
      plans: [
        ...f.plans,
        {
          name: "",
          duration: "1 Month",
          offerPrice: 0,
          priceSuffix: "/month",
          popular: false,
          disabled: false,
          originalPriceNote: "",
          headline: "",
          keyHighlights: [],
          benefits: [],
          requirements: [],
          activationSteps: [],
          customContent: "",
        },
      ],
    }));
  };

  const removePlan = (idx: number) => {
    setForm((f) => ({
      ...f,
      plans: f.plans.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setSubmitStatus({ kind: "error", message: "Title is required." });
      return;
    }
    const offer = Number(form.offerPrice);
    if (!Number.isFinite(offer) || offer < 0) {
      setSubmitStatus({
        kind: "error",
        message: "Offer price must be a non-negative number.",
      });
      return;
    }
    const slug = form.slug.trim() || slugify(form.title);

    const sortTrim = form.sortOrder.trim();
    let sortOrderPayload: number | undefined;
    if (sortTrim !== "") {
      const so = Number(sortTrim);
      if (!Number.isFinite(so) || so < 0 || !Number.isInteger(so)) {
        setSubmitStatus({
          kind: "error",
          message: "Display order must be a whole number ≥ 0.",
        });
        return;
      }
      sortOrderPayload = Math.floor(so);
    } else if (mode === "edit") {
      sortOrderPayload = 0;
    }

    const payload = {
      slug,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      logoUrl: form.logoUrl.trim(),
      images: form.images.map((u) => u.trim()).filter(Boolean),
      iconLabel: form.iconLabel.trim(),
      popular: form.popular,
      disabled: form.disabled,
      benefits: form.benefitsText
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      originalPrice:
        form.originalPrice.trim() === "" ? undefined : Number(form.originalPrice),
      offerPrice: offer,
      priceSuffix: form.priceSuffix.trim() || "/month",
      discountPercent:
        form.discountPercent.trim() === ""
          ? undefined
          : Number(form.discountPercent),
      plans: form.plans
        .filter((p) => p.name.trim() !== "")
        .map((p) => ({
          ...p,
          offerPrice: Number(p.offerPrice) || 0,
          originalPrice:
            typeof p.originalPrice === "number"
              ? p.originalPrice
              : p.originalPrice === undefined || String(p.originalPrice) === ""
              ? undefined
              : Number(p.originalPrice),
          originalPriceNote: p.originalPriceNote?.trim() || "",
          priceSuffix: p.priceSuffix?.trim() || "/month",
          headline: p.headline?.trim() || "",
          keyHighlights: (p.keyHighlights ?? [])
            .map((s) => s.trim())
            .filter(Boolean),
          benefits: (p.benefits ?? []).map((s) => s.trim()).filter(Boolean),
          requirements: (p.requirements ?? [])
            .map((s) => s.trim())
            .filter(Boolean),
          activationSteps: (p.activationSteps ?? [])
            .map((s) => s.trim())
            .filter(Boolean),
          customHeading: (() => {
            const h = p.customHeading;
            if (!h) return undefined;
            const eyebrow = h.eyebrow?.trim() || "";
            const title = h.title?.trim() || "";
            const subtitle = h.subtitle?.trim() || "";
            if (!eyebrow && !title && !subtitle) return undefined;
            return {
              eyebrow,
              title,
              subtitle,
              tone: h.tone ?? "primary",
            };
          })(),
          customContent: (p.customContent ?? "").trim(),
        })),
      ...(sortOrderPayload !== undefined
        ? { sortOrder: sortOrderPayload }
        : {}),
    };

    setSubmitStatus({
      kind: "loading",
      message: mode === "create" ? "Creating product..." : "Saving changes...",
    });
    try {
      const url =
        mode === "create"
          ? "/api/products"
          : `/api/products/${encodeURIComponent(form._id ?? "")}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        onAuthRequired();
        throw new Error("Session expired. Sign in again.");
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          data.error || `${mode === "create" ? "Create" : "Update"} failed (${res.status})`
        );
      }
      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setSubmitStatus({ kind: "error", message });
    }
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ss-primary">
            {mode === "create" ? "New product" : "Edit product"}
          </div>
          <h3 className="mt-0.5 text-lg font-semibold tracking-tight">
            {form.title || "Untitled product"}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full bg-ss-bg-soft px-3 py-1.5 text-xs font-semibold text-ss-text/70 ring-1 ring-black/10 hover:bg-ss-bg-soft/70"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Logo */}
        <Field label="Logo">
          <div className="grid gap-3 sm:grid-cols-[160px_minmax(0,1fr)]">
            <ProductLogoTile variant="compact" className="w-full">
              {form.logoUrl ? (
                <div className="relative h-full min-h-[120px] w-full">
                  <Image
                    src={form.logoUrl}
                    alt="Logo preview"
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="grid min-h-[120px] w-full place-items-center text-xs text-ss-text/55">
                  No logo
                </div>
              )}
            </ProductLogoTile>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleLogoUpload(f);
                }}
                className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ss-primary file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-ss-primary/90 disabled:opacity-50"
                suppressHydrationWarning
              />
              <input
                type="url"
                value={form.logoUrl}
                onChange={(e) => updateField("logoUrl", e.target.value)}
                placeholder="…or paste an image URL"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm focus:border-ss-primary/40 focus:outline-none focus:ring-2 focus:ring-ss-primary/20"
                suppressHydrationWarning
              />
              <p className="text-[11px] text-ss-text/55">
                Transparent PNG recommended — preview uses the same frame as the storefront.
              </p>
            </div>
          </div>
        </Field>

        {/* Gallery */}
        <Field
          label="Product gallery"
          hint="Shown on the product detail page. The first image is used as the hero."
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                disabled={galleryUploading}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) handleGalleryUpload(files);
                }}
                className="block max-w-full text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ss-primary file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-ss-primary/90 disabled:opacity-50"
                suppressHydrationWarning
              />
              {galleryUploading && galleryProgress && (
                <span className="text-xs text-ss-text/65">
                  Uploading {galleryProgress.done}/{galleryProgress.total}…
                </span>
              )}
              {!galleryUploading && form.images.length > 0 && (
                <span className="text-xs text-ss-text/55">
                  {form.images.length} image{form.images.length === 1 ? "" : "s"}
                </span>
              )}
            </div>

            {form.images.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-ss-bg-soft/40 px-4 py-6 text-center text-sm text-ss-text/55">
                No gallery images yet. Upload PNG, JPG, or WebP files — you can
                select multiple at once.
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {form.images.map((url, idx) => (
                  <li
                    key={`${url}-${idx}`}
                    className="group relative overflow-hidden rounded-2xl bg-ss-bg-soft/60 ring-1 ring-black/5"
                  >
                    <div className="relative aspect-square w-full">
                      <Image
                        src={url}
                        alt={`Gallery image ${idx + 1}`}
                        fill
                        sizes="(min-width: 1024px) 200px, (min-width: 640px) 28vw, 45vw"
                        className="object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-ss-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
                          Hero
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-1 border-t border-black/5 bg-white/80 px-2 py-1.5 text-[11px]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(idx, -1)}
                          disabled={idx === 0}
                          className="rounded-md px-1.5 py-0.5 text-ss-text/65 hover:bg-black/5 disabled:opacity-30"
                          title="Move left"
                          aria-label="Move image left"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(idx, 1)}
                          disabled={idx === form.images.length - 1}
                          className="rounded-md px-1.5 py-0.5 text-ss-text/65 hover:bg-black/5 disabled:opacity-30"
                          title="Move right"
                          aria-label="Move image right"
                        >
                          →
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        {form.logoUrl !== url && (
                          <button
                            type="button"
                            onClick={() => setImageAsLogo(url)}
                            className="rounded-md px-1.5 py-0.5 font-medium text-ss-primary hover:bg-ss-primary/10"
                            title="Use as catalog logo"
                          >
                            Set logo
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="rounded-md px-1.5 py-0.5 font-medium text-rose-600 hover:bg-rose-500/10"
                          title="Remove from gallery"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>

        {/* Basic info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => {
                const t = e.target.value;
                updateField("title", t);
                if (mode === "create" && (!form.slug || form.slug === slugify(form.title))) {
                  updateField("slug", slugify(t));
                }
              }}
              placeholder="e.g. ChatGPT Pro"
              className={inputCls}
              suppressHydrationWarning
            />
          </Field>
          <Field label="Slug" required hint="lowercase, dashes only">
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => updateField("slug", slugify(e.target.value))}
              placeholder="e.g. chatgpt-pro"
              className={inputCls}
              suppressHydrationWarning
            />
          </Field>
        </div>

        <Field label="Short description">
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="One short sentence shown on the catalog card."
            className={cn(inputCls, "resize-y")}
            suppressHydrationWarning
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) =>
                updateField("category", e.target.value as ApiProduct["category"])
              }
              className={inputCls}
              suppressHydrationWarning
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Display order"
            hint="Lower numbers appear first in the catalog. Leave blank when creating to add at the end."
          >
            <input
              type="number"
              min={0}
              step={1}
              value={form.sortOrder}
              onChange={(e) => updateField("sortOrder", e.target.value)}
              placeholder={mode === "create" ? "auto" : "0"}
              className={inputCls}
              suppressHydrationWarning
            />
          </Field>
        </div>

        <Field label="Icon label" hint="2–3 chars shown if no logo">
          <input
            type="text"
            value={form.iconLabel}
            onChange={(e) => updateField("iconLabel", e.target.value)}
            placeholder="e.g. AI"
            className={inputCls}
            suppressHydrationWarning
          />
        </Field>

        <Field label="Benefits" hint="One per line — shown as bullets on the card.">
          <textarea
            rows={3}
            value={form.benefitsText}
            onChange={(e) => updateField("benefitsText", e.target.value)}
            placeholder={"e.g.\nFaster productivity\nBetter outputs\nAlways-on support"}
            className={cn(inputCls, "resize-y font-mono text-xs sm:text-sm")}
            suppressHydrationWarning
          />
        </Field>

        {/* Pricing (top-level for catalog card) */}
        <div className="rounded-2xl bg-ss-bg-soft/50 p-4 ring-1 ring-ss-primary/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-ss-text/60">
            Catalog pricing (shown on the product card)
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-4">
            <Field label="Original price">
              <input
                type="number"
                min={0}
                step={1}
                value={form.originalPrice}
                onChange={(e) => updateField("originalPrice", e.target.value)}
                placeholder="e.g. 18000"
                className={inputCls}
                suppressHydrationWarning
              />
            </Field>
            <Field label="Offer price" required>
              <input
                type="number"
                min={0}
                step={1}
                required
                value={form.offerPrice}
                onChange={(e) => updateField("offerPrice", e.target.value)}
                placeholder="e.g. 4500"
                className={inputCls}
                suppressHydrationWarning
              />
            </Field>
            <Field label="Suffix">
              <input
                type="text"
                value={form.priceSuffix}
                onChange={(e) => updateField("priceSuffix", e.target.value)}
                placeholder="/month"
                className={inputCls}
                suppressHydrationWarning
              />
            </Field>
            <Field label="Discount %" hint="auto-calculated if blank">
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={form.discountPercent}
                onChange={(e) => updateField("discountPercent", e.target.value)}
                placeholder="e.g. 75"
                className={inputCls}
                suppressHydrationWarning
              />
            </Field>
          </div>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-3">
          <Toggle
            label="Popular (show 'Popular' badge)"
            checked={form.popular}
            onChange={(v) => updateField("popular", v)}
          />
          <Toggle
            label="Disabled (hide from public catalog)"
            checked={form.disabled}
            onChange={(v) => updateField("disabled", v)}
          />
        </div>

        {/* Plans */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold tracking-tight">Plans</div>
              <div className="text-xs text-ss-text/55">
                Each plan can have its own pricing. Disable a plan to hide it
                without deleting it.
              </div>
            </div>
            <button
              type="button"
              onClick={addPlan}
              className="inline-flex items-center gap-1 rounded-full bg-ss-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-ss-primary/90"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add plan
            </button>
          </div>

          {form.plans.length === 0 ? (
            <div className="mt-3 rounded-xl bg-ss-bg-soft/40 p-4 text-center text-xs text-ss-text/60 ring-1 ring-ss-primary/5">
              No plans yet. Add at least one to offer different pricing tiers.
            </div>
          ) : (
            <ul className="mt-3 grid gap-3">
              {form.plans.map((p, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "rounded-xl bg-ss-bg-soft/40 p-3 ring-1",
                    p.disabled
                      ? "opacity-60 ring-black/5"
                      : "ring-ss-primary/10"
                  )}
                >
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updatePlan(idx, { name: e.target.value })}
                      placeholder="Plan name (e.g. Pro)"
                      className={inputCls}
                      suppressHydrationWarning
                    />
                    <input
                      type="text"
                      value={p.duration}
                      onChange={(e) => updatePlan(idx, { duration: e.target.value })}
                      placeholder="Duration (e.g. 1 Month)"
                      className={inputCls}
                      suppressHydrationWarning
                    />
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={
                        typeof p.offerPrice === "number" ? p.offerPrice : ""
                      }
                      onChange={(e) =>
                        updatePlan(idx, {
                          offerPrice: e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                      placeholder="Offer price"
                      className={inputCls}
                      suppressHydrationWarning
                    />
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={
                        typeof p.originalPrice === "number"
                          ? p.originalPrice
                          : ""
                      }
                      onChange={(e) =>
                        updatePlan(idx, {
                          originalPrice:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        })
                      }
                      placeholder="Original (optional)"
                      className={inputCls}
                      suppressHydrationWarning
                    />
                    <button
                      type="button"
                      onClick={() => removePlan(idx)}
                      aria-label={`Remove plan ${p.name || idx + 1}`}
                      className="self-center rounded-full bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={p.priceSuffix}
                      onChange={(e) =>
                        updatePlan(idx, { priceSuffix: e.target.value })
                      }
                      placeholder="Suffix (e.g. /month)"
                      className={cn(inputCls, "max-w-[140px]")}
                      suppressHydrationWarning
                    />
                    <Toggle
                      label="Popular"
                      compact
                      checked={Boolean(p.popular)}
                      onChange={(v) => updatePlan(idx, { popular: v })}
                    />
                    <Toggle
                      label="Disabled"
                      compact
                      checked={Boolean(p.disabled)}
                      onChange={(v) => updatePlan(idx, { disabled: v })}
                    />
                  </div>

                  <PlanDetailsEditor
                    plan={p}
                    onChange={(patch) => updatePlan(idx, patch)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {submitStatus.kind === "error" ? (
          <StatusPill tone="error">{submitStatus.message}</StatusPill>
        ) : null}
        {submitStatus.kind === "success" ? (
          <StatusPill tone="success">{submitStatus.message}</StatusPill>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-2xl bg-ss-bg-soft px-4 py-2.5 text-sm font-semibold text-ss-text/80 ring-1 ring-black/10 hover:bg-ss-bg-soft/70"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitStatus.kind === "loading" || uploading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ss-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ss-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitStatus.kind === "loading" ? (
              <>
                <Spinner />
                <span>{submitStatus.message ?? "Saving..."}</span>
              </>
            ) : (
              <span>{mode === "create" ? "Create product" : "Save changes"}</span>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}

// --- Small bits ----------------------------------------------------------

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm focus:border-ss-primary/40 focus:outline-none focus:ring-2 focus:ring-ss-primary/20";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ss-text/60">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? (
        <span className="mt-1 block text-[11px] text-ss-text/50">{hint}</span>
      ) : null}
    </label>
  );
}

function PlanDetailsEditor({
  plan,
  onChange,
}: {
  plan: ApiPlan;
  onChange: (patch: Partial<ApiPlan>) => void;
}) {
  const [open, setOpen] = useState(false);
  const heading = plan.customHeading;
  const headingFilled =
    (heading?.eyebrow?.trim() ? 1 : 0) +
    (heading?.title?.trim() ? 1 : 0) +
    (heading?.subtitle?.trim() ? 1 : 0);
  const customContentFilled = Boolean(
    plan.customContent &&
      plan.customContent.replace(/<[^>]*>/g, "").trim().length > 0
  );
  const filledCount =
    (plan.headline?.trim() ? 1 : 0) +
    (plan.originalPriceNote?.trim() ? 1 : 0) +
    (plan.keyHighlights?.length ? 1 : 0) +
    (plan.benefits?.length ? 1 : 0) +
    (plan.requirements?.length ? 1 : 0) +
    (plan.activationSteps?.length ? 1 : 0) +
    (headingFilled > 0 ? 1 : 0) +
    (customContentFilled ? 1 : 0);

  const linesToList = (s: string) =>
    s
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean);
  const listToText = (xs?: string[]) => (xs ?? []).join("\n");

  const updateHeading = (
    patch: Partial<NonNullable<ApiPlan["customHeading"]>>
  ) => {
    const next = { ...(plan.customHeading ?? { tone: "primary" as const }), ...patch };
    const empty =
      !next.eyebrow?.trim() && !next.title?.trim() && !next.subtitle?.trim();
    onChange({ customHeading: empty ? undefined : next });
  };

  const headingTones: Array<{
    id: NonNullable<NonNullable<ApiPlan["customHeading"]>["tone"]>;
    label: string;
    swatch: string;
  }> = [
    { id: "primary", label: "Purple", swatch: "from-ss-primary to-ss-accent" },
    { id: "accent", label: "Pink", swatch: "from-ss-accent to-fuchsia-400" },
    { id: "emerald", label: "Emerald", swatch: "from-emerald-500 to-teal-400" },
    { id: "amber", label: "Amber", swatch: "from-amber-500 to-orange-400" },
  ];

  return (
    <div className="mt-3 rounded-xl bg-white/70 ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold tracking-wide text-ss-text/75">
          Plan details (key highlights, benefits, requirements…)
        </span>
        <span className="flex items-center gap-2">
          {filledCount > 0 ? (
            <span className="inline-flex items-center rounded-full bg-ss-bg-soft px-2 py-0.5 text-[10px] font-semibold text-ss-primary ring-1 ring-ss-primary/15">
              {filledCount} filled
            </span>
          ) : (
            <span className="text-[10px] text-ss-text/45">empty</span>
          )}
          <span
            aria-hidden="true"
            className={cn(
              "text-ss-text/55 transition-transform",
              open ? "rotate-180" : "rotate-0"
            )}
          >
            ▾
          </span>
        </span>
      </button>

      {open ? (
        <div className="space-y-3 border-t border-black/5 px-3 py-3">
          {/* Custom heading banner */}
          <div className="rounded-xl bg-ss-bg-soft/40 p-3 ring-1 ring-ss-primary/10">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ss-primary">
                  Custom heading banner
                </div>
                <div className="text-[11px] text-ss-text/55">
                  Optional standout banner shown above the plan details on the
                  product page.
                </div>
              </div>
              {headingFilled > 0 ? (
                <button
                  type="button"
                  onClick={() => onChange({ customHeading: undefined })}
                  className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Field label="Eyebrow">
                <input
                  type="text"
                  value={heading?.eyebrow ?? ""}
                  onChange={(e) => updateHeading({ eyebrow: e.target.value })}
                  placeholder="LIMITED TIME OFFER"
                  className={inputCls}
                  suppressHydrationWarning
                />
              </Field>
              <Field label="Title">
                <input
                  type="text"
                  value={heading?.title ?? ""}
                  onChange={(e) => updateHeading({ title: e.target.value })}
                  placeholder="Save up to 90% on annual plans"
                  className={inputCls}
                  suppressHydrationWarning
                />
              </Field>
            </div>

            <div className="mt-2">
              <Field label="Subtitle">
                <input
                  type="text"
                  value={heading?.subtitle ?? ""}
                  onChange={(e) => updateHeading({ subtitle: e.target.value })}
                  placeholder="Activated within 5–15 minutes via exclusive coupon."
                  className={inputCls}
                  suppressHydrationWarning
                />
              </Field>
            </div>

            <div className="mt-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ss-text/60">
                Color
              </div>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {headingTones.map((t) => {
                  const active = (heading?.tone ?? "primary") === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateHeading({ tone: t.id })}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition-colors",
                        active
                          ? "bg-white text-ss-text ring-ss-primary/40"
                          : "bg-white/70 text-ss-text/65 ring-black/10 hover:bg-white"
                      )}
                      aria-pressed={active}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-block h-3 w-3 rounded-full bg-gradient-to-br",
                          t.swatch
                        )}
                      />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Field
            label="Headline"
            hint="Optional bold lead line, e.g. “12 Months Sales Navigator Core”."
          >
            <input
              type="text"
              value={plan.headline ?? ""}
              onChange={(e) => onChange({ headline: e.target.value })}
              placeholder="12 Months Sales Navigator Core"
              className={inputCls}
              suppressHydrationWarning
            />
          </Field>

          <Field
            label="Original price note"
            hint="Free-form note shown above the offer price (use this when the original price isn’t a single number)."
          >
            <input
              type="text"
              value={plan.originalPriceNote ?? ""}
              onChange={(e) => onChange({ originalPriceNote: e.target.value })}
              placeholder="$960–$1080/year ($100/m) or 960 GBP/y"
              className={inputCls}
              suppressHydrationWarning
            />
          </Field>

          <Field
            label="Key highlights"
            hint="One bullet per line — billing type, warranty, activation method, etc."
          >
            <textarea
              rows={4}
              value={listToText(plan.keyHighlights)}
              onChange={(e) =>
                onChange({ keyHighlights: linesToList(e.target.value) })
              }
              placeholder={
                "Billing type: Annual\nFully guaranteed with official purchase receipt\nActivated via exclusive coupons/discount method"
              }
              className={cn(inputCls, "resize-y font-mono text-[13px]")}
              suppressHydrationWarning
            />
          </Field>

          <Field
            label="Benefits"
            hint="One feature per line — what the customer gets with this plan."
          >
            <textarea
              rows={5}
              value={listToText(plan.benefits)}
              onChange={(e) =>
                onChange({ benefits: linesToList(e.target.value) })
              }
              placeholder={
                "Advanced search filters and saved searches\nUp to 10,000 saved leads\n50 free InMail messages each month"
              }
              className={cn(inputCls, "resize-y font-mono text-[13px]")}
              suppressHydrationWarning
            />
          </Field>

          <Field
            label="Requirements"
            hint="One requirement per line — eligibility checks before activation."
          >
            <textarea
              rows={4}
              value={listToText(plan.requirements)}
              onChange={(e) =>
                onChange({ requirements: linesToList(e.target.value) })
              }
              placeholder={
                "No active subscription on your LinkedIn profile\nAccount must be 20+ days old with 10+ connections\nReal name and real profile photo on LinkedIn"
              }
              className={cn(inputCls, "resize-y font-mono text-[13px]")}
              suppressHydrationWarning
            />
          </Field>

          <Field
            label="Activation process"
            hint="One step per line — what we do after the customer orders."
          >
            <textarea
              rows={3}
              value={listToText(plan.activationSteps)}
              onChange={(e) =>
                onChange({ activationSteps: linesToList(e.target.value) })
              }
              placeholder={
                "We log into your account temporarily\nApply the exclusive coupon and pay via our card\nPlan activated within 5–15 minutes"
              }
              className={cn(inputCls, "resize-y font-mono text-[13px]")}
              suppressHydrationWarning
            />
          </Field>

          {/* Free-form rich text — paste from Word/Docs with formatting. */}
          <div className="rounded-xl bg-ss-bg-soft/40 p-3 ring-1 ring-ss-primary/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ss-primary">
                  Free-form description
                </div>
                <div className="text-[11px] text-ss-text/55">
                  Type your own headings, bold, and bullets — or paste straight
                  from Word / Google Docs and the formatting is kept.
                </div>
              </div>
              {customContentFilled ? (
                <button
                  type="button"
                  onClick={() => onChange({ customContent: "" })}
                  className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <div className="mt-2">
              <RichTextEditor
                value={plan.customContent ?? ""}
                onChange={(html) => onChange({ customContent: html })}
                placeholder="Paste from Word/Docs, or type and use the toolbar…"
                minHeight={220}
              />
            </div>
            <div className="mt-2 text-[11px] text-ss-text/50">
              Tip: in Word / Google Docs, select your nicely formatted text and
              press <kbd className="rounded bg-white px-1 ring-1 ring-black/10">Ctrl/Cmd&nbsp;C</kbd>,
              then click into this box and paste with{" "}
              <kbd className="rounded bg-white px-1 ring-1 ring-black/10">Ctrl/Cmd&nbsp;V</kbd>.
              Headings, bold, italics, links, and bullet/numbered lists are
              preserved. Everything else is stripped for safety.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  compact,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  compact?: boolean;
}) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2 rounded-full bg-ss-bg-soft/70 ring-1 ring-ss-primary/10",
        compact ? "px-2.5 py-1" : "px-3 py-2"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--ss-primary)]"
        suppressHydrationWarning
      />
      <span
        className={cn(
          "font-semibold text-ss-text/80",
          compact ? "text-[11px]" : "text-xs"
        )}
      >
        {label}
      </span>
    </label>
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
