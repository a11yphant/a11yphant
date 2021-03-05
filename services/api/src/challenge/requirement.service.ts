import { PrismaService } from "@a11y-challenges/prisma";
import { Injectable } from "@nestjs/common";

import { Requirement } from "./models/requirement.model";

@Injectable()
export class RequirementService {
  constructor(private prisma: PrismaService) {}

  async findForLevel(levelId: string): Promise<Requirement[]> {
    const requirements = await this.prisma.requirement.findMany({
      where: { levelId },
    });

    return requirements.map((requirement) => Requirement.fromDatabaseRecord(requirement));
  }
}
