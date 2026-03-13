const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCourses() {
  const courses = await prisma.course.findMany();
  console.log("Found courses:", courses);
}

checkCourses()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
