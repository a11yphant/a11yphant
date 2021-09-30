import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";

import { InputError } from "./exceptions/input.error";
import { RegisterUserInput } from "./inputs/register-user.input";
import { User } from "./models/user.model";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { nullable: true, description: "Returns the current user" })
  currentUser(@SessionToken() sessionToken: SessionTokenInterface): Promise<User> {
    return this.userService.findById(sessionToken.userId);
  }

  @Mutation(() => User, { description: "Register a new local user." })
  register(@Args("registerUserInput") registerUserInput: RegisterUserInput, @SessionToken() sessionToken: SessionTokenInterface): Promise<User> {
    return this.userService.registerUser(registerUserInput, sessionToken.userId).catch((e) => {
      throw new InputError(e.message);
    });
  }

  @ResolveField(() => Boolean)
  isRegistered(@Parent() user: User): boolean {
    return user.authProvider !== "anonymous";
  }
}
