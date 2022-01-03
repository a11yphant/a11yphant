import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { createConfigServiceMock } from "@tests/support/helpers";

import { AuthenticationService } from "@/authentication/authentication.service";
import { InvalidJwtException } from "@/authentication/exceptions/invalid-jwt.exception";
import { UserNotFoundException } from "@/authentication/exceptions/user-not-found.exception";
import { ResetPasswordErrorCodes } from "@/authentication/graphql/enums/reset-password-error-codes.enum";
import { ValidatePasswordResetTokenResultEnum } from "@/authentication/graphql/enums/validate-password-reset-token-result.enum";
import { AuthenticationResolver } from "@/authentication/graphql/resolvers/authentication.resolver";
import { ResetPasswordErrorResult } from "@/authentication/graphql/results/reset-password-error.result";
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
    const user = new User(UserFactory.build());
    const loginInput = { email: user.email, password: "test_pw" };
    const token = "test_token";

    const login = jest.fn();
    const findByEmail = jest.fn();
    const createSignedToken = jest.fn();
    const cookie = jest.fn();
    const context = createMock<IContext>({ res: { cookie: cookie } });

    const resolver = createAuthenticationResolver({
      authenticationService: { login },
      jwtService: { createSignedToken },
    });

    beforeEach(() => {
      jest.clearAllMocks();

      login.mockResolvedValue(user);
      findByEmail.mockResolvedValue(user);
      createSignedToken.mockResolvedValue(token);
    });

    it("returns the logged in user", async () => {
      const loggedInUser = await resolver.login(loginInput, context);

      expect(login).toHaveBeenCalledTimes(1);
      expect(login).toHaveBeenCalledWith(loginInput);

      expect(loggedInUser).toBe(user);
    });

    it("sets the session cookie", async () => {
      await resolver.login(loginInput, context);

      expect(createSignedToken).toHaveBeenCalledTimes(1);
      expect(createSignedToken).toHaveBeenCalledWith({ userId: user.id }, expect.anything());

      expect(cookie).toHaveBeenCalledTimes(1);
      expect(cookie).toHaveBeenCalledWith(expect.stringContaining(""), token, expect.anything());
    });

    it("throws an error if username or password are wrong", () => {
      login.mockRejectedValue(new Error("E-Mail or password wrong."));

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

    it("returns valid if the validation does not throw an error", () => {
      const validatePasswordResetToken = jest.fn().mockResolvedValue(true);

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      expect(resolver.validatePasswordResetToken("test_token")).resolves.toEqual({ result: ValidatePasswordResetTokenResultEnum.VALID });
    });

    it("returns invalid token if the token is not valid", () => {
      const validatePasswordResetToken = jest.fn().mockRejectedValue(new InvalidJwtException());

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      expect(resolver.validatePasswordResetToken("test_token")).resolves.toEqual({ result: ValidatePasswordResetTokenResultEnum.INVALID_TOKEN });
    });

    it("returns invalid token if the token is not valid", () => {
      const validatePasswordResetToken = jest.fn().mockRejectedValue(new InvalidJwtException());

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      expect(resolver.validatePasswordResetToken("test_token")).resolves.toEqual({ result: ValidatePasswordResetTokenResultEnum.INVALID_TOKEN });
    });

    it("returns invalid token if the token is not valid", () => {
      const validatePasswordResetToken = jest.fn().mockRejectedValue(new UserNotFoundException());

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      expect(resolver.validatePasswordResetToken("test_token")).resolves.toEqual({ result: ValidatePasswordResetTokenResultEnum.UNKNOWN_USER });
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

      const result = await resolver.resetPassword("test_token", "test_password");

      expect(resetPassword).toHaveBeenCalledWith("test_token", "test_password");
      expect(result).toHaveProperty("id");
    });

    it("returns an error if the jwt is not valid", async () => {
      const resetPassword = jest.fn().mockRejectedValue(new InvalidJwtException());

      const resolver = createAuthenticationResolver({
        authenticationService: {
          resetPassword,
        },
      });

      const result = await resolver.resetPassword("test_token", "test_password");

      expect(resetPassword).toHaveBeenCalledWith("test_token", "test_password");
      expect(result).toHaveProperty("errorCode", ResetPasswordErrorCodes.INVALID_TOKEN);
    });

    it("returns an error if the password is not valid", async () => {
      const resolver = createAuthenticationResolver();

      const result = await resolver.resetPassword("test_token", "secret");

      expect(result).toHaveProperty("errorCode", "INPUT_VALIDATION_ERROR");
      expect((result as ResetPasswordErrorResult).inputErrors).toHaveLength(1);
      expect((result as ResetPasswordErrorResult).inputErrors[0]).toHaveProperty("field", "password");
    });
  });
});
