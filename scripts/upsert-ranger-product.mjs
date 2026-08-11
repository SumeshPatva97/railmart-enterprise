import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function upsertRangerProduct() {
  console.log('Adding / Updating 12) RANGER Tatkal Software product in database...');

  // Ensure category exists
  let category = await prisma.category.findUnique({
    where: { slug: 'tatkal-booking-software' },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Tatkal Booking Software',
        slug: 'tatkal-booking-software',
        description: 'High-speed automated IRCTC Tatkal ticket booking softwares.',
      },
    });
  }

  const sku = 'TTK-RANGER-12';
  const slug = 'ranger-tatkal-software';
  const name = '12) RANGER';
  const alternateName = '12';
  const price = 1449;
  const description = 'RANGER – BEST FOR BOTH APP & WEB\nBest Performance on App & Web\nSmooth & Fast Working\nFamous for Stable App Login\nReliable Performance\nQuick Response\nSeamless Login Experience\nRANGER is built for users who want fast, smooth, and dependable performance on both App and Web.';
  const featuresList = [
    'Best Performance on App & Web',
    'Smooth & Fast Working',
    'Famous for Stable App Login',
    'Reliable Performance',
    'Quick Response',
    'Seamless Login Experience'
  ];

  // Upsert product
  const existingProduct = await prisma.product.findFirst({
    where: { OR: [{ sku }, { slug }] },
  });

  let product;
  if (existingProduct) {
    product = await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        name: 'RANGER Tatkal Software',
        alternateName,
        price,
        description,
        features: JSON.stringify(featuresList),
        is_deleted: 0,
        isVisible: true,
        status: 'ACTIVE',
        stock: 100,
        categoryId: category.id,
      },
      include: { images: true },
    });
    console.log(`✓ Updated existing RANGER product (ID: ${product.id})`);
  } else {
    product = await prisma.product.create({
      data: {
        name: 'RANGER Tatkal Software',
        alternateName,
        slug,
        sku,
        price,
        discount: 0,
        stock: 100,
        gstPercent: 18,
        deliveryCharges: 0,
        description,
        features: JSON.stringify(featuresList),
        isFeatured: true,
        isPopular: true,
        status: 'ACTIVE',
        isVisible: true,
        is_deleted: 0,
        categoryId: category.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
              alt: 'RANGER Tatkal Software',
              isPrimary: true,
            },
          ],
        },
      },
      include: { images: true },
    });
    console.log(`✓ Created new RANGER product (ID: ${product.id})`);
  }

  // Ensure local SKU folder image exists
  const skuDir = path.join(process.cwd(), 'public', 'uploads', sku);
  if (!fs.existsSync(skuDir)) {
    fs.mkdirSync(skuDir, { recursive: true });
  }

  console.log(`\nProduct Details:\nName: ${product.name}\nSKU: ${product.sku}\nPrice: ₹${product.price}\nSort Key (alternateName): ${product.alternateName}`);
  console.log('✅ RANGER product added successfully!');

  await prisma.$disconnect();
}

upsertRangerProduct().catch(async (e) => {
  console.error('Error adding RANGER product:', e);
  await prisma.$disconnect();
  process.exit(1);
});
