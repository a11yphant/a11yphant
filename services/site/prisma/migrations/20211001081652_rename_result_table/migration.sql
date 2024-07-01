-- AlterTable
ALTER TABLE "results" RENAME CONSTRAINT "results_submissionId_fkey" TO "code_level_results_submissionId_fkey";

-- AlterTable
ALTER TABLE "results" RENAME TO "code_level_results";

-- AlterIndex
ALTER INDEX "results_submissionId_unique" RENAME TO "code_level_results_submissionId_unique";

-- AlterTable
ALTER TABLE "code_level_results" RENAME CONSTRAINT "results_pkey" TO "code_level_results_pkey";
