import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { useDatabase } from "@tests/support/helpers";

import { AuthenticationService } from "@/authentication/authentication.service";
import { HashService } from "@/authentication/hash.service";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

const getAuthenticationService = (
  partials: { userService?: Partial<UserService>; hashService?: Partial<HashService> } = {},
): AuthenticationService => {
  const userService = createMock<UserService>(partials.userService);
  const hashService = createMock<HashService>(partials.hashService);

  return new AuthenticationService(userService, hashService);
};

describe("authentication service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  const errorMessage = "E-Mail or password wrong.";

  describe("login", () => {
    it("can log in an user.", async () => {
      const prisma = getPrismaService();

      const email = "hallo@a11yphant.com";

      const user = await prisma.user.create({
        data: UserFactory.build({ email, verifiedAt: new Date() }),
      });

      const service = getAuthenticationService({
        userService: {
          findByEmail: jest.fn().mockResolvedValue(new User(user)),
        },
        hashService: {
          compare: jest.fn().mockResolvedValue(true),
        },
      });

      const loggedInUser = await service.login({ email: user.email, password: "test_pw" });
      expect(loggedInUser.email).toBe(email);
    });

    it("throws an error if the email is not found.", () => {
      const service = getAuthenticationService({
        userService: {
          findByEmail: jest.fn().mockResolvedValue(null),
        },
      });

      expect(service.login({ email: "test_mail", password: "test_pw" })).rejects.toThrowError(errorMessage);
    });

    it("throws an error if the email is not verified.", async () => {
      const prisma = getPrismaService();

      const user = await prisma.user.create({
        data: UserFactory.build(),
      });

      const service = getAuthenticationService({
        userService: {
          findByEmail: jest.fn().mockResolvedValue(new User(user)),
        },
      });

      expect(service.login({ email: user.email, password: "test_pw" })).rejects.toThrowError("E-Mail address has not yet been verified.");
    });

    it("throws an error if the password is wrong.", async () => {
      const prisma = getPrismaService();

      const user = await prisma.user.create({
        data: UserFactory.build({ verifiedAt: new Date() }),
      });

      const service = getAuthenticationService({
        userService: {
          findByEmail: jest.fn().mockResolvedValue(new User(user)),
        },
        hashService: {
          compare: jest.fn().mockResolvedValue(false),
        },
      });

      expect(service.login({ email: user.email, password: "test_pw" })).rejects.toThrowError(errorMessage);
    });
  });
});
