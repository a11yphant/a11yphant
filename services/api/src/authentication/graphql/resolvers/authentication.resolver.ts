import { ConfigService } from "@nestjs/config";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-errors";

import { User } from "@/user/models/user.model";

import { AuthenticationService } from "../../authentication.service";
import { LoginInput } from "../../inputs/login.input";
import { Context as IContext } from "../../interfaces/context.interface";
import { JwtService } from "../../jwt.service";
import { ValidatePasswordResetTokenResult } from "../results/validate-password-reset-token.result";

@Resolver()
export class AuthenticationResolver {
  constructor(private authenticationService: AuthenticationService, private jwtService: JwtService, private config: ConfigService) {}

  @Mutation(() => User)
  async login(@Args("loginInput") loginInput: LoginInput, @Context() ctx: IContext): Promise<User> {
    const user = await this.authenticationService.login(loginInput).catch((e) => {
      throw new UserInputError(e.message);
    });

    const token = await this.jwtService.createSignedToken({ userId: user.id }, { subject: "session", expiresInSeconds: 3600 * 24 * 365 });
    ctx.res.cookie(this.config.get<string>("cookie.name"), token, this.config.get("cookie.defaultConfig"));

    return user;
  }

  @Mutation(() => ValidatePasswordResetTokenResult)
  async validatePasswordResetToken(@Args("token") token: string): Promise<ValidatePasswordResetTokenResult> {
    const result = await this.authenticationService.validatePasswordResetToken(token);

    return {
      result,
    };
  }
}
