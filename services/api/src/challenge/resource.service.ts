import { PrismaService, Resource as ResourceRecord } from "@a11yphant/prisma";
import { Injectable } from "@nestjs/common";

import { Resource } from "./models/resource.model";

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  async findForLevel(levelId: string): Promise<Resource[]> {
    const resources = await this.prisma.resource.findMany({
      where: { levelId },
    });

    return resources.map((resource) => ResourceService.createModelFromDatabaseRecord(resource));
  }

  static createModelFromDatabaseRecord(record: ResourceRecord): Resource {
    const resource = new Resource({
      id: record.id,
      title: record.title,
      link: record.link,
    });

    return resource;
  }
}
