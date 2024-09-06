-- DropForeignKey
ALTER TABLE "check_results" DROP CONSTRAINT "check_results_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "check_results" DROP CONSTRAINT "check_results_resultId_fkey";

-- DropForeignKey
ALTER TABLE "levels" DROP CONSTRAINT "levels_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "requirements" DROP CONSTRAINT "requirements_levelId_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_levelId_fkey";

-- AddForeignKey
ALTER TABLE "levels" ADD FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_results" ADD FOREIGN KEY ("resultId") REFERENCES "results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_results" ADD FOREIGN KEY ("requirementId") REFERENCES "requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
