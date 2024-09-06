/**
 * @jest-environment node
 */

import { faker } from "@faker-js/faker";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, QUIZ_LEVEL, QuizLevelData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

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
    const level = Factory.build<QuizLevelData>(QUIZ_LEVEL, { challengeId: faker.string.uuid() });

    expect(level.challenge).toBeUndefined();
  });
});
