/*
  Warnings:

  - Made the column `ruleId` on table `requirements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "requirements" ALTER COLUMN "ruleId" SET NOT NULL;
