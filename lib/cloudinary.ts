import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const PLACEHOLDER_SECRET = "PASTE_YOUR_CLOUDINARY_API_SECRET_HERE";

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Missing Cloudinary environment variables. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local."
  );
}

if (apiSecret === PLACEHOLDER_SECRET) {
  throw new Error(
    "CLOUDINARY_API_SECRET is still the placeholder. Open .env.local and paste the real API secret from your Cloudinary dashboard (Settings → Access Keys)."
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };

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
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
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
