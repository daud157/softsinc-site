import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/adminAuth";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load reviews";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => null)) as
      | {
          image?: unknown;
          service?: unknown;
          customerName?: unknown;
          rating?: unknown;
          featured?: unknown;
        }
      | null;

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const image = typeof body.image === "string" ? body.image.trim() : "";
    const service = typeof body.service === "string" ? body.service.trim() : "";

    if (!image) {
      return NextResponse.json(
        { error: "image is required" },
        { status: 400 }
      );
    }
    if (!service) {
      return NextResponse.json(
        { error: "service is required" },
        { status: 400 }
      );
    }

    const customerName =
      typeof body.customerName === "string" ? body.customerName.trim() : "";

    let rating = 5;
    if (typeof body.rating === "number" && Number.isFinite(body.rating)) {
      rating = Math.max(1, Math.min(5, Math.round(body.rating)));
    }

    const featured = Boolean(body.featured);

    await connectDB();

    const review = await Review.create({
      image,
      service,
      customerName,
      rating,
      featured,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create review";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
