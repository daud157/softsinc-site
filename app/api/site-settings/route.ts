import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { isAdminRequest } from "@/lib/adminAuth";
import { connectDB } from "@/lib/mongodb";
import { nextResponseForMongoOr500 } from "@/lib/mongoHttpError";
import { getSiteSettings } from "@/lib/loadSiteSettings";
import { SITE_SETTINGS_DOC_ID, SiteSettingsModel } from "@/models/SiteSettings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAllowedLogoUrl(url: string): boolean {
  const t = url.trim();
  if (t === "") return true;
  try {
    const u = new URL(t);
    if (u.protocol !== "https:") return false;
    if (u.hostname !== "res.cloudinary.com") return false;
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings, { status: 200 });
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw =
    typeof body === "object" && body !== null && "siteLogoUrl" in body
      ? (body as { siteLogoUrl: unknown }).siteLogoUrl
      : undefined;

  if (typeof raw !== "string") {
    return NextResponse.json(
      { error: "siteLogoUrl is required (string; use empty string to clear)" },
      { status: 400 }
    );
  }

  const siteLogoUrl = raw.trim();
  if (!isAllowedLogoUrl(siteLogoUrl)) {
    return NextResponse.json(
      {
        error:
          "Logo URL must be empty or an https://res.cloudinary.com/… image URL (upload via this page).",
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const nextUrl = siteLogoUrl;
    await SiteSettingsModel.updateOne(
      { _id: SITE_SETTINGS_DOC_ID },
      { $set: { siteLogoUrl: nextUrl } },
      { upsert: true }
    );

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, siteLogoUrl: nextUrl }, { status: 200 });
  } catch (err) {
    console.error("[api/site-settings PATCH]", err);
    return nextResponseForMongoOr500(err, "Failed to save settings");
  }
}
