import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Converts a Base64 image data URL to a local file stored in `public/uploads/<SKU>/`
 * and returns the lightweight URL path (e.g., `/uploads/SKU-123/img_1712345678_abcd.jpg`).
 * If the string is already a URL/path, it returns it unchanged.
 */
export function saveImageFile(imageStr: string, sku: string = 'general'): string {
  if (!imageStr || typeof imageStr !== 'string') return imageStr;

  // If it's not a Base64 data URL, keep it as is (e.g. /uploads/... or http://...)
  if (!imageStr.startsWith('data:image/')) {
    return imageStr;
  }

  try {
    const matches = imageStr.match(/^data:image\/([a-zA-Z0-9+\-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return imageStr;
    }

    let ext = matches[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Clean SKU for directory path
    const safeSku = (sku || 'general').trim().replace(/[^a-zA-Z0-9_-]/g, '_');

    // Target directory: public/uploads/<SKU>/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeSku);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueId = crypto.randomBytes(4).toString('hex');
    const filename = `img_${Date.now()}_${uniqueId}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    return `/uploads/${safeSku}/${filename}`;
  } catch (err) {
    console.error('Failed to save Base64 image to file storage:', err);
    return imageStr;
  }
}
