import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcryptjs.hash('GymFlowSuper123!', 12);

  // 1. Create SaaS Plans
  const plansData = [
    {
      name: 'Free Trial',
      price: 0,
      interval: 'MONTHLY',
      maxBranches: 1,
      maxMembers: 50,
      features: ['Basic Attendance', 'Single Branch', 'Member Directory'],
    },
    {
      name: 'Growth Plan',
      price: 4999,
      interval: 'MONTHLY',
      maxBranches: 3,
      maxMembers: 500,
      features: ['Multi-Branch Scoping', 'POS & Inventory', 'Trainer Assigning', 'SMS & WhatsApp Broadcasts'],
    },
    {
      name: 'Elite Enterprise',
      price: 9999,
      interval: 'MONTHLY',
      maxBranches: 10,
      maxMembers: 5000,
      features: ['Unlimited Branches', 'Dedicated Storage Bucket', 'API Integrations', 'Custom Domain Support'],
    },
  ];

  const plans = [];
  for (const plan of plansData) {
    let createdPlan = await prisma.saaSPlan.findFirst({
      where: { name: plan.name },
    });
    if (!createdPlan) {
      createdPlan = await prisma.saaSPlan.create({
        data: {
          name: plan.name,
          price: plan.price,
          interval: plan.interval,
          maxBranches: plan.maxBranches,
          maxMembers: plan.maxMembers,
          features: plan.features,
        },
      });
    }
    plans.push(createdPlan);
  }

  // 2. Create Demo Tenant linked to Growth Plan
  const demoTenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'GymFlow Demo Gym',
      subdomain: 'demo',
      currency: 'INR',
      locale: 'en-IN',
      saasPlanId: plans[1].id,
      saasStatus: 'ACTIVE',
    },
  });

  // 3. Create Super Admin User linked to Demo Tenant
  let adminPhone = '9876543210';
  const existingPhoneUser = await prisma.user.findUnique({
    where: { phone: adminPhone },
  });
  if (existingPhoneUser && existingPhoneUser.email !== 'admin@gymflow.io') {
    adminPhone = '9876543211'; // Use fallback phone number if the primary is already taken by another user
  }

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@gymflow.io' },
    update: {
      phone: adminPhone,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      tenantId: demoTenant.id,
    },
    create: {
      email: 'admin@gymflow.io',
      firstName: 'Super',
      lastName: 'Admin',
      phone: adminPhone,
      password: password,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      tenantId: demoTenant.id,
      superAdmin: {
        create: {},
      },
    },
  });

  // Ensure SuperAdmin record is linked
  await prisma.superAdmin.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
    },
  });

  console.log('Seeding completed successfully:', {
    plansCreated: plans.length,
    demoTenantId: demoTenant.id,
    superAdminId: superAdmin.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
