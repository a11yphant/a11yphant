-- DropForeignKey
ALTER TABLE "check_results" DROP CONSTRAINT "check_results_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "check_results" DROP CONSTRAINT "check_results_resultId_fkey";

-- DropForeignKey
ALTER TABLE "code_level_results" DROP CONSTRAINT "code_level_results_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "code_level_submissions" DROP CONSTRAINT "code_level_submissions_levelId_fkey";

-- DropForeignKey
ALTER TABLE "code_level_submissions" DROP CONSTRAINT "code_level_submissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "code_levels" DROP CONSTRAINT "code_levels_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "hints" DROP CONSTRAINT "hints_taskId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_level_resuls" DROP CONSTRAINT "quiz_level_resuls_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_levels" DROP CONSTRAINT "quiz_levels_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "requirements" DROP CONSTRAINT "requirements_levelId_fkey";

-- DropForeignKey
ALTER TABLE "requirements" DROP CONSTRAINT "requirements_ruleId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_levelId_fkey";

-- AddForeignKey
ALTER TABLE "quiz_levels" ADD CONSTRAINT "quiz_levels_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_level_resuls" ADD CONSTRAINT "quiz_level_resuls_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "quiz_level_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_levels" ADD CONSTRAINT "code_levels_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "code_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "code_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hints" ADD CONSTRAINT "hints_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_level_submissions" ADD CONSTRAINT "code_level_submissions_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "code_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_level_submissions" ADD CONSTRAINT "code_level_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_level_results" ADD CONSTRAINT "code_level_results_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "code_level_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_results" ADD CONSTRAINT "check_results_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "code_level_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_results" ADD CONSTRAINT "check_results_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
