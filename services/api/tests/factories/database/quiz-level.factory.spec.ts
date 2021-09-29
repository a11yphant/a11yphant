import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { QUIZ_LEVEL, QuizLevelData } from ".";
import { Factory } from "./factory";

describe("quiz level database factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a level record with the default options", async () => {
    const prisma = getPrismaService();

    const level = await prisma.quizLevel.create({
      data: Factory.build<QuizLevelData>(QUIZ_LEVEL),
    });

    expect(level).toBeTruthy();
  });

  it("can create a level record with answers", async () => {
    const prisma = getPrismaService();

    const level = await prisma.quizLevel.create({
      data: Factory.build<QuizLevelData>(QUIZ_LEVEL, {}, { numberOfAnswerOptions: 2 }),
      include: {
        answerOptions: true,
      },
    });

    expect(level.answerOptions).toHaveLength(2);
  });

  it("does not create a challenge when a challenge id is passed", () => {
    const level = Factory.build<QuizLevelData>(QUIZ_LEVEL, { challengeId: faker.datatype.uuid() });

    expect(level.challenge).toBeUndefined();
  });
});
