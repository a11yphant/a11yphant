// import { createMock } from "@golevelup/ts-jest";
// import { ConfigService } from "@nestjs/config";
// import { UserFactory } from "@tests/factories/models/user.factory";
// import { createConfigServiceMock } from "@tests/helpers";
// import faker from "faker";

// import { AuthenticationResolver } from "@/authentication/authentication.resolver";
// import { AuthenticationService } from "@/authentication/authentication.service";
// import { JwtService } from "@/authentication/jwt.service";
// import { User } from "@/user/models/user.model";

describe("authentication resolver", () => {
  describe("login", () => {
    it.todo("returns the logged in user and sets the cookie", () => {
      // const id = faker.datatype.uuid();
      // const user = new User(UserFactory.build({ id }));
      // const loginFunc = jest.fn().mockResolvedValue(user);
      // const signFunc = jest.fn().mockResolvedValue(true);
      // const resolver = new AuthenticationResolver(
      //   createMock<AuthenticationService>({
      //     login: loginFunc,
      //   }),
      //   createMock<JwtService>({
      //     createSignedToken: signFunc,
      //   }),
      //   createMock<ConfigService>(createConfigServiceMock()),
      // );
    });

    it.todo("throws an error if username or password are wrong");
  });
});
