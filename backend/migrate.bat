@echo off
cd c:\Users\asus1\Downloads\LMS\backend
npx prisma generate
npx prisma db push --accept-data-loss
echo MIGRATION_DONE > migration_status.txt
