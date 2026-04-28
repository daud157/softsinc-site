import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/adminAuth";
import { getCloudinary, isCloudinaryEnvReady } from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";
import { normalizeBody } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

async function findProductByIdOrSlug(idOrSlug: string) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return ProductModel.findById(idOrSlug);
  }
  return ProductModel.findOne({ slug: idOrSlug });
}

export async function GET(_request: Request, { params }: RouteCtx) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await findProductByIdOrSlug(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.error("[api/products/[id] GET] error:", err);
    const message = err instanceof Error ? err.message : "Failed to load product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteCtx) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const normalized = normalizeBody(body);

    if (!normalized.slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    if (!normalized.title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (normalized.offerPrice === undefined) {
      return NextResponse.json(
        { error: "offerPrice is required (numeric)" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await findProductByIdOrSlug(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.slug !== normalized.slug) {
      const collision = await ProductModel.findOne({ slug: normalized.slug });
      if (collision && String(collision._id) !== String(product._id)) {
        return NextResponse.json(
          { error: `A product with slug "${normalized.slug}" already exists.` },
          { status: 409 }
        );
      }
    }

    // Detect gallery URLs that were removed in this update and clean them
    // up from Cloudinary in the background. Best-effort; never fails the save.
    const oldImages = Array.isArray(product.images)
      ? product.images.filter((u): u is string => typeof u === "string")
      : [];
    const newImagesSet = new Set(normalized.images);
    const removed = oldImages.filter((u) => !newImagesSet.has(u));

    Object.assign(product, normalized);
    await product.save();

    if (removed.length > 0) {
      void destroyCloudinaryUrls(removed);
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.error("[api/products/[id] PUT] error:", err);
    const message = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteCtx) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();

    const product = await findProductByIdOrSlug(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const urlsToDestroy: string[] = [];
    if (typeof product.logoUrl === "string" && product.logoUrl) {
      urlsToDestroy.push(product.logoUrl);
    }
    if (Array.isArray(product.images)) {
      for (const u of product.images) {
        if (typeof u === "string" && u) urlsToDestroy.push(u);
      }
    }

    await product.deleteOne();

    if (urlsToDestroy.length > 0) {
      void destroyCloudinaryUrls(urlsToDestroy);
    }

    return NextResponse.json({ ok: true, id: String(product._id) }, { status: 200 });
  } catch (err) {
    console.error("[api/products/[id] DELETE] error:", err);
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function destroyCloudinaryUrls(urls: string[]): Promise<void> {
  if (!isCloudinaryEnvReady()) {
    console.warn("[products] Skipping Cloudinary cleanup: env not configured");
    return;
  }
  const cloudinary = getCloudinary();
  const seen = new Set<string>();
  for (const url of urls) {
    if (!url || !url.includes("res.cloudinary.com")) continue;
    const publicId = extractCloudinaryPublicId(url);
    if (!publicId || seen.has(publicId)) continue;
    seen.add(publicId);
    try {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
    } catch (err) {
      console.warn("[products] Cloudinary destroy failed for", publicId, err);
    }
  }
}

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return null;
    let rest = parts.slice(uploadIdx + 1);
    if (rest[0]?.startsWith("v") && /^v\d+$/.test(rest[0])) {
      rest = rest.slice(1);
    }
    if (rest.length === 0) return null;
    return rest.join("/").replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}
