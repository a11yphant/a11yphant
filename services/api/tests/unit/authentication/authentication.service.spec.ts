import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { useDatabase } from "@tests/support/helpers";

import { AuthenticationService } from "@/authentication/authentication.service";
import { HashService } from "@/authentication/hash.service";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

describe("authentication service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  const errorMessage = "E-Mail or password wrong.";

  describe("login", () => {
    it("can log in an user.", async () => {
      const prisma = getPrismaService();

      const email = "hallo@a11yphant.com";

      const user = await prisma.user.create({
        data: UserFactory.build({ email }),
      });

      const service = new AuthenticationService(
        createMock<UserService>({
          findByEmail: jest.fn().mockResolvedValue(new User(user)),
        }),
        createMock<HashService>({
          compare: jest.fn().mockResolvedValue(true),
        }),
      );

      const loggedInUser = await service.login({ email: user.email, password: "test_pw" });
      expect(loggedInUser.email).toBe(email);
    });

    it("throws an error if the email is not found.", () => {
      const service = new AuthenticationService(
        createMock<UserService>({
          findByEmail: jest.fn().mockResolvedValue(null),
        }),
        createMock<HashService>(),
      );

      expect(service.login({ email: "test_mail", password: "test_pw" })).rejects.toThrowError(errorMessage);
    });

    it("throws an error if the password is wrong.", async () => {
      const prisma = getPrismaService();

      const user = await prisma.user.create({
        data: UserFactory.build(),
      });

      const service = new AuthenticationService(
        createMock<UserService>({
          findByEmail: jest.fn().mockResolvedValue(new User(user)),
        }),
        createMock<HashService>({
          compare: jest.fn().mockResolvedValue(false),
        }),
      );

      expect(service.login({ email: user.email, password: "test_pw" })).rejects.toThrowError(errorMessage);
    });
  });
});
