import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { Rule } from "./models/rule.model";

@Injectable()
export class RuleService {
  constructor(private prisma: PrismaService) {}
  async findOneForRequirement(requirementId: string): Promise<Rule> {
    const record = await this.prisma.requirement.findFirst({ where: { id: requirementId }, select: { rule: true } });

    return record?.rule ? new Rule({ id: record.rule.id, key: record.rule.key }) : null;
  }
}
