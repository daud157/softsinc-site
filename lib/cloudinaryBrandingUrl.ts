/**
 * Cloudinary delivery URL for site logos.
 * Uses PNG + quality auto so alpha from the stored asset is preserved on delivery.
 * We intentionally do not chain `e_background_removal` here: it is a separate add-on,
 * and running it on assets that already have transparency can produce a flat white mat.
 */
const LOGO_DELIVERY = "f_png/q_auto:best";

export function cloudinaryBrandingLogoDeliveryUrl(url: string): string {
  const raw = url.trim();
  if (!raw) return raw;
  if (!raw.includes("res.cloudinary.com") || !raw.includes("/image/upload/")) {
    return raw;
  }
  // Idempotent: do not stack delivery transforms if the URL already carries them.
  if (raw.includes(LOGO_DELIVERY)) {
    return raw;
  }
  return raw.replace("/image/upload/", `/image/upload/${LOGO_DELIVERY}/`);
}
