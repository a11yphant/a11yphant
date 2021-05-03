import { Injectable } from "@nestjs/common";
import { Requirement as RequirementRecord, Rule as RuleRecord } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { Requirement } from "./models/requirement.model";
import { Rule } from "./models/rule.model";

@Injectable()
export class RequirementService {
  constructor(private prisma: PrismaService) {}

  async findForLevel(levelId: string): Promise<Requirement[]> {
    const requirements = await this.prisma.requirement.findMany({
      where: { levelId },
      // TODO remove when refactoring the resultForSubmission endpoint
      include: {
        rule: true,
      },
    });

    return requirements.map((requirement) => RequirementService.createModelFromDatabaseRecord(requirement));
  }

  static createModelFromDatabaseRecord(record: RequirementRecord & { rule: RuleRecord }): Requirement {
    const requirement = new Requirement({
      id: record.id,
      title: record.title,
      description: record.description,
    });

    // TODO remove when refactoring
    if (!record.rule) {
      return requirement;
    }

    requirement.rule = new Rule({
      id: record.rule.id,
      key: record.rule.key,
    });

    return requirement;
  }
}
