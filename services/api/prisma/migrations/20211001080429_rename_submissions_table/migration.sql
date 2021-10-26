-- AlterTable
ALTER TABLE "submissions" RENAME TO "code_level_submissions";

-- AlterTable
ALTER TABLE "code_level_submissions" RENAME CONSTRAINT "submissions_levelId_fkey" TO "code_level_submissions_levelId_fkey";

-- AlterTable
ALTER TABLE "code_level_submissions" RENAME CONSTRAINT "submissions_userId_fkey" TO "code_level_submissions_userId_fkey";

-- AlterTable
ALTER TABLE "code_level_submissions" RENAME CONSTRAINT "submissions_pkey" TO "code_level_submissions_pkey";
