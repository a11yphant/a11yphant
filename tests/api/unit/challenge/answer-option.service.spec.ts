/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { CHALLENGE, ChallengeData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";
import { Factory } from "rosie";

import { AnswerOptionService } from "@/challenge/answer-option.service";

describe("answer service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can find all answer options for a quiz level", async () => {
    const prisma = getPrismaService();

    const challenge = await prisma.challenge.create({
      data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfQuizLevels: 2 }),
      include: { quizLevels: true },
    });

    const answerOptionService = new AnswerOptionService(prisma);
    const answerOptions = await answerOptionService.findForQuizLevel(challenge.quizLevels[0].id);
    expect(answerOptions).toHaveLength(2);
  });
});
