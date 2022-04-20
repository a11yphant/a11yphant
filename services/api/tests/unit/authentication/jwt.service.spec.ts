import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

import { JwtScope } from "@/authentication/enums/jwt-scope.enum";
import { JwtService } from "@/authentication/jwt.service";

describe("jwt service", () => {
  describe("create signed token", () => {
    it("creates a singed jwt for the passed content", async () => {
      const secret = "secret";
      const service = new JwtService(createMock<ConfigService>({ get: jest.fn().mockReturnValue(secret) }));

      const content = {
        key: "value",
      };
      const token = await service.createSignedToken(content, { subject: "test", expiresInSeconds: 3600 });

      expect(token).toBeTruthy();
      expect(jwt.verify(token, secret)).toEqual(expect.objectContaining(content));
    });
  });

  describe("validate token", () => {
    it("returns true for a valid jwt", async () => {
      const secret = "secret";
      const service = new JwtService(createMock<ConfigService>({ get: jest.fn().mockReturnValue(secret) }));

      const token = jwt.sign({ payload: "something", scope: JwtScope.SESSION }, secret);
      expect(await service.validateToken(token, JwtScope.SESSION)).toBeTruthy();
    });

    it("returns false for an jwt with an invalid secret", async () => {
      const service = new JwtService(createMock<ConfigService>({ get: jest.fn().mockReturnValue("secret") }));

      const token = jwt.sign({ payload: "something", scope: JwtScope.SESSION }, "asdf");
      expect(await service.validateToken(token, JwtScope.SESSION)).toBeFalsy();
    });

    it("returns false for an jwt with the wrong session", async () => {
      const secret = "secret";
      const service = new JwtService(createMock<ConfigService>({ get: jest.fn().mockReturnValue(secret) }));

      const token = jwt.sign({ payload: "something", scope: JwtScope.PASSWORD_RESET }, secret);
      expect(await service.validateToken(token, JwtScope.SESSION)).toBeFalsy();
    });

    it("returns false if the passed string is not a jwt and a scope is passed", async () => {
      const service = new JwtService(createMock<ConfigService>({ get: jest.fn().mockReturnValue("secret") }));

      const token = "just-a-string";
      expect(await service.validateToken(token, JwtScope.EMAIL_CONFIRMATION)).toBeFalsy();
    });
  });

  describe("decode token", () => {
    it("returns the token content", async () => {
      const secret = "secret";
      const service = new JwtService(createMock<ConfigService>({ get: jest.fn().mockReturnValue(secret) }));

      const payload = { payload: "something" };

      const token = jwt.sign(payload, secret);
      expect(await service.decodeToken(token)).toEqual(expect.objectContaining(payload));
    });
  });
});
