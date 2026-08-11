import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function downloadAndLocalizeImages() {
  console.log('Fetching all existing product images from database...');

  const images = await prisma.productImage.findMany({
    include: { product: true },
  });

  console.log(`Found ${images.length} total product images.`);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let count = 0;

  for (const img of images) {
    const currentUrl = img.url;
    if (!currentUrl) continue;

    // Skip if already in /uploads/products/
    if (currentUrl.startsWith('/uploads/products/')) {
      console.log(`Skipping image ID ${img.id} (already local): ${currentUrl}`);
      continue;
    }

    try {
      let buffer = null;
      let ext = 'jpg';

      if (currentUrl.startsWith('data:image/')) {
        // Base64 image
        const matches = currentUrl.match(/^data:image\/([a-zA-Z0-9+\-]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          ext = matches[1].toLowerCase() === 'jpeg' ? 'jpg' : matches[1].toLowerCase();
          buffer = Buffer.from(matches[2], 'base64');
        }
      } else if (currentUrl.startsWith('http://') || currentUrl.startsWith('https://')) {
        // Remote URL (e.g. Unsplash or Cloudinary)
        console.log(`Downloading remote image for product "${img.product?.name}": ${currentUrl}`);
        const res = await fetch(currentUrl);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('png')) ext = 'png';
          else if (contentType.includes('webp')) ext = 'webp';
          else if (contentType.includes('gif')) ext = 'gif';
          else if (contentType.includes('svg')) ext = 'svg';
        } else {
          console.error(`Failed to download ${currentUrl}: HTTP ${res.status}`);
        }
      }

      if (buffer) {
        const uniqueId = crypto.randomBytes(6).toString('hex');
        const filename = `prod_${Date.now()}_${uniqueId}.${ext}`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, buffer);
        const localPath = `/uploads/products/${filename}`;

        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: localPath },
        });

        count++;
        console.log(`Successfully saved & updated image ID ${img.id} -> ${localPath}`);
      }
    } catch (err) {
      console.error(`Error processing image ID ${img.id}:`, err.message || err);
    }
  }

  console.log(`\nMigration Completed! ${count} images saved into /public/uploads/products/ and updated in DB.`);
  await prisma.$disconnect();
}

downloadAndLocalizeImages().catch(async (e) => {
  console.error('Fatal Migration Error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
