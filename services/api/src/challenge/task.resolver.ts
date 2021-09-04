import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { HintService } from "./hint.service";
import { Hint } from "./models/hint.model";
import { Task } from "./models/task.model";

@Resolver(() => Task)
export class TaskResolver {
  constructor(private hintService: HintService) {}

  @ResolveField(() => [Hint], { description: "All hints available for this task." })
  async hints(@Parent() task: Task): Promise<Hint[]> {
    return this.hintService.findForTask(task.id);
  }
}
