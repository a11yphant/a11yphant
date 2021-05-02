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
        rules: true,
      },
    });

    return requirements.map((requirement) => RequirementService.createModelFromDatabaseRecord(requirement));
  }

  static createModelFromDatabaseRecord(record: RequirementRecord & { rules: RuleRecord[] }): Requirement {
    const requirement = new Requirement({
      id: record.id,
      title: record.title,
    });

    // TODO remove when refactoring
    if (!record.rules) {
      return requirement;
    }

    requirement.rules = record.rules.map(
      (rule) =>
        new Rule({
          id: rule.id,
          key: rule.key,
          title: rule.title,
          shortDescription: rule.shortDescription,
          additionalDescription: rule.additionalDescription,
        }),
    );

    return requirement;
  }
}
