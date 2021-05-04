import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ChallengeResolver } from "./challenge.resolver";
import { ChallengeService } from "./challenge.service";
import { HintResolver } from "./hint.resolver";
import { HintService } from "./hint.service";
import { LevelResolver } from "./level.resolver";
import { LevelService } from "./level.service";
import { LevelByChallengeSlugAndIndexArgs } from "./level-by-challenge-slug-and-index.args";
import { RequirementService } from "./requirement.service";
import { ResourceService } from "./resource.service";
import { RuleService } from "./rule.service";

@Module({
  imports: [PrismaModule],
  providers: [
    ChallengeResolver,
    ChallengeService,
    LevelResolver,
    LevelService,
    LevelByChallengeSlugAndIndexArgs,
    RequirementService,
    HintResolver,
    HintService,
    ResourceService,
    RuleService,
  ],
  exports: [LevelService, RequirementService, RuleService],
})
export class ChallengeModule {}
