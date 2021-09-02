import { Injectable } from "@nestjs/common";
import { Prisma, Result as ResultRecord } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import { Result } from "../graphql/models/result.model";
import { ResultStatus } from "../graphql/models/result-status.enum";

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  async findOneForSubmission(id: string): Promise<Result> {
    const record = await this.prisma.result.findFirst({
      where: {
        submissionId: id,
      },
    });

    return record ? ResultService.createModelFromRecord(record) : null;
  }

  async countNumberOfCheckedRequirements(id: string): Promise<number> {
    return this.prisma.checkResult.count({ where: { resultId: id } });
  }

  async countNumberOfFailedRequirementChecks(id: string): Promise<number> {
    return this.prisma.checkResult.count({ where: { resultId: id, status: ResultStatus.FAIL } });
  }

  async update(id: string, data: Pick<Prisma.ResultUpdateInput, "status">): Promise<Result> {
    const record = await this.prisma.result.update({
      where: {
        id,
      },
      data,
    });

    return record ? ResultService.createModelFromRecord(record) : null;
  }

  static createModelFromRecord(record: ResultRecord): Result {
    return new Result({ id: record.id, status: record.status, submissionId: record.submissionId });
  }
}
