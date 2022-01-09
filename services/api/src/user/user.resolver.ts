import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";
import { MailService } from "@/mail/mail.service";

import { InputError } from "./exceptions/input.error";
import { RegisterUserInput } from "./inputs/register-user.input";
import { User } from "./models/user.model";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService, private mailService: MailService) {}

  @Query(() => User, { nullable: true })
  async user(@Args("id", { type: () => ID }) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(() => User, { nullable: true, description: "Returns the current user" })
  currentUser(@SessionToken() sessionToken: SessionTokenInterface): Promise<User> {
    return this.userService.findById(sessionToken.userId);
  }

  @Mutation(() => User, { description: "Register a new local user." })
  async register(
    @Args("registerUserInput") registerUserInput: RegisterUserInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<User> {
    const user = await this.userService.registerUser(registerUserInput, sessionToken.userId).catch((e) => {
      throw new InputError(e.message);
    });
    this.mailService.sendRegistrationMail(user);
    return user;
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
