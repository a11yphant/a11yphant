import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ChallengesArgs } from "./arg-types/challenges.args";
import { LevelByChallengeSlugAndIndexArgs } from "./arg-types/level-by-challenge-slug-and-index.args";
import { ChallengeResolver } from "./challenge.resolver";
import { ChallengeService } from "./challenge.service";
import { HintResolver } from "./hint.resolver";
import { HintService } from "./hint.service";
import { LevelResolver } from "./level.resolver";
import { LevelService } from "./level.service";
import { RequirementResolver } from "./requirement.resolver";
import { RequirementService } from "./requirement.service";
import { ResourceService } from "./resource.service";
import { RuleService } from "./rule.service";

@Module({
  imports: [PrismaModule],
  providers: [
    ChallengeResolver,
    ChallengesArgs,
    ChallengeService,
    LevelResolver,
    LevelService,
    LevelByChallengeSlugAndIndexArgs,
    RequirementResolver,
    RequirementService,
    HintResolver,
    HintService,
    ResourceService,
    RuleService,
  ],
  exports: [LevelService, RequirementService, RuleService],
})
export class ChallengeModule {}
