import { Injectable } from "@nestjs/common";
import { CheckResult, Requirement } from "@prisma/client";

import { RequirementStatus } from "@/challenge/enums/requirement-status.enum";
import { PrismaService } from "@/prisma/prisma.service";
import { RequirementResult } from "@/submission/graphql/models/requirement-result.model";

@Injectable()
export class RequirementResultService {
  constructor(private prisma: PrismaService) {}

  async findManyForResult(resultId: string): Promise<RequirementResult[]> {
    const records = await this.prisma.checkResult.findMany({
      where: { resultId },
      include: { requirement: true },
      orderBy: { requirement: { order: "asc" } },
    });

    return records.map((record) => this.createRequirementFromRecord(record));
  }

  async create(resultId: string, requirementId: string, status: RequirementStatus): Promise<RequirementResult> {
    const record = await this.prisma.checkResult.create({
      data: {
        resultId,
        requirementId,
        status,
      },
      include: { requirement: true },
    });

    return this.createRequirementFromRecord(record);
  }

  private createRequirementFromRecord(record: CheckResult & { requirement: Requirement }): RequirementResult {
    return new RequirementResult({
      id: record.id,
      result: record.status,
      title: record.requirement.title,
      description: record.requirement.description,
      requirementId: record.requirementId,
    });
  }
}
