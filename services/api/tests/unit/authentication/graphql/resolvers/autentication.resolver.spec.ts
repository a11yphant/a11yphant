import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { createConfigServiceMock } from "@tests/support/helpers";

import { AuthenticationService } from "@/authentication/authentication.service";
import { JwtScope } from "@/authentication/enums/jwt-scope.enum";
import { ResendEmailConfirmationResultEnum } from "@/authentication/enums/resend-email-confirmation-result.enum";
import { InvalidJwtException } from "@/authentication/exceptions/invalid-jwt.exception";
import { UserNotFoundException } from "@/authentication/exceptions/user-not-found.exception";
import { RequestPasswordResetErrorCodes } from "@/authentication/graphql/enums/request-password-reset-error-codes.enum";
import { RequestPasswordResetFields } from "@/authentication/graphql/enums/request-password-reset-fields.enum";
import { ResetPasswordErrorCodes } from "@/authentication/graphql/enums/reset-password-error-codes.enum";
import { ResetPasswordFields } from "@/authentication/graphql/enums/reset-password-fields.enum";
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
    requestPasswordReset: jest.fn().mockReturnValue(null),
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
      expect(createSignedToken).toHaveBeenCalledWith({ scope: JwtScope.SESSION }, expect.objectContaining({ subject: user.id }));

      expect(cookie).toHaveBeenCalledTimes(1);
      expect(cookie).toHaveBeenCalledWith(expect.stringContaining(""), token, expect.anything());
    });

    it("throws an error if username or password are wrong", () => {
      login.mockRejectedValue(new Error("E-Mail or password wrong."));

      expect(resolver.login({ email: "test_mail", password: "test_pw" }, createMock<IContext>())).rejects.toThrowError("E-Mail or password wrong.");
    });
  });

  describe("request password reset", () => {
    it("can request a password reset", async () => {
      const email = "info@a11yphant.com";
      const requestPasswordReset = jest.fn().mockResolvedValue(null);
      const resolver = createAuthenticationResolver({
        authenticationService: {
          requestPasswordReset,
        },
      });

      await resolver.requestPasswordReset({ email });

      expect(requestPasswordReset).toHaveBeenCalledWith(email);
    });

    it("fails with an invalid email error when the email is not valid", async () => {
      const email = "not-a-valid-email";

      const resolver = createAuthenticationResolver();

      const result = await resolver.requestPasswordReset({ email });

      expect(result).toHaveProperty("errorCode", RequestPasswordResetErrorCodes.INPUT_VALIDATION_ERROR);
      expect(result).toHaveProperty(
        "inputErrors",
        expect.arrayContaining([
          expect.objectContaining({
            field: RequestPasswordResetFields.EMAIL,
          }),
        ]),
      );
    });
  });

  describe("logout", () => {
    it("returns true and clears the cookie", async () => {
      const user = new User(UserFactory.build());
      user.authProvider = "github";

      const findByIdFunc = jest.fn().mockResolvedValue(user);
      const clearCookieFunc = jest.fn();

      const resolver = createAuthenticationResolver({
        userService: {
          findById: findByIdFunc,
        },
      });

      const logoutResult = await resolver.logout(
        createMock<IContext>({
          res: { clearCookie: clearCookieFunc },
          sessionToken: { userId: user.id },
        }),
      );

      expect(findByIdFunc).toHaveBeenCalledTimes(1);
      expect(findByIdFunc).toHaveBeenCalledWith(user.id);

      expect(clearCookieFunc).toHaveBeenCalledTimes(1);
      expect(clearCookieFunc).toHaveBeenCalledWith(expect.stringContaining(""));

      expect(logoutResult).toBe(true);
    });

    it("returns false if user is anonymous", async () => {
      const user = new User(UserFactory.build());

      const findByIdFunc = jest.fn().mockResolvedValue(user);
      const clearCookieFunc = jest.fn();

      const resolver = createAuthenticationResolver({
        userService: {
          findById: findByIdFunc,
        },
      });

      const logoutResult = await resolver.logout(
        createMock<IContext>({
          res: { clearCookie: clearCookieFunc },
          sessionToken: { userId: user.id },
        }),
      );

      expect(findByIdFunc).toHaveBeenCalledTimes(1);
      expect(findByIdFunc).toHaveBeenCalledWith(user.id);

      expect(clearCookieFunc).not.toHaveBeenCalled();

      expect(logoutResult).toBe(false);
    });

    it("returns false if no user is logged in", async () => {
      const resolver = createAuthenticationResolver();
      const logoutResult = await resolver.logout(createMock<IContext>());

      expect(logoutResult).toEqual(false);
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

      resolver.validatePasswordResetToken({ token: "test_token" });

      expect(validatePasswordResetToken).toHaveBeenCalledWith("test_token");
    });

    it("returns valid if the validation does not throw an error", () => {
      const validatePasswordResetToken = jest.fn().mockResolvedValue(true);

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      expect(resolver.validatePasswordResetToken({ token: "test_token" })).resolves.toEqual({ result: ValidatePasswordResetTokenResultEnum.VALID });
    });

    it("returns invalid token if the token is not valid", () => {
      const validatePasswordResetToken = jest.fn().mockRejectedValue(new InvalidJwtException());

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      expect(resolver.validatePasswordResetToken({ token: "test_token" })).resolves.toEqual({
        result: ValidatePasswordResetTokenResultEnum.INVALID_TOKEN,
      });
    });

    it("returns invalid token if the token is not valid", () => {
      const validatePasswordResetToken = jest.fn().mockRejectedValue(new InvalidJwtException());

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      expect(resolver.validatePasswordResetToken({ token: "test_token" })).resolves.toEqual({
        result: ValidatePasswordResetTokenResultEnum.INVALID_TOKEN,
      });
    });

    it("returns invalid token if the token is not valid", () => {
      const validatePasswordResetToken = jest.fn().mockRejectedValue(new UserNotFoundException());

      const resolver = createAuthenticationResolver({
        authenticationService: {
          validatePasswordResetToken,
        },
      });

      expect(resolver.validatePasswordResetToken({ token: "test_token" })).resolves.toEqual({
        result: ValidatePasswordResetTokenResultEnum.UNKNOWN_USER,
      });
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

      const result = await resolver.resetPassword({ token: "test_token", password: "test_password" });

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

      const result = await resolver.resetPassword({ token: "test_token", password: "test_password" });

      expect(resetPassword).toHaveBeenCalledWith("test_token", "test_password");
      expect(result).toHaveProperty("errorCode", ResetPasswordErrorCodes.INVALID_TOKEN);
    });

    it("returns an error if the password is not valid", async () => {
      const resolver = createAuthenticationResolver();

      const result = await resolver.resetPassword({ token: "test_token", password: "secret" });

      expect(result).toHaveProperty("errorCode", "INPUT_VALIDATION_ERROR");
      expect((result as ResetPasswordErrorResult).inputErrors).toHaveLength(1);
      expect((result as ResetPasswordErrorResult).inputErrors[0]).toHaveProperty("field", ResetPasswordFields.PASSWORD);
    });
  });

  describe("resend confirmation email", () => {
    const user = new User(UserFactory.build());

    it("calls resend confirmation email on the auth service with the provided userId", async () => {
      const resendConfirmationEmail = jest.fn().mockResolvedValue(ResendEmailConfirmationResultEnum.SUCCESSFUL);

      const resolver = createAuthenticationResolver({
        authenticationService: {
          resendConfirmationEmail,
        },
      });

      const result = await resolver.resendConfirmationEmail({ userId: user.id });

      expect(resendConfirmationEmail).toHaveBeenCalledWith(user.id);
      expect(result).toBe(ResendEmailConfirmationResultEnum.SUCCESSFUL);
    });
  });
});
