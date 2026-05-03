import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const members = await prisma.member.findMany({
    include: {
      user: true,
      subscription: {
        include: {
          plan: true
        }
      }
    }
  });

  console.log("=== MEMBERS ===");
  members.forEach(m => {
    console.log(`Member: ${m.user.firstName} ${m.user.lastName}`);
    console.log(`- User BranchId: ${m.user.branchId}`);
    console.log(`- Status: ${m.status}`);
    if (m.subscription) {
      console.log(`- Subscription:`);
      console.log(`  - Plan: ${m.subscription.plan.name}`);
      console.log(`  - Status: ${m.subscription.status}`);
      console.log(`  - BranchId: ${m.subscription.branchId}`);
      console.log(`  - EndDate: ${m.subscription.endDate}`);
    } else {
      console.log(`- No Subscription`);
    }
    console.log("---");
  });

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" }
  });

  console.log("=== ADMINS ===");
  admins.forEach(a => {
    console.log(`Admin: ${a.firstName} ${a.lastName} - BranchId: ${a.branchId}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
