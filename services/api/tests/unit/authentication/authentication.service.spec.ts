import { createMock } from "@golevelup/ts-jest";
import { UserFactory } from "@tests/support/factories/models/user.factory";

import { AuthenticationService } from "@/authentication/authentication.service";
import { ValidatePasswordResetTokenResultEnum } from "@/authentication/enums/validate-password-reset-token-result.enum";
import { HashService } from "@/authentication/hash.service";
import { JwtService } from "@/authentication/jwt.service";
import { UserService } from "@/user/user.service";

import { InvalidJwtException } from "../../../src/authentication/exceptions/invalid-jwt.exception";

const userId = "userId";

function createAuthenticationService(
  partials: { userService?: Partial<UserService>; hashService?: Partial<HashService>; jwtService?: Partial<JwtService> } = {},
): AuthenticationService {
  const userService = createMock<UserService>({
    findByEmail: jest.fn().mockResolvedValue(UserFactory.build()),
    ...partials.userService,
  });

  const hashService = createMock<HashService>({
    compare: jest.fn().mockResolvedValue(false),
    ...partials.hashService,
  });

  const jwtService = createMock<JwtService>({
    validateToken: jest.fn().mockResolvedValue(true),
    decodeToken: jest.fn().mockReturnValue({ sub: userId, exp: Number.MAX_SAFE_INTEGER }),
    ...partials.jwtService,
  });

  return new AuthenticationService(userService, hashService, jwtService);
}

describe("authentication service", () => {
  const errorMessage = "E-Mail or password wrong.";

  describe("login", () => {
    it("can log in an user.", async () => {
      const email = "hallo@a11yphant.com";

      const service = createAuthenticationService({
        userService: {
          findByEmail: jest.fn().mockResolvedValue(UserFactory.build({ email })),
        },
        hashService: {
          compare: jest.fn().mockResolvedValue(true),
        },
      });

      const loggedInUser = await service.login({ email: "hallo@a11yphant.com", password: "test_pw" });
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
      const service = createAuthenticationService({
        hashService: {
          compare: jest.fn().mockResolvedValue(false),
        },
      });

      expect(service.login({ email: "mail@example.com", password: "test_pw" })).rejects.toThrowError(errorMessage);
    });
  });

  describe("validate password reset token", () => {
    it("returns valid for valid tokens", async () => {
      const service = createAuthenticationService();

      expect(await service.validatePasswordResetToken("valid_token")).toBe(ValidatePasswordResetTokenResultEnum.VALID);
    });

    it("returns invalid jwt if the jwt is invalid", async () => {
      const service = createAuthenticationService({
        jwtService: {
          validateToken: jest.fn().mockResolvedValue(false),
        },
      });

      expect(await service.validatePasswordResetToken("invalid_token")).toBe(ValidatePasswordResetTokenResultEnum.INVALID_JWT);
    });

    it("returns expired if the jwt is expired", async () => {
      const service = createAuthenticationService({
        jwtService: {
          decodeToken: jest.fn().mockReturnValue({ exp: 0 }),
        },
      });

      expect(await service.validatePasswordResetToken("valid_token")).toBe(ValidatePasswordResetTokenResultEnum.EXPIRED);
    });

    it("returns unknown user if the embedded email cannot be found", async () => {
      const findById = jest.fn().mockResolvedValue(null);
      const service = createAuthenticationService({
        userService: {
          findById,
        },
      });

      const result = await service.validatePasswordResetToken("valid_token");

      expect(findById).toHaveBeenCalledWith(userId);
      expect(result).toBe(ValidatePasswordResetTokenResultEnum.UNKNOWN_USER);
    });
  });

  describe("reset password", () => {
    it("can reset the password", async () => {
      const password = "password";
      const updatePassword = jest.fn();
      const service = createAuthenticationService({
        userService: {
          updatePassword,
        },
      });

      await service.resetPassword("valid_token", password);

      expect(updatePassword).toHaveBeenCalledWith(userId, password);
    });

    it("fails resetting the password if the token is not valid", async () => {
      const service = createAuthenticationService({
        jwtService: {
          validateToken: jest.fn().mockResolvedValue(false),
        },
      });

      expect(service.resetPassword("invalid_token", "new_pw")).rejects.toThrow(InvalidJwtException);
    });
  });
});
