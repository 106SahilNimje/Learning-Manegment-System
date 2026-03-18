const prisma = require('./src/config/prisma');
const bcrypt = require('bcryptjs');

async function test() {
  const email = 'reseller@lms.com';
  const user = await prisma.user.findFirst({ where: { email } });
  
  if (!user) {
    console.log("User not found!");
    return;
  }
  
  console.log("User found:", user.email, user.role);
  
  const isMatch = await bcrypt.compare('password123', user.password);
  console.log("Password match for 'password123':", isMatch);
}

test().finally(() => prisma.$disconnect());
