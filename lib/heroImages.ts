/**
 * Cloudinary delivery URLs for hero mascots.
 * `e_background_removal` → transparent PNG (removes white studio background / halftone paper).
 * `f_png` keeps alpha. `q_auto:best` reduces compression speckle.
 */
const BASE =
  "https://res.cloudinary.com/dduhc5cqo/image/upload";

const MOBILE_VERSION_ID =
  "v1777381361/ChatGPT_Image_Apr_28_2026_06_01_03_PM_bnjnu5";
const DESKTOP_VERSION_ID =
  "v1777381358/ChatGPT_Image_Apr_28_2026_06_00_55_PM_auhn8b";

function heroGirlTransparent(versionIdWithExt: string) {
  return `${BASE}/e_background_removal/f_png/q_auto:best/${versionIdWithExt}.png`;
}

export const HERO_GIRL_MOBILE_SRC = heroGirlTransparent(MOBILE_VERSION_ID);
export const HERO_GIRL_DESKTOP_SRC = heroGirlTransparent(DESKTOP_VERSION_ID);
