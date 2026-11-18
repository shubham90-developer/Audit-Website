"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});
// Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
// Protect this router using your existing admin authentication middleware.
router.post("/", upload.single("image"), async (req, res, next) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "Image required" });
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: "audit-blog" }, (err, data) => {
                if (err || !data)
                    return reject(err || new Error("Upload failed"));
                resolve(data);
            });
            stream.end(req.file.buffer);
        });
        res.json({
            success: true,
            data: { url: result.secure_url, publicId: result.public_id },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
