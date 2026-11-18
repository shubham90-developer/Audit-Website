import type { Express } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Reuse your existing configured Cloudinary client if it is initialized elsewhere.
export const uploadToCloudinary = (file: Express.Multer.File): Promise<{ url: string; publicId: string }> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'audit-website/legal-pages', resource_type: 'image' }, (error, result) => {
      if (error || !result) return reject(error || new Error('Upload failed'))
      resolve({ url: result.secure_url, publicId: result.public_id })
    })
    Readable.from(file.buffer).pipe(stream)
  })
