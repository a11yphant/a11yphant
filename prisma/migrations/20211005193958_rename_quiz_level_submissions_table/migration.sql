-- AlterTable
ALTER TABLE "QuizLevelSubmission" RENAME CONSTRAINT "QuizLevelSubmission_levelId_fkey" TO "quiz_level_submissions_levelId_fkey";

-- AlterTable
ALTER TABLE "QuizLevelSubmission" RENAME CONSTRAINT "QuizLevelSubmission_userId_fkey" TO "quiz_level_submissions_userId_fkey";

-- AlterTable
ALTER TABLE "QuizLevelSubmission" RENAME TO "quiz_level_submissions";

-- AlterTable
ALTER TABLE "quiz_level_submissions" RENAME CONSTRAINT "QuizLevelSubmission_pkey" TO "quiz_level_submissions_pkey";
