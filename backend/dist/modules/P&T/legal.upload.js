"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
// Reuse your existing configured Cloudinary client if it is initialized elsewhere.
const uploadToCloudinary = (file) => new Promise((resolve, reject) => {
    const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'audit-website/legal-pages', resource_type: 'image' }, (error, result) => {
        if (error || !result)
            return reject(error || new Error('Upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream_1.Readable.from(file.buffer).pipe(stream);
});
exports.uploadToCloudinary = uploadToCloudinary;
