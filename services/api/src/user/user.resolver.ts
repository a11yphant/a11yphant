import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";

import { User } from "./models/user.model";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { nullable: true, description: "Returns the current user" })
  currentUser(@SessionToken() sessionToken: SessionTokenInterface): Promise<User> {
    return this.userService.findById(sessionToken.userId);
  }

  @ResolveField(() => Boolean)
  isRegistered(@Parent() user: User): boolean {
    return user.authProvider !== "anonymous";
  }
}
