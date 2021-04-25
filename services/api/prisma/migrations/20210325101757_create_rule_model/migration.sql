-- CreateTable
CREATE TABLE "rules" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RequirementToRule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "rules.key_unique" ON "rules"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_RequirementToRule_AB_unique" ON "_RequirementToRule"("A", "B");

-- CreateIndex
CREATE INDEX "_RequirementToRule_B_index" ON "_RequirementToRule"("B");

-- AddForeignKey
ALTER TABLE "_RequirementToRule" ADD FOREIGN KEY ("A") REFERENCES "requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequirementToRule" ADD FOREIGN KEY ("B") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
