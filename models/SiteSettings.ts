import mongoose, { Schema, type Model } from "mongoose";

/** Single document id for global site settings. */
export const SITE_SETTINGS_DOC_ID = "default" as const;

const siteSettingsSchema = new Schema(
  {
    _id: { type: String, default: SITE_SETTINGS_DOC_ID },
    siteLogoUrl: { type: String, trim: true, default: "" },
  },
  { collection: "sitesettings", versionKey: false }
);

export type SiteSettingsAttrs = {
  _id: string;
  siteLogoUrl: string;
};

export const SiteSettingsModel: Model<SiteSettingsAttrs> =
  (mongoose.models.SiteSettings as Model<SiteSettingsAttrs> | undefined) ??
  mongoose.model<SiteSettingsAttrs>("SiteSettings", siteSettingsSchema);
