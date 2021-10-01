-- Rename table
ALTER TABLE "levels" RENAME TO "code_levels";

-- AlterTable
ALTER TABLE "code_levels" RENAME CONSTRAINT "levels_pkey" TO "code_levels_pkey";

-- RenameForeignKey
ALTER TABLE "code_levels" RENAME CONSTRAINT "levels_challengeId_fkey" TO "code_levels_challengeId_fkey";
