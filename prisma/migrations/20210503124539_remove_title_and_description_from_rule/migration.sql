/*
  Warnings:

  - You are about to drop the column `title` on the `rules` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `rules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rules" DROP COLUMN "title",
DROP COLUMN "description";
