/*
  Warnings:

  - Added the required column `difficulty` to the `challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "difficulty" INTEGER NOT NULL;
