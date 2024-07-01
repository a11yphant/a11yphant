-- DropForeignKey
ALTER TABLE "quiz_answer_options" DROP CONSTRAINT "quiz_answer_options_quizLevelId_fkey";

-- AddForeignKey
ALTER TABLE "quiz_answer_options" ADD CONSTRAINT "quiz_answer_options_quizLevelId_fkey" FOREIGN KEY ("quizLevelId") REFERENCES "quiz_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
