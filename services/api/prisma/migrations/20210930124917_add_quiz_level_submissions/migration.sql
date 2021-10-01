-- CreateTable
CREATE TABLE "QuizLevelSubmission" (
    "id" UUID NOT NULL,
    "levelId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "QuizLevelSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnswerOptionToQuizLevelSubmission" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerOptionToQuizLevelSubmission_AB_unique" ON "_AnswerOptionToQuizLevelSubmission"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerOptionToQuizLevelSubmission_B_index" ON "_AnswerOptionToQuizLevelSubmission"("B");

-- AddForeignKey
ALTER TABLE "QuizLevelSubmission" ADD CONSTRAINT "QuizLevelSubmission_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "quiz_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizLevelSubmission" ADD CONSTRAINT "QuizLevelSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerOptionToQuizLevelSubmission" ADD FOREIGN KEY ("A") REFERENCES "quiz_answer_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerOptionToQuizLevelSubmission" ADD FOREIGN KEY ("B") REFERENCES "QuizLevelSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
