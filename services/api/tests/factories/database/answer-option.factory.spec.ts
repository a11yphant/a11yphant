import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { ANSWER_OPTION } from "./constants";
import { Factory } from "./factory";
import { AnswerOptionData } from "./types";

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
