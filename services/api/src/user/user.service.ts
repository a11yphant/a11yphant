import { Injectable } from "@nestjs/common";

import { ProviderInformation } from "@/authentication/interfaces/providerInformation.interface";
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

  async updateWithAuthInformation(userId: string, providerInformation: ProviderInformation): Promise<User | null> {
    let userRecord = await this.prisma.user.findFirst({
      where: {
        authId: providerInformation.id,
        authProvider: providerInformation.provider,
      },
    });

    if (userRecord) return new User(userRecord);

    if (!userId) return null;

    userRecord = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        authId: providerInformation.id,
        authProvider: providerInformation.provider,
        displayName: providerInformation.displayName,
      },
    });

    return new User(userRecord);
  }
}
