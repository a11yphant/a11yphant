-- CreateTable
CREATE TABLE "checks" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CheckToRequirement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "checks.key_unique" ON "checks"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_CheckToRequirement_AB_unique" ON "_CheckToRequirement"("A", "B");

-- CreateIndex
CREATE INDEX "_CheckToRequirement_B_index" ON "_CheckToRequirement"("B");

-- AddForeignKey
ALTER TABLE "_CheckToRequirement" ADD FOREIGN KEY ("A") REFERENCES "checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CheckToRequirement" ADD FOREIGN KEY ("B") REFERENCES "requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
