/*
  Warnings:

  - The primary key for the `challenges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `check_results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `hints` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `taskId` column on the `hints` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `levels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `requirements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `ruleId` column on the `requirements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `rules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `submissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `userId` column on the `submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `levelId` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[submissionId]` on the table `results` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `challenges` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `check_results` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `resultId` on the `check_results` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `requirementId` on the `check_results` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `hints` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `levels` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `challengeId` on the `levels` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `requirements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `levelId` on the `requirements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `results` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `submissionId` on the `results` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `rules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `levelId` on the `submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

-- AlterTable
ALTER TABLE "check_results" DROP CONSTRAINT "check_results_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "resultId",
ADD COLUMN     "resultId" UUID NOT NULL,
DROP COLUMN "requirementId",
ADD COLUMN     "requirementId" UUID NOT NULL,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "hints" DROP CONSTRAINT "hints_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "taskId",
ADD COLUMN     "taskId" UUID,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "requirements" DROP CONSTRAINT "requirements_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "levelId",
ADD COLUMN     "levelId" UUID NOT NULL,
DROP COLUMN "ruleId",
ADD COLUMN     "ruleId" UUID,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "results" DROP CONSTRAINT "results_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "submissionId",
ADD COLUMN     "submissionId" UUID NOT NULL,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "rules" DROP CONSTRAINT "rules_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "levelId",
ADD COLUMN     "levelId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "levelId",
ADD COLUMN     "levelId" UUID,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "levels" DROP CONSTRAINT "levels_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "challengeId",
ADD COLUMN     "challengeId" UUID NOT NULL,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "results_submissionId_unique" ON "results"("submissionId");

-- AddForeignKey
ALTER TABLE "levels" ADD FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD FOREIGN KEY ("ruleId") REFERENCES "rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hints" ADD FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_results" ADD FOREIGN KEY ("resultId") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_results" ADD FOREIGN KEY ("requirementId") REFERENCES "requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

