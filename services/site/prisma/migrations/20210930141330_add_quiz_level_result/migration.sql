-- CreateTable
CREATE TABLE "quiz_level_resuls" (
    "id" UUID NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "submissionId" UUID NOT NULL,

    CONSTRAINT "quiz_level_resuls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_level_resuls_submissionId_unique" ON "quiz_level_resuls"("submissionId");

-- AddForeignKey
ALTER TABLE "quiz_level_resuls" ADD CONSTRAINT "quiz_level_resuls_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "QuizLevelSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
