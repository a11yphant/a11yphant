import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ANSWER_OPTION, AnswerOptionData, Factory } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";
import faker from "faker";

describe("answer option factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a result record with default options", async () => {
    const prisma = getPrismaService();

    const answerOption = await prisma.answerOption.create({
      data: Factory.build<AnswerOptionData>(ANSWER_OPTION),
    });

    expect(answerOption).toBeTruthy();
  });

  it("does not create a quiz level if an quiz level id is passed", () => {
    const data = Factory.build<AnswerOptionData>(ANSWER_OPTION, { quizLevelId: faker.datatype.uuid() });

    expect(data.quizLevel).toBeUndefined();
  });
});
