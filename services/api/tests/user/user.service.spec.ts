import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { UserFactory } from "@tests/factories/models/user.factory";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { CryptService } from "@/authentication/crypt.service";
import { ProviderInformation } from "@/authentication/interfaces/providerInformation.interface";
import { RegisterUserInput } from "@/user/inputs/register-user.input";
import { UserService } from "@/user/user.service";

describe("user service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can create a user", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma, createMock<CryptService>(), createMock<Logger>());

    expect(await service.create()).toHaveProperty("id", expect.any(String));
  });

  it("can find a user by id", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma, createMock<CryptService>(), createMock<Logger>());

    const user = await service.create();

    expect(await service.findById(user.id)).toHaveProperty("id", user.id);
  });

  it("returns null if it cannot find the user by id", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma, createMock<CryptService>(), createMock<Logger>());

    expect(await service.findById(faker.datatype.uuid())).toBeNull();
  });

  it("adds auth information to an anonymous user", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma, createMock<CryptService>(), createMock<Logger>());

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

  describe("register", () => {
    it("registers an user", async () => {
      const prisma = getPrismaService();
      const service = new UserService(
        prisma,
        createMock<CryptService>({ hashPassword: jest.fn().mockResolvedValue("hashedPassword") }),
        createMock<Logger>(),
      );

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
      const service = new UserService(getPrismaService(), createMock<CryptService>(), createMock<Logger>());

      expect(service.registerUser({ email: "test", password: "test" }, faker.datatype.uuid())).rejects.toThrowError("Anonymous user is invalid.");
    });

    it("throws an error if the user is already registered", async () => {
      const prisma = getPrismaService();
      const service = new UserService(prisma, createMock<CryptService>(), createMock<Logger>());

      const userId = faker.datatype.uuid();

      await prisma.user.create({
        data: UserFactory.build({ id: userId, authProvider: "github" }),
      });

      expect(service.registerUser({ email: "test", password: "test" }, userId)).rejects.toThrowError("User is already registered.");
    });
  });
});
