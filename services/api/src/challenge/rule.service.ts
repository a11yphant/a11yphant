import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { Rule } from "./models/rule.model";

@Injectable()
export class RuleService {
  constructor(private prisma: PrismaService) {}
  async findOneForRequirement(requirementId: string): Promise<Rule> {
    const record = await this.prisma.rule.findFirst({ where: { requirements: { every: { id: requirementId } } } });

    return record ? new Rule({ id: record.id, key: record.key }) : null;
  }
}
