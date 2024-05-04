-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authId" TEXT,
ADD COLUMN     "authProvider" TEXT NOT NULL DEFAULT E'anonymous';
