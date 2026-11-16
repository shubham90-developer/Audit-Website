import multer from "multer";
import cloudinary from "../config/cloudinary";

export type ResourceType = "image" | "video";

export interface UploadedMedia {
  url: string;
  publicId: string;
}

/* ---------- Common multer middleware (use in any route) ----------
   upload.single("image")
   upload.array("images", 10)
   upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }])
------------------------------------------------------------------ */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      return cb(null, true);
    }
    cb(new Error("Only image and video files are allowed"));
  },
});

/* ---------- Cloudinary helpers ---------- */

export const uploadBuffer = (
  buffer: Buffer,
  folder: string,
  resourceType: ResourceType,
): Promise<UploadedMedia> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });

export const uploadMany = (
  files: { buffer: Buffer }[] | undefined,
  folder: string,
  resourceType: ResourceType,
): Promise<UploadedMedia[]> =>
  Promise.all(
    (files ?? []).map((f) => uploadBuffer(f.buffer, folder, resourceType)),
  );

export const deleteFromCloudinary = (
  publicId: string,
  resourceType: ResourceType,
) => cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
