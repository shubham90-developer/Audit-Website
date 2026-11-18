"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadMany = exports.uploadBuffer = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
/* ---------- Common multer middleware (use in any route) ----------
   upload.single("image")
   upload.array("images", 10)
   upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }])
------------------------------------------------------------------ */
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/")) {
            return cb(null, true);
        }
        cb(new Error("Only image and video files are allowed"));
    },
});
/* ---------- Cloudinary helpers ---------- */
const uploadBuffer = (buffer, folder, resourceType) => new Promise((resolve, reject) => {
    const stream = cloudinary_1.default.uploader.upload_stream({ folder, resource_type: resourceType }, (error, result) => {
        if (error || !result)
            return reject(error ?? new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(buffer);
});
exports.uploadBuffer = uploadBuffer;
const uploadMany = (files, folder, resourceType) => Promise.all((files ?? []).map((f) => (0, exports.uploadBuffer)(f.buffer, folder, resourceType)));
exports.uploadMany = uploadMany;
const deleteFromCloudinary = (publicId, resourceType) => cloudinary_1.default.uploader.destroy(publicId, { resource_type: resourceType });
exports.deleteFromCloudinary = deleteFromCloudinary;
