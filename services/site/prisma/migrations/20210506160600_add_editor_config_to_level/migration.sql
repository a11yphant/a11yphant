-- AlterTable
ALTER TABLE "levels" ADD COLUMN     "hasHtmlEditor" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hasCssEditor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasJsEditor" BOOLEAN NOT NULL DEFAULT false;
