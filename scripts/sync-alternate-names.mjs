import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Syncing alternateName for existing products...');
  const products = await prisma.product.findMany();
  for (const p of products) {
    // Extract last 2 digits from SKU if possible, or format index
    const match = p.sku.match(/(\d{2})$/);
    let altName = p.alternateName;
    if (match) {
      altName = match[1];
    }
    console.log(`Updating product ${p.sku} (${p.name}) alternateName -> ${altName}`);
    await prisma.product.update({
      where: { id: p.id },
      data: { alternateName: altName },
    });
  }
  console.log('✅ Sync finished successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
