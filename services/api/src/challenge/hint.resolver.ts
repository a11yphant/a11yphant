import { Args, ID, Query, Resolver } from "@nestjs/graphql";

import { HintService } from "./hint.service";
import { Hint } from "./models/hint.model";

@Resolver(() => Hint)
export class HintResolver {
  constructor(private hintService: HintService) {}

  @Query(() => Hint, { nullable: true })
  async hint(@Args("id", { type: () => ID }) id: string): Promise<Hint> {
    return this.hintService.findOneById(id);
  }
}
