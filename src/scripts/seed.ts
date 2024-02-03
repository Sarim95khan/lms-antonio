const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Engineering' },
        { name: 'Science' },
        { name: 'Arts' },
        { name: 'Bussiness' },
        { name: 'Medical' },
        { name: 'Diploma' },
        { name: 'Information and Technology' },
        { name: 'Music' },
      ],
    });
    console.log('Success in seeding data category');
  } catch (error) {
    console.log('Error from seed.ts');
  } finally {
    await database.$disconnect();
  }
}

main();
