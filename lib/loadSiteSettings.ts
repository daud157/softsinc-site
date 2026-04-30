import { connectDB } from "@/lib/mongodb";
import { SITE_SETTINGS_DOC_ID, SiteSettingsModel } from "@/models/SiteSettings";

export type SiteSettingsPublic = {
  siteLogoUrl: string;
};

/**
 * Loads singleton site settings. Safe when DB is unavailable (build / misconfig):
 * returns empty logo so the layout can still render.
 */
export async function getSiteSettings(): Promise<SiteSettingsPublic> {
  try {
    await connectDB();
    const doc = await SiteSettingsModel.findOneAndUpdate(
      { _id: SITE_SETTINGS_DOC_ID },
      { $setOnInsert: { siteLogoUrl: "" } },
      { upsert: true, returnDocument: "after", lean: true }
    );
    const url =
      doc &&
      typeof doc === "object" &&
      "siteLogoUrl" in doc &&
      typeof (doc as { siteLogoUrl?: unknown }).siteLogoUrl === "string"
        ? String((doc as { siteLogoUrl: string }).siteLogoUrl).trim()
        : "";
    return { siteLogoUrl: url };
  } catch (err) {
    console.warn("[getSiteSettings] falling back to defaults:", err);
    return { siteLogoUrl: "" };
  }
}
