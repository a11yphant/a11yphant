import { PrismaModule } from "@a11y-challenges/prisma";
import { Module } from "@nestjs/common";

import { ChallengeResolver } from "./challenge.resolver";
import { ChallengeService } from "./challenge.service";
import { HintService } from "./hint.service";
import { LevelResolver } from "./level.resolver";
import { LevelService } from "./level.service";
import { RequirementService } from "./requirement.service";
import { ResourceService } from "./resource.service";

@Module({
  imports: [PrismaModule],
  providers: [ChallengeResolver, ChallengeService, LevelResolver, LevelService, RequirementService, HintService, ResourceService],
})
export class ChallengeModule {}
