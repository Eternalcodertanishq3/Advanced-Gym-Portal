const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  const rawPassword = 'password123';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  
  await prisma.user.update({
    where: { email: 'admin@eaglegym.in' },
    data: { password: hashedPassword }
  });
  
  console.log('Password reset successfully for admin@eaglegym.in to:', rawPassword);
  
  // Verify it immediately
  const user = await prisma.user.findUnique({ where: { email: 'admin@eaglegym.in' } });
  const match = await bcrypt.compare(rawPassword, user.password);
  console.log('Verification match in script:', match);
  
  process.exit(0);
}

resetPassword().catch(err => {
  console.error(err);
  process.exit(1);
});
