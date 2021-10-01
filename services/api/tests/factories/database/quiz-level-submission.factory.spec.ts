import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { QUIZ_LEVEL_SUBMISSION, QuizLevelSubmissionData } from ".";
import { Factory } from "./factory";

describe("quiz level submission factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a quiz level submission record with default options", async () => {
    const prisma = getPrismaService();

    const result = await prisma.quizLevelSubmission.create({
      data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION),
    });

    expect(result).toBeTruthy();
  });
});
