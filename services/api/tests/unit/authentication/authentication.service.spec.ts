import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { useDatabase } from "@tests/support/helpers";

import { AuthenticationService } from "@/authentication/authentication.service";
import { HashService } from "@/authentication/hash.service";
import { JwtService } from "@/authentication/jwt.service";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

function createAuthenticationService(
  partials: { userService?: Partial<UserService>; hashService?: Partial<HashService>; jwtService?: Partial<JwtService> } = {},
): AuthenticationService {
  const userService = createMock<UserService>(partials.userService);
  const hashService = createMock<HashService>(partials.hashService);
  const jwtService = createMock<JwtService>(partials.jwtService);

  return new AuthenticationService(userService, hashService, jwtService);
}

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

      const service = createAuthenticationService({
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
      const service = createAuthenticationService({
        userService: {
          findByEmail: jest.fn().mockResolvedValue(null),
        },
      });

      expect(service.login({ email: "test_mail", password: "test_pw" })).rejects.toThrowError(errorMessage);
    });

    it("throws an error if the password is wrong.", async () => {
      const prisma = getPrismaService();

      const user = await prisma.user.create({
        data: UserFactory.build(),
      });

      const service = createAuthenticationService({
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
