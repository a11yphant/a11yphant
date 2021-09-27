import { Injectable } from "@nestjs/common";

import { ProviderInformation } from "@/authentication/interfaces/providerInformation.interface";
import { PrismaService } from "@/prisma/prisma.service";

import { User } from "./models/user.model";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        displayName: "anonymous",
      },
    });

    return new User(record);
  }

  async findById(userId: string): Promise<User> {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return userRecord ? new User(userRecord) : null;
  }

  async findUserFromOauth(userId: string, providerInformation: ProviderInformation): Promise<User> {
    let userRecord = await this.prisma.user.findFirst({
      where: {
        authId: providerInformation.id,
        authProvider: providerInformation.provider,
      },
    });

    if (userRecord) return new User(userRecord);

    userRecord = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        authId: providerInformation.id,
        authProvider: providerInformation.provider,
      },
    });

    return new User(userRecord);
  }
}
