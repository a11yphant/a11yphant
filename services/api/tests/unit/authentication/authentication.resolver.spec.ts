import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { createConfigServiceMock } from "@tests/support/helpers";
import faker from "faker";

import { AuthenticationResolver } from "@/authentication/authentication.resolver";
import { AuthenticationService } from "@/authentication/authentication.service";
import { Context as IContext } from "@/authentication/interfaces/context.interface";
import { JwtService } from "@/authentication/jwt.service";
import { User } from "@/user/models/user.model";

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

      const configServiceMock = createConfigServiceMock();

      const resolver = new AuthenticationResolver(
        createMock<AuthenticationService>({
          login: loginFunc,
        }),
        createMock<JwtService>({
          createSignedToken: signFunc,
        }),
        createMock<ConfigService>(configServiceMock),
      );

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

      const resolver = new AuthenticationResolver(
        createMock<AuthenticationService>({
          login: loginFunc,
        }),
        createMock<JwtService>(),
        createMock<ConfigService>(),
      );

      expect(resolver.login({ email: "test_mail", password: "test_pw" }, createMock<IContext>())).rejects.toThrowError("E-Mail or password wrong.");
    });
  });
});
