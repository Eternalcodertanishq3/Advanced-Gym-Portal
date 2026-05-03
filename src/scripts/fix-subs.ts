import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing orphan subscriptions...");
  
  const subscriptions = await prisma.subscription.findMany({
    where: { branchId: null },
    include: {
      member: {
        include: {
          user: {
            select: { branchId: true }
          }
        }
      }
    }
  });

  console.log(`Found ${subscriptions.length} subscriptions with null branchId.`);

  for (const sub of subscriptions) {
    if (sub.member.user.branchId) {
      console.log(`Updating subscription for member ${sub.memberId} to branch ${sub.member.user.branchId}`);
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { branchId: sub.member.user.branchId }
      });
    }
  }

  const payments = await prisma.payment.findMany({
    where: { branchId: null },
    include: {
      member: {
        include: {
          user: {
            select: { branchId: true }
          }
        }
      }
    }
  });

  console.log(`Found ${payments.length} payments with null branchId.`);

  for (const pay of payments) {
    if (pay.member?.user?.branchId) {
      console.log(`Updating payment ${pay.id} to branch ${pay.member.user.branchId}`);
      await prisma.payment.update({
        where: { id: pay.id },
        data: { branchId: pay.member.user.branchId }
      });
    }
  }

  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
