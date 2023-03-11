import { ConfigService } from "@nestjs/config";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import * as Yup from "yup";

import { AuthenticationService } from "@/authentication/authentication.service";
import { JwtScope } from "@/authentication/enums/jwt-scope.enum";
import { ResendEmailConfirmationResultEnum } from "@/authentication/enums/resend-email-confirmation-result.enum";
import { InvalidJwtException } from "@/authentication/exceptions/invalid-jwt.exception";
import { UserNotFoundException } from "@/authentication/exceptions/user-not-found.exception";
import { LoginInput } from "@/authentication/graphql/inputs/login.input";
import { Context as IContext } from "@/authentication/interfaces/context.interface";
import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { JwtService } from "@/authentication/jwt.service";
import { SessionToken } from "@/authentication/session-token.decorator";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

import { RequestPasswordResetErrorCodes } from "../enums/request-password-reset-error-codes.enum";
import { RequestPasswordResetFields } from "../enums/request-password-reset-fields.enum";
import { RequestPasswordResetSuccessResultEnum } from "../enums/request-password-reset-success-result.enum";
import { ResetPasswordErrorCodes } from "../enums/reset-password-error-codes.enum";
import { ResetPasswordFields } from "../enums/reset-password-fields.enum";
import { ValidatePasswordResetTokenResultEnum } from "../enums/validate-password-reset-token-result.enum";
import { RequestPasswordResetInput } from "../inputs/request-password-reset.input";
import { ResetPasswordInput } from "../inputs/reset-password.input";
import { ValidatePasswordResetTokenInput } from "../inputs/validate-password-reset-token.input";
import { RequestPasswordResetResult } from "../results/request-password-reset.result";
import { ResetPasswordResult } from "../results/reset-password.result";
import { ValidatePasswordResetTokenResult } from "../results/validate-password-reset-token.result";

@Resolver()
export class AuthenticationResolver {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Mutation(() => User)
  async login(@Args("loginInput") loginInput: LoginInput, @Context() ctx: IContext): Promise<User> {
    const user = await this.authenticationService.login(loginInput).catch((e) => {
      throw new GraphQLError(e.message, { extensions: { code: "BAD_USER_INPUT" } });
    });

    const token = await this.jwtService.createSignedToken({ scope: JwtScope.SESSION }, { subject: user.id, expiresInSeconds: 3600 * 24 * 365 });
    ctx.res.cookie(this.config.get<string>("cookie.name"), token, this.config.get("cookie.defaultConfig"));

    return user;
  }

  @Mutation(() => RequestPasswordResetResult)
  async requestPasswordReset(@Args("requestPasswordResetInput") input: RequestPasswordResetInput): Promise<typeof RequestPasswordResetResult> {
    const inputErrors = [];

    try {
      const passwordSchema = Yup.string().email("The email must be a valid email.");
      await passwordSchema.validate(input.email);
    } catch (e) {
      inputErrors.push({
        field: RequestPasswordResetFields.EMAIL,
        message: e.message,
      });
    }

    if (inputErrors.length > 0) {
      return {
        errorCode: RequestPasswordResetErrorCodes.INPUT_VALIDATION_ERROR,
        inputErrors,
      };
    }

    await this.authenticationService.requestPasswordReset(input.email);

    return {
      result: RequestPasswordResetSuccessResultEnum.EMAIL_SENT,
    };
  }

  @Mutation(() => ResendEmailConfirmationResultEnum, { description: "Resend the confirmation email." })
  async resendConfirmationEmail(@SessionToken() sessionToken: SessionTokenInterface): Promise<ResendEmailConfirmationResultEnum> {
    return this.authenticationService.resendConfirmationEmail(sessionToken.userId);
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: IContext): Promise<boolean> {
    const user = await this.userService.findById(ctx.sessionToken.userId);
    if (user && user.authProvider !== "anonymous") {
      ctx.res.clearCookie(this.config.get<string>("cookie.name"));
      return true;
    }
    return false;
  }

  @Mutation(() => ValidatePasswordResetTokenResult)
  async validatePasswordResetToken(
    @Args("validatePasswordResetTokenInput") input: ValidatePasswordResetTokenInput,
  ): Promise<ValidatePasswordResetTokenResult> {
    try {
      await this.authenticationService.validatePasswordResetToken(input.token);
    } catch (e) {
      if (e instanceof InvalidJwtException) {
        return {
          result: ValidatePasswordResetTokenResultEnum.INVALID_TOKEN,
        };
      }

      if (e instanceof UserNotFoundException) {
        return {
          result: ValidatePasswordResetTokenResultEnum.UNKNOWN_USER,
        };
      }
    }

    return {
      result: ValidatePasswordResetTokenResultEnum.VALID,
    };
  }

  @Mutation(() => ResetPasswordResult)
  async resetPassword(@Args("resetPasswordInput") input: ResetPasswordInput): Promise<typeof ResetPasswordResult> {
    const inputErrors = [];

    try {
      const passwordSchema = Yup.string().min(8, "Password must be at least 8 characters long.").required("Password is required.");
      await passwordSchema.validate(input.password);
    } catch (e) {
      inputErrors.push({
        field: ResetPasswordFields.PASSWORD,
        message: e.message,
      });
    }

    if (inputErrors.length > 0) {
      return {
        errorCode: ResetPasswordErrorCodes.INPUT_VALIDATION_ERROR,
        inputErrors,
      };
    }

    try {
      const userId = await this.authenticationService.resetPassword(input.token, input.password);

      return await this.userService.findById(userId);
    } catch (e) {
      if (e instanceof InvalidJwtException || e instanceof UserNotFoundException) {
        return {
          errorCode: ResetPasswordErrorCodes.INVALID_TOKEN,
          inputErrors: [],
        };
      }

      throw e;
    }
  }
}
