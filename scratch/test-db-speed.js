const { PrismaClient } = require('@prisma/client');

async function test() {
  const directUrl = "postgresql://neondb_owner:npg_oWGk5LUBEO8R@ep-empty-recipe-avutgsic.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const pooledUrl = "postgresql://neondb_owner:npg_oWGk5LUBEO8R@ep-empty-recipe-avutgsic-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require";
  
  console.log("Testing Direct Connection...");
  const prismaDirect = new PrismaClient({ datasources: { db: { url: directUrl } } });
  let t1 = Date.now();
  let count1 = await prismaDirect.product.count();
  console.log("Direct Result:", count1, "in", Date.now() - t1, "ms");
  await prismaDirect.$disconnect();

  console.log("Testing Pooled Connection...");
  const prismaPooled = new PrismaClient({ datasources: { db: { url: pooledUrl } } });
  let t2 = Date.now();
  let count2 = await prismaPooled.product.count();
  console.log("Pooled Result:", count2, "in", Date.now() - t2, "ms");
  await prismaPooled.$disconnect();
}

test().catch(console.error);
