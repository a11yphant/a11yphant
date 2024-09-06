import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { AuthenticationService } from "@/authentication/authentication.service";
import type { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";
import { MailService } from "@/mail/mail.service";

import { WithCodeError } from "../support/graphql/results/with-code.error";
import { RegisterUserInput } from "./inputs/register-user.input";
import { User } from "./models/user.model";
import { RegisterResult } from "./results/register.result";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private mailService: MailService,
  ) {}

  @Query(() => User, { nullable: true })
  async user(@Args("id", { type: () => ID }) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(() => User, { nullable: true, description: "Returns the current user" })
  currentUser(@SessionToken() sessionToken: SessionTokenInterface): Promise<User> {
    return this.userService.findById(sessionToken.userId);
  }

  @Mutation(() => RegisterResult, { description: "Register a new local user." })
  async register(
    @Args("registerUserInput") registerUserInput: RegisterUserInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<typeof RegisterResult> {
    try {
      const user = await this.userService.registerUser(registerUserInput, sessionToken.userId);

      this.mailService.sendRegistrationMail({
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        token: await this.authService.generateMailConfirmationToken(user.id),
      });

      return user;
    } catch (error: unknown) {
      if (error instanceof WithCodeError) {
        return {
          errorCode: error.code,
        };
      }

      // some unexpected error
      throw error;
    }
  }

  @ResolveField(() => Boolean)
  isRegistered(@Parent() user: User): boolean {
    return user.authProvider !== "anonymous";
  }

  @ResolveField(() => Boolean, { description: "Indicates whether a local user has confirmed their email." })
  isVerified(@Parent() user: User): boolean {
    if (user.authProvider === "anonymous") {
      return false;
    }

    if (user.authProvider === "local") {
      return !!user.verifiedAt;
    }

    return true;
  }
}
