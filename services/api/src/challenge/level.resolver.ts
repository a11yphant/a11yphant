import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { Level } from "./models/level.model";
import { Requirement } from "./models/requirement.model";
import { RequirementService } from "./requirement.service";

@Resolver(() => Level)
export class LevelResolver {
  constructor(private requirementService: RequirementService) {}

  @ResolveField(() => [Requirement], { name: "requirements" })
  async requirements(@Parent() level: Level): Promise<Requirement[]> {
    return this.requirementService.findForLevel(level.id);
  }
}
