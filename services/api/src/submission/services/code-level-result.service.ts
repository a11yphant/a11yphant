import { Injectable } from "@nestjs/common";
import { CodeLevelResult as ResultRecord, Prisma } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import { Result } from "../graphql/models/result.model";
import { ResultStatus } from "../graphql/models/result-status.enum";

@Injectable()
export class CodeLevelResultService {
  constructor(private prisma: PrismaService) {}

  async findOneForSubmission(id: string): Promise<Result> {
    const record = await this.prisma.codeLevelResult.findFirst({
      where: {
        submissionId: id,
      },
    });

    return record ? CodeLevelResultService.createModelFromRecord(record) : null;
  }

  async countNumberOfCheckedRequirements(id: string): Promise<number> {
    return this.prisma.checkResult.count({ where: { resultId: id } });
  }

  async countNumberOfFailedRequirementChecks(id: string): Promise<number> {
    return this.prisma.checkResult.count({ where: { resultId: id, status: ResultStatus.FAIL } });
  }

  async update(id: string, data: Pick<Prisma.CodeLevelResultUpdateInput, "status">): Promise<Result> {
    const record = await this.prisma.codeLevelResult.update({
      where: {
        id,
      },
      data,
    });

    return record ? CodeLevelResultService.createModelFromRecord(record) : null;
  }

  static createModelFromRecord(record: ResultRecord): Result {
    return new Result({ id: record.id, status: record.status, submissionId: record.submissionId });
  }
}
