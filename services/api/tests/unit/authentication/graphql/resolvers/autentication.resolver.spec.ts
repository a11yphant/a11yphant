import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { createConfigServiceMock } from "@tests/support/helpers";
import faker from "faker";

import { AuthenticationService } from "@/authentication/authentication.service";
import { AuthenticationResolver } from "@/authentication/graphql/resolvers/authentication.resolver";
import { Context as IContext } from "@/authentication/interfaces/context.interface";
import { JwtService } from "@/authentication/jwt.service";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

function createAuthenticationResolver(
  partials: {
    authenticationService?: Partial<AuthenticationService>;
    userService?: Partial<UserService>;
    jwtService?: Partial<JwtService>;
    config?: Record<string, any>;
  } = {},
): AuthenticationResolver {
  const authenticationService = createMock<AuthenticationService>({
    ...partials.authenticationService,
  });
  const userService = createMock<UserService>({
    findById: jest.fn().mockResolvedValue(UserFactory.build()),
    ...partials.userService,
  });
  const jwtService = createMock<JwtService>({
    ...partials.jwtService,
  });
  const configService = createConfigServiceMock({
    ...partials.config,
  });

  return new AuthenticationResolver(authenticationService, userService, jwtService, configService as ConfigService);
}

describe("authentication resolver", () => {
  describe("login", () => {
    it("returns the logged in user and sets the cookie", async () => {
      const id = faker.datatype.uuid();
      const user = new User(UserFactory.build({ id }));

      const loginInput = { email: user.email, password: "test_pw" };
      const token = "test_token";

      const loginFunc = jest.fn().mockResolvedValue(user);
      const signFunc = jest.fn().mockResolvedValue(token);
      const cookieFunc = jest.fn();

      const resolver = createAuthenticationResolver({
        authenticationService: {
          login: loginFunc,
        },
        jwtService: {
          createSignedToken: signFunc,
        },
      });

      const loggedInUser = await resolver.login(
        loginInput,
        createMock<IContext>({
          res: { cookie: cookieFunc },
        }),
      );

      expect(loginFunc).toHaveBeenCalledTimes(1);
      expect(loginFunc).toHaveBeenCalledWith(loginInput);

      expect(signFunc).toHaveBeenCalledTimes(1);
      expect(signFunc).toHaveBeenCalledWith({ userId: id }, expect.anything());

      expect(cookieFunc).toHaveBeenCalledTimes(1);
      expect(cookieFunc).toHaveBeenCalledWith(expect.stringContaining(""), token, expect.anything());

      expect(loggedInUser).toBe(user);
    });

    it("throws an error if username or password are wrong", () => {
      const loginFunc = jest.fn().mockRejectedValue(new Error("E-Mail or password wrong."));

      const resolver = createAuthenticationResolver({
        authenticationService: {
          login: loginFunc,
        },
      });

      expect(resolver.login({ email: "test_mail", password: "test_pw" }, createMock<IContext>())).rejects.toThrowError("E-Mail or password wrong.");
    });
  });

  describe("validate password reset token", () => {
    it("calls validate password reset token on the auth service with the provided token", () => {
      const validatePasswordResetToken = jest.fn().mockResolvedValue(true);

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      resolver.validatePasswordResetToken("test_token");

      expect(validatePasswordResetToken).toHaveBeenCalledWith("test_token");
    });
  });

  describe("password reset", () => {
    it("calls reset password on the auth service with the provided token", async () => {
      const resetPassword = jest.fn().mockResolvedValue(true);

      const resolver = createAuthenticationResolver({
        authenticationService: {
          resetPassword,
        },
      });

      await resolver.resetPassword("test_token", "test_password");

      expect(resetPassword).toHaveBeenCalledWith("test_token", "test_password");
    });
  });
});
