import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime";

import { HashService } from "@/authentication/hash.service";
import { ProviderInformation } from "@/authentication/interfaces/provider-information.interface";
import { PrismaService } from "@/prisma/prisma.service";

import { RegisterUserInput } from "./inputs/register-user.input";
import { User } from "./models/user.model";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService, private hashService: HashService) {}

  async create(): Promise<User> {
    const record = await this.prisma.user.create({
      data: {},
    });

    return new User(record);
  }

  async findById(userId: string): Promise<User> {
    try {
      const userRecord = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return userRecord ? new User(userRecord) : null;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        return null;
      }

      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return userRecord ? new User(userRecord) : null;
  }

  async registerUser(registerUserInput: RegisterUserInput, currentUserId: string): Promise<User> {
    const currentUser = await this.prisma.user.findFirst({
      where: {
        id: currentUserId,
      },
    });

    if (!currentUser) throw new Error("Anonymous user is invalid.");

    if (currentUser.authProvider !== "anonymous") {
      throw new Error("User is already registered.");
    }

    const userRecord = await this.prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        authProvider: "local",
        email: registerUserInput.email,
        password: await this.hashService.make(registerUserInput.password),
        displayName: registerUserInput.displayName,
      },
    });

    return userRecord ? new User(userRecord) : null;
  }

  async confirmUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verifiedAt: new Date(),
      },
    });
  }

  async updateWithAuthInformation(userId: string, providerInformation: ProviderInformation): Promise<User | null> {
    let userRecord = await this.prisma.user.findFirst({
      where: {
        authId: providerInformation.id,
        authProvider: providerInformation.provider,
      },
    });

    userRecord = await this.prisma.user.update({
      where: {
        id: userRecord?.id || userId,
      },
      data: {
        authId: providerInformation.id,
        authProvider: providerInformation.provider,
        displayName: providerInformation.displayName,
      },
    });

    return new User(userRecord);
  }

  async seenUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastSeen: new Date(),
      },
    });
  }

  async deleteStaleUsers(): Promise<void> {
    const [codeLevelusers, quizLevelUsers] = await Promise.all([
      this.prisma.codeLevelSubmission.groupBy({
        by: ["userId"],
      }),
      this.prisma.quizLevelSubmission.groupBy({
        by: ["userId"],
      }),
    ]);

    const userIdsWithSubmissions = Array.from(new Set([...codeLevelusers, ...quizLevelUsers].map((sub) => sub.userId)));

    const date = new Date();
    date.setDate(date.getDate() - this.config.get<number>("api.user-as-stale-days"));

    await this.prisma.user.deleteMany({
      where: {
        AND: {
          authProvider: "anonymous",
          id: {
            notIn: userIdsWithSubmissions,
          },
          lastSeen: {
            lt: date,
          },
        },
      },
    });
  }
}
