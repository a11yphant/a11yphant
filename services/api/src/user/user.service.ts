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

  async findUserFromOauth(userId: string, provider: string, providerAuthId: string): Promise<User> {
    let userRecord = await this.prisma.user.findFirst({
      where: {
        authId: providerAuthId,
        authProvider: provider,
      },
    });

    if (userRecord) return new User(userRecord);

    userRecord = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        authId: providerAuthId,
        authProvider: provider,
      },
    });

    return new User(userRecord);
  }
}
