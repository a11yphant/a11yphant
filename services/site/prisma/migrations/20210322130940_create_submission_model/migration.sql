-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "html" TEXT,
    "css" TEXT,
    "js" TEXT,
    "levelId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "submissions" ADD FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
