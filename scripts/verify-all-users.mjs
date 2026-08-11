import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAllUsers() {
  console.log('Marking all existing user accounts as emailVerified: true...');
  const result = await prisma.user.updateMany({
    data: {
      emailVerified: true,
    },
  });
  console.log(`✅ ${result.count} user accounts marked as email verified!`);
  await prisma.$disconnect();
}

verifyAllUsers().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
