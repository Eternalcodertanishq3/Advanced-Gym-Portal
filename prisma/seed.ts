import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcryptjs.hash('EagleGym123!', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@eaglegym.in' },
    update: {},
    create: {
      email: 'admin@eaglegym.in',
      firstName: 'Super',
      lastName: 'Admin',
      phone: '9876543210',
      password: password,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log({ superAdmin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
