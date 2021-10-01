-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "submissions" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
