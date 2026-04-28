import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/adminAuth";
import { getCloudinary, isCloudinaryEnvReady } from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
    }

    await connectDB();

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Best-effort: remove the Cloudinary asset if the image URL is from Cloudinary.
    const imageUrl = review.image;
    if (
      isCloudinaryEnvReady() &&
      typeof imageUrl === "string" &&
      imageUrl.includes("res.cloudinary.com")
    ) {
      const publicId = extractCloudinaryPublicId(imageUrl);
      if (publicId) {
        try {
          await getCloudinary().uploader.destroy(publicId, { invalidate: true });
        } catch {
          // Non-fatal: continue with DB delete even if the asset removal fails.
        }
      }
    }

    await review.deleteOne();

    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete review";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractCloudinaryPublicId(url: string): string | null {
  // Example: https://res.cloudinary.com/<cloud>/image/upload/v1700000000/folder/file.png
  // We need: folder/file (no version, no extension)
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
    const joined = rest.join("/");
    return joined.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}
