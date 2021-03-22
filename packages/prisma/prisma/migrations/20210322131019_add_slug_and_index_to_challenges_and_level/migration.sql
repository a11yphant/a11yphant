-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "levels" ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0;
