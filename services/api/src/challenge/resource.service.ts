import { PrismaService } from "@a11y-challenges/prisma";
import { Injectable } from "@nestjs/common";

import { Resource } from "./models/resource.model";

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  async findForLevel(levelId: string): Promise<Resource[]> {
    const resources = await this.prisma.resource.findMany({
      where: { levelId },
    });

    return resources.map((resource) => Resource.fromDatabaseRecord(resource));
  }
}
