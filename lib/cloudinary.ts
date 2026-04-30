import { v2 as cloudinarySdk } from "cloudinary";

const PLACEHOLDER_SECRET = "PASTE_YOUR_CLOUDINARY_API_SECRET_HERE";

let configured = false;

/**
 * Configures the Cloudinary SDK on first use. Safe to import during `next build`
 * when env vars are missing; callers must handle errors or use helpers below.
 */
export function getCloudinary() {
  if (configured) {
    return cloudinarySdk;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary environment variables. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (e.g. in Vercel Project → Settings → Environment Variables)."
    );
  }

  if (apiSecret === PLACEHOLDER_SECRET) {
    throw new Error(
      "CLOUDINARY_API_SECRET is still the placeholder. Paste the real API secret from your Cloudinary dashboard (Settings → Access Keys)."
    );
  }

  cloudinarySdk.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
  return cloudinarySdk;
}

/** True when all Cloudinary env vars are present (no network call). */
export function isCloudinaryEnvReady(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  return Boolean(
    cloudName &&
      apiKey &&
      apiSecret &&
      apiSecret !== PLACEHOLDER_SECRET
  );
}

export type UploadedImage = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

export async function uploadImageBuffer(
  buffer: Buffer,
  folder = "softsinc/reviews"
): Promise<UploadedImage> {
  const cloudinary = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        // Do not use fetch_format "auto" here: it re-encodes before storage and can
        // pick JPEG for PNG logos, which strips transparency (white background).
        transformation: [{ quality: "auto:good" }],
      },
      (error, result) => {
        if (error || !result) {
          console.error("[cloudinary] upload_stream error:", error);
          const message =
            (error && typeof error === "object" && "message" in error
              ? String((error as { message?: unknown }).message)
              : null) ?? "Cloudinary upload failed";
          reject(new Error(message));
          return;
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    stream.end(buffer);
  });
}
