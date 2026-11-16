import cloudinary from "../config/cloudinary";
import { ResourceType } from "../middlewares/upload";

export interface ICloudinaryResult {
  url: string;
  publicId: string;
  secure_url: string;
  public_id: string;
}

export const uploadBuffer = (
  buffer: Buffer,
  folder: string = "audit-website",
  resourceType: ResourceType = "image"
): Promise<ICloudinaryResult> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error: any, result: any) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    stream.end(buffer);
  });

export const deleteMedia = async (publicId: string, resourceType: ResourceType = "image"): Promise<void> => {
  if (!publicId || publicId === "default") return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
