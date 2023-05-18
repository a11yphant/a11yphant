import { faker } from "@faker-js/faker";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CODE_LEVEL_SUBMISSION, CodeLevelSubmissionData, Factory, USER, UserData } from "@tests/support/factories/database";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { createConfigServiceMock, useDatabase } from "@tests/support/helpers";

import { HashService } from "@/authentication/hash.service";
import { ProviderInformation } from "@/authentication/interfaces/provider-information.interface";
import { PrismaService } from "@/prisma/prisma.service";
import { AnonymousUserInvalidError } from "@/user/exceptions/anonymous-user-invalid.error";
import { EmailInUseError } from "@/user/exceptions/email-in-use.error";
import { UserRegisteredError } from "@/user/exceptions/user-registered.error";
import { RegisterUserInput } from "@/user/inputs/register-user.input";
import { UserService } from "@/user/user.service";

describe("user service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  const getUserService = (
    prisma: PrismaService = getPrismaService(),
    partials: { hashService?: Partial<HashService>; configs?: Record<string, any> } = {},
  ): UserService => {
    const hashService = createMock<HashService>({
      ...partials?.hashService,
    });

    const configService = createMock<ConfigService>(createConfigServiceMock(partials?.configs));

    return new UserService(prisma, hashService, configService);
  };

  describe("create", () => {
    it("can create a user", async () => {
      const service = getUserService();
      expect(await service.create()).toHaveProperty("id", expect.any(String));
    });
  });

  describe("findById", () => {
    it("can find a user by id", async () => {
      const prisma = getPrismaService();
      const service = getUserService(prisma);

      const user = await prisma.user.create({
        data: UserFactory.build(),
      });

      expect(await service.findById(user.id)).toHaveProperty("id", user.id);
    });

    it("returns null if it cannot find the user by id", async () => {
      const service = getUserService();
      expect(await service.findById(faker.string.uuid())).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("can find a user by email", async () => {
      const prisma = getPrismaService();
      const service = getUserService(prisma);

      const user = await prisma.user.create({
        data: UserFactory.build({ email: "hallo@a11yphant.com" }),
      });

      expect(await service.findByEmail(user.email)).toHaveProperty("email", user.email);
    });
  });

  describe("register", () => {
    it("registers an user", async () => {
      const prisma = getPrismaService();

      const service = getUserService(prisma, {
        hashService: {
          make: jest.fn().mockResolvedValue("hashedPassword"),
        },
      });

      const userId = faker.string.uuid();
      const email = "hallo@a11yphant.com";
      const password = "fake_password";

      await prisma.user.create({
        data: UserFactory.build({ id: userId, authProvider: "anonymous" }),
      });

      const input: RegisterUserInput = {
        email,
        password,
        displayName: "A11y Phant",
      };

      const createdUser = await service.registerUser(input, userId);

      expect(createdUser.authProvider).toBe("local");
      expect(createdUser.email).toBe(email);
    });

    it("throws an error if the anonymous user is not found", async () => {
      const service = getUserService();
      expect(service.registerUser({ email: "test", password: "test" }, faker.string.uuid())).rejects.toBeInstanceOf(AnonymousUserInvalidError);
    });

    it("throws an error if the email addres is already in use", async () => {
      const prisma = getPrismaService();
      const service = getUserService(prisma);

      const userId = faker.string.uuid();
      const email = faker.internet.email();

      await Promise.all([
        prisma.user.create({
          data: UserFactory.build({ id: userId }),
        }),
        prisma.user.create({
          data: UserFactory.build({ email, authProvider: "local" }),
        }),
      ]);

      expect(service.registerUser({ email, password: "test" }, userId)).rejects.toBeInstanceOf(EmailInUseError);
    });

    it("throws an error if the user is already registered", async () => {
      const prisma = getPrismaService();
      const service = getUserService(prisma);

      const userId = faker.string.uuid();

      await prisma.user.create({
        data: UserFactory.build({ id: userId, authProvider: "github" }),
      });

      expect(service.registerUser({ email: "test", password: "test" }, userId)).rejects.toBeInstanceOf(UserRegisteredError);
    });
  });

  describe("confirmUser", () => {
    it("sets the confirmation time", async () => {
      const prisma = getPrismaService();
      const service = getUserService(prisma);

      let user = await prisma.user.create({
        data: UserFactory.build(),
      });

      await service.confirmUser(user.id);

      user = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });

      expect(user.verifiedAt).toBeTruthy();
    });
  });

  describe("updateWithAuthInformation", () => {
    it("adds auth information to an anonymous user", async () => {
      const prisma = getPrismaService();
      const service = getUserService(prisma);

      const user = await prisma.user.create({
        data: UserFactory.build({ displayName: null }),
      });

      const providerInformation: ProviderInformation = {
        id: faker.string.uuid(),
        displayName: faker.person.fullName(),
        provider: "github",
      };

      await service.updateWithAuthInformation(user.id, providerInformation);

      const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(updatedUser).toHaveProperty("displayName", providerInformation.displayName);
      expect(updatedUser).toHaveProperty("authProvider", providerInformation.provider);
    });
  });

  describe("seenUser", () => {
    it("updates the last seen time", async () => {
      const prisma = getPrismaService();

      const service = getUserService(prisma);

      let user = await prisma.user.create({
        data: UserFactory.build(),
      });

      const oldTime = user.lastSeen;

      await service.seenUser(user.id);

      user = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });

      expect(user.lastSeen.getTime()).toBeGreaterThan(oldTime.getTime());
    });
  });

  describe("deleteStaleUsers", () => {
    const STALEDAYS = 7;

    const runDeleteOnService = async (prisma: PrismaService): Promise<void> => {
      const service = getUserService(prisma, {
        configs: {
          "api.user-as-stale-days": STALEDAYS,
        },
      });
      await service.deleteStaleUsers();
    };

    it("deletes a stale user successfully", async () => {
      const prisma = getPrismaService();

      const date = new Date();
      date.setDate(date.getDate() - STALEDAYS - 1);

      await prisma.user.create({
        data: Factory.build<UserData>(USER, { authProvider: "anonymous", lastSeen: date }),
      });

      await runDeleteOnService(prisma);

      expect(await prisma.user.count()).toEqual(0);
    });

    it("doesn't delete recently active users", async () => {
      const prisma = getPrismaService();

      const date = new Date();
      date.setDate(date.getDate() - STALEDAYS + 3);

      await prisma.user.create({
        data: Factory.build<UserData>(USER, { lastSeen: date }),
      });

      await runDeleteOnService(prisma);

      expect(await prisma.user.count()).toEqual(1);
    });

    it("doesn't delete user with submissions", async () => {
      const prisma = getPrismaService();
      const date = new Date();
      date.setDate(date.getDate() - STALEDAYS - 5);

      await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
          user: {
            create: Factory.build<UserData>(USER, {
              lastSeen: date,
            }),
          },
        }),
      });

      await runDeleteOnService(prisma);

      expect(await prisma.user.count()).toEqual(1);
    });

    it("only deletes anonymous users", async () => {
      const prisma = getPrismaService();
      const date = new Date();
      date.setDate(date.getDate() - STALEDAYS - 5);

      await prisma.user.create({
        data: Factory.build<UserData>(USER, { authProvider: "anonymous", lastSeen: date }),
      });

      const goodUser = await prisma.user.create({
        data: Factory.build<UserData>(USER, { authProvider: "github", lastSeen: date }),
      });

      await runDeleteOnService(prisma);

      expect(await prisma.user.count()).toEqual(1);
      expect((await prisma.user.findFirst()).id).toBe(goodUser.id);
    });
  });

  describe("update password", () => {
    it("can update the password for a user", async () => {
      const hashedPassword = "hashedPassword";
      const prisma = getPrismaService();
      const service = new UserService(
        prisma,
        createMock<HashService>({ make: jest.fn().mockResolvedValue(hashedPassword) }),
        createMock<ConfigService>(createConfigServiceMock()),
      );

      const user = await prisma.user.create({
        data: UserFactory.build({ authProvider: "local" }),
      });

      await service.updatePassword(user.id, "newPassword");

      const updatedUser = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });

      expect(updatedUser.password).toEqual(hashedPassword);
    });
  });
});
