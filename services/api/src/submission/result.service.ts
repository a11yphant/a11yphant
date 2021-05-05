import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { Result } from "./models/result.model";
import { ResultStatus } from "./models/result-status.enum";

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  async findOneForSubmission(id: string): Promise<Result> {
    const record = await this.prisma.result.findFirst({
      where: {
        submissionId: id,
      },
    });

    return record ? new Result({ id: record.id, status: record.status, submissionId: record.submissionId }) : null;
  }

  async countNumberOfCheckedRequirements(id: string): Promise<number> {
    return this.prisma.checkResult.count({ where: { resultId: id } });
  }

  async countNumberOfFailedRequirementChecks(id: string): Promise<number> {
    return this.prisma.checkResult.count({ where: { resultId: id, status: ResultStatus.FAIL } });
  }
}
