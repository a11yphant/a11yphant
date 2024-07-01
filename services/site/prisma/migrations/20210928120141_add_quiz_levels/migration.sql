-- CreateTable
CREATE TABLE "quiz_levels" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "question" TEXT NOT NULL,
    "challengeId" UUID NOT NULL,

    CONSTRAINT "quiz_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answer_options" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "quizLevelId" UUID NOT NULL,

    CONSTRAINT "quiz_answer_options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quiz_levels" ADD CONSTRAINT "quiz_levels_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answer_options" ADD CONSTRAINT "quiz_answer_options_quizLevelId_fkey" FOREIGN KEY ("quizLevelId") REFERENCES "quiz_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
