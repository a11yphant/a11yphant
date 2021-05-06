import { Injectable } from "@nestjs/common";
import { Hint as HintRecord } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { Hint } from "./models/hint.model";

@Injectable()
export class HintService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string): Promise<Hint> {
    const record = await this.prisma.hint.findUnique({ where: { id } });

    return record ? HintService.createModelFromDatabaseRecord(record) : null;
  }

  async findForTask(taskId: string): Promise<Hint[]> {
    const hints = await this.prisma.hint.findMany({
      where: { taskId },
    });

    return hints.map((hint) => HintService.createModelFromDatabaseRecord(hint));
  }

  static createModelFromDatabaseRecord(record: HintRecord): Hint {
    const hint = new Hint({ id: record.id, text: record.text });

    return hint;
  }
}
