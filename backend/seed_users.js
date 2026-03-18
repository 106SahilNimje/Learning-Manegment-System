const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedUser(email, name, role, orgOwnerId = null) {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  let user = await prisma.user.findFirst({ where: { email } });
  
  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash, role }
    });
  } else {
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role,
      }
    });
  }
  return user;
}

async function seed() {
  console.log('Seeding started...');
  
  // 1. Admin
  await seedUser('admin@lms.com', 'Platform Admin', 'PLATFORM_OWNER');
  console.log('Admin seeded.');

  // 2. Reseller User
  const reseller = await seedUser('reseller@lms.com', 'Demo Reseller Admin', 'RESELLER_ADMIN');
  console.log('Reseller user seeded.');

  // 3. Organization for Reseller
  let org = await prisma.organization.findUnique({ where: { slug: 'demo-reseller' } });
  if (org) {
    await prisma.organization.update({
      where: { id: org.id },
      data: { ownerId: reseller.id }
    });
  } else {
    await prisma.organization.create({
      data: {
        name: 'Demo Reseller',
        slug: 'demo-reseller',
        ownerId: reseller.id,
        commissionRate: 20.0,
        isActive: true,
      }
    });
  }
  console.log('Organization seeded.');

  console.log('-----------------------------------');
  console.log('Seeded successfully!');
  console.log('Admin Account -> Email: admin@lms.com | Password: password123');
  console.log('Reseller Account -> Email: reseller@lms.com | Password: password123');
}

seed()
  .catch((e) => {
    console.error('SEED SCRIPT FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
