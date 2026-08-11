import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function migrateAllImagesToSKUFolders() {
  console.log('🚀 Starting image migration to SKU folder structure (public/uploads/<SKU>/)...');

  const products = await prisma.product.findMany({
    include: { images: true },
  });

  console.log(`📦 Found ${products.length} total products in database.`);

  let totalMigrated = 0;

  for (const product of products) {
    const sku = (product.sku || `PROD-${product.id.slice(0, 6)}`).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const skuDir = path.join(process.cwd(), 'public', 'uploads', sku);

    if (!fs.existsSync(skuDir)) {
      fs.mkdirSync(skuDir, { recursive: true });
    }

    console.log(`\n📌 Processing Product: "${product.name}" (SKU: ${sku}) - ${product.images.length} images`);

    for (let idx = 0; idx < product.images.length; idx++) {
      const img = product.images[idx];
      const currentUrl = img.url;

      if (!currentUrl) continue;

      // If already in the target SKU folder, check if file exists
      if (currentUrl.startsWith(`/uploads/${sku}/`)) {
        const localFilePath = path.join(process.cwd(), 'public', currentUrl);
        if (fs.existsSync(localFilePath)) {
          console.log(`  ✓ Image ${img.id} already exists in SKU folder: ${currentUrl}`);
          continue;
        }
      }

      try {
        let buffer = null;
        let ext = 'jpg';

        if (currentUrl.startsWith('data:image/')) {
          // Base64 Image
          const matches = currentUrl.match(/^data:image\/([a-zA-Z0-9+\-]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            ext = matches[1].toLowerCase() === 'jpeg' ? 'jpg' : matches[1].toLowerCase();
            buffer = Buffer.from(matches[2], 'base64');
          }
        } else if (currentUrl.startsWith('http://') || currentUrl.startsWith('https://')) {
          // Remote HTTP URL
          console.log(`  ↓ Downloading remote image: ${currentUrl}`);
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
            console.error(`  ✕ Failed to download ${currentUrl}: HTTP ${res.status}`);
          }
        } else if (currentUrl.startsWith('/uploads/')) {
          // Existing local file in old path (e.g. /uploads/products/...)
          const oldFilePath = path.join(process.cwd(), 'public', currentUrl);
          if (fs.existsSync(oldFilePath)) {
            buffer = fs.readFileSync(oldFilePath);
            ext = path.extname(oldFilePath).replace('.', '') || 'jpg';
          }
        }

        if (buffer) {
          const uniqueId = crypto.randomBytes(4).toString('hex');
          const filename = `img_${Date.now()}_${uniqueId}.${ext}`;
          const filePath = path.join(skuDir, filename);

          fs.writeFileSync(filePath, buffer);
          const newUrlPath = `/uploads/${sku}/${filename}`;

          await prisma.productImage.update({
            where: { id: img.id },
            data: { url: newUrlPath },
          });

          totalMigrated++;
          console.log(`  ✓ Saved & Updated DB: ${newUrlPath}`);
        }
      } catch (err) {
        console.error(`  ✕ Error migrating image ${img.id}:`, err.message || err);
      }
    }
  }

  console.log(`\n🎉 Migration Complete! Successfully migrated ${totalMigrated} images into public/uploads/<SKU>/ folders.`);
  await prisma.$disconnect();
}

migrateAllImagesToSKUFolders().catch(async (e) => {
  console.error('Fatal Migration Error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
