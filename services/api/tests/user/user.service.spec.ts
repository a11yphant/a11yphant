import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { CODE_LEVEL_SUBMISSION, CodeLevelSubmissionData, Factory, USER, UserData } from "@tests/factories/database";
import { UserFactory } from "@tests/factories/models/user.factory";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { HashService } from "@/authentication/hash.service";
import { ProviderInformation } from "@/authentication/interfaces/provider-information.interface";
import { PrismaService } from "@/prisma/prisma.service";
import { RegisterUserInput } from "@/user/inputs/register-user.input";
import { UserService } from "@/user/user.service";

describe("user service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("create", () => {
    it("can create a user", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<HashService>(), createMock<Logger>());

      expect(await service.create()).toHaveProperty("id", expect.any(String));
    });
  });

  describe("findById", () => {
    it("can find a user by id", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<HashService>(), createMock<Logger>());

      const user = await prisma.user.create({
        data: UserFactory.build(),
      });

      expect(await service.findById(user.id)).toHaveProperty("id", user.id);
    });

    it("returns null if it cannot find the user by id", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<HashService>(), createMock<Logger>());

      expect(await service.findById(faker.datatype.uuid())).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("can find a user by email", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<HashService>(), createMock<Logger>());

      const user = await prisma.user.create({
        data: UserFactory.build({ email: "hallo@a11yphant.com" }),
      });

      expect(await service.findByEmail(user.email)).toHaveProperty("email", user.email);
    });
  });

  describe("updateWithAuthInformation", () => {
    it("adds auth information to an anonymous user", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<HashService>(), createMock<Logger>());

      const user = await prisma.user.create({
        data: UserFactory.build({ displayName: null }),
      });

      const providerInformation: ProviderInformation = {
        id: faker.datatype.uuid(),
        displayName: faker.name.findName(),
        provider: "github",
      };

      await service.updateWithAuthInformation(user.id, providerInformation);

      const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(updatedUser).toHaveProperty("displayName", providerInformation.displayName);
      expect(updatedUser).toHaveProperty("authProvider", providerInformation.provider);
    });
  });

  describe("register", () => {
    it("registers an user", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<HashService>({ make: jest.fn().mockResolvedValue("hashedPassword") }), createMock<Logger>());

      const userId = faker.datatype.uuid();
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
      const service = new UserService(getPrismaService(), createMock<HashService>(), createMock<Logger>());

      expect(service.registerUser({ email: "test", password: "test" }, faker.datatype.uuid())).rejects.toThrowError("Anonymous user is invalid.");
    });

    it("throws an error if the user is already registered", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<HashService>(), createMock<Logger>());

      const userId = faker.datatype.uuid();

      await prisma.user.create({
        data: UserFactory.build({ id: userId, authProvider: "github" }),
      });

      expect(service.registerUser({ email: "test", password: "test" }, userId)).rejects.toThrowError("User is already registered.");
    });
  });

  describe("seenUser", () => {
    it("updates the last seen time", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<HashService>({ make: jest.fn().mockResolvedValue("hashedPassword") }), createMock<Logger>());

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
    const runDeleteOnService = async (prisma: PrismaService): Promise<void> => {
      const service = new UserService(prisma, createMock<HashService>(), createMock<Logger>());
      await service.deleteStaleUsers();
    };

    it("deletes a stale user successfully", async () => {
      const prisma = getPrismaService();

      const date = new Date();
      date.setDate(date.getDate() - 8);

      await prisma.user.create({
        data: Factory.build<UserData>(USER, { authProvider: "anonymous", lastSeen: date }),
      });

      await runDeleteOnService(prisma);

      expect(await prisma.user.count()).toEqual(0);
    });

    it("doesn't delete recently active users", async () => {
      const prisma = getPrismaService();

      const date = new Date();
      date.setDate(date.getDate() - 2);

      await prisma.user.create({
        data: Factory.build<UserData>(USER, { lastSeen: date }),
      });

      await runDeleteOnService(prisma);

      expect(await prisma.user.count()).toEqual(1);
    });

    it("doesn't delete user with submissions", async () => {
      const prisma = getPrismaService();
      const date = new Date();
      date.setDate(date.getDate() - 12);

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
      date.setDate(date.getDate() - 12);

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
});
