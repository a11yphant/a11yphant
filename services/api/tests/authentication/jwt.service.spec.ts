import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

import { JwtService } from "@/authentication/jwt.service";

describe("jwt service", () => {
  describe("create signed token", () => {
    it("creates a singed jwt for the passed content", async () => {
      const secret = "secret";
      const service = new JwtService(
        createMock<ConfigService>({ get: jest.fn().mockReturnValue(secret) }),
      );

      const content = {
        key: "value",
      };
      const token = await service.createSignedToken(content, { subject: "test", expiresInSeconds: 3600 });

      expect(token).toBeTruthy();
      expect(jwt.verify(token, secret)).toEqual(expect.objectContaining(content));
    });
  });

  describe("validate jwt", () => {
    it("returns true for a valid jwt", async () => {
      const secret = "secret";
      const service = new JwtService(
        createMock<ConfigService>({ get: jest.fn().mockReturnValue(secret) }),
      );

      const token = jwt.sign({ payload: "something" }, secret);
      expect(await service.validateToken(token)).toBeTruthy();
    });

    it("returns false for an invalid jwt", async () => {
      const service = new JwtService(
        createMock<ConfigService>({ get: jest.fn().mockReturnValue("secret") }),
      );

      const token = jwt.sign({ payload: "something" }, "asdf");
      expect(await service.validateToken(token)).toBeFalsy();
    });
  });
});
