/*
  Warnings:

  - You are about to drop the column `longDescription` on the `rules` table. All the data in the column will be lost.
  - Added the required column `additionalDescription` to the `rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rules" DROP COLUMN "longDescription",
ADD COLUMN     "additionalDescription" TEXT NOT NULL;
