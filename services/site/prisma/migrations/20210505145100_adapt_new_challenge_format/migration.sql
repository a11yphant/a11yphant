/*
  Warnings:

  - You are about to drop the column `content` on the `hints` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `hints` table. All the data in the column will be lost.
  - You are about to drop the column `tldr` on the `levels` table. All the data in the column will be lost.
  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_levelId_fkey";

-- DropForeignKey
ALTER TABLE "hints" DROP CONSTRAINT "hints_levelId_fkey";

-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "introduction" TEXT NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "hints" DROP COLUMN "content",
DROP COLUMN "levelId",
ADD COLUMN     "text" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "taskId" TEXT;

-- AlterTable
ALTER TABLE "levels" DROP COLUMN "tldr";

-- AlterTable
ALTER TABLE "requirements" ADD COLUMN     "options" JSONB;

-- DropTable
DROP TABLE "resources";

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "levelId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hints" ADD FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
