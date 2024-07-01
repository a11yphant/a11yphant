/*
  Warnings:

  - You are about to drop the column `ruleId` on the `check_results` table. All the data in the column will be lost.
  - Added the required column `requirementId` to the `check_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_results" DROP CONSTRAINT "check_results_ruleId_fkey";

-- AlterTable
ALTER TABLE "check_results" DROP COLUMN "ruleId",
ADD COLUMN     "requirementId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "check_results" ADD FOREIGN KEY ("requirementId") REFERENCES "requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
