import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function migrateImages() {
  console.log('Starting Base64 image migration to local file storage...');

  const images = await prisma.productImage.findMany();
  let migratedCount = 0;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  for (const img of images) {
    if (img.url && img.url.startsWith('data:image/')) {
      try {
        const matches = img.url.match(/^data:image\/([a-zA-Z0-9+\-]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          let ext = matches[1].toLowerCase();
          if (ext === 'jpeg') ext = 'jpg';
          if (ext === 'svg+xml') ext = 'svg';

          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          const uniqueId = crypto.randomBytes(6).toString('hex');
          const filename = `prod_${Date.now()}_${uniqueId}.${ext}`;
          const filePath = path.join(uploadDir, filename);

          fs.writeFileSync(filePath, buffer);
          const relativeUrl = `/uploads/products/${filename}`;

          await prisma.productImage.update({
            where: { id: img.id },
            data: { url: relativeUrl },
          });

          migratedCount++;
          console.log(`Migrated image ID ${img.id} -> ${relativeUrl}`);
        }
      } catch (err) {
        console.error(`Error migrating image ID ${img.id}:`, err);
      }
    }
  }

  console.log(`Migration complete! Successfully converted ${migratedCount} Base64 images to file paths.`);
  await prisma.$disconnect();
}

migrateImages().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
