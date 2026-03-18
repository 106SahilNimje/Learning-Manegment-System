const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Running Prisma generate...");
  const genResult = execSync('npx prisma generate', { encoding: 'utf-8' });
  fs.writeFileSync('migration_log.txt', genResult);
  
  console.log("Running Prisma db push...");
  const pushResult = execSync('npx prisma db push --accept-data-loss', { encoding: 'utf-8' });
  fs.appendFileSync('migration_log.txt', '\n' + pushResult);
  
  console.log("Done.");
} catch (err) {
  fs.writeFileSync('migration_log.txt', err.message + '\n\n' + (err.stdout ? err.stdout : ''));
}
