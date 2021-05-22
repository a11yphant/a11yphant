import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

import { User } from "./models/user.model";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(): Promise<User> {
    const record = await this.prisma.user.create({
      data: {},
    });

    return new User(record);
  }
}
