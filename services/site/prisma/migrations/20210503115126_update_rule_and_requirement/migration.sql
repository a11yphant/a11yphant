/*
  Warnings:

  - You are about to drop the column `shortDescription` on the `rules` table. All the data in the column will be lost.
  - You are about to drop the column `additionalDescription` on the `rules` table. All the data in the column will be lost.
  - You are about to drop the `_RequirementToRule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RequirementToRule" DROP CONSTRAINT "_RequirementToRule_A_fkey";

-- DropForeignKey
ALTER TABLE "_RequirementToRule" DROP CONSTRAINT "_RequirementToRule_B_fkey";

-- AlterTable
ALTER TABLE "requirements" ADD COLUMN     "ruleId" TEXT;

-- AlterTable
ALTER TABLE "rules" DROP COLUMN "shortDescription",
DROP COLUMN "additionalDescription",
ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "_RequirementToRule";

-- AddForeignKey
ALTER TABLE "requirements" ADD FOREIGN KEY ("ruleId") REFERENCES "rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
