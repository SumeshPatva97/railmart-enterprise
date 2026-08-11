import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkImages() {
  const images = await prisma.productImage.findMany();
  console.log('Product images count:', images.length);
  for (const img of images.slice(0, 5)) {
    console.log(`- ID: ${img.id}, URL preview: ${img.url ? img.url.substring(0, 60) : 'null'}`);
  }
  await prisma.$disconnect();
}

checkImages().catch(console.error);
