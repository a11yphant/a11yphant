import { Injectable } from "@nestjs/common";
import { Requirement as RequirementRecord } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { Requirement } from "./models/requirement.model";

@Injectable()
export class RequirementService {
  constructor(private prisma: PrismaService) {}

  async findForLevel(levelId: string): Promise<Requirement[]> {
    const requirements = await this.prisma.requirement.findMany({
      where: { levelId },
      orderBy: {
        order: "asc",
      },
    });

    return requirements.map((requirement) => RequirementService.createModelFromDatabaseRecord(requirement));
  }

  static createModelFromDatabaseRecord(record: RequirementRecord): Requirement {
    const requirement = new Requirement({
      id: record.id,
      title: record.title,
      description: record.description,
    });

    return requirement;
  }
}
