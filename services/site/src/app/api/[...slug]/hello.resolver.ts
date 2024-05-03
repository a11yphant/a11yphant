import { Query, Resolver } from "@nestjs/graphql";

import { Hello } from "./hello.model";

@Resolver(() => Hello)
export class HelloResolver {
  @Query(() => Hello)
  hallo(): Hello {
    return {
      id: "hallo",
    };
  }
}
