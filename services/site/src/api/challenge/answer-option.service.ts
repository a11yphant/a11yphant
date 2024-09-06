import { Injectable } from "@nestjs/common";
import { AnswerOption } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import { AnswerOption as AnswerOptionModel } from "./models/answer-option.model";

@Injectable()
export class AnswerOptionService {
  constructor(private readonly prisma: PrismaService) {}

  async findForQuizLevel(quizLevelId: string): Promise<AnswerOptionModel[]> {
    const record = await this.prisma.answerOption.findMany({
      where: { quizLevelId: quizLevelId },
    });

    return record.sort(() => 0.5 - Math.random()).map(AnswerOptionService.creatModelFromRecord);
  }

  static creatModelFromRecord(record: AnswerOption): AnswerOptionModel {
    const model = new AnswerOptionModel({ ...record });

    return model;
  }
}
