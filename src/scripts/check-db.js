const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      status: true
    }
  });
  console.log('Users in database:');
  console.table(users);
  process.exit(0);
}

checkUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
