/*
  Warnings:

  - Added the required column `displayName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "displayName" TEXT NOT NULL;
